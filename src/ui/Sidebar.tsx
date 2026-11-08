"use client";
import Link from "next/link";
import { useRef, useEffect } from "react";
import {
  IoCloseSharp,
  IoLogoWhatsapp,
  IoLogoInstagram,
  IoMailSharp
} from "react-icons/io5";
import { SiTiktok } from "react-icons/si";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type SidebarProps = {
  isOpen: boolean; // Controls whether sidebar is visible
  onClose: () => void; // Function to close sidebar
  theme: "light" | "dark"; // Theme mode (not used in this snippet but passed)
  onThemeToggle: () => void; // Theme toggle function (not used here)
};

const QUICK_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/blog", label: "Blog" },
  { to: "/gallery", label: "Gallery" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" }
];

const RESOURCES = [
  { to: "/tutorials", label: "Tutorials" },
  { to: "/artist-spotlights", label: "Artist Spotlights" },
  { to: "/art-supplies", label: "Art Supplies Guide" },
  { to: "/faq", label: "FAQs" }
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // If click target is outside the sidebar container, close sidebar
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay behind sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-xs transition-opacity duration-300 ${isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose} // Clicking overlay closes sidebar
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 z-50 h-full w-[280px] rounded-tl-2xl rounded-bl-2xl bg-gray-100 shadow-2xl transform transition-transform duration-300 overflow-y-auto ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
      >
        {/* Close button in top-right corner */}
        <button
          className="fixed top-4 right-4 text-2xl hover:text-gray-700"
          onClick={onClose} // Clicking close button closes sidebar
          aria-label="Close"
        >
          <IoCloseSharp className="w-6 h-6 text-black" />
        </button>

        {/* Sidebar content */}
        {user ? (
          <div className="mt-12 mx-6 p-4 flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <User className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-900 line-clamp-1">Welcome,</p>
            <p className="text-xs text-gray-500 truncate w-full text-center mb-4">{user.email}</p>
            <Link
              href="/profile"
              onClick={onClose}
              className="w-full text-center px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-black transition-colors"
            >
              Edit Profile
            </Link>
            {user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
              <Link
                href="/8392-admin"
                onClick={onClose}
                className="mt-2 w-full text-center px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={() => { signOut(); onClose(); }}
              className="mt-2 w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 font-medium px-4 py-2.5 rounded-lg transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="mt-12 ml-8 translate-x-5" id="profile">
            <img src="/award-image.JPG" alt="Award" className="w-32 rounded-xl shadow-md" />
            {/* Social Icons */}
            <div className="flex gap-4 mt-6 items-center">
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-green-600 hover:text-green-700 transition"
              >
                <IoLogoWhatsapp className="w-6 h-6 text-gray-500 hover:text-gray-800" />
              </a>
              <a
                href="https://www.tiktok.com/@smartist88?_t=ZM-8wXnYAmrfHi&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-black hover:text-gray-700 transition"
              >
                <SiTiktok className="w-6 h-5 text-gray-500 hover:text-gray-800" />
              </a>
              <a
                href="https://www.instagram.com/an_mmanuel?igsh=MXViNWhzajhldTczYg%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-pink-600 hover:text-pink-700 transition"
              >
                <IoLogoInstagram className="w-6 h-6 text-gray-500 hover:text-gray-800" />
              </a>
              <a
                href="mailto:smartmasterpiece7@gmail.com"
                aria-label="Email"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                <IoMailSharp className="w-6 h-6 text-gray-500 hover:text-gray-800" />
              </a>
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <nav className="mt-8 px-6 pb-10 space-y-3">
          {/* Quick Links */}
          <div>
            <h2 className="font-semibold text-gray-900 mb-3 text-lg">
              Quick Links
            </h2>
            <ul className="space-y-2 text-gray-700">
              {QUICK_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    href={to}
                    onClick={onClose} // Close sidebar when link clicked
                    className="block py-2 px-3 rounded-md hover:bg-gray-200 transition font-medium text-gray-700 hover:text-gray-900"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <ul className="text-gray-700 pl-2">
              {RESOURCES.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    href={to}
                    onClick={onClose} // Close sidebar when link clicked
                    className="block text-sm py-2 px-3 rounded-md hover:bg-gray-200 transition font-medium text-gray-700 hover:text-gray-900"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* User Actions
          {!user && (
            <div className="pt-6 mt-4 border-t border-gray-200">
              <Link
                href="/auth"
                onClick={onClose}
                className="flex items-center text-gray-700 hover:text-gray-900 hover:bg-gray-200 font-medium px-3 py-2 w-full rounded-md transition"
              >
                <User className="w-5 h-5 mr-3" />
                Sign In
              </Link>
            </div>
          )} */}
        </nav>
      </div>
    </>
  );
};
