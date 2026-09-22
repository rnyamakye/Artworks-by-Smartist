"use client";

import React, { useState, useEffect } from "react";
import Container from "@/ui/Container";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { User, Lock, MapPin, Phone, Mail, Package, CreditCard, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"account" | "payment" | "security" | "orders">("account");
  
  // Profile Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "momo">("card");
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);

  // Security Form State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth?redirect=/profile");
    }
  }, [user, authLoading, router]);

  // Fetch Profile Data
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        if (data) {
          setFullName(data.full_name || "");
          setPhone(data.phone || "");
          setAddress(data.address || "");
          if (data.preferred_payment_method) {
            setPaymentMethod(data.preferred_payment_method as "card" | "momo");
          }
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsFetchingProfile(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Fetch Orders Data
  useEffect(() => {
    if (!user || activeTab !== "orders") return;

    const fetchOrders = async () => {
      setIsOrdersLoading(true);
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error: any) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setIsOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user, activeTab]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsProfileLoading(true);
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullName,
        phone,
        address,
        preferred_payment_method: paymentMethod,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;
      
      toast.success("Password updated successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <Container>
        <div className="py-20 text-center min-h-[50vh] flex items-center justify-center">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-10 md:py-16 max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-8 text-gray-900">My Account</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
                <h2 className="text-center font-semibold text-gray-900 line-clamp-1">{fullName || "User"}</h2>
                <p className="text-center text-sm text-gray-500 line-clamp-1">{user.email}</p>
              </div>
              <div className="p-2">
                <button
                  onClick={() => setActiveTab("account")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === "account" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium text-sm">Account Details</span>
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === "orders" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span className="font-medium text-sm">Order History</span>
                </button>
                <button
                  onClick={() => setActiveTab("payment")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === "payment" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="font-medium text-sm">Payment Methods</span>
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    activeTab === "security" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Lock className="w-5 h-5" />
                  <span className="font-medium text-sm">Security</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "account" && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4">Account Details</h2>
                
                {isFetchingProfile ? (
                  <div className="py-10 text-center"><p className="text-gray-500">Loading details...</p></div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-5 max-w-2xl">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          disabled
                          value={user.email}
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed directly.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Your phone number"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Default Delivery Address</label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                          rows={3}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Your full delivery address"
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isProfileLoading}
                        className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition-colors disabled:opacity-70"
                      >
                        {isProfileLoading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === "payment" && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4">Payment Methods</h2>
                
                {isFetchingProfile ? (
                  <div className="py-10 text-center"><p className="text-gray-500">Loading details...</p></div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Payment Method</label>
                      <div className="space-y-3">
                        <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input 
                            type="radio" 
                            name="payment_method" 
                            value="card" 
                            checked={paymentMethod === 'card'} 
                            onChange={() => setPaymentMethod('card')}
                            className="h-4 w-4 text-black focus:ring-black border-gray-300"
                          />
                          <div className="ml-3 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-gray-500" />
                            <span className="font-medium text-gray-900">Credit / Debit Card</span>
                          </div>
                        </label>
                        
                        <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'momo' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input 
                            type="radio" 
                            name="payment_method" 
                            value="momo" 
                            checked={paymentMethod === 'momo'} 
                            onChange={() => setPaymentMethod('momo')}
                            className="h-4 w-4 text-black focus:ring-black border-gray-300"
                          />
                          <div className="ml-3 flex items-center gap-2">
                            <Phone className="w-5 h-5 text-gray-500" />
                            <span className="font-medium text-gray-900">Mobile Money (MoMo)</span>
                          </div>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">This method will be pre-selected during checkout.</p>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isProfileLoading}
                        className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition-colors disabled:opacity-70"
                      >
                        {isProfileLoading ? "Saving..." : "Save Payment Preference"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4">Security Settings</h2>
                <form onSubmit={handleUpdatePassword} className="space-y-5 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      required
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black outline-none"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isPasswordLoading}
                      className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-black transition-colors disabled:opacity-70"
                    >
                      {isPasswordLoading ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-4">Order History</h2>
                
                {isOrdersLoading ? (
                  <div className="py-10 text-center"><p className="text-gray-500">Loading orders...</p></div>
                ) : orders.length === 0 ? (
                  <div className="py-12 text-center bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h3>
                    <p className="text-gray-500 mb-4 text-sm">When you place an order, it will appear here.</p>
                    <button
                      onClick={() => router.push("/shop")}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
                        <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Order ID</p>
                            <p className="text-sm font-mono font-medium">{order.id.split('-')[0]}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Date</p>
                            <p className="text-sm font-medium">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Total</p>
                            <p className="text-sm font-bold text-gray-900">${Number(order.total_amount).toFixed(2)}</p>
                          </div>
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                              ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                'bg-yellow-100 text-yellow-800'}`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-500">Shipped to: <span className="text-gray-700">{order.address}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
