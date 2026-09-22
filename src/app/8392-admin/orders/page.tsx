"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { Trash2, Package, CheckCircle, Clock, XCircle } from "lucide-react";
import Loading from "@/ui/Loading";

export default function OrdersManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          quantity,
          price_at_time,
          products (
            name,
            images
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch orders");
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Order deleted");
      fetchOrders();
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Shop Orders</h1>
      </div>

      <div className="bg-transparent md:bg-white md:rounded-xl md:shadow-sm md:border md:border-gray-200 overflow-hidden">
        
        {/* Desktop View (Table) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">Customer Info</th>
                <th className="p-4 font-semibold text-gray-600">Order Items</th>
                <th className="p-4 font-semibold text-gray-600">Total</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className={`border-b border-gray-100 hover:bg-gray-50 ${order.status === 'pending' ? 'bg-blue-50/30' : ''}`}>
                  <td className="p-4 align-top max-w-[250px]">
                    <div className="font-medium text-gray-900">{order.name}</div>
                    <div className="text-sm text-gray-500">{order.email}</div>
                    <div className="text-sm text-gray-500">{order.phone}</div>
                    <div className="text-sm text-gray-600 mt-2 p-2 bg-gray-100 rounded-md">
                      <span className="block text-xs font-semibold text-gray-500 uppercase mb-1">Delivery Address</span>
                      {order.address}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(order.created_at).toLocaleString()}
                    </div>
                  </td>
                  
                  <td className="p-4 align-top">
                    <div className="space-y-3">
                      {order.order_items?.map((item: any) => (
                        <div key={item.id} className="flex gap-3 items-center">
                          <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0">
                            {item.products?.images?.[0] ? (
                              <img src={item.products.images[0]} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">{item.products?.name || "Unknown Product"}</div>
                            <div className="text-xs text-gray-500">
                              {item.quantity} x ${item.price_at_time?.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  
                  <td className="p-4 align-top">
                    <span className="font-bold text-gray-900">${order.total_amount?.toFixed(2)}</span>
                  </td>
                  
                  <td className="p-4 align-top">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  
                  <td className="p-4 align-top text-right space-y-2">
                    <div className="flex flex-col items-end gap-2">
                      {order.status === 'pending' && (
                        <button onClick={() => updateStatus(order.id, 'processing')} className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Mark Processing
                        </button>
                      )}
                      {order.status === 'processing' && (
                        <button onClick={() => updateStatus(order.id, 'completed')} className="text-xs font-medium text-green-600 hover:text-green-800 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Mark Completed
                        </button>
                      )}
                      {(order.status === 'pending' || order.status === 'processing') && (
                        <button onClick={() => updateStatus(order.id, 'cancelled')} className="text-xs font-medium text-gray-600 hover:text-gray-800 flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Cancel Order
                        </button>
                      )}
                      <button onClick={() => handleDelete(order.id)} className="text-xs font-medium text-red-600 hover:text-red-800 flex items-center gap-1 mt-2">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Cards) */}
        <div className="block md:hidden space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
              <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{order.name}</h3>
                  <div className="text-xs text-gray-500 mt-1">{new Date(order.created_at).toLocaleString()}</div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-sm text-gray-700 flex items-center gap-2"><span className="text-gray-400">Email:</span> {order.email}</div>
                <div className="text-sm text-gray-700 flex items-center gap-2"><span className="text-gray-400">Phone:</span> {order.phone}</div>
                <div className="text-sm text-gray-700 mt-2 p-2 bg-gray-50 rounded-md">
                  <span className="block text-xs font-semibold text-gray-500 uppercase mb-1">Delivery Address</span>
                  {order.address}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Order Items</div>
                <div className="space-y-2">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 shrink-0">
                        {item.products?.images?.[0] ? (
                          <img src={item.products.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">{item.products?.name || "Unknown Product"}</div>
                        <div className="text-xs text-gray-500 flex justify-between">
                          <span>{item.quantity} x ${item.price_at_time?.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <div className="text-sm text-gray-500">Total</div>
                <div className="font-bold text-gray-900 text-lg">${order.total_amount?.toFixed(2)}</div>
              </div>

              <div className="border-t border-gray-100 pt-3 flex flex-wrap gap-2">
                {order.status === 'pending' && (
                  <button onClick={() => updateStatus(order.id, 'processing')} className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center justify-center gap-1">
                    <Clock className="w-4 h-4" /> Process
                  </button>
                )}
                {order.status === 'processing' && (
                  <button onClick={() => updateStatus(order.id, 'completed')} className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 flex items-center justify-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Complete
                  </button>
                )}
                {(order.status === 'pending' || order.status === 'processing') && (
                  <button onClick={() => updateStatus(order.id, 'cancelled')} className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center justify-center gap-1">
                    <XCircle className="w-4 h-4" /> Cancel
                  </button>
                )}
                <button onClick={() => handleDelete(order.id)} className="w-full py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center gap-1 mt-1">
                  <Trash2 className="w-4 h-4" /> Delete Order
                </button>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-200">
              No orders found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
