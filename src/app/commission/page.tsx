"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import Container from "@/ui/Container";

export default function CommissionPage() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    size: "A4",
    subject: "Portrait",
    delivery_method: "Standard Shipping",
    description: "",
  });

  const sizes = ["A5 (148 x 210 mm)", "A4 (210 x 297 mm)", "A3 (297 x 420 mm)", "A2 (420 x 594 mm)", "Custom Size"];
  const subjects = ["Portrait (Single)", "Portrait (Couple/Group)", "Pet Portrait", "Landscape", "Other"];
  const deliveryMethods = ["Standard Shipping", "Express Shipping", "Local Pickup", "Digital Copy Only"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;

      // 1. Upload image if provided
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `commission_${Date.now()}.${fileExt}`;
        const filePath = `commissions/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("images")
          .getPublicUrl(filePath);
          
        imageUrl = publicUrlData.publicUrl;
      }

      // 2. Insert Commission Request
      const { error: insertError } = await supabase.from("commissions").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          size: formData.size,
          subject: formData.subject,
          delivery_method: formData.delivery_method,
          description: formData.description,
          image_url: imageUrl,
        }
      ]);

      if (insertError) throw insertError;

      toast.success("Commission request submitted successfully!");
      setFormData({ name: "", email: "", phone: "", size: "A4", subject: "Portrait", delivery_method: "Standard Shipping", description: "" });
      setFile(null);
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-12 md:py-20 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">Request a Commission</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Let's create something beautiful together. Fill out the form below with your ideas, and I will get back to you with a quote and timeline.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                placeholder="john@example.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (Optional - for WhatsApp)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                placeholder="+1 234 567 8900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Artwork Size</label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none bg-white"
              >
                {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject Type</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none bg-white"
              >
                {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Method</label>
              <select
                value={formData.delivery_method}
                onChange={(e) => setFormData({ ...formData, delivery_method: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none bg-white"
              >
                {deliveryMethods.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reference Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none bg-gray-50 text-gray-700"
            />
            <p className="text-xs text-gray-500 mt-2">Upload a clear, high-quality photo for the best result.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
            <textarea
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
              placeholder="Tell me about your vision for this artwork. Any specific details, background preferences, or deadlines?"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-center md:justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
            >
              {loading ? "Submitting Request..." : "Submit Commission Request"}
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
}
