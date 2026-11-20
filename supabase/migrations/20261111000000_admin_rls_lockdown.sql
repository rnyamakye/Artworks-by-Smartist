-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: Admin RLS Lockdown & Security Hardening
-- Enforces public.is_admin() for all content modification and storage
-- Locks testimonial inserts to pending/unapproved only
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Create Admins table
CREATE TABLE IF NOT EXISTS public.admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view admins" ON public.admins;
CREATE POLICY "Admins can view admins" ON public.admins
  FOR SELECT USING (auth.uid() = id);

-- 2. Define secure is_admin() function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  -- Service role is always admin (backend scripts, internal triggers)
  IF (auth.role() = 'service_role') THEN
    RETURN true;
  END IF;

  -- Check if user's JWT has role = 'admin' in app_metadata
  IF (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin') THEN
    RETURN true;
  END IF;

  -- Check if user's ID or email is in public.admins
  IF EXISTS (
    SELECT 1 FROM public.admins
    WHERE id = auth.uid() OR email = (auth.jwt() ->> 'email')
  ) THEN
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Products / Artworks RLS
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Products are publicly viewable" ON public.products;
DROP POLICY IF EXISTS "Admins can modify products" ON public.products;

CREATE POLICY "Products are publicly viewable" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Admins can modify products" ON public.products
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. Blogs RLS
ALTER TABLE IF EXISTS public.blogs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Blogs are publicly viewable" ON public.blogs;
DROP POLICY IF EXISTS "Admins can modify blogs" ON public.blogs;

CREATE POLICY "Blogs are publicly viewable" ON public.blogs
  FOR SELECT USING (true);

CREATE POLICY "Admins can modify blogs" ON public.blogs
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. Tutorials RLS
ALTER TABLE IF EXISTS public.tutorials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tutorials are publicly viewable" ON public.tutorials;
DROP POLICY IF EXISTS "Admins can modify tutorials" ON public.tutorials;

CREATE POLICY "Tutorials are publicly viewable" ON public.tutorials
  FOR SELECT USING (true);

CREATE POLICY "Admins can modify tutorials" ON public.tutorials
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6. About Page RLS
ALTER TABLE IF EXISTS public.about_page ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "About page is public" ON public.about_page;
DROP POLICY IF EXISTS "Admins can manage about page" ON public.about_page;

CREATE POLICY "About page is public" ON public.about_page
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage about page" ON public.about_page
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 7. Achievements RLS
ALTER TABLE IF EXISTS public.achievements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Achievements are public" ON public.achievements;
DROP POLICY IF EXISTS "Admins can manage achievements" ON public.achievements;

CREATE POLICY "Achievements are public" ON public.achievements
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage achievements" ON public.achievements
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 8. Policies (Legal pages) RLS
ALTER TABLE IF EXISTS public.policies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Policies are public" ON public.policies;
DROP POLICY IF EXISTS "Admins can manage policies" ON public.policies;

CREATE POLICY "Policies are public" ON public.policies
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage policies" ON public.policies
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 9. Testimonials RLS & Force Unapproved on Insert
ALTER TABLE IF EXISTS public.testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Approved testimonials are public" ON public.testimonials;
DROP POLICY IF EXISTS "Public can view testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can submit a testimonial" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can update and delete testimonials" ON public.testimonials;

-- Public can only view approved reviews, unless admin
CREATE POLICY "Approved testimonials are public" ON public.testimonials
  FOR SELECT
  USING (approved = true OR status = 'approved' OR public.is_admin());

-- Visitors can insert, but CANNOT self-approve (approved must be false / status must be pending)
CREATE POLICY "Anyone can submit a testimonial" ON public.testimonials
  FOR INSERT
  WITH CHECK (
    (coalesce(approved, false) = false) AND 
    (coalesce(status, 'pending') = 'pending')
  );

-- Only admins can approve, edit, or delete testimonials
CREATE POLICY "Admins can manage testimonials" ON public.testimonials
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Enforce unapproved status in trigger for non-admins as additional defense
CREATE OR REPLACE FUNCTION force_pending_testimonial()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.is_admin() THEN
    NEW.approved := false;
    NEW.status := 'pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_force_pending_testimonial ON public.testimonials;
CREATE TRIGGER trigger_force_pending_testimonial
BEFORE INSERT ON public.testimonials
FOR EACH ROW EXECUTE FUNCTION force_pending_testimonial();

-- 10. Contact Messages RLS with Length & Status Constraints
ALTER TABLE IF EXISTS public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can send contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins can manage contact messages" ON public.contact_messages;

CREATE POLICY "Anyone can send contact messages" ON public.contact_messages
  FOR INSERT
  WITH CHECK (
    coalesce(status, 'unread') = 'unread' AND
    length(name) >= 1 AND length(name) <= 100 AND
    length(email) >= 4 AND length(email) <= 255 AND
    length(message) >= 1 AND length(message) <= 5000
  );

CREATE POLICY "Admins can manage contact messages" ON public.contact_messages
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Enforce unread status on insert for non-admins
CREATE OR REPLACE FUNCTION force_unread_contact_message()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.is_admin() THEN
    NEW.status := 'unread';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_force_unread_contact_message ON public.contact_messages;
CREATE TRIGGER trigger_force_unread_contact_message
BEFORE INSERT ON public.contact_messages
FOR EACH ROW EXECUTE FUNCTION force_unread_contact_message();

-- 11. Newsletter Subscribers RLS with Length Constraints
ALTER TABLE IF EXISTS public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can manage subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT
  WITH CHECK (
    length(email) >= 4 AND length(email) <= 255
  );

CREATE POLICY "Admins can manage subscribers" ON public.newsletter_subscribers
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 12. Commissions Table RLS & Admin Policies
ALTER TABLE IF EXISTS public.commissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage commissions" ON public.commissions;
DROP POLICY IF EXISTS "Anyone can submit a commission" ON public.commissions;
DROP POLICY IF EXISTS "Users can view own commissions" ON public.commissions;

CREATE POLICY "Anyone can submit a commission" ON public.commissions
  FOR INSERT
  WITH CHECK (
    coalesce(status, 'pending') = 'pending' AND
    length(customer_name) >= 1 AND length(customer_name) <= 100 AND
    length(customer_email) >= 4 AND length(customer_email) <= 255 AND
    (description IS NULL OR length(description) <= 5000)
  );

CREATE POLICY "Users can view own commissions" ON public.commissions
  FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can manage commissions" ON public.commissions
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Enforce pending status on insert for non-admins
CREATE OR REPLACE FUNCTION force_pending_commission()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT public.is_admin() THEN
    NEW.status := 'pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_force_pending_commission ON public.commissions;
CREATE TRIGGER trigger_force_pending_commission
BEFORE INSERT ON public.commissions
FOR EACH ROW EXECUTE FUNCTION force_pending_commission();

-- 13. Storage Objects (Images Bucket & Invoices Bucket) RLS
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('images', 'images', true),
  ('invoices', 'invoices', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Admins can manage images storage" ON storage.objects;
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage invoices storage" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload invoices" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own invoices" ON storage.objects;

-- Images Bucket: Public read, Admin manage
CREATE POLICY "Public can view images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY "Admins can manage images storage" ON storage.objects
  FOR ALL
  USING (bucket_id = 'images' AND public.is_admin())
  WITH CHECK (bucket_id = 'images' AND public.is_admin());

-- Invoices Bucket: Admin manage, Users read own invoices
CREATE POLICY "Admins can manage invoices storage" ON storage.objects
  FOR ALL
  USING (bucket_id = 'invoices' AND public.is_admin())
  WITH CHECK (bucket_id = 'invoices' AND public.is_admin());

CREATE POLICY "Users can view own invoices" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'invoices' AND 
    ((auth.uid())::text = (storage.foldername(name))[1] OR public.is_admin())
  );

