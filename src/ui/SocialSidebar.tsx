"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  IoLogoInstagram,
  IoLogoWhatsapp,
  IoMailSharp,
  IoClose,
} from "react-icons/io5";
import { SiTiktok } from "react-icons/si";
import { usePathname } from "next/navigation";

export const SocialSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Visible only on the homepage ("/")
  if (pathname !== "/" && pathname !== "") return null;

  const socialLinks = [
    {
      name: "WhatsApp",
      href: "https://wa.me/+233547348350",
      icon: <IoLogoWhatsapp className="w-5 h-5 text-emerald-500" />,
      hoverBg: "hover:bg-emerald-50",
      borderHover: "hover:border-emerald-300",
      label: "Chat on WhatsApp",
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@smartist88?_t=ZM-8wXnYAmrfHi&_r=1",
      icon: <SiTiktok className="w-4 h-4 text-gray-900" />,
      hoverBg: "hover:bg-gray-100",
      borderHover: "hover:border-gray-400",
      label: "TikTok",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/an_mmanuel?igsh=MXViNWhzajhldTczYg%3D%3D&utm_source=qr",
      icon: <IoLogoInstagram className="w-5 h-5 text-pink-600" />,
      hoverBg: "hover:bg-pink-50",
      borderHover: "hover:border-pink-300",
      label: "Instagram",
    },
    {
      name: "Email",
      href: "mailto:smartmasterpiece7@gmail.com",
      icon: <IoMailSharp className="w-5 h-5 text-gray-700" />,
      hoverBg: "hover:bg-gray-100",
      borderHover: "hover:border-gray-400",
      label: "Email Me",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
    >
      {/* Expanded Links Menu */}
      <div
        className={`flex flex-col items-end gap-3 mb-3 transition-all duration-300 ease-out origin-bottom ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-6 scale-90 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        {socialLinks.map((item, index) => (
          <a
            key={item.name}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className={`flex items-center gap-2.5 group transition-all duration-200 ${
              isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{
              transitionDelay: isOpen ? `${(socialLinks.length - 1 - index) * 40}ms` : "0ms",
            }}
          >
            {/* Pill Label */}
            <span className="bg-gray-900/90 backdrop-blur-xs text-white text-xs font-medium py-1 px-2.5 rounded-lg shadow-md opacity-90 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {item.label}
            </span>

            {/* Round Icon Button */}
            <div
              className={`w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center transition-all duration-200 group-hover:scale-110 active:scale-95 ${item.hoverBg} ${item.borderHover}`}
            >
              {item.icon}
            </div>
          </a>
        ))}
      </div>

      {/* Main Single Round Trigger Circle */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close social media menu" : "Open WhatsApp and social links"}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-400/30 ${
          isOpen
            ? "bg-gray-900 text-white shadow-gray-900/30 rotate-90"
            : "bg-[#25D366] text-white shadow-emerald-500/30 hover:bg-[#20bd5a]"
        }`}
      >
        {isOpen ? (
          <IoClose className="w-7 h-7" />
        ) : (
          <>
            <IoLogoWhatsapp className="w-8 h-8" />
            {/* Subtle attention indicator ping badge */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white" />
            </span>
          </>
        )}
      </button>
    </div>
  );
};
