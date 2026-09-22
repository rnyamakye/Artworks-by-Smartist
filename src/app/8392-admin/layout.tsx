"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { LayoutDashboard, Image as ImageIcon, FileText, Video, Users, FileEdit, LogOut, ChevronLeft, ChevronRight, MessageSquare, ShoppingBag, Quote, Globe } from "lucide-react";
import toast from "react-hot-toast";
import { useConfirm } from "@/context/ConfirmContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { confirm } = useConfirm();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [pendingCommissions, setPendingCommissions] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    // Only fetch if not on login page
    if (pathname !== "/8392-admin/login") {
      fetchPendingCount();
      fetchUnreadMessagesCount();
      fetchPendingOrdersCount();
    }
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const fetchPendingCount = async () => {
    const { count } = await supabase
      .from("commissions")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");
    if (count !== null) setPendingCommissions(count);
  };

  const fetchUnreadMessagesCount = async () => {
    const { count } = await supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("status", "unread");
    if (count !== null) setUnreadMessages(count);
  };

  const fetchPendingOrdersCount = async () => {
    const { count } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");
    if (count !== null) setPendingOrders(count);
  };

  const handleLogout = async () => {
    if (await confirm({ title: "Logout", message: "Are you sure you want to log out?", confirmText: "Logout", destructive: true })) {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      router.push("/8392-admin/login");
      router.refresh();
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/8392-admin", icon: LayoutDashboard },
    { name: "Orders", href: "/8392-admin/orders", icon: ShoppingBag, badge: pendingOrders },
    { name: "Artworks", href: "/8392-admin/artworks", icon: ImageIcon },
    { name: "Blogs", href: "/8392-admin/blogs", icon: FileText },
    { name: "Tutorials", href: "/8392-admin/tutorials", icon: Video },
    { name: "Testimonials", href: "/8392-admin/testimonials", icon: Quote },
    { name: "Commissions", href: "/8392-admin/commissions", icon: FileEdit, badge: pendingCommissions },
    { name: "Messages", href: "/8392-admin/messages", icon: MessageSquare, badge: unreadMessages },
    { name: "Subscribers", href: "/8392-admin/subscribers", icon: Users },
    { name: "About Page", href: "/8392-admin/about", icon: FileEdit },
    { name: "Policies", href: "/8392-admin/policies", icon: FileText },
  ];

  // If we are on the login page, don't show the sidebar
  if (pathname === "/8392-admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white shadow-sm z-20 px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Admin</h2>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${
          isCollapsed ? "md:w-20" : "md:w-64"
        } w-64 fixed md:sticky top-0 left-0 h-screen bg-white shadow-md flex flex-col z-40 transition-all duration-300 ease-in-out`}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className={`text-xl md:text-2xl font-bold text-gray-900 truncate ${isCollapsed ? 'md:hidden' : ''}`}>Admin</h2>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)} 
            className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hidden md:block"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            // Strict match for Dashboard
            const isDashboard = item.href === '/8392-admin';
            const trulyActive = isDashboard ? pathname === '/8392-admin' : isActive;

            return (
              <Link
                key={item.name}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                className={`relative flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  trulyActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? "md:justify-center w-full" : "gap-3"}`}>
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className={`font-medium whitespace-nowrap ${isCollapsed ? 'md:hidden' : ''}`}>{item.name}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <>
                    <span className={`bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ${isCollapsed ? 'md:hidden' : ''}`}>
                      {item.badge}
                    </span>
                    {isCollapsed && (
                      <span className="hidden md:block absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 flex flex-col gap-2">
          <Link
            href="/"
            title={isCollapsed ? "View Site" : undefined}
            className={`flex items-center ${isCollapsed ? "md:justify-center" : "gap-3"} px-4 py-3 w-full rounded-lg text-gray-700 hover:bg-gray-100 transition-colors`}
          >
            <Globe className="w-5 h-5 flex-shrink-0" />
            <span className={`font-medium whitespace-nowrap ${isCollapsed ? 'md:hidden' : ''}`}>View Live Site</span>
          </Link>
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : undefined}
            className={`flex items-center ${isCollapsed ? "md:justify-center" : "gap-3"} px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`font-medium whitespace-nowrap ${isCollapsed ? 'md:hidden' : ''}`}>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 md:pt-0 pt-14">
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
