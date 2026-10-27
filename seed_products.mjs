import { createClient } from '@supabase/supabase-js';
import { products, blogData, tutorials } from '../admin/constants/index.mjs';

const supabase = createClient(
  'http://127.0.0.1:54321',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU' // SERVICE_ROLE_KEY to bypass RLS
);

async function seed() {
  console.log(`Seeding ${products.length} products...`);
  try {
    const formattedProducts = products.map((p, index) => ({
      _id: p._id,
      name: p.name || `Artwork #${p._id || index}`,
      overview: p.description || null,
      description: p.description || null,
      images: p.images || [],
    }));

    const { error: err1 } = await supabase.from('products').upsert(formattedProducts, { onConflict: '_id' });
    if (err1) console.error("Error inserting products:", err1);
    else console.log("Successfully seeded products!");

    console.log(`Seeding ${blogData.length} blogs...`);
    const formattedBlogs = blogData.map((b, index) => ({
      _id: b.id || index,
      title: b.title,
      description: b.description,
      image: b.image
    }));
    
    const { error: err2 } = await supabase.from('blogs').upsert(formattedBlogs, { onConflict: '_id' });
    if (err2) console.error("Error inserting blogs:", err2);
    else console.log("Successfully seeded blogs!");
    
  } catch (err) {
    console.error("Fatal error:", err);
  }
}

seed();
