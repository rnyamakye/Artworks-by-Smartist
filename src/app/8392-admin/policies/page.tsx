"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Edit2, X } from "lucide-react";
import Loading from "@/ui/Loading";

export default function PoliciesManager() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editor State
  const [editingPolicy, setEditingPolicy] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPolicies();
  }, []);

  async function fetchPolicies() {
    setLoading(true);
    const { data, error } = await supabase.from("policies").select("*").order("slug", { ascending: true });
    if (error) {
      toast.error("Failed to fetch policies");
    } else {
      setPolicies(data || []);
    }
    setLoading(false);
  }

  const handleEdit = (policy: any) => {
    setEditingPolicy(policy);
    setFormData({
      title: policy.title,
      content: policy.content,
    });
  };

  const cancelEdit = () => {
    setEditingPolicy(null);
    setFormData({ title: "", content: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPolicy) return;
    setSubmitting(true);

    try {
      const { error } = await supabase.from("policies").update({
        title: formData.title,
        content: formData.content,
        updated_at: new Date().toISOString()
      }).eq("id", editingPolicy.id);
      
      if (error) throw error;

      toast.success("Policy updated successfully");
      cancelEdit();
      fetchPolicies();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Manage Policies</h1>
        {editingPolicy && (
          <button
            onClick={cancelEdit}
            className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            <X className="w-4 h-4" /> Cancel Editing
          </button>
        )}
      </div>

      {editingPolicy ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-4xl">
          <div className="mb-4 text-sm text-gray-500">
            Editing Policy: <span className="font-semibold text-gray-900">{editingPolicy.slug}</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Policy Title</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content (HTML)</label>
              <textarea
                required
                rows={15}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none font-mono text-sm"
                placeholder="Write your policy content here in HTML format..."
              ></textarea>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((policy) => (
            <div key={policy.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">{policy.title}</h3>
                <p className="text-sm text-gray-500 mb-4">/{policy.slug}</p>
                <div className="text-sm text-gray-600 line-clamp-3 mb-6">
                  {policy.content.replace(/<[^>]*>?/gm, '')} {/* Strip HTML for preview */}
                </div>
              </div>
              <button
                onClick={() => handleEdit(policy)}
                className="flex items-center justify-center gap-2 w-full bg-gray-50 hover:bg-gray-100 text-gray-800 py-2 rounded-lg border border-gray-200 transition-colors"
              >
                <Edit2 className="w-4 h-4" /> Edit Policy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
