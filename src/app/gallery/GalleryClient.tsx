"use client";
import { useEffect, useState, useMemo } from "react";
import Container from "@/ui/Container";
import ProductCard from "@/ui/ProductCard";
import { ChevronDown, Sparkles, X } from "lucide-react";
import { DEFAULT_CATEGORIES } from "@/constants/categories";

export interface Product {
  id: string;
  _id: string;
  name: string;
  category: string | null;
  price: number | null;
  images: string[];
  in_stock: boolean;
  created_at: string;
  social_post_url?: string | null;
}

type SortOption = "newest" | "oldest" | "name_asc" | "name_desc" | "category";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest First",
  oldest: "Oldest First",
  name_asc: "Name: A → Z",
  name_desc: "Name: Z → A",
  category: "Category",
};

const LOCAL_STORAGE_KEY = "artworksCurrentPage";

interface GalleryClientProps {
  initialProducts: Product[];
  initialCategory?: string;
}

export default function GalleryClient({
  initialProducts,
  initialCategory = "All",
}: GalleryClientProps) {
  const [products] = useState<Product[]>(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingPage, setPendingPage] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [activeCategory, setActiveCategory] = useState<string>(
    initialCategory || "All"
  );
  const [sortOpen, setSortOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const productsPerPage = 12;

  // Restore saved page
  useEffect(() => {
    const savedPage = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedPage) {
      const p = parseInt(savedPage, 10);
      if (!isNaN(p) && p > 0) setCurrentPage(p);
    }
  }, []);

  // Save page
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, currentPage.toString());
  }, [currentPage]);

  // Combined categories from DEFAULT_CATEGORIES and any custom DB categories
  const categories = useMemo(() => {
    const extraCats = products
      .map((p) => p.category)
      .filter(
        (cat): cat is string =>
          Boolean(cat) &&
          !(DEFAULT_CATEGORIES as readonly string[]).includes(cat as any)
      );
    const uniqueExtras = Array.from(new Set(extraCats));
    return ["All", ...DEFAULT_CATEGORIES, ...uniqueExtras];
  }, [products]);

  // Calculate count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    products.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  // Filter + sort
  const processedProducts = useMemo(() => {
    let list = [...products];

    // Filter by category
    if (activeCategory !== "All") {
      list = list.filter(
        (p) =>
          (p.category || "").toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        list.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        list.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "name_asc":
        list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      case "name_desc":
        list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
        break;
      case "category":
        list.sort((a, b) =>
          (a.category ?? "").localeCompare(b.category ?? "")
        );
        break;
    }

    return list;
  }, [products, activeCategory, sortBy]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, activeCategory]);

  // Pagination
  const totalPages = Math.ceil(processedProducts.length / productsPerPage);
  const currentProducts = processedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    if (pendingPage !== null) {
      window.scrollTo(0, 0);
      const timer = setTimeout(() => {
        setCurrentPage(pendingPage);
        setPendingPage(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pendingPage]);

  const changePageWithLoading = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setPendingPage(page);
  };

  return (
    <div>
      <Container>
        <div className="flex flex-col gap-8 md:py-10">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Art Collection
            </h1>
            <p className="text-gray-500 mt-3 text-sm md:text-base max-w-xl mx-auto">
              Explore hand-drawn graphite and pencil artworks, custom portraits, and exclusive exhibitions.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">

              {activeCategory !== "All" && (
                <button
                  onClick={() => setActiveCategory("All")}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  Clear filter <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Controls bar */}
          <div className="flex flex-row gap-4 items-start sm:items-center justify-between pb-2 border-b border-gray-100">
            {/* Category dropdown */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => {
                  setCategoryOpen((o) => !o);
                  setSortOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors shadow-sm"
              >

                <span className="text-gray-900 font-semibold">
                  {activeCategory}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                  {categoryCounts[activeCategory] || 0}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {categoryOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setCategoryOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-64 max-h-80 overflow-y-auto bg-white border border-gray-100 rounded-2xl shadow-xl z-20 py-1">
                    {categories.map((cat) => {
                      const count = categoryCounts[cat] || 0;
                      const isSelected =
                        activeCategory.toLowerCase() === cat.toLowerCase();
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            setActiveCategory(cat);
                            setCategoryOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${isSelected
                            ? "bg-gray-900 text-white font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                          <span>{cat}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${isSelected
                              ? "bg-white/20 text-white"
                              : "bg-gray-100 text-gray-600"
                              }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Sort dropdown */}
            <div className="relative flex-shrink-0 self-end sm:self-auto">
              <button
                onClick={() => {
                  setSortOpen((o) => !o);
                  setCategoryOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors shadow-sm"
              >
                <span className="text-gray-400">Sort by:</span>
                <span className="text-gray-900 font-semibold">
                  {SORT_LABELS[sortBy]}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${sortOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {sortOpen && (
                <>
                  {/* Backdrop to close */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setSortOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-lg z-20 overflow-hidden py-1">
                    {(Object.keys(SORT_LABELS) as SortOption[]).map(
                      (option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSortBy(option);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${sortBy === option
                            ? "bg-gray-900 text-white font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                          <span>{SORT_LABELS[option]}</span>
                          {sortBy === option && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </button>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Grid */}
          {currentProducts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100 p-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                No artworks in this category yet
              </h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                There are currently no artworks listed under &ldquo;{activeCategory}&rdquo;. Explore other categories or check back soon!
              </p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSortBy("newest");
                }}
                className="mt-5 px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-black transition-colors shadow-sm"
              >
                View All Artworks
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8 items-start">
              {currentProducts.map((item) => (
                <ProductCard item={item as any} key={item?._id || item?.id} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => changePageWithLoading(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => changePageWithLoading(num)}
                  className={`w-9 h-9 text-sm rounded-lg font-medium transition-colors ${currentPage === num
                    ? "bg-gray-900 text-white"
                    : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => changePageWithLoading(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
