"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/ui/Header";
import { Footer } from "@/ui/Footer";

export function ClientHeader() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/8392-admin");
  
  if (isAdmin) return null;
  
  return <Header />;
}

export function ClientFooter() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/8392-admin");
  
  if (isAdmin) return null;
  
  return <Footer />;
}
