"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import Loading from "@/ui/Loading";

export default function SubscribersManager() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  async function fetchSubscribers() {
    setLoading(true);
    const { data, error } = await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to fetch subscribers");
    } else {
      setSubscribers(data || []);
    }
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;
    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Subscriber removed");
      fetchSubscribers();
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
      </div>

      <div className="bg-transparent md:bg-white md:rounded-xl md:shadow-sm md:border md:border-gray-200 overflow-hidden max-w-4xl">
        
        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">Email Address</th>
                <th className="p-4 font-semibold text-gray-600">Subscribed Date</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{item.email}</td>
                  <td className="p-4 text-gray-600">
                    {new Date(item.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="p-4 flex items-center justify-end gap-2">
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">No subscribers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View (List) */}
        <div className="block md:hidden space-y-3">
          {subscribers.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center gap-4">
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.email}</h3>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(item.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg shrink-0">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {subscribers.length === 0 && (
            <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-200">
              No subscribers found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
