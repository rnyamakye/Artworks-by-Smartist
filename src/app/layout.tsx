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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://artworksbysmartist.com"),
  title: {
    default: "Artworks by Smartist | Fine Pencil Art & Custom Portraits",
    template: "%s | Artworks by Smartist",
  },
  description:
    "Explore hyper-realistic fine pencil artwork, commissioned custom portraits, and pencil drawing tutorials by Smartist.",
  openGraph: {
    title: "Artworks by Smartist | Fine Pencil Art & Custom Portraits",
    description:
      "Explore hyper-realistic fine pencil artwork, commissioned custom portraits, and pencil drawing tutorials by Smartist.",
    url: "https://artworksbysmartist.com",
    siteName: "Artworks by Smartist",
    images: [
      {
        url: "/award-image.JPG",
        width: 1200,
        height: 630,
        alt: "Artworks by Smartist - Fine Pencil Art",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artworks by Smartist | Fine Pencil Art",
    description:
      "Hyper-realistic fine pencil drawings, commissioned portraits, and drawing tutorials.",
    images: ["/award-image.JPG"],
  },
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
