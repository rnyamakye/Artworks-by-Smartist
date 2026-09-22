"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Trash2, CheckCircle, Mail } from "lucide-react";
import Loading from "@/ui/Loading";

export default function MessagesManager() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to fetch messages");
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Message deleted");
      fetchMessages();
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("contact_messages").update({ status: newStatus }).eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Marked as ${newStatus}`);
      fetchMessages();
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Contact Messages</h1>
      </div>

      <div className="bg-transparent md:bg-white md:rounded-xl md:shadow-sm md:border md:border-gray-200 overflow-hidden">
        
        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">Sender Info</th>
                <th className="p-4 font-semibold text-gray-600">Message</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((item) => (
                <tr key={item.id} className={`border-b border-gray-100 hover:bg-gray-50 ${item.status === 'unread' ? 'bg-blue-50/30' : ''}`}>
                  <td className="p-4 align-top w-1/4">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.email}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(item.created_at).toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4 align-top w-1/2">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.message}</p>
                  </td>
                  <td className="p-4 align-top">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      item.status === 'unread' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 align-top text-right space-y-2">
                    <div className="flex flex-col items-end gap-2">
                      {item.status === 'unread' ? (
                        <button onClick={() => updateStatus(item.id, 'read')} className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Mark Read
                        </button>
                      ) : (
                        <button onClick={() => updateStatus(item.id, 'unread')} className="text-xs font-medium text-gray-600 hover:text-gray-800 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> Mark Unread
                        </button>
                      )}
                      <a href={`mailto:${item.email}`} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> Reply
                      </a>
                      <button onClick={() => handleDelete(item.id)} className="text-xs font-medium text-red-600 hover:text-red-800 flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">No messages found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Cards) */}
        <div className="block md:hidden space-y-4">
          {messages.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
              <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <div className="text-sm text-gray-500">{item.email}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(item.created_at).toLocaleString()}</div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                  item.status === 'unread' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.status}
                </span>
              </div>
              
              <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-100">
                {item.message}
              </div>

              <div className="border-t border-gray-100 pt-3 flex flex-wrap gap-2">
                {item.status === 'unread' ? (
                  <button onClick={() => updateStatus(item.id, 'read')} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center justify-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Mark Read
                  </button>
                ) : (
                  <button onClick={() => updateStatus(item.id, 'unread')} className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center justify-center gap-1">
                    <Mail className="w-4 h-4" /> Mark Unread
                  </button>
                )}
                <a href={`mailto:${item.email}`} className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 flex items-center justify-center gap-1">
                  <Mail className="w-4 h-4" /> Reply
                </a>
                <button onClick={() => handleDelete(item.id)} className="w-full py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center gap-1 mt-1">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-200">
              No messages found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
