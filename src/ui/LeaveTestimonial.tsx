"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { X, Send, Sparkles, MessageSquare } from "lucide-react";

interface LeaveTestimonialProps {
  onTestimonialSubmitted?: (testimonial: any) => void;
}

export const LeaveTestimonial: React.FC<LeaveTestimonialProps> = ({
  onTestimonialSubmitted,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    text: "",
    social_post_url: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!formData.text.trim()) {
      toast.error("Please enter your testimonial.");
      return;
    }

    setLoading(true);

    const clientGeneratedId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `t_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const newTestimonialData = {
      id: clientGeneratedId,
      name: formData.name.trim(),
      author_name: formData.name.trim(),
      role: formData.role.trim() || null,
      text: formData.text.trim(),
      content: formData.text.trim(),
      social_post_url: formData.social_post_url.trim() || null,
      status: "pending",
      approved: false,
      created_at: new Date().toISOString(),
    };

    try {
      // Attempt to save to Supabase
      if (supabase) {
        // Do not chain .select() here because unapproved/pending testimonials
        // are restricted from public SELECT by RLS until admin approval
        const { error } = await supabase
          .from("testimonials")
          .insert([newTestimonialData]);

        if (error) {
          throw error;
        }
      }

      // Success toast
      toast.success(
        "Testimonial submitted successfully! It is now pending admin approval."
      );

      // Notify parent component to display it immediately with gray text
      if (onTestimonialSubmitted) {
        onTestimonialSubmitted(newTestimonialData);
      }

      // Close modal and reset form
      setIsOpen(false);
      setFormData({ name: "", role: "", text: "", social_post_url: "" });
    } catch (err: any) {
      console.error("Testimonial submission failed:", err);
      // Failure toast
      toast.error(
        err?.message || "Failed to submit testimonial. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-full font-medium shadow-sm hover:bg-black transition-all duration-300 hover:shadow-md text-sm"
      >
        <MessageSquare className="w-4 h-4" />
        <span>Leave a Review</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col border border-gray-100 relative">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Share Your Experience
                  </h3>
                  <p className="text-xs text-gray-500">
                    Your review will appear pending admin approval.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Your Name *
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none transition-colors text-sm"
                  placeholder="e.g. Sarah Mitchell"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Your Title / Role (Optional)
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none transition-colors text-sm"
                  placeholder="e.g. Art Enthusiast, Collector, Interior Designer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Testimonial *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.text}
                  onChange={(e) =>
                    setFormData({ ...formData, text: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none transition-colors text-sm resize-none"
                  placeholder="Write your thoughts about the pencil artwork, commission experience, or quality..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Social Media Post URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.social_post_url}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      social_post_url: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none transition-colors text-sm"
                  placeholder="https://www.instagram.com/p/... or https://www.tiktok.com/@..."
                />
                <p className="text-xs text-gray-400 mt-1">
                  Share a post featuring our artwork to embed with your review.
                </p>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-full font-medium text-sm hover:bg-black transition-all shadow-sm disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
