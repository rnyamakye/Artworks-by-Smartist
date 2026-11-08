export interface FallbackBlogItem {
  id: string;
  _id?: string;
  image: string;
  src?: string;
  date: string;
  title: string;
  description: string;
  social_post_url?: string;
}

export function formatBlogDate(dateInput: string | Date | undefined): string {
  if (!dateInput) return "Recent";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export const FALLBACK_BLOGS: FallbackBlogItem[] = [
  {
    id: "b001",
    _id: "b001",
    src: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800",
    date: "06/11/2026",
    title: "The Art of Cross-Hatching: A Complete Guide",
    description:
      "Master the fundamental pencil shading technique that separates beginners from professionals.\n\nCross-hatching involves layering parallel lines at intersecting angles to create rich tone, texture, and three-dimensional depth. By adjusting line density, pencil grade, and pressure, artists can achieve seamless transitions from radiant highlights to profound, velvety shadows.\n\nExperiment with 2B and 4B graphite grades to discover how subtle cross-hatched patterns bring pencil sketches to life with authentic realism and dynamic rhythm.",
    social_post_url: "",
  },
  {
    id: "b002",
    _id: "b002",
    src: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800",
    date: "04/11/2026",
    title: "Choosing the Right Paper for Graphite Drawing",
    description:
      "Bristol, cartridge, or hot-pressed watercolor? Here's how paper texture impacts your pencil artwork.\n\nThe paper surface you choose determines how graphite particles adhere to the sheet. Smooth plate Bristol board allows for ultra-fine micro-details, crisp hair strands, and sharp edges. In contrast, medium-tooth vellum or cartridge paper allows multiple graphite layers to build deep tonal depth without slipping.\n\nAlways consider paper weight (at least 200 gsm / 120 lb) to withstand blending and erasing without warping.",
    social_post_url: "",
  },
  {
    id: "b003",
    _id: "b003",
    src: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800",
    date: "01/11/2026",
    title: "Capturing Realistic Skin Tones in Pencil",
    description:
      "Techniques for rendering lifelike portrait values, subtle highlights, and soft blended gradients.\n\nHuman skin is never a single flat tone. By combining hard pencils (2H, H) for delicate undertones and softer grades (B, 2B, 4B) for rich shadows, you can sculpt facial anatomy with lifelike precision.\n\nUse blending stumps or tortillons with gentle, circular pressure to avoid muddy smudges, and utilize a kneaded eraser to pick out specular highlights on cheekbones and the bridge of the nose.",
    social_post_url: "",
  },
];
