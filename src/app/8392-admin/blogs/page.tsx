"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, X, Upload } from "lucide-react";
import Loading from "@/ui/Loading";

export default function BlogsManager() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageFile: null as File | null,
    existingImageUrl: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    setLoading(true);
    const { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to fetch blogs");
    } else {
      setBlogs(data || []);
    }
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Blog post deleted");
      fetchBlogs();
    }
  };

  const handleEdit = (blog: any) => {
    setEditingId(blog.id);
    setFormData({
      title: blog.title || "",
      description: blog.description || "",
      imageFile: null,
      existingImageUrl: blog.image || "",
    });
    setView("form");
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", imageFile: null, existingImageUrl: "" });
    setView("list");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = formData.existingImageUrl;

      if (formData.imageFile) {
        const fileExt = formData.imageFile.name.split('.').pop();
        const fileName = `blogs/${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, formData.imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      const blogData = {
        title: formData.title,
        description: formData.description,
        image: imageUrl || null,
      };

      if (editingId) {
        const { error } = await supabase.from("blogs").update(blogData).eq("id", editingId);
        if (error) throw error;
        toast.success("Blog updated");
      } else {
        const { error } = await supabase.from("blogs").insert([blogData]);
        if (error) throw error;
        toast.success("Blog created");
      }

      resetForm();
      fetchBlogs();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Blogs</h1>
        {view === "list" ? (
          <button
            onClick={() => { resetForm(); setView("form"); }}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" /> Add Blog Post
          </button>
        ) : (
          <button
            onClick={resetForm}
            className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
        )}
      </div>

      {view === "form" ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content / Description</label>
              <textarea
                required
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
              
              {formData.existingImageUrl && !formData.imageFile && (
                <div className="mb-4">
                  <img src={formData.existingImageUrl} alt="Current" className="w-48 h-32 object-cover rounded-lg" />
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
                className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-4 h-4" /> {formData.imageFile ? formData.imageFile.name : "Select Image File"}
              </button>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
              >
                {submitting ? "Saving..." : editingId ? "Update Blog" : "Save Blog"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-transparent md:bg-white md:rounded-xl md:shadow-sm md:border md:border-gray-200 overflow-hidden">
          
          {/* Desktop View (Table) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-600">Image</th>
                  <th className="p-4 font-semibold text-gray-600">Title</th>
                  <th className="p-4 font-semibold text-gray-600">Preview</th>
                  <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="w-16 h-12 rounded object-cover" />
                      ) : (
                        <div className="w-16 h-12 bg-gray-200 rounded"></div>
                      )}
                    </td>
                    <td className="p-4 font-medium text-gray-900 max-w-[200px] truncate">{item.title}</td>
                    <td className="p-4 text-gray-600 max-w-[300px] truncate">{item.description}</td>
                    <td className="p-4 flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {blogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">No blog posts found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View (Cards) */}
          <div className="block md:hidden space-y-4">
            {blogs.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-3">
                {item.image ? (
                  <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                </div>
                
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button onClick={() => handleEdit(item)} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center justify-center gap-1">
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center gap-1">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
            {blogs.length === 0 && (
              <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-200">
                No blog posts found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
