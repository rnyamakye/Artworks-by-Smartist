"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, ShoppingCart, User as UserIcon, LogOut } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { IoLogoInstagram, IoLogoWhatsapp, IoMailSharp } from "react-icons/io5";
import { SiTiktok } from "react-icons/si";

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);
  const currentTranslateY = useRef(0);
  
  // Use cart & auth
  const { itemCount } = require("@/context/CartContext").useCart();
  const { user, signOut } = require("@/context/AuthContext").useAuth();

  const handleThemeToggle = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // Scroll handler for 1-to-1 synced reveal-on-scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      // Header is ~80px tall plus margins, so -150px safely hides it
      currentTranslateY.current = Math.min(
        Math.max(currentTranslateY.current - diff, -150),
        0
      );

      if (headerRef.current) {
        headerRef.current.style.transform = `translate(-50%, ${currentTranslateY.current}px)`;
      }

      lastScrollY.current = currentScrollY;
      setIsScrolled(currentScrollY > 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links
  const navLinks: { href: string; label: string }[] = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/gallery", label: "Gallery" },
    { href: "/shop", label: "Shop" },
    { href: "/contact", label: "Contact" }
  ];

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed z-50 left-1/2 w-[95%] md:w-full max-w-7xl md:px-12 py-3 top-2 md:top-4 transition-colors duration-300 ${isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-md rounded-full"
            : "bg-transparent shadow-sm rounded-full"
          } ${className}`}
        style={{ transform: "translate(-50%, 0px)" }}
      >
        <div className="flex items-center justify-between px-4 md:px-0 w-full gap-10">
          {/* Logo */}
          <div className="flex items-center z-10">
            <Link href={"/"}>
              <img
                src="/smartist-logo-1.jpg"
                alt="logo"
                className="w-[40px] rounded-full"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium hover:text-black text-gray-700 relative group overflow-hidden"
              >
                {link.label}
                <span className="inline-flex w-full h-[1px] bg-black absolute bottom-0 left-0 transform -translate-x-[50%] scale-0 group-hover:translate-x-0 duration-300 group-hover:scale-100"></span>
              </Link>
            ))}
          </nav>

          {/* Mobile Right-side Icons & Menu */}
          <div className="flex gap-4 md:hidden items-center">
            {/* Cart Icon Mobile */}
            <Link href="/checkout" className="relative text-gray-600 hover:text-gray-900 transition mt-1">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Profile/Sidebar Button */}
            <button
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-200 transition duration-300"
              onClick={() => setShowSidebar(true)}
              aria-label="Open Sidebar"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Desktop Right-side Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Icon Desktop */}
            <Link href="/checkout" className="relative text-gray-700 hover:text-gray-900 transition">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth Icon Desktop */}
            {user ? (
              <div className="relative group ml-2 mt-1">
                <button className="text-gray-700 hover:text-gray-900 transition flex items-center" aria-label="User menu">
                  <UserIcon className="w-5 h-5" />
                </button>
                <div className="absolute right-0 mt-0 w-48 bg-white border border-gray-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right pt-2">
                  <div className="py-2 bg-white rounded-xl shadow-sm border border-gray-100">
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile Settings</Link>
                    {user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                      <Link href="/8392-admin" className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium">Admin Dashboard</Link>
                    )}
                    <button onClick={() => signOut()} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Sign Out</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/auth" className="text-gray-700 hover:text-gray-900 transition ml-2 mt-1" title="Sign In">
                <UserIcon className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
    </>
  );
};
