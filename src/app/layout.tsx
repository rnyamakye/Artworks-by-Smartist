import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { ClientHeader, ClientFooter } from "@/ui/ClientLayoutComponents";
import { SocialSidebar } from "@/ui/SocialSidebar";
import { ClientMainWrapper } from "@/ui/ClientMainWrapper";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ConfirmProvider } from "@/context/ConfirmContext";

import { cn } from "@/lib/utils";

const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Artworks",
  description: "Artwork Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("antialiased", mulish.variable, "font-sans")} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col text-sm md:text-base">
        <AuthProvider>
          <CartProvider>
            <ConfirmProvider>
              <ClientHeader />
              <SocialSidebar />
              <ClientMainWrapper>{children}</ClientMainWrapper>
              <ClientFooter />
              <Toaster position="bottom-right" />
            </ConfirmProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
