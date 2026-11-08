"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SocialEmbed } from "@/ui/SocialEmbed";
import { FALLBACK_BLOGS, formatBlogDate } from "@/constants/fallbackBlogs";

const ITEMS_PER_PAGE = 6;

interface BlogImage {
  id: string | number;
  image: string;
  description: string;
  date: string;
  title?: string;
  social_post_url?: string;
}

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const [blogsData, setBlogsData] = useState<BlogImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch blogs from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        const transformed: BlogImage[] = (data || []).map((item: any) => ({
          id: item.id || item._id,
          image: item.image,
          description: item.description,
          title: item.title,
          social_post_url: item.social_post_url || "",
          date: formatBlogDate(item.created_at),
        }));

        setBlogsData(transformed.length > 0 ? transformed : (FALLBACK_BLOGS as any));
      } catch (error) {
        console.error("Error fetching blogs data", error);
        setBlogsData(FALLBACK_BLOGS as any);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalPages = Math.max(1, Math.ceil(blogsData.length / ITEMS_PER_PAGE));
  const paginatedData = blogsData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="w-full mx-auto px-4 md:px-8 pt-4 md:pt-12 pb-16 flex flex-col items-center">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center text-gray-900 tracking-tight">
          Check Out Our Blog
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
          Discover stories, drawing insights, and updates from the world of hyper-realistic pencil art.
        </p>
      </div>

      {/* Blog Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12 w-full max-w-7xl animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="aspect-[16/10] sm:aspect-square w-full bg-gray-200 rounded-2xl sm:rounded-[28px]" />
              <div className="h-4 bg-gray-200 rounded-full w-3/4 mt-1" />
              <div className="h-3.5 bg-gray-200 rounded-full w-1/2" />
            </div>
          ))}
        </div>
      ) : blogsData.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100 max-w-lg w-full p-8 my-8">
          <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No blog articles published yet.</p>
          <p className="text-xs text-gray-400 mt-1">Check back soon for new drawing stories and tutorials.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12 w-full max-w-7xl">
            {paginatedData.map((item) => {
              const blogHref = item.id ? `/blog/${item.id}` : "/blog";

              return (
                <Link
                  key={item.id}
                  href={blogHref}
                  className="group flex flex-col cursor-pointer"
                >
                  {/* Rounded media container - shortened height on mobile */}
                  <div className="relative aspect-[16/10] sm:aspect-square w-full rounded-2xl sm:rounded-[28px] overflow-hidden bg-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md">
                    {item.image ? (
                      <img
                        src={item.image}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        alt={item.title || "Blog post"}
                      />
                    ) : item.social_post_url ? (
                      <div className="w-full h-full overflow-hidden p-3 flex items-center justify-center bg-gray-50 pointer-events-none">
                        <SocialEmbed url={item.social_post_url} />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Calendar className="w-12 h-12 stroke-[1.5]" />
                      </div>
                    )}
                  </div>

                  {/* Clean text section below image */}
                  <div className="mt-3.5 px-1 flex flex-col">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 leading-snug line-clamp-1 group-hover:text-gray-600 transition-colors">
                      {item.title || item.description}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-400 font-medium mt-1">
                      <time>{item.date}</time>
                      {item.title && item.description && (
                        <>
                          <span>•</span>
                          <span className="line-clamp-1 text-gray-500 font-normal">
                            {item.description}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {blogsData.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center items-center gap-4 mb-8">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-300 text-sm font-medium"
              >
                Previous
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number)}
                      className={`px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                        page === number
                          ? "bg-gray-900 text-white font-semibold"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-300 text-sm font-medium"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
