import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import ImageSlider from "../ui/ImageSlider";
import { supabase } from "@/lib/supabase";
import { LeaveTestimonial } from "@/ui/LeaveTestimonial";

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
      const { data } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      return data || [];
    };

    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(3);
      return data || [];
    };

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 2500)
    );

    const [articlesRes, testimonialsRes] = await Promise.race([
      Promise.all([fetchArticles(), fetchTestimonials()]),
      timeout.then(() => [[], []] as [any[], any[]]),
    ]);

    rawArticles = articlesRes || [];
    rawTestimonials = testimonialsRes || [];
  } catch (err) {
    console.warn("Could not fetch latest blogs/testimonials for homepage:", err);
  }

  const articles = (rawArticles || []).map((item: any) => ({
    id: item.id,
    src: item.image,
    date: new Date(item.created_at).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    title: item.title,
    description: item.description,
  }));

  const testimonials = rawTestimonials || [];

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-4 md:px-8 pt-32 md:pt-0 pb-12 min-h-[65vh]">
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
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
            <Link
              href="/blog"
              className="px-3 py-3 bg-white border border-gray-200 text-gray-900 rounded-md font-semibold shadow hover:bg-gray-50 hover:shadow-xl transition"
            >
              Explore Blog
            </Link>
          </div>
        </div>
        {/* Right side: Placeholder image */}
        <div className="flex-1 flex justify-center mt-12 md:mt-0 md:ml-12 w-full self-stretch">
          <div className="w-full h-full min-h-[350px] md:min-h-[500px] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
            {/* Placeholder icon */}
            <div className="flex flex-col w-full h-full items-center justify-center text-gray-300">
              <ImageSlider />
            </div>
          </div>
        </div>
      </div>
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
                    <span className="text-xs text-white/80 uppercase font-medium bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full group-hover:bg-white group-hover:text-black transition-colors">
                      Explore &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-0">
        {/* Articles Grid */}
        <div className="flex items-center justify-between py-6">
          <h2 className="text-2xl md:text-3xl font-bold">Latest Articles</h2>
          <Link href="/blog" className="gap-2 group overflow-hidden">
            <div className="flex items-center text-gray-900 text-sm gap-1">
              View All <FaArrowRight className="h-3" />
            </div>
            <span className="inline-flex w-full h-[1px] bg-black absolute bottom-0 left-0 transform -translate-x-[50%] scale-0 group-hover:translate-x-0 duration-300 group-hover:scale-100" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ">
          {articles.map((article: any, idx: number) => (
            <Link key={idx} href="/articles">
              <article className="group flex flex-col gap-4">
                <div className="bg-gray-200 aspect-[4/3] rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition">
                  <img
                    src={article.src}
                    alt={article.title}
                    className="h-full w-full object-cover object-top group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="px-1 flex flex-col">
                  <time className="block mb-2 text-xs text-gray-500 font-medium tracking-wide uppercase">
                    {article.date}
                  </time>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {article.description}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto py-12 px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center md:text-left">
            What Our Community Says
          </h2>
          <LeaveTestimonial />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t: any, idx: number) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-start shadow-sm"
            >
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <circle cx={12} cy={8} r={4} />
                    <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
              <p className="text-gray-700 text-base mt-2">&quot;{t.text}&quot;</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
