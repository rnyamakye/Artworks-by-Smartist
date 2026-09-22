"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import Loading from "@/ui/Loading";

export default function TutorialsManager() {
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtube_id: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTutorials();
  }, []);

  async function fetchTutorials() {
    setLoading(true);
    const { data, error } = await supabase.from("tutorials").select("*").order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to fetch tutorials");
    } else {
      setTutorials(data || []);
    }
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tutorial?")) return;
    const { error } = await supabase.from("tutorials").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Tutorial deleted");
      fetchTutorials();
    }
  };

  const handleEdit = (tutorial: any) => {
    setEditingId(tutorial.id);
    setFormData({
      title: tutorial.title || "",
      description: tutorial.description || "",
      youtube_id: tutorial.youtube_id || "",
    });
    setView("form");
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", youtube_id: "" });
    setView("list");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase.from("tutorials").update(formData).eq("id", editingId);
        if (error) throw error;
        toast.success("Tutorial updated");
      } else {
        const { error } = await supabase.from("tutorials").insert([formData]);
        if (error) throw error;
        toast.success("Tutorial created");
      }

      resetForm();
      fetchTutorials();
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
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Tutorials</h1>
        {view === "list" ? (
          <button
            onClick={() => { resetForm(); setView("form"); }}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" /> Add Tutorial
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
              <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Video ID</label>
              <input
                required
                type="text"
                placeholder="e.g. dQw4w9WgXcQ"
                value={formData.youtube_id}
                onChange={(e) => setFormData({ ...formData, youtube_id: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">This is the 11-character code at the end of a YouTube URL.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
              ></textarea>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
              >
                {submitting ? "Saving..." : editingId ? "Update Tutorial" : "Save Tutorial"}
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
                  <th className="p-4 font-semibold text-gray-600">Thumbnail</th>
                  <th className="p-4 font-semibold text-gray-600">Title</th>
                  <th className="p-4 font-semibold text-gray-600">YouTube ID</th>
                  <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tutorials.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <img 
                        src={`https://img.youtube.com/vi/${item.youtube_id}/default.jpg`} 
                        alt="Thumbnail" 
                        className="w-16 h-12 rounded object-cover"
                      />
                    </td>
                    <td className="p-4 font-medium text-gray-900">{item.title}</td>
                    <td className="p-4 text-gray-600">{item.youtube_id}</td>
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
                {tutorials.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">No tutorials found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View (Cards) */}
          <div className="block md:hidden space-y-4">
            {tutorials.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
                <div className="w-24 h-16 shrink-0 rounded-md overflow-hidden bg-gray-100">
                  <img 
                    src={`https://img.youtube.com/vi/${item.youtube_id}/default.jpg`} 
                    alt="Thumbnail" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                  <div className="text-xs text-gray-500 mb-2 truncate">ID: {item.youtube_id}</div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(item)} className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 flex items-center justify-center gap-1">
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="flex-1 py-1.5 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 flex items-center justify-center gap-1">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {tutorials.length === 0 && (
              <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-200">
                No tutorials found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
