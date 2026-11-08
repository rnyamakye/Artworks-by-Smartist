"use client";

import { usePathname } from "next/navigation";

export function ClientMainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/8392-admin");
  
  return (
    <main className={`flex-1 w-full ${isAdmin ? "" : "pt-24 md:pt-32"}`}>
      {children}
    </main>
  );
}
