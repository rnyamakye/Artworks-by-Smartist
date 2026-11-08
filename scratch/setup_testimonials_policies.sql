-- ─────────────────────────────────────────────────────────────────────────────
-- Testimonials Policies: Allow visitors to submit reviews and view testimonials
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Ensure table has RLS enabled
ALTER TABLE IF EXISTS testimonials ENABLE ROW LEVEL SECURITY;

-- 2. Allow any visitor (anon & authenticated) to insert a new pending testimonial
DROP POLICY IF EXISTS "Anyone can insert testimonials" ON testimonials;
CREATE POLICY "Anyone can insert testimonials" ON testimonials
FOR INSERT 
WITH CHECK (true);

-- 3. Allow public to read testimonials (approved and pending)
DROP POLICY IF EXISTS "Public can view testimonials" ON testimonials;
CREATE POLICY "Public can view testimonials" ON testimonials
FOR SELECT 
USING (true);

-- 4. Allow admins (service_role or authenticated) to update status (approve/reject) and delete
DROP POLICY IF EXISTS "Admins can update and delete testimonials" ON testimonials;
CREATE POLICY "Admins can update and delete testimonials" ON testimonials
FOR ALL 
USING (auth.role() = 'service_role' OR auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

