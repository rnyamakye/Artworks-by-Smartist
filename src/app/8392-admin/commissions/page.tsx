"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Trash2, CheckCircle, ExternalLink, Image as ImageIcon, FileText } from "lucide-react";
import Loading from "@/ui/Loading";
import { useRouter } from "next/navigation";

export default function CommissionsManager() {
  const router = useRouter();
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommissions();
  }, []);

  async function fetchCommissions() {
    setLoading(true);
    const { data, error } = await supabase.from("commissions").select("*").order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to fetch commissions");
    } else {
      setCommissions(data || []);
    }
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this commission request?")) return;
    const { error } = await supabase.from("commissions").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Commission deleted");
      fetchCommissions();
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("commissions").update({ status: newStatus }).eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Marked as ${newStatus}`);
      fetchCommissions();
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Artwork Commissions</h1>
      </div>

      <div className="bg-transparent md:bg-white md:rounded-xl md:shadow-sm md:border md:border-gray-200 overflow-hidden">
        
        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">Client Info</th>
                <th className="p-4 font-semibold text-gray-600">Details</th>
                <th className="p-4 font-semibold text-gray-600">Description</th>
                <th className="p-4 font-semibold text-gray-600">Image</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((item) => (
                <tr key={item.id} className={`border-b border-gray-100 hover:bg-gray-50 ${item.status === 'pending' ? 'bg-blue-50/30' : ''}`}>
                  <td className="p-4 align-top">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.email}</div>
                    {item.phone && <div className="text-sm text-gray-500">{item.phone}</div>}
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="text-sm"><span className="font-medium">Size:</span> {item.size}</div>
                    <div className="text-sm mt-1"><span className="font-medium">Type:</span> {item.subject}</div>
                  </td>
                  <td className="p-4 align-top max-w-xs">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.description}</p>
                  </td>
                  <td className="p-4 align-top">
                    {item.image_url ? (
                      <a href={item.image_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium">
                        <ImageIcon className="w-4 h-4" /> View Image
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm italic">None</span>
                    )}
                  </td>
                  <td className="p-4 align-top">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      item.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 align-top text-right space-y-2">
                    <div className="flex flex-col items-end gap-2">
                      {item.status === 'pending' && (
                        <button onClick={() => updateStatus(item.id, 'reviewed')} className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Mark Reviewed
                        </button>
                      )}
                      {item.status === 'reviewed' && (
                        <button onClick={() => updateStatus(item.id, 'completed')} className="text-xs font-medium text-green-600 hover:text-green-800 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Mark Completed
                        </button>
                      )}
                      <button onClick={() => router.push(`/8392-admin/commissions/${item.id}/invoice`)} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Generate Invoice
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-xs font-medium text-red-600 hover:text-red-800 flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {commissions.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No commission requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Cards) */}
        <div className="block md:hidden space-y-4">
          {commissions.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
              <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <div className="text-xs text-gray-500 mt-1">{new Date(item.created_at).toLocaleDateString()}</div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                  item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  item.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {item.status}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-gray-700 flex items-center gap-2"><span className="text-gray-400">Email:</span> {item.email}</div>
                {item.phone && <div className="text-sm text-gray-700 flex items-center gap-2"><span className="text-gray-400">Phone:</span> {item.phone}</div>}
              </div>

              <div className="flex gap-4 border-t border-gray-100 pt-3">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Size</div>
                  <div className="text-sm text-gray-900">{item.size}</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Type</div>
                  <div className="text-sm text-gray-900">{item.subject}</div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Description</div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {item.description}
                </p>
              </div>

              {item.image_url && (
                <div className="border-t border-gray-100 pt-3">
                  <a href={item.image_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 p-2 rounded-lg text-sm font-medium border border-blue-100 justify-center">
                    <ImageIcon className="w-4 h-4" /> View Reference Image
                  </a>
                </div>
              )}

              <div className="border-t border-gray-100 pt-3 flex flex-wrap gap-2">
                {item.status === 'pending' && (
                  <button onClick={() => updateStatus(item.id, 'reviewed')} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center justify-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Review
                  </button>
                )}
                {item.status === 'reviewed' && (
                  <button onClick={() => updateStatus(item.id, 'completed')} className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 flex items-center justify-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Complete
                  </button>
                )}
                <button onClick={() => router.push(`/8392-admin/commissions/${item.id}/invoice`)} className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 flex items-center justify-center gap-1">
                  <FileText className="w-4 h-4" /> Invoice
                </button>
                <button onClick={() => handleDelete(item.id)} className="w-full py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center gap-1 mt-1">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
          {commissions.length === 0 && (
            <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-200">
              No commission requests found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
