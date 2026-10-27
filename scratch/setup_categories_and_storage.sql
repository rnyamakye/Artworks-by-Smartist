-- Ensure images bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- Update products policy to allow authenticated admins
DROP POLICY IF EXISTS "Admins can modify products" ON products;
CREATE POLICY "Admins can modify products" ON products 
FOR ALL 
USING (auth.role() = 'service_role' OR auth.role() = 'authenticated') 
WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Storage policies for images bucket
DROP POLICY IF EXISTS "Admins can manage images storage" ON storage.objects;
CREATE POLICY "Admins can manage images storage" ON storage.objects 
FOR ALL 
USING (bucket_id = 'images' AND (auth.role() = 'service_role' OR auth.role() = 'authenticated')) 
WITH CHECK (bucket_id = 'images' AND (auth.role() = 'service_role' OR auth.role() = 'authenticated'));

DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
CREATE POLICY "Public can view images" ON storage.objects 
FOR SELECT 
USING (bucket_id = 'images');

-- Upsert sample artworks covering all requested categories (Children, Family Portrait, Abstract, etc.)
INSERT INTO products (_id, name, overview, description, price, category, images, in_stock)
VALUES 
  (
    'p006', 
    'Mother and Child', 
    'An intimate family portrait commission — pencil on watercolour paper.', 
    'A tender family portrait rendered with soft gradients and delicate line work. Perfect as a treasured heirloom.', 
    520, 
    'Family Portrait', 
    '["/family-portrait.JPG"]'::jsonb, 
    true
  ),
  (
    'p007', 
    'Little Angel', 
    'Commissioned children portrait capturing pure innocence and joy.', 
    'Detailed graphite pencil portrait of a smiling child with curls, focusing on soft skin tones and expressive eyes. 12x16 inches on Strathmore Bristol.', 
    350, 
    'Children', 
    '["/commmissioned-portrait-29.JPG"]'::jsonb, 
    true
  ),
  (
    'p008', 
    'The Generations', 
    'A multi-generational family portrait heirloom.', 
    'Commissioned family portrait rendered in deep graphite and charcoal, capturing the unique bond between generations. 18x24 inches.', 
    850, 
    'Family Portrait', 
    '["/family-portrait.JPG"]'::jsonb, 
    true
  ),
  (
    'p009', 
    'Vision of the Soul', 
    'A hyper-realistic surrealist eye study exploring abstract reflections.', 
    'Hyper-realistic pencil artwork focusing on the human eye with abstract reflections, intricate iris patterns, and skin micro-textures. 16x20 inches.', 
    420, 
    'Abstract', 
    '["/realistic-eye.JPG"]'::jsonb, 
    true
  ),
  (
    'p010', 
    'Golden Smiles', 
    'A playful and expressive children portrait study in pencil.', 
    'Commissioned portrait celebrating childhood wonder, capturing radiant lighting and subtle shading across the face. 11x14 inches.', 
    320, 
    'Children', 
    '["/commmissioned-portrait-30.JPG"]'::jsonb, 
    true
  ),
  (
    'p011', 
    'Cherished Family Moments', 
    'Commissioned graphite portrait celebrating togetherness.', 
    'A warm and intimate portrait study capturing genuine smiles and emotional connection between loved ones. 16x20 inches.', 
    720, 
    'Family Portrait', 
    '["/commmissioned-portrait-3.JPG"]'::jsonb, 
    true
  ),
  (
    'p012', 
    'Abstract Resonance', 
    'Dynamic abstract graphite study exploring fluid movement and contrast.', 
    'An experimental fine art piece exploring tonal graduation, motion, and organic shapes rendered in graphite. 14x18 inches.', 
    390, 
    'Abstract', 
    '["/Artist-holding-commissioned-portrait-1.JPG"]'::jsonb, 
    true
  )
ON CONFLICT (_id) DO UPDATE SET
  name = EXCLUDED.name,
  overview = EXCLUDED.overview,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  category = EXCLUDED.category,
  images = EXCLUDED.images,
  in_stock = EXCLUDED.in_stock;
