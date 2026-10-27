import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "http://127.0.0.1:54321",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"
);

// ─── Helper ──────────────────────────────────────────────────────────────────
const ok = (label, { error }) => {
  if (error) console.error(`❌  ${label}:`, error.message);
  else console.log(`✅  ${label}`);
};

// ─── Products ─────────────────────────────────────────────────────────────────
async function seedProducts() {
  const products = [
    {
      _id: "p001",
      name: "Whispering Woods",
      overview: "A serene forest scene rendered entirely in graphite.",
      description:
        "This hyper-realistic pencil drawing captures an ancient forest at dawn, with intricate cross-hatching techniques giving depth to every branch and leaf. 18×24 inches on 300gsm cartridge paper.",
      price: 450,
      category: "Landscape",
      images: [
        "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
        "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800",
      ],
      in_stock: true,
    },
    {
      _id: "p002",
      name: "Portrait of Solitude",
      overview: "A deeply emotive portrait study in charcoal and graphite.",
      description:
        "A contemplative portrait capturing the quiet strength of the human gaze. Drawn with 4H–6B pencils for a full tonal range. 14×18 inches on Bristol board.",
      price: 380,
      category: "Portrait",
      images: [
        "https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?w=800",
      ],
      in_stock: true,
    },
    {
      _id: "p003",
      name: "The Old Lighthouse",
      overview: "An architectural study of a coastal lighthouse at dusk.",
      description:
        "Rendered with extreme precision, every brick and rust stain on this lighthouse is lovingly captured in pencil. The sea mist effect was achieved using blending stumps and kneaded erasers. 20×28 inches.",
      price: 620,
      category: "Architecture",
      images: [
        "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800",
        "https://images.unsplash.com/photo-1513467655676-c17fd4e0a469?w=800",
      ],
      in_stock: true,
    },
    {
      _id: "p004",
      name: "Majestic Eagle",
      overview: "A powerful wildlife study of a bald eagle in flight.",
      description:
        "Each feather individually rendered using micro-stippling and directional strokes. A true test of patience — over 120 hours of work. 16×20 inches on acid-free Bristol.",
      price: 780,
      category: "Wildlife",
      images: [
        "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=800",
      ],
      in_stock: false,
    },
    {
      _id: "p005",
      name: "Urban Geometry",
      overview: "A study in perspective — city rooftops at golden hour.",
      description:
        "Inspired by walks through old city quarters, this piece plays with vanishing points and shadow patterns. Drawn on toned grey paper with white chalk highlights. 12×16 inches.",
      price: 290,
      category: "Architecture",
      images: [
        "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800",
      ],
      in_stock: true,
    },
    {
      _id: "p006",
      name: "Mother and Child",
      overview: "An intimate portrait commission — pencil on watercolour paper.",
      description:
        "A tender family portrait rendered with soft gradients and delicate line work. Perfect as a treasured heirloom. 11×14 inches, available as an original or high-quality print.",
      price: 520,
      category: "Family Portrait",
      images: [
        "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800",
      ],
      in_stock: true,
    },
    {
      _id: "p007",
      name: "Little Angel",
      overview: "Commissioned children portrait capturing pure innocence and joy.",
      description:
        "Detailed graphite pencil portrait of a smiling child with curls, focusing on soft skin tones and expressive eyes. 12×16 inches on Strathmore Bristol.",
      price: 350,
      category: "Children",
      images: ["/commmissioned-portrait-29.JPG"],
      in_stock: true,
    },
    {
      _id: "p008",
      name: "The Generations",
      overview: "A multi-generational family portrait heirloom.",
      description:
        "Commissioned family portrait rendered in deep graphite and charcoal, capturing the unique bond between generations. 18×24 inches.",
      price: 850,
      category: "Family Portrait",
      images: ["/family-portrait.JPG"],
      in_stock: true,
    },
    {
      _id: "p009",
      name: "Vision of the Soul",
      overview: "A hyper-realistic surrealist eye study exploring abstract reflections.",
      description:
        "Hyper-realistic pencil artwork focusing on the human eye with abstract reflections, intricate iris patterns, and skin micro-textures. 16×20 inches on heavy Bristol board.",
      price: 420,
      category: "Abstract",
      images: ["/realistic-eye.JPG"],
      in_stock: true,
    },
    {
      _id: "p010",
      name: "Golden Smiles",
      overview: "A playful and expressive children portrait study in pencil.",
      description:
        "Commissioned portrait celebrating childhood wonder, capturing radiant lighting and subtle shading across the face. 11×14 inches.",
      price: 320,
      category: "Children",
      images: ["/commmissioned-portrait-30.JPG"],
      in_stock: true,
    },
    {
      _id: "p011",
      name: "Cherished Family Moments",
      overview: "Commissioned graphite portrait celebrating togetherness.",
      description:
        "A warm and intimate portrait study capturing genuine smiles and emotional connection between loved ones. 16×20 inches.",
      price: 720,
      category: "Family Portrait",
      images: ["/commmissioned-portrait-3.JPG"],
      in_stock: true,
    },
    {
      _id: "p012",
      name: "Abstract Resonance",
      overview: "Dynamic abstract graphite study exploring fluid movement and contrast.",
      description:
        "An experimental fine art piece exploring tonal graduation, motion, and organic shapes rendered in graphite. 14×18 inches.",
      price: 390,
      category: "Abstract",
      images: ["/Artist-holding-commissioned-portrait-1.JPG"],
      in_stock: true,
    },
  ];

  const res = await supabase.from("products").upsert(products, { onConflict: "_id" });
  ok("Products", res);
}

// ─── Blogs ────────────────────────────────────────────────────────────────────
async function seedBlogs() {
  const blogs = [
    {
      _id: "b001",
      title: "The Art of Cross-Hatching: A Complete Guide",
      description:
        "Master the fundamental pencil shading technique that separates beginners from professionals.",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
      content:
        "Cross-hatching is one of the most versatile shading techniques in pencil art. By layering parallel lines at varying angles, artists can create rich tonal values and stunning textures...\n\nStart with light, evenly spaced lines. Build depth by adding a second layer at 45°. The closer the lines, the darker the tone.",
    },
    {
      _id: "b002",
      title: "Choosing the Right Pencil: H vs B Grades Explained",
      description:
        "Everything you need to know about pencil grades and how to use each one effectively.",
      image: "https://images.unsplash.com/photo-1503551723145-6c040742065b?w=800",
      content:
        "The pencil grading scale runs from 9H (hardest, lightest) to 9B (softest, darkest). For realistic portraits, a range of 2H, HB, 2B, 4B and 6B covers most needs.\n\nUse hard pencils (H grades) for fine details and structural underdrawing. Use soft pencils (B grades) for rich shadows and smooth blends.",
    },
    {
      _id: "b003",
      title: "How I Spent 120 Hours Drawing a Single Eagle Feather",
      description: "A behind-the-scenes look at my most ambitious wildlife piece to date.",
      image: "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=800",
      content:
        "When I started the Majestic Eagle piece, I had no idea it would consume four months of evenings. What began as a quick wildlife sketch evolved into a near-obsessive study of feather micro-structure.\n\nEvery barb and barbule of each feather was individually stippled using a 0.3mm mechanical pencil loaded with 4H leads.",
    },
    {
      _id: "b004",
      title: "Paper Matters: Why Your Surface Changes Everything",
      description:
        "The surprising impact that paper choice has on your pencil drawings.",
      image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800",
      content:
        "Most beginners overlook paper and wonder why their drawings never look like the ones they admire online. The truth is — paper is half the drawing.\n\nFor hyper-realistic work, I recommend Strathmore 400 Series Bristol Vellum. It holds multiple layers without pilling, and erases cleanly.",
    },
  ];

  const res = await supabase.from("blogs").upsert(blogs, { onConflict: "_id" });
  ok("Blogs", res);
}

// ─── Tutorials ────────────────────────────────────────────────────────────────
async function seedTutorials() {
  const tutorials = [
    {
      title: "Drawing Realistic Eyes — Step by Step",
      description:
        "A complete walkthrough for drawing hyper-realistic eyes, from basic shapes to final highlights.",
      image: "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=800",
      video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      content:
        "Step 1: Sketch the almond shape lightly with an HB pencil.\nStep 2: Map out the iris circle — it is always partially hidden by the eyelid.\nStep 3: Shade the pupil to near-black with a 6B, leaving a highlight.\nStep 4: Build iris texture with radiating strokes from the pupil outward.",
    },
    {
      title: "Mastering the Blending Stump",
      description:
        "How to use tortillons and blending stumps to achieve silky-smooth gradients.",
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
      video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      content:
        "A blending stump (tortillon) is a tightly rolled paper tool used to smudge and blend graphite.\n\nKey tips:\n• Always blend in the direction of the form\n• Use a clean stump for light areas\n• Never blend over fine detail lines",
    },
    {
      title: "Drawing Realistic Hair — Strand by Strand",
      description:
        "The professional technique for rendering hair that actually looks like hair.",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
      video_url: null,
      content:
        "The biggest mistake beginners make is drawing individual hairs. Instead:\n\n1. Block in the overall shadow masses first\n2. Use flowing strokes in the direction of hair growth\n3. Add individual strands only on top, in the light areas\n4. Use a kneaded eraser pulled into a fine point to lift highlights",
    },
  ];

  const res = await supabase.from("tutorials").insert(tutorials);
  ok("Tutorials", res);
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
async function seedTestimonials() {
  const testimonials = [
    {
      author_name: "Sarah Mitchell",
      author_email: "sarah.m@example.com",
      content:
        "I commissioned a portrait of my late grandmother and I am absolutely speechless. The likeness is uncanny and the emotion captured in her eyes brought me to tears. This is the most treasured piece in my home.",
      rating: 5,
      approved: true,
    },
    {
      author_name: "James Okonkwo",
      author_email: "james.ok@example.com",
      content:
        "Ordered the Whispering Woods print for my office and the quality is outstanding. The detail in the tree bark is mind-blowing — you can see individual wood grain lines. Highly recommend!",
      rating: 5,
      approved: true,
    },
    {
      author_name: "Priya Sharma",
      author_email: "priya.s@example.com",
      content:
        "Got a custom pencil portrait done for my husband's birthday. Communication was great throughout the process and the final piece exceeded expectations. Will definitely commission again.",
      rating: 5,
      approved: true,
    },
    {
      author_name: "Thomas Adler",
      author_email: "t.adler@example.com",
      content:
        "Stunning work. I have purchased from several artists and this is by far the most technically accomplished pencil art I have seen. The tonal range is extraordinary.",
      rating: 4,
      approved: true,
    },
    {
      author_name: "Fatima Al-Hassan",
      author_email: "fatima.h@example.com",
      content:
        "The Wildlife Eagle piece is incredible. My son who is an ornithologist was amazed at the anatomical accuracy of the feathers. A true work of art.",
      rating: 5,
      approved: false,
    },
  ];

  const res = await supabase.from("testimonials").insert(testimonials);
  ok("Testimonials", res);
}

// ─── About Page ───────────────────────────────────────────────────────────────
async function seedAboutPage() {
  const about = {
    hero_title: "Bringing Light and Shadow to Life",
    hero_subtitle:
      "Hyper-realistic pencil art that captures emotion, texture, and the beauty of the everyday",
    bio: "I am a self-taught pencil artist based in Accra, Ghana, with over 12 years of experience creating hyper-realistic drawings. My work spans portraiture, wildlife, landscapes, and architectural studies — all crafted entirely with graphite pencils on paper.\n\nWhat began as sketching in school notebooks has grown into a full-time artistic practice and a growing global collector base. I believe pencil art is the most honest medium — every stroke is intentional, every mark permanent.\n\nWhen I am not drawing, I teach workshops, share tutorials, and obsess over finding the perfect paper.",
    profile_image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
    social_links: {
      instagram: "https://instagram.com/smartist",
      twitter: "https://twitter.com/smartist",
      youtube: "https://youtube.com/@smartist",
    },
  };

  const res = await supabase.from("about_page").insert([about]);
  ok("About Page", res);
}

// ─── Achievements ─────────────────────────────────────────────────────────────
async function seedAchievements() {
  const achievements = [
    {
      title: "Featured in African Art Quarterly",
      description:
        "Selected as one of the top 10 emerging pencil artists in West Africa for the summer issue.",
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
      date: "2023-06-15",
    },
    {
      title: "500+ Commission Pieces Completed",
      description:
        "Reached the milestone of 500 completed commission artworks shipped to collectors in 34 countries.",
      image: null,
      date: "2023-11-01",
    },
    {
      title: "Best in Show — Accra Arts Festival",
      description:
        "Awarded Best in Show in the Contemporary Drawing category at the annual Accra Arts Festival.",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800",
      date: "2022-09-20",
    },
    {
      title: "YouTube Channel — 50K Subscribers",
      description:
        "Pencil art tutorial channel reached 50,000 subscribers, making it one of the fastest growing art channels in Ghana.",
      image: null,
      date: "2024-01-10",
    },
  ];

  const res = await supabase.from("achievements").insert(achievements);
  ok("Achievements", res);
}

// ─── Contact Messages ─────────────────────────────────────────────────────────
async function seedContactMessages() {
  const messages = [
    {
      name: "Emily Chen",
      email: "emily.chen@example.com",
      subject: "Commission Inquiry — Family Portrait",
      message:
        "Hello! I would love to commission a family portrait for Christmas. There are 4 of us and I have some great reference photos. Could you give me an idea of pricing and turnaround time?",
      status: "unread",
    },
    {
      name: "David Osei",
      email: "d.osei@example.com",
      subject: "Purchasing the Lighthouse Print",
      message:
        "Hi, I saw the Old Lighthouse piece on your Instagram. Is the original still available? I would also love to know if you ship to the UK.",
      status: "read",
    },
    {
      name: "Amara Diallo",
      email: "amara.d@example.com",
      subject: "Workshop availability",
      message:
        "I am interested in attending one of your pencil art workshops. Do you offer online sessions? I am based in Dakar.",
      status: "replied",
    },
  ];

  const res = await supabase.from("contact_messages").insert(messages);
  ok("Contact Messages", res);
}

// ─── Newsletter Subscribers ───────────────────────────────────────────────────
async function seedSubscribers() {
  const subs = [
    { email: "collector1@example.com" },
    { email: "artlover22@example.com" },
    { email: "sarah.mitchell@example.com" },
    { email: "james.ok@example.com" },
    { email: "priya.s@example.com" },
    { email: "thomas.adler@example.com" },
    { email: "newsletter@artworld.com" },
    { email: "fanofpencils@example.com" },
  ];

  const res = await supabase.from("newsletter_subscribers").upsert(subs, { onConflict: "email" });
  ok("Newsletter Subscribers", res);
}

// ─── Commissions ──────────────────────────────────────────────────────────────
async function seedCommissions() {
  const commissions = [
    {
      customer_name: "Grace Mensah",
      customer_email: "grace.m@example.com",
      description: "Portrait of my late father from a wedding photograph — chest-up, formal wear.",
      size: "14×18 inches",
      medium: "Graphite on Bristol",
      budget: 400,
      deadline: "2024-12-25",
      status: "in_progress",
      notes: "Reference photo already sent via email. Customer wants it framed.",
    },
    {
      customer_name: "Kwame Asante",
      customer_email: "k.asante@example.com",
      description: "Two pets — a German Shepherd and a tabby cat — together in one piece.",
      size: "16×20 inches",
      medium: "Graphite on cartridge paper",
      budget: 350,
      deadline: "2025-01-15",
      status: "pending",
      notes: null,
    },
    {
      customer_name: "Linda Boateng",
      customer_email: "linda.b@example.com",
      description: "Wedding portrait — bride and groom, full colour pencil requested.",
      size: "20×24 inches",
      medium: "Colour pencil on watercolour paper",
      budget: 700,
      deadline: "2025-02-14",
      status: "pending",
      notes: "First anniversary gift, must arrive by Feb 10.",
    },
    {
      customer_name: "Ama Owusu",
      customer_email: "ama.o@example.com",
      description: "Hyper-realistic drawing of my cat, Mochi. She passed away last month.",
      size: "11×14 inches",
      medium: "Graphite",
      budget: 250,
      deadline: "2024-11-30",
      status: "completed",
      notes: "Delivered and paid in full.",
    },
  ];

  const res = await supabase.from("commissions").insert(commissions);
  ok("Commissions", res);
}

// ─── Orders ───────────────────────────────────────────────────────────────────
async function seedOrders() {
  const orders = [
    {
      customer_name: "James Okonkwo",
      customer_email: "james.ok@example.com",
      total_amount: 450,
      status: "delivered",
      shipping_address: {
        line1: "42 Canary Wharf",
        city: "London",
        country: "UK",
        postal_code: "E14 5AB",
      },
      notes: "Signed copy requested — fulfilled.",
    },
    {
      customer_name: "Sarah Mitchell",
      customer_email: "sarah.m@example.com",
      total_amount: 380,
      status: "shipped",
      shipping_address: {
        line1: "87 Maple Drive",
        city: "Toronto",
        country: "Canada",
        postal_code: "M4B 1B3",
      },
      notes: null,
    },
    {
      customer_name: "Thomas Adler",
      customer_email: "t.adler@example.com",
      total_amount: 290,
      status: "pending",
      shipping_address: {
        line1: "Musterstraße 12",
        city: "Berlin",
        country: "Germany",
        postal_code: "10115",
      },
      notes: null,
    },
  ];

  const res = await supabase.from("orders").insert(orders);
  ok("Orders", res);
}

// ─── Policies ─────────────────────────────────────────────────────────────────
async function seedPolicies() {
  const updates = [
    {
      slug: "privacy-policy",
      title: "Privacy Policy",
      content: `Last updated: October 2024

We take your privacy seriously. This policy explains what data we collect and why.

**What we collect**
- Name and email when you contact us or subscribe to our newsletter
- Order details when you make a purchase
- Commission request details

**How we use it**
- To fulfil your orders and commissions
- To send you newsletters you signed up for (you can unsubscribe anytime)
- To respond to your enquiries

**We never sell your data.** All data is stored securely and is not shared with third parties except where required to fulfil your order (e.g. shipping providers).

For any questions, contact us at privacy@smartist.art`,
    },
    {
      slug: "return-policy",
      title: "Return & Refund Policy",
      content: `**Original Artworks**
All original artwork sales are final. Due to the one-of-a-kind nature of original pieces, we cannot accept returns. Please review all photos carefully before purchasing.

If your artwork arrives damaged, please photograph the damage and packaging within 48 hours of delivery and contact us immediately. We will work with you to find a fair resolution.

**Commission Pieces**
Commissions are custom-made to your specifications. A 50% non-refundable deposit is required to begin work. The balance is due upon completion before delivery.

If you are not satisfied with the final piece, please communicate this during the revision stage (up to 2 revisions included). We do not offer refunds on completed commission pieces.

**Prints**
Prints can be returned within 14 days in original, unopened condition. Return shipping costs are the buyer's responsibility.`,
    },
    {
      slug: "shipping-policy",
      title: "Shipping Policy",
      content: `**Processing Time**
Original artworks and prints are carefully packaged and dispatched within 3–5 business days of payment confirmation. Commission pieces are shipped upon final approval and payment.

**Packaging**
All artworks are shipped flat (not rolled) in rigid mailer boxes with acid-free backing boards and protective sleeves. Large pieces may be shipped in custom wooden crates.

**Delivery Times**
- Ghana: 2–4 business days
- West Africa: 5–10 business days  
- Europe & UK: 7–14 business days
- USA & Canada: 10–18 business days
- Rest of World: 14–21 business days

**Tracking**
All shipments include tracking. You will receive a tracking number by email once your order is dispatched.

**Customs & Import Duties**
International buyers are responsible for any customs fees or import duties in their country.`,
    },
    {
      slug: "terms-of-service",
      title: "Terms of Service",
      content: `By using this website and purchasing from Smartist, you agree to the following terms.

**Intellectual Property**
All artwork displayed on this site remains the intellectual property of the artist. Purchasing a piece grants you ownership of the physical artwork only — not reproduction rights. You may not reproduce, print, or digitally distribute any artwork without written permission.

**Commission Agreements**
Commission clients receive a personal use licence for their commissioned piece. Commercial use (advertising, merchandise, etc.) requires a separate commercial licence.

**Accuracy of Listings**
We make every effort to accurately represent artworks through photography. However, colours may vary slightly due to monitor calibration. This is not grounds for a return.

**Governing Law**
These terms are governed by the laws of the Republic of Ghana.

For questions, contact us at hello@smartist.art`,
    },
  ];

  for (const policy of updates) {
    const res = await supabase
      .from("policies")
      .update({ title: policy.title, content: policy.content, updated_at: new Date().toISOString() })
      .eq("slug", policy.slug);
    ok(`Policy: ${policy.slug}`, res);
  }
}

// ─── Run all ──────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🎨  Seeding Smartist demo data...\n");
  await seedProducts();
  await seedBlogs();
  await seedTutorials();
  await seedTestimonials();
  await seedAboutPage();
  await seedAchievements();
  await seedContactMessages();
  await seedSubscribers();
  await seedCommissions();
  await seedOrders();
  await seedPolicies();
  console.log("\n🏁  Done!\n");
}

main().catch(console.error);
