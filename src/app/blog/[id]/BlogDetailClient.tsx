"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SocialEmbed } from "@/ui/SocialEmbed";
import { FALLBACK_BLOGS, FallbackBlogItem, formatBlogDate } from "@/constants/fallbackBlogs";

interface BlogDetailClientProps {
  id: string;
}

interface BlogPost {
  id: string;
  title: string;
  description: string;
  image?: string;
  social_post_url?: string;
  date: string;
}

export default function BlogDetailClient({ id }: BlogDetailClientProps) {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadPost() {
      setLoading(true);
      let foundItem: any = null;

      // 1. First attempt: Query Supabase by primary key `id`
      try {
        if (supabase) {
          const { data, error } = await supabase
            .from("blogs")
            .select("*")
            .eq("id", id)
            .maybeSingle();

          if (!error && data) {
            foundItem = data;
          }
        }
      } catch (err) {
        console.warn("Could not query blog by id:", err);
      }

      // 2. Second attempt: If not found by `id`, query by `_id` column
      if (!foundItem) {
        try {
          if (supabase) {
            const { data, error } = await supabase
              .from("blogs")
              .select("*")
              .eq("_id", id)
              .maybeSingle();

            if (!error && data) {
              foundItem = data;
            }
          }
        } catch (err) {
          console.warn("Could not query blog by _id:", err);
        }
      }

      // 3. Third attempt: Match with fallback articles
      if (!foundItem) {
        const fallback = FALLBACK_BLOGS.find(
          (b) => b.id === id || b._id === id
        );
        if (fallback) {
          foundItem = fallback;
        }
      }

      if (!isMounted) return;

      if (foundItem) {
        const formattedDate = formatBlogDate(foundItem.created_at || foundItem.date);

        const resolvedTitle =
          foundItem.title || foundItem.description || "Featured Artwork & Story";

        setBlog({
          id: foundItem.id || foundItem._id || id,
          title: resolvedTitle,
          description: foundItem.description || "",
          image: foundItem.image || foundItem.src || "",
          social_post_url: foundItem.social_post_url || "",
          date: formattedDate,
        });

        // 4. Fetch related / other blogs
        try {
          let related: BlogPost[] = [];
          if (supabase) {
            const { data: relData } = await supabase
              .from("blogs")
              .select("*")
              .neq("id", foundItem.id || id)
              .order("created_at", { ascending: false })
              .limit(3);

            if (relData && relData.length > 0) {
              related = relData.map((item: any) => ({
                id: item.id || item._id,
                title: item.title || item.description || "Artwork Post",
                description: item.description || "",
                image: item.image || item.src || "",
                social_post_url: item.social_post_url || "",
                date: formatBlogDate(item.created_at || item.date),
              }));
            }
          }

          if (related.length === 0) {
            related = FALLBACK_BLOGS.filter(
              (b) => b.id !== id && b._id !== id
            ).map((b) => ({
              id: b.id,
              title: b.title,
              description: b.description,
              image: b.image || b.src || "",
              social_post_url: b.social_post_url || "",
              date: b.date,
            }));
          }

          if (isMounted) {
            setRelatedPosts(related.slice(0, 3));
          }
        } catch (err) {
          console.warn("Could not load related posts:", err);
        }
      } else {
        setBlog(null);
      }

      setLoading(false);
    }

    loadPost();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Loading skeleton state
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 pt-4 md:pt-12 pb-16 animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded-full mb-8" />
        <div className="h-4 w-48 bg-gray-200 rounded-full mb-4" />
        <div className="h-10 w-3/4 bg-gray-200 rounded-2xl mb-8" />
        <div className="aspect-[16/10] sm:aspect-[16/9] w-full bg-gray-200 rounded-3xl mb-8" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded-full w-full" />
          <div className="h-4 bg-gray-200 rounded-full w-5/6" />
          <div className="h-4 bg-gray-200 rounded-full w-4/6" />
        </div>
      </div>
    );
  }

  // Not found state
  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Blog Post Not Found
        </h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm sm:text-base">
          The blog article you are looking for does not exist or may have been removed.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-black transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Blogs</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="w-full max-w-4xl mx-auto px-4 md:px-8 pt-4 md:pt-12 pb-16">
      {/* Top Navigation */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to all blogs</span>
        </Link>
      </div>

      {/* Header section */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400 font-medium mb-3">
          <Calendar className="w-4 h-4" />
          <time>{blog.date}</time>
          <span>•</span>
          <span className="text-gray-600">Pencil Art & Insights</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          {blog.title}
        </h1>
      </header>

      {/* Featured Image */}
      {blog.image && (
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100 shadow-sm mb-10 border border-gray-100">
          <img
            src={blog.image}
            alt={blog.title || "Blog cover"}
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}

      {/* Article Body */}
      <div className="text-base sm:text-lg text-gray-700 leading-relaxed space-y-6">
        {blog.description ? (
          <div className="whitespace-pre-line leading-relaxed font-normal">
            {blog.description}
          </div>
        ) : null}
      </div>

      {/* Social Media Embed if attached */}
      {blog.social_post_url && (
        <div className="my-10 p-6 rounded-2xl bg-gray-50 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
            Featured Social Post
          </h3>
          <SocialEmbed url={blog.social_post_url} />
        </div>
      )}

      {/* Bottom Actions */}
      <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-100 text-gray-800 text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Blogs</span>
        </Link>

        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-black transition-colors shadow-sm"
        >
          <span>Browse Artwork Gallery</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Related / More Blogs */}
      {relatedPosts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">
            More From Our Blog
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedPosts.map((related) => (
              <Link
                key={related.id}
                href={`/blog/${related.id}`}
                className="group flex flex-col cursor-pointer"
              >
                <div className="aspect-[16/10] sm:aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 shadow-xs mb-3 group-hover:shadow-md transition-shadow">
                  {related.image ? (
                    <img
                      src={related.image}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Calendar className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-1 group-hover:text-gray-600 transition-colors">
                  {related.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">{related.date}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

