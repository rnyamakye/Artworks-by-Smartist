-- ─────────────────────────────────────────────────────────────────────────────
-- Testimonials schema update: Support name, role, text, status, social_post_url
-- Synchronizes author_name <-> name, content <-> text, approved <-> status
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Add missing columns to testimonials table
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS text TEXT;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS social_post_url TEXT;

-- 2. Populate new columns from existing legacy columns for existing rows
UPDATE public.testimonials
SET 
  name = COALESCE(name, author_name),
  text = COALESCE(text, content),
  status = CASE WHEN approved = true THEN 'approved' ELSE 'pending' END
WHERE name IS NULL OR text IS NULL;

-- 3. Make author_name and content nullable so inserts with name/text don't fail
ALTER TABLE public.testimonials ALTER COLUMN author_name DROP NOT NULL;
ALTER TABLE public.testimonials ALTER COLUMN content DROP NOT NULL;

-- 4. Create trigger to sync columns bidirectionally
CREATE OR REPLACE FUNCTION sync_testimonials_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- Sync name <-> author_name
  IF NEW.name IS NOT NULL AND NEW.author_name IS NULL THEN
    NEW.author_name := NEW.name;
  ELSIF NEW.author_name IS NOT NULL AND NEW.name IS NULL THEN
    NEW.name := NEW.author_name;
  END IF;

  -- Sync text <-> content
  IF NEW.text IS NOT NULL AND NEW.content IS NULL THEN
    NEW.content := NEW.text;
  ELSIF NEW.content IS NOT NULL AND NEW.text IS NULL THEN
    NEW.text := NEW.content;
  END IF;

  -- Sync status <-> approved
  IF NEW.status IS NOT NULL THEN
    IF NEW.status = 'approved' THEN
      NEW.approved := true;
    ELSE
      NEW.approved := false;
    END IF;
  ELSIF NEW.approved IS NOT NULL THEN
    IF NEW.approved = true THEN
      NEW.status := 'approved';
    ELSE
      NEW.status := 'pending';
    END IF;
  ELSE
    NEW.status := 'pending';
    NEW.approved := false;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_testimonials_columns ON public.testimonials;
CREATE TRIGGER trigger_sync_testimonials_columns
BEFORE INSERT OR UPDATE ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION sync_testimonials_columns();

-- 5. Update RLS Policies
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a testimonial" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can insert testimonials" ON public.testimonials;
CREATE POLICY "Anyone can submit a testimonial" ON public.testimonials
FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Approved testimonials are public" ON public.testimonials;
DROP POLICY IF EXISTS "Public can view testimonials" ON public.testimonials;
CREATE POLICY "Approved testimonials are public" ON public.testimonials
FOR SELECT
USING (approved = true OR status = 'approved');

DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can update and delete testimonials" ON public.testimonials;
CREATE POLICY "Admins can manage testimonials" ON public.testimonials
FOR ALL
USING (auth.role() = 'service_role' OR auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

