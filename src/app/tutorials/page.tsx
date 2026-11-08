"use client";
import { useState, useEffect } from "react";
import YouTube from "react-youtube";
import { supabase } from "@/lib/supabase";
import Loading from "@/ui/Loading";
import { SocialEmbed } from "@/ui/SocialEmbed";

interface TutorialVideo {
  id: string;
  title: string;
  youtubeId: string;
  description: string;
  date: string;
  social_post_url?: string;
}

const ITEMS_PER_PAGE = 6;

export default function TutorialsPage() {
  const [tutorialsData, setTutorialsData] = useState<TutorialVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("tutorials").select("*");
        if (error) throw error;
        // Transform data
        const transformed: TutorialVideo[] = (data || []).map((item: any) => ({
          id: item._id || item.id,
          title: item.title,
          youtubeId: item.youtube_id,
          description: item.description,
          social_post_url: item.social_post_url || "",
          date: new Date(item.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
          })
        }));
        setTutorialsData(transformed);
      } catch (error) {
        console.error("Error fetching tutorials data", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalPages = Math.max(
    1,
    Math.ceil(tutorialsData.length / ITEMS_PER_PAGE)
  );
  const paginatedData = tutorialsData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const opts = {
    height: "350",
    width: "100%",
    playerVars: {
      autoplay: 0
    }
  };

  return (
    <main className="w-full mx-auto px-4 md:px-8 py-12 flex flex-col items-center">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center text-gray-900">
          Pencil Art Tutorials
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Learn new skills with our collection of art tutorials.
        </p>
      </div>

      {/* Video Cards */}
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full max-w-7xl">
            {paginatedData.map((video) => (
              <article
                key={video.id}
                className="bg-white rounded-md shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition"
              >
                <YouTube videoId={video.youtubeId} opts={opts} />
                {video.social_post_url && (
                  <div className="px-4">
                    <SocialEmbed url={video.social_post_url} />
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Pagination Controls */}
          {tutorialsData.length > ITEMS_PER_PAGE && (
            <div className="flex justify-center items-center gap-4 mb-8">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-300"
              >
                Previous
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number)}
                      className={`px-3 py-2 rounded-md transition-colors ${
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
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-gray-300"
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
