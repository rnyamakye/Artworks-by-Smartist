"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Image as ImageIcon, FileText, Video, Users, MessageSquare, ShoppingBag } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    artworks: 0,
    blogs: 0,
    tutorials: 0,
    subscribers: 0,
    messages: 0,
    orders: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const [{ count: artworks }, { count: blogs }, { count: tutorials }, { count: subscribers }, { count: messages }, { count: orders }] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("blogs").select("*", { count: "exact", head: true }),
        supabase.from("tutorials").select("*", { count: "exact", head: true }),
        supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
      ]);

      setStats({
        artworks: artworks || 0,
        blogs: blogs || 0,
        tutorials: tutorials || 0,
        subscribers: subscribers || 0,
        messages: messages || 0,
        orders: orders || 0,
      });
    }

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Orders", value: stats.orders, icon: ShoppingBag, href: "/8392-admin/orders", color: "bg-indigo-500" },
    { title: "Total Artworks", value: stats.artworks, icon: ImageIcon, href: "/8392-admin/artworks", color: "bg-blue-500" },
    { title: "Total Blogs", value: stats.blogs, icon: FileText, href: "/8392-admin/blogs", color: "bg-green-500" },
    { title: "Total Tutorials", value: stats.tutorials, icon: Video, href: "/8392-admin/tutorials", color: "bg-purple-500" },
    { title: "Subscribers", value: stats.subscribers, icon: Users, href: "/8392-admin/subscribers", color: "bg-orange-500" },
    { title: "Messages", value: stats.messages, icon: MessageSquare, href: "/8392-admin/messages", color: "bg-teal-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link key={card.title} href={card.href} className="block">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 font-medium">{card.title}</h3>
                <div className={`${card.color} p-3 rounded-lg text-white`}>
                  <card.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-4xl font-bold text-gray-900">{card.value}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
