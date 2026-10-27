"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  ChevronDown,
  Search,
  Filter,
  Sparkles,
} from "lucide-react";
import Loading from "@/ui/Loading";
import { useConfirm } from "@/context/ConfirmContext";
import { DEFAULT_CATEGORIES } from "@/constants/categories";

type AdminSortOption = "newest" | "oldest" | "name_asc" | "name_desc" | "category";

const ADMIN_SORT_LABELS: Record<AdminSortOption, string> = {
  newest: "Newest First",
  oldest: "Oldest First",
  name_asc: "Name: A → Z",
  name_desc: "Name: Z → A",
  category: "Category: A → Z",
};

export default function ArtworksManager() {
  const { confirm } = useConfirm();
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");

  // Filtering & Sorting State
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<AdminSortOption>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOpen, setSortOpen] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    overview: "",
    price: "",
    imageFile: null as File | null,
    existingImageUrl: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchArtworks();
  }, []);

  async function fetchArtworks() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to fetch artworks");
    } else {
      setArtworks(data || []);
    }
    setLoading(false);
  }

  // Combined categories from DEFAULT_CATEGORIES and any custom DB categories
  const allCategories = useMemo(() => {
    const dbCats = artworks
      .map((item) => item.category)
      .filter(Boolean) as string[];
    const combined = Array.from(new Set([...DEFAULT_CATEGORIES, ...dbCats]));
    return ["All", ...combined];
  }, [artworks]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: artworks.length };
    artworks.forEach((item) => {
      if (item.category) {
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
    });
    return counts;
  }, [artworks]);

  // Filtered and Sorted Artworks
  const displayedArtworks = useMemo(() => {
    let list = [...artworks];

    // Filter by category
    if (selectedCategory !== "All") {
      list = list.filter(
        (item) =>
          (item.category || "").toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          (item.name || "").toLowerCase().includes(q) ||
          (item.category || "").toLowerCase().includes(q) ||
          (item.description || "").toLowerCase().includes(q)
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
          (a.category || "").localeCompare(b.category || "")
        );
        break;
    }

    return list;
  }, [artworks, selectedCategory, searchQuery, sortBy]);

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Delete Artwork",
      message:
        "Are you sure you want to delete this artwork? This action cannot be undone.",
      confirmText: "Delete",
      destructive: true,
    });
    if (!isConfirmed) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Artwork deleted");
      fetchArtworks();
    }
  };

  const handleEdit = (artwork: any) => {
    setEditingId(artwork.id);
    const cat = artwork.category || "";
    const isKnown = DEFAULT_CATEGORIES.includes(cat as any);
    setIsCustomCategory(!isKnown && cat !== "");
    setFormData({
      name: artwork.name || "",
      category: cat,
      description: artwork.description || "",
      overview: artwork.overview || "",
      price: artwork.price !== null && artwork.price !== undefined ? String(artwork.price) : "",
      imageFile: null,
      existingImageUrl: artwork.images?.[0] || "",
    });
    setView("form");
  };

  const resetForm = () => {
    setEditingId(null);
    setIsCustomCategory(false);
    setFormData({
      name: "",
      category: "",
      description: "",
      overview: "",
      price: "",
      imageFile: null,
      existingImageUrl: "",
    });
    setView("list");
  };

  const handleSelectCategory = (cat: string) => {
    if (cat === "CUSTOM") {
      setIsCustomCategory(true);
      setFormData((prev) => ({ ...prev, category: "" }));
    } else {
      setIsCustomCategory(false);
      setFormData((prev) => ({ ...prev, category: cat }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = formData.existingImageUrl;

      // If there's a new file, upload it to storage
      if (formData.imageFile) {
        const fileExt = formData.imageFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `artworks/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, formData.imageFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("images").getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const productData = {
        name: formData.name,
        category: formData.category.trim(),
        description: formData.description,
        overview: formData.overview || formData.description.slice(0, 100),
        price: formData.price ? parseFloat(formData.price) : null,
        images: imageUrl ? [imageUrl] : [],
        in_stock: true,
      };

      if (editingId) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Artwork updated");
      } else {
        const { error } = await supabase.from("products").insert([productData]);
        if (error) throw error;
        toast.success("Artwork added");
      }

      resetForm();
      fetchArtworks();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Artworks Collection
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your exhibition portfolio, artwork categories, and gallery pieces.
          </p>
        </div>
        {view === "list" ? (
          <button
            onClick={() => {
              resetForm();
              setView("form");
            }}
            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-black transition-colors font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Artwork
          </button>
        ) : (
          <button
            onClick={resetForm}
            className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
        )}
      </div>

      {view === "form" ? (
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {editingId ? "Edit Artwork" : "Create New Artwork"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title / Name *
              </label>
              <input
                required
                type="text"
                value={formData.name}
                placeholder="e.g. Portrait of Joy, Little Wonder, Abstract Waves"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none transition-colors"
              />
            </div>

            {/* Category Selector with standard categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artwork Category *
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Select a standard exhibition category to reflect directly in the gallery filters, or define a custom one:
              </p>
              
              {/* Category Quick Pills */}
              <div className="flex flex-wrap gap-2 mb-3">
                {DEFAULT_CATEGORIES.map((cat) => {
                  const isSelected =
                    !isCustomCategory &&
                    formData.category.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => handleSelectCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-gray-900 text-white shadow-sm ring-2 ring-gray-900 ring-offset-1"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => handleSelectCategory("CUSTOM")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isCustomCategory
                      ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                      : "border-dashed border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  + Custom Category
                </button>
              </div>

              {/* Category Input Field */}
              <input
                required
                type="text"
                placeholder={
                  isCustomCategory
                    ? "Type custom category name..."
                    : "Selected category"
                }
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Overview
                </label>
                <input
                  type="text"
                  placeholder="e.g. 14×18 graphite on Bristol board"
                  value={formData.overview}
                  onChange={(e) =>
                    setFormData({ ...formData, overview: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description & Technique
              </label>
              <textarea
                rows={4}
                placeholder="Details about dimensions, pencil grades, inspiration, framing..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Artwork Image
              </label>

              {formData.existingImageUrl && !formData.imageFile && (
                <div className="mb-4 relative inline-block">
                  <img
                    src={formData.existingImageUrl}
                    alt="Current Artwork"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                  />
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                    Current Image
                  </span>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFormData({ ...formData, imageFile: e.target.files[0] });
                  }
                }}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 border border-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              >
                <Upload className="w-4 h-4" />{" "}
                {formData.imageFile
                  ? formData.imageFile.name
                  : "Select Artwork Image"}
              </button>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-black disabled:bg-gray-400 font-medium transition-colors shadow-sm"
              >
                {submitting
                  ? "Saving..."
                  : editingId
                  ? "Update Artwork"
                  : "Save Artwork"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Controls Bar: Search & Sort */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search artworks by title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setSortOpen((o) => !o)}
                className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-gray-500">Sort:</span>
                  <span className="text-gray-900">{ADMIN_SORT_LABELS[sortBy]}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    sortOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {sortOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setSortOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden py-1">
                    {(Object.keys(ADMIN_SORT_LABELS) as AdminSortOption[]).map(
                      (option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSortBy(option);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                            sortBy === option
                              ? "bg-gray-900 text-white font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span>{ADMIN_SORT_LABELS[option]}</span>
                        </button>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Category Filter Pills (Reflecting gallery categories in admin panel) */}
          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Category:
            </span>
            {allCategories.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isSelected =
                selectedCategory.toLowerCase() === cat.toLowerCase();

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-gray-900 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* List Display */}
          <div className="bg-transparent md:bg-white md:rounded-xl md:shadow-sm md:border md:border-gray-200 overflow-hidden">
            {/* Desktop View (Table) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                      Artwork
                    </th>
                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                      Title
                    </th>
                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                      Category
                    </th>
                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider">
                      Price
                    </th>
                    <th className="p-4 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedArtworks.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-14 h-14 rounded-lg object-cover border border-gray-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-900">
                          {item.name}
                        </div>
                        {item.overview && (
                          <div className="text-xs text-gray-500 line-clamp-1 max-w-xs mt-0.5">
                            {item.overview}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() =>
                            setSelectedCategory(item.category || "All")
                          }
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          {item.category || "Uncategorized"}
                        </button>
                      </td>
                      <td className="p-4 text-sm font-medium text-gray-700">
                        {item.price ? `$${Number(item.price).toFixed(2)}` : "—"}
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(item)}
                            title="Edit Artwork"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            title="Delete Artwork"
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {displayedArtworks.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-500">
                        <div className="max-w-sm mx-auto space-y-2">
                          <p className="font-medium text-gray-700">
                            No artworks found
                          </p>
                          <p className="text-xs text-gray-400">
                            No pieces match category &ldquo;{selectedCategory}&rdquo;
                            {searchQuery ? ` and query "${searchQuery}"` : ""}.
                          </p>
                          {(selectedCategory !== "All" || searchQuery) && (
                            <button
                              onClick={() => {
                                setSelectedCategory("All");
                                setSearchQuery("");
                              }}
                              className="mt-3 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200"
                            >
                              Reset Filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View (Cards) */}
            <div className="block md:hidden space-y-3">
              {displayedArtworks.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4"
                >
                  <div className="w-20 h-20 shrink-0">
                    {item.images?.[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full rounded-lg object-cover border border-gray-100 shadow-sm"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center border border-gray-100">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 mb-2.5">
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium truncate">
                        {item.category || "Uncategorized"}
                      </span>
                      {item.price && (
                        <span className="text-xs font-semibold text-gray-600">
                          ${Number(item.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-100 flex items-center justify-center gap-1 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex-1 py-1.5 bg-red-50 text-red-600 rounded-md text-xs font-medium hover:bg-red-100 flex items-center justify-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {displayedArtworks.length === 0 && (
                <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-200">
                  No artworks found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
