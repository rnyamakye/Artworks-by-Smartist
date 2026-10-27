// Checkout is currently disabled — this page redirects to home.
// Re-enable when the shop goes live by restoring the original component below.

import { redirect } from "next/navigation";

export default function CheckoutPage() {
  redirect("/");
}

// 
// "use client";
// import React, { useState } from "react";
// import { useCart } from "@/context/CartContext";
// import { supabase } from "@/lib/supabase";
// import toast from "react-hot-toast";
// import Container from "@/ui/Container";
// import Link from "next/link";
// import { Trash2 } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
// import { useEffect } from "react";
// 
// export default function CheckoutPage() {
//   const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
//   const { user, loading: authLoading } = useAuth();
//   const router = useRouter();
//   
//   useEffect(() => {
//     if (!authLoading && !user) {
//       toast.error("Please sign in to complete your checkout.");
//       router.push("/auth?redirect=/checkout");
//     }
//   }, [user, authLoading, router]);
// 
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//   });
//   const [paymentMethod, setPaymentMethod] = useState<"card" | "momo">("card");
// 
//   // Pre-fill user email and fetch profile to pre-fill other fields
//   useEffect(() => {
//     if (user) {
//       setFormData(prev => ({ ...prev, email: user.email || "" }));
// 
//       const fetchProfile = async () => {
//         try {
//           const { data, error } = await supabase
//             .from("profiles")
//             .select("*")
//             .eq("id", user.id)
//             .single();
// 
//           if (data && !error) {
//             setFormData(prev => ({
//               ...prev,
//               name: prev.name || data.full_name || "",
//               phone: prev.phone || data.phone || "",
//               address: prev.address || data.address || "",
//             }));
//             if (data.preferred_payment_method) {
//               setPaymentMethod(data.preferred_payment_method as "card" | "momo");
//             }
//           }
//         } catch (error) {
//           // Ignore error, profile might not exist yet
//         }
//       };
// 
//       fetchProfile();
//     }
//   }, [user]);
// 
//   const [isSubmitting, setIsSubmitting] = useState(false);
// 
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };
// 
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (cart.length === 0) {
//       toast.error("Your cart is empty");
//       return;
//     }
// 
//     setIsSubmitting(true);
//     try {
//       // 1. Create order
//       const { data: orderData, error: orderError } = await supabase
//         .from("orders")
//         .insert([
//           {
//             name: formData.name,
//             email: formData.email,
//             phone: formData.phone,
//             address: formData.address,
//             total_amount: cartTotal,
//             status: "pending",
//             user_id: user?.id,
//             payment_method: paymentMethod,
//           },
//         ])
//         .select()
//         .single();
// 
//       if (orderError) throw orderError;
// 
//       // 2. Create order items
//       const orderItems = cart.map((item) => ({
//         order_id: orderData.id,
//         product_id: item.id || item._id, // Support legacy _id if id isn't populated
//         quantity: item.cartQuantity,
//         price_at_time: item.regular_price,
//       }));
// 
//       const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
//       if (itemsError) throw itemsError;
// 
//       toast.success("Order placed successfully! We will contact you soon.");
//       clearCart();
//       router.push("/");
//     } catch (error: any) {
//       console.error("Checkout error:", error);
//       toast.error(error.message || "Failed to place order. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
// 
//   if (authLoading) {
//     return (
//       <Container>
//         <div className="py-20 text-center min-h-[50vh] flex flex-col items-center justify-center">
//           <p className="text-gray-500">Checking authentication...</p>
//         </div>
//       </Container>
//     );
//   }
// 
//   if (!user) {
//     return null; // Will redirect in useEffect
//   }
// 
//   if (cart.length === 0) {
//     return (
//       <Container>
//         <div className="py-20 text-center min-h-[50vh] flex flex-col items-center justify-center">
//           <h1 className="text-2xl md:text-3xl font-bold mb-4">Your Cart is Empty</h1>
//           <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
//           <Link
//             href="/shop"
//             className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
//           >
//             Continue Shopping
//           </Link>
//         </div>
//       </Container>
//     );
//   }
// 
//   return (
//     <Container>
//       <div className="py-10 md:py-16">
//         <h1 className="text-2xl md:text-4xl font-bold mb-10 text-gray-900">Checkout</h1>
//         
//         <div className="flex flex-col lg:flex-row gap-10">
//           {/* Cart Items */}
//           <div className="lg:w-3/5">
//             <h2 className="text-xl font-semibold mb-6 border-b pb-2">Order Summary</h2>
//             <div className="space-y-6">
//               {cart.map((item) => (
//                 <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
//                   <div className="w-24 h-24 shrink-0 rounded-md overflow-hidden bg-gray-100">
//                     <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
//                   </div>
//                   <div className="flex-1 flex flex-col">
//                     <div className="flex justify-between">
//                       <h3 className="font-semibold text-gray-900">{item.name}</h3>
//                       <p className="font-bold">${(item.regular_price * item.cartQuantity).toFixed(2)}</p>
//                     </div>
//                     <p className="text-sm text-gray-500 line-clamp-1 mb-auto">{item.category}</p>
//                     
//                     <div className="flex items-center justify-between mt-4">
//                       <div className="flex items-center border border-gray-200 rounded-lg">
//                         <button 
//                           onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
//                           className="px-3 py-1 hover:bg-gray-100 transition-colors rounded-l-lg"
//                         >-</button>
//                         <span className="px-3 py-1 text-sm font-medium border-x border-gray-200">{item.cartQuantity}</span>
//                         <button 
//                           onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
//                           className="px-3 py-1 hover:bg-gray-100 transition-colors rounded-r-lg"
//                         >+</button>
//                       </div>
//                       <button 
//                         onClick={() => removeFromCart(item.id)}
//                         className="text-red-500 hover:text-red-700 p-2"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
// 
//           {/* Checkout Form */}
//           <div className="lg:w-2/5">
//             <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 sticky top-24">
//               <h2 className="text-xl font-semibold mb-6 border-b border-gray-200 pb-2">Shipping Details</h2>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
//                   <input
//                     required
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//                   <input
//                     required
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//                   <input
//                     required
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
//                   <textarea
//                     required
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     rows={3}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
//                   ></textarea>
//                 </div>
// 
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
//                   <div className="space-y-2">
//                     <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
//                       <input 
//                         type="radio" 
//                         name="payment" 
//                         value="card" 
//                         checked={paymentMethod === 'card'} 
//                         onChange={() => setPaymentMethod('card')}
//                         className="h-4 w-4 text-black focus:ring-black border-gray-300"
//                       />
//                       <span className="ml-3 font-medium text-sm text-gray-900">Credit / Debit Card</span>
//                     </label>
//                     <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${paymentMethod === 'momo' ? 'border-black bg-gray-50' : 'border-gray-200'}`}>
//                       <input 
//                         type="radio" 
//                         name="payment" 
//                         value="momo" 
//                         checked={paymentMethod === 'momo'} 
//                         onChange={() => setPaymentMethod('momo')}
//                         className="h-4 w-4 text-black focus:ring-black border-gray-300"
//                       />
//                       <span className="ml-3 font-medium text-sm text-gray-900">Mobile Money (MoMo)</span>
//                     </label>
//                   </div>
//                 </div>
//                 
//                 <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
//                   <div className="flex justify-between text-gray-600">
//                     <span>Subtotal</span>
//                     <span>${cartTotal.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-gray-600">
//                     <span>Shipping</span>
//                     <span>Calculated later</span>
//                   </div>
//                   <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
//                     <span>Total</span>
//                     <span>${cartTotal.toFixed(2)}</span>
//                   </div>
//                 </div>
// 
//                 <div className="mt-6 pt-2">
//                   <p className="text-xs text-gray-500 mb-4 text-center">
//                     Note: Payment gateway (Paystack) integration is pending. For now, your order will be recorded manually and we will contact you for payment.
//                   </p>
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="w-full py-3 px-4 bg-gray-900 text-white font-semibold rounded-lg shadow hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
//                   >
//                     {isSubmitting ? (
//                       <span className="flex items-center gap-2">
//                         <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Processing...
//                       </span>
//                     ) : (
//                       "Place Order"
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Container>
//   );
// }
// 
// 
// 
// 