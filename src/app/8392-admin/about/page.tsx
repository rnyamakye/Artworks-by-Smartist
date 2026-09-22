"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import Loading from "@/ui/Loading";

export default function AboutPageManager() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Content State
  const [pageId, setPageId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  // Achievements State
  const [achievements, setAchievements] = useState<any[]>([]);
  const [achievementView, setAchievementView] = useState<"list" | "form">("list");
  const [editingAchievementId, setEditingAchievementId] = useState<string | null>(null);
  const [achievementFormData, setAchievementFormData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const [{ data: aboutData, error: aboutError }, { data: achData, error: achError }] = await Promise.all([
      supabase.from("about_page").select("*").limit(1).single(),
      supabase.from("achievements").select("*").order("created_at", { ascending: true })
    ]);

    if (aboutError && aboutError.code !== "PGRST116") {
      toast.error("Failed to fetch about page content");
    } else if (aboutData) {
      setPageId(aboutData.id);
      setFormData({
        title: aboutData.title || "",
        content: aboutData.content || "",
      });
    }

    if (achError) {
      toast.error("Failed to fetch achievements");
    } else {
      setAchievements(achData || []);
    }

    setLoading(false);
  }

  // Handle About Page Submit
  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (pageId) {
        const { error } = await supabase.from("about_page").update({
          title: formData.title,
          content: formData.content,
          updated_at: new Date().toISOString()
        }).eq("id", pageId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("about_page").insert([{
          title: formData.title,
          content: formData.content
        }]);
        if (error) throw error;
      }

      toast.success("About page updated successfully");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Achievement Form Actions
  const resetAchievementForm = () => {
    setEditingAchievementId(null);
    setAchievementFormData({ title: "", description: "" });
    setAchievementView("list");
  };

  const handleEditAchievement = (item: any) => {
    setEditingAchievementId(item.id);
    setAchievementFormData({
      title: item.title,
      description: item.description,
    });
    setAchievementView("form");
  };

  const handleDeleteAchievement = async (id: string) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;
    const { error } = await supabase.from("achievements").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Achievement deleted");
      fetchData();
    }
  };

  const handleAchievementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingAchievementId) {
        const { error } = await supabase.from("achievements").update(achievementFormData).eq("id", editingAchievementId);
        if (error) throw error;
        toast.success("Achievement updated");
      } else {
        const { error } = await supabase.from("achievements").insert([achievementFormData]);
        if (error) throw error;
        toast.success("Achievement added");
      }
      resetAchievementForm();
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-12">
      {/* SECTION 1: ABOUT PAGE CONTENT */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Edit About Page</h1>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-3xl">
          <form onSubmit={handleAboutSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">History Content</label>
              <textarea
                required
                rows={12}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none font-mono text-sm"
                placeholder="You can write HTML or plain text here..."
              ></textarea>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
              >
                {submitting ? "Saving..." : "Save Content"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* SECTION 2: ACHIEVEMENTS */}
      <div>
        <div className="flex justify-between items-center mb-6 max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Achievements</h2>
          {achievementView === "list" ? (
            <button
              onClick={() => { resetAchievementForm(); setAchievementView("form"); }}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              <Plus className="w-4 h-4" /> Add Achievement
            </button>
          ) : (
            <button
              onClick={resetAchievementForm}
              className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          )}
        </div>

        {achievementView === "form" ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-3xl">
            <form onSubmit={handleAchievementSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Achievement Title</label>
                <input
                  required
                  type="text"
                  value={achievementFormData.title}
                  onChange={(e) => setAchievementFormData({ ...achievementFormData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  rows={4}
                  value={achievementFormData.description}
                  onChange={(e) => setAchievementFormData({ ...achievementFormData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {submitting ? "Saving..." : editingAchievementId ? "Update Achievement" : "Save Achievement"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-transparent md:bg-white md:rounded-xl md:shadow-sm md:border md:border-gray-200 overflow-hidden max-w-3xl">
            
            {/* Desktop View (Table) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-600">Title</th>
                  <th className="p-4 font-semibold text-gray-600">Description</th>
                  <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{item.title}</td>
                    <td className="p-4 text-gray-600 max-w-[250px] truncate">{item.description}</td>
                    <td className="p-4 flex items-center justify-end gap-2">
                      <button onClick={() => handleEditAchievement(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteAchievement(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {achievements.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-500">No achievements found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

            {/* Mobile View (Cards) */}
            <div className="block md:hidden space-y-3">
              {achievements.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button onClick={() => handleEditAchievement(item)} className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 flex items-center justify-center gap-1">
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button onClick={() => handleDeleteAchievement(item.id)} className="flex-1 py-1.5 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 flex items-center justify-center gap-1">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              ))}
              {achievements.length === 0 && (
                <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-200">
                  No achievements found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
