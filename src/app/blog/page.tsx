"use client";
import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Loading from "@/ui/Loading";

const ITEMS_PER_PAGE = 6;

interface BlogImage {
  id: string | number;
  image: string;
  description: string;
  date: string;
}

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const [blogsData, setBlogsData] = useState<BlogImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selected, setSelected] = useState<BlogImage | null>(null);

  // Fetch only images from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("blogs").select("*");
        if (error) throw error;
        // Only keep id, image, description, date
        const transformed: BlogImage[] = (data || []).map((item: any) => ({
          id: item._id || item.id,
          image: item.image,
          description: item.description,
          date: new Date(item.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
          })
        }));
        setBlogsData(transformed);
      } catch (error) {
        console.error("Error fetching blogs data", error);
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
    <>
      {/* Modal for more details */}
      <Transition appear show={!!selected} as="div">
        <Dialog
          as="div"
          className="relative z-50 focus:outline-none"
          onClose={() => setSelected(null)}
        >
          <div className="fixed inset-0 z-50 w-screen overflow-y-auto bg-black/30 backdrop-blur-sm">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                enter="ease-in duration-300"
                enterFrom="opacity-0 transform-[scale(90%)]"
                enterTo="opacity-100 transform-[scale(100%)] "
                leave="ease-in duration-100"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(50%)] "
              >
                <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-black/30 backdrop-blur-2xl z-50 p-6">
                  <img
                    src={selected?.image}
                    alt="Blog"
                    className="w-full object-cover rounded-lg max-h-96"
                  />
                  <div className="mt-4 text-white">
                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-200">
                      <Calendar className="w-4 h-4" />
                      {selected?.date}
                    </div>
                    <Dialog.Title className="text-lg font-semibold mb-2">
                      Description
                    </Dialog.Title>
                    <Dialog.Description className="text-base whitespace-pre-line">
                      {selected?.description}
                    </Dialog.Description>
                  </div>
                  <button
                    className="mt-6 px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
                    onClick={() => setSelected(null)}
                  >
                    Close
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <main className="w-full mx-auto px-4 md:px-8 py-12 flex flex-col items-center">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center text-gray-900">
            Explore Our Blog Gallery
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Discover artwork and images from our community of satisfied
            customers.
          </p>
        </div>

        {/* Blog Image Cards */}
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full max-w-7xl">
              {paginatedData.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition"
                  onClick={() => setSelected(item)}
                >
                  <img src={item.image} className="w-full h-56 object-cover" />
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </div>
                    <p className="text-gray-700 text-sm line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination Controls */}
            {blogsData.length > ITEMS_PER_PAGE && (
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
    </>
  );
}
