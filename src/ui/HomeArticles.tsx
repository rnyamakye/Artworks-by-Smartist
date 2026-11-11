"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { SocialEmbed } from "@/ui/SocialEmbed";
import { supabase } from "@/lib/supabase";
import { formatBlogDate } from "@/constants/fallbackBlogs";

export interface BlogItem {
  id?: string | number;
  image?: string;
  src?: string;
  title?: string;
  description?: string;
  date?: string;
  social_post_url?: string;
}

interface HomeArticlesProps {
  articles: BlogItem[];
}

export const HomeArticles: React.FC<HomeArticlesProps> = ({ articles }) => {
  const [articleList, setArticleList] = useState<BlogItem[]>(articles || []);

  useEffect(() => {
    setArticleList(articles || []);
  }, [articles]);

  useEffect(() => {
    let isMounted = true;
    const fetchFresh = async () => {
      try {
        if (!supabase) return;
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);

        if (!error && data && data.length > 0 && isMounted) {
          setArticleList(
            data.map((item: any) => ({
              id: item.id || item._id,
              image: item.image,
              src: item.image,
              title: item.title || item.description || "Featured Artwork & Story",
              description: item.description,
              date: formatBlogDate(item.created_at),
              social_post_url: item.social_post_url || "",
            }))
          );
        }
      } catch {
        // Silently preserve current articles
      }
    };
    fetchFresh();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!articleList || articleList.length === 0) {
    return null;
  }

  return (
    <>
      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {articleList.map((article, idx) => {
          const displayImage = article.image || article.src;
          const blogHref = article.id ? `/blog/${article.id}` : "/blog";

          return (
            <Link
              key={article.id || idx}
              href={blogHref}
              className="group flex flex-col cursor-pointer"
            >
              {/* Media Container - shortened on mobile */}
              <div className="relative aspect-[16/10] sm:aspect-square w-full rounded-2xl sm:rounded-[28px] overflow-hidden bg-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-md">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={article.title || "Blog post"}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                ) : article.social_post_url ? (
                  <div className="w-full h-full overflow-hidden p-3 flex items-center justify-center bg-gray-50 pointer-events-none">
                    <SocialEmbed url={article.social_post_url} />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Calendar className="w-12 h-12 stroke-[1.5]" />
                  </div>
                )}
              </div>

              {/* Text Section below matching design */}
              <div className="mt-3.5 px-1 flex flex-col">
                <h3 className="text-base md:text-lg font-bold text-gray-900 leading-snug line-clamp-1 group-hover:text-gray-600 transition-colors">
                  {article.title || article.description}
                </h3>
                <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-400 font-medium mt-1">
                  {article.date && <time>{article.date}</time>}
                  {article.title && article.description && (
                    <>
                      <span>•</span>
                      <span className="line-clamp-1 text-gray-500 font-normal">
                        {article.description}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* "See All Articles" link at the bottom of the section */}
      <div className="mt-8 sm:mt-12 flex justify-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-900 font-semibold text-sm sm:text-base hover:text-gray-600 transition-colors group py-2"
        >
          <span className="relative">
            See All Articles
            <span className="block h-[1.5px] bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </>
  );
};
