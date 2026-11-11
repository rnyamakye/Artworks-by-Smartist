import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import ImageSlider from "../ui/ImageSlider";
import { supabase } from "@/lib/supabase";
import { HomeArticles } from "@/ui/HomeArticles";
import { CommunityTestimonials } from "@/ui/CommunityTestimonials";
import { FALLBACK_BLOGS, formatBlogDate } from "@/constants/fallbackBlogs";

export const revalidate = 0;

const artworks = [
  {
    src: "/commmissioned-portrait-29.JPG",
    category: "Children"
  },
  {
    src: "/family-portrait.JPG",
    category: "Family Portrait"
  },
  {
    src: "/realistic-eye.JPG",
    category: "Abstract"
  }
];

export default async function Home() {
  let rawArticles: any[] = [];
  let rawTestimonials: any[] = [];

  try {
    const fetchArticles = async () => {
      if (!supabase) return [];
      const { data } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      return data || [];
    };

    const fetchTestimonials = async () => {
      if (!supabase) return [];
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);
      return data || [];
    };

    // Graceful, non-rejecting timeout (800ms): resolves null without throwing
    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 800)
    );

    const fetchPromise = Promise.all([
      fetchArticles().catch(() => []),
      fetchTestimonials().catch(() => []),
    ]);

    const result = await Promise.race([fetchPromise, timeoutPromise]);
    if (result) {
      [rawArticles, rawTestimonials] = result;
    }
  } catch {
    // Gracefully proceed with fallback content
  }

  const dbArticles = (rawArticles || []).map((item: any) => ({
    id: item.id || item._id,
    src: item.image,
    image: item.image,
    date: formatBlogDate(item.created_at),
    title: item.title || item.description || "Featured Artwork & Story",
    description: item.description,
    social_post_url: item.social_post_url || "",
  }));

  const articles = dbArticles.length > 0 ? dbArticles : FALLBACK_BLOGS;

  const fallbackTestimonials = [
    {
      id: "t001",
      name: "Sarah Mitchell",
      role: "Art Collector",
      text: "I commissioned a portrait of my late grandmother and I am absolutely speechless. The likeness is uncanny and the emotion captured in her eyes brought me to tears. This is the most treasured piece in my home.",
      status: "approved",
      created_at: "2026-10-15T12:00:00Z",
    },
    {
      id: "t002",
      name: "James Okonkwo",
      role: "Interior Designer",
      text: "The tonal depth and texture achieved with pure graphite is breathtaking. We installed two landscape pieces in a luxury residence and our clients couldn't stop admiring the intricate details.",
      status: "approved",
      created_at: "2026-10-20T14:30:00Z",
    },
    {
      id: "t003",
      name: "Elena Rostova",
      role: "Gallery Curator",
      text: "Hyper-realism with authentic heart. The precision in the shading and proportion is master-level. Truly exceptional artistry that stands out in contemporary drawing.",
      status: "approved",
      created_at: "2026-10-28T09:15:00Z",
    },
    {
      id: "t004",
      name: "David Vance",
      role: "Architectural Designer",
      text: "The perspective and shading work in these graphite pieces is sensational. It adds such a timeless and sophisticated atmosphere to our gallery.",
      status: "approved",
      created_at: "2026-11-01T10:00:00Z",
    },
    {
      id: "t005",
      name: "Maya Lin",
      role: "Art Collector",
      text: "Every fine stroke captures genuine emotion. Ordering was seamless, and the commissioned artwork arrived securely packaged and even more stunning in person.",
      status: "approved",
      created_at: "2026-11-04T16:20:00Z",
    },
  ];

  const dbTestimonials = (rawTestimonials || []).map((item: any) => ({
    id: item.id || item._id,
    name: item.name || item.author_name || "Collector",
    role: item.role || item.author_email || "Art Collector",
    text: item.text || item.content || "",
    status: item.status || (item.approved ? "approved" : "pending"),
    created_at: item.created_at,
    social_post_url: item.social_post_url || null,
  }));

  const testimonials =
    dbTestimonials.length > 0 ? dbTestimonials : fallbackTestimonials;

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 md:px-8 pt-4 md:pt-0 pb-12 min-h-[65vh]">
        <div className="flex-1 max-w-xl">
          <h1 className="text-4xl md:text-6xl font-semibold text-gray-900 mb-6">
            Discover the Beauty of Pencil Art
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-8">
            Explore our collection of stunning pencil artworks, tutorials, and
            resources for artists of all levels.
          </p>
          <div className="flex gap-4">
            <Link
              href="/gallery"
              className="group px-3 py-3 bg-gray-900 text-white rounded-md font-semibold shadow hover:bg-gray-800 transition hover:shadow-xl flex items-center"
            >
              Browse Artwork{" "}
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 border border-gray-300 rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              About Me
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center mt-8 md:mt-0 w-full max-w-md">
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <ImageSlider />
          </div>
        </div>
      </div>

      {/* Artworks Showcase */}
      <section>
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 min-h-screen md:min-h-full">
          <div className="flex items-center-safe md:items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold py-6">Artworks</h2>
            <Link href="/gallery" className="gap-2 group overflow-hidden">
              <div className="flex items-center text-gray-900 text-xs md:text-sm gap-1">
                View All <FaArrowRight className="h-3" />
              </div>
              <span className="inline-flex w-full h-[1px] bg-black absolute bottom-0 left-0 transform -translate-x-[50%] scale-0 group-hover:translate-x-0 duration-300 group-hover:scale-100" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 md:flex-row gap-6 mb-12">
            {artworks.map((product, idx) => (
              <Link
                key={idx}
                href={`/gallery?category=${encodeURIComponent(product.category)}`}
                className="bg-white rounded-lg shadow overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="relative flex-1 flex items-center justify-center bg-gray-100 aspect-[4/3] md:aspect-square overflow-hidden">
                  <img
                    src={product.src}
                    className="object-cover object-center w-full h-full group-hover:scale-105 transition-transform duration-500"
                    alt={product.category}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-5">
                    <span className="text-white text-base md:text-lg font-semibold tracking-wide group-hover:translate-x-1 transition-transform">
                      {product.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-0">
        <div className="py-6">
          <h2 className="text-2xl md:text-3xl font-bold">Latest Articles</h2>
        </div>

        <HomeArticles articles={articles} />
      </section>

      {/* What Our Community Says (Testimonials + Leave Testimonial) */}
      <CommunityTestimonials initialTestimonials={testimonials} />
    </div>
  );
}
