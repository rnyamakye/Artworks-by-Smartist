-- Add social_post_url column to all 4 tables
-- Run this migration in your Supabase SQL editor

ALTER TABLE blogs ADD COLUMN IF NOT EXISTS social_post_url TEXT;
ALTER TABLE tutorials ADD COLUMN IF NOT EXISTS social_post_url TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS social_post_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS social_post_url TEXT;
