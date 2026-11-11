"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import Loading from "@/ui/Loading";
import {
  Trash2,
  CheckCircle,
  XCircle,
  Link2,
  X,
  Clock,
  Filter,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  text: string;
  status: string;
  created_at: string;
  social_post_url?: string | null;
};

type FilterStatus = "all" | "pending" | "approved";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");

  // Social URL modal state
  const [editingUrlId, setEditingUrlId] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [savingUrl, setSavingUrl] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load testimonials");
      console.error(error);
    } else {
      const normalized = (data || []).map((item: any) => ({
        id: item.id || item._id,
        name: item.name || item.author_name || "Anonymous",
        role: item.role || item.author_email || null,
        text: item.text || item.content || "",
        status: item.status || (item.approved ? "approved" : "pending"),
        created_at: item.created_at,
        social_post_url: item.social_post_url || null,
      }));
      setTestimonials(normalized);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, newStatus: "approved" | "pending") => {
    const isApproved = newStatus === "approved";
    const { error } = await supabase
      .from("testimonials")
      .update({ status: newStatus, approved: isApproved })
      .eq("id", id);

    if (error) {
      toast.error(error.message || `Failed to mark as ${newStatus}`);
      console.error(error);
    } else {
      toast.success(
        newStatus === "approved"
          ? "Testimonial approved! It is now live in full color on the homepage."
          : "Testimonial marked as pending."
      );
      // Update local state immediately for snappy response
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this testimonial?"))
      return;

    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) {
      toast.error(error.message || "Failed to delete testimonial");
      console.error(error);
    } else {
      toast.success("Testimonial deleted");
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const openUrlModal = (testimonial: Testimonial) => {
    setEditingUrlId(testimonial.id);
    setUrlInput(testimonial.social_post_url || "");
  };

  const closeUrlModal = () => {
    setEditingUrlId(null);
    setUrlInput("");
  };

  const handleSaveUrl = async () => {
    if (!editingUrlId) return;
    setSavingUrl(true);
    const { error } = await supabase
      .from("testimonials")
      .update({ social_post_url: urlInput || null })
      .eq("id", editingUrlId);

    if (error) {
      toast.error("Failed to save social URL");
    } else {
      toast.success("Social post URL saved");
      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === editingUrlId ? { ...t, social_post_url: urlInput || null } : t
        )
      );
      closeUrlModal();
    }
    setSavingUrl(false);
  };

  // Filtered testimonials
  const filteredTestimonials = useMemo(() => {
    if (filter === "all") return testimonials;
    return testimonials.filter((t) => t.status === filter);
  }, [testimonials, filter]);

  const pendingCount = useMemo(
    () => testimonials.filter((t) => t.status === "pending").length,
    [testimonials]
  );
  const approvedCount = useMemo(
    () => testimonials.filter((t) => t.status === "approved").length,
    [testimonials]
  );

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Manage Testimonials
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review community submissions, approve testimonials to publish them live, or attach social post links.
          </p>
        </div>
      </div>

      {/* Pending Reviews Notice Banner */}
      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">
                {pendingCount} Testimonial{pendingCount > 1 ? "s" : ""} Awaiting Approval
              </p>
              <p className="text-xs text-amber-700">
                Pending reviews appear with gray text on the homepage until you click &quot;Approve&quot;.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilter("pending")}
            className="px-3 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700 transition-colors shrink-0"
          >
            Review Pending ({pendingCount})
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            filter === "all"
              ? "bg-gray-900 text-white shadow-sm"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <span>All Testimonials</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              filter === "all" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {testimonials.length}
          </span>
        </button>

        <button
          onClick={() => setFilter("pending")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            filter === "pending"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Approval</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              filter === "pending"
                ? "bg-white/20 text-white"
                : pendingCount > 0
                ? "bg-amber-100 text-amber-800 font-semibold"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {pendingCount}
          </span>
        </button>

        <button
          onClick={() => setFilter("approved")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            filter === "approved"
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Approved</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              filter === "approved" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {approvedCount}
          </span>
        </button>
      </div>

      {/* Social URL Modal */}
      {editingUrlId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Attach Social Media Post
              </h3>
              <button
                onClick={closeUrlModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Social Post URL (Instagram, TikTok, YouTube, X)
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://www.instagram.com/p/... or https://www.tiktok.com/@..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  This post will be embedded underneath the testimonial in the review card.
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  onClick={closeUrlModal}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveUrl}
                  disabled={savingUrl}
                  className="px-5 py-2 bg-gray-900 text-white rounded-xl hover:bg-black disabled:bg-gray-400 text-sm font-medium transition-colors"
                >
                  {savingUrl ? "Saving..." : "Save Link"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials List */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
        {filteredTestimonials.length === 0 ? (
          <div className="p-12 text-center text-gray-500 space-y-2">
            <p className="font-semibold text-gray-700">No testimonials found</p>
            <p className="text-xs text-gray-400">
              {filter === "pending"
                ? "There are currently no reviews awaiting approval."
                : filter === "approved"
                ? "No approved testimonials yet."
                : "No community testimonials in the database."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop View Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/75">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Testimonial Review
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Social Link
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Approval & Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredTestimonials.map((testimonial) => {
                    const isPending = testimonial.status === "pending";

                    return (
                      <tr
                        key={testimonial.id}
                        className={`hover:bg-gray-50/80 transition-colors ${
                          isPending ? "bg-amber-50/30" : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-sm text-gray-900">
                            {testimonial.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {testimonial.role || "Collector"}
                          </div>
                        </td>

                        <td className="px-6 py-4 max-w-sm">
                          <p
                            className={`text-sm line-clamp-3 ${
                              isPending ? "text-gray-500 italic" : "text-gray-800"
                            }`}
                            title={testimonial.text}
                          >
                            &ldquo;{testimonial.text}&rdquo;
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          {testimonial.social_post_url ? (
                            <a
                              href={testimonial.social_post_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline max-w-[140px] truncate block font-medium"
                              title={testimonial.social_post_url}
                            >
                              🔗 View post
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                          {testimonial.created_at
                            ? new Date(testimonial.created_at).toLocaleDateString()
                            : "—"}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {isPending ? (
                            <span className="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                              Pending Approval
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Approved & Live
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex items-center justify-end gap-2">
                            {/* Prominent Approve Button for Pending Reviews */}
                            {isPending ? (
                              <button
                                onClick={() => handleUpdateStatus(testimonial.id, "approved")}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                                title="Approve and publish live"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateStatus(testimonial.id, "pending")}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-medium rounded-lg transition-colors"
                                title="Unpublish / mark as pending"
                              >
                                <XCircle className="w-3.5 h-3.5 text-amber-600" />
                                <span>Unpublish</span>
                              </button>
                            )}

                            {/* Attach Social Link */}
                            <button
                              onClick={() => openUrlModal(testimonial)}
                              className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Attach social post URL"
                            >
                              <Link2 className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(testimonial.id)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile View Cards */}
            <div className="block lg:hidden divide-y divide-gray-100">
              {filteredTestimonials.map((testimonial) => {
                const isPending = testimonial.status === "pending";

                return (
                  <div
                    key={testimonial.id}
                    className={`p-4 space-y-3 ${
                      isPending ? "bg-amber-50/30" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {testimonial.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {testimonial.role || "Collector"} •{" "}
                          {testimonial.created_at
                            ? new Date(testimonial.created_at).toLocaleDateString()
                            : ""}
                        </div>
                      </div>
                      {isPending ? (
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          Pending
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Live
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-sm ${
                        isPending ? "text-gray-500 italic" : "text-gray-700"
                      }`}
                    >
                      &ldquo;{testimonial.text}&rdquo;
                    </p>

                    {testimonial.social_post_url && (
                      <div className="text-xs text-blue-600 truncate">
                        🔗 {testimonial.social_post_url}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      {isPending ? (
                        <button
                          onClick={() => handleUpdateStatus(testimonial.id, "approved")}
                          className="flex-1 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve Live
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(testimonial.id, "pending")}
                          className="flex-1 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 flex items-center justify-center gap-1 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5 text-amber-600" /> Mark Pending
                        </button>
                      )}

                      <button
                        onClick={() => openUrlModal(testimonial)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 flex items-center justify-center gap-1 transition-colors"
                      >
                        <Link2 className="w-3.5 h-3.5" /> Social
                      </button>

                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 flex items-center justify-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
