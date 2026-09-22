"use client";

import React from "react";
import { IoLogoInstagram, IoLogoWhatsapp, IoMailSharp } from "react-icons/io5";
import { SiTiktok } from "react-icons/si";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export const SocialSidebar = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const isAdminRoute = pathname?.startsWith("/8392-admin");

  if (isAdmin || isAdminRoute) return null;

  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40 flex flex-col gap-4 bg-white/80 backdrop-blur-md p-3 rounded-l-2xl shadow-lg border border-r-0 border-gray-200">
      <a
        href="https://wa.me/+233547348350"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="text-green-600 hover:text-green-700 transition transform hover:-translate-x-1"
      >
        <IoLogoWhatsapp className="w-6 h-6 text-gray-500 hover:text-green-600 transition-colors" />
      </a>
      <a
        href="https://www.tiktok.com/@smartist88?_t=ZM-8wXnYAmrfHi&_r=1"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TikTok"
        className="text-black hover:text-gray-700 transition transform hover:-translate-x-1"
      >
        <SiTiktok className="w-5 h-5 text-gray-500 hover:text-black transition-colors mx-auto" />
      </a>
      <a
        href="https://www.instagram.com/an_mmanuel?igsh=MXViNWhzajhldTczYg%3D%3D&utm_source=qr"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="text-pink-600 hover:text-pink-700 transition transform hover:-translate-x-1"
      >
        <IoLogoInstagram className="w-6 h-6 text-gray-500 hover:text-pink-600 transition-colors" />
      </a>
      <a
        href="mailto:smartmasterpiece7@gmail.com"
        aria-label="Email"
        className="text-gray-700 hover:text-gray-900 transition transform hover:-translate-x-1"
      >
        <IoMailSharp className="w-6 h-6 text-gray-500 hover:text-gray-900 transition-colors" />
      </a>
    </div>
  );
};
