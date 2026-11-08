import Link from "next/link";
import { Sparkles, ArrowRight, Palette, ShieldCheck, Truck } from "lucide-react";
import { NewsletterForm } from "@/ui/NewsletterForm";

interface ComingSoonProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  showShopHighlights?: boolean;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
  title = "Something Extraordinary is in the Works",
  subtitle = "We're putting the finishing pencil strokes on this section. Check back soon for new original artworks, exhibition updates, and exclusive collector opportunities.",
  badge = "Coming Soon",
  showShopHighlights = true,
}) => {
  return (
    <div className="w-full min-h-[75vh] flex flex-col items-center justify-center py-12 md:py-20 px-4 md:px-8 text-center">
      {/* Decorative Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-800 uppercase tracking-wider mb-6 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
        <span>{badge}</span>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 tracking-tight max-w-3xl mx-auto leading-tight mb-6">
        {title}
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
        {subtitle}
      </p>

      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white font-medium hover:bg-black transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <span>Explore Gallery</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/commission"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-800 font-medium border border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-sm"
        >
          <span>Request Custom Commission</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-gray-600 font-medium hover:text-gray-900 transition-colors"
        >
          <span>Return Home</span>
        </Link>
      </div>

      {/* Value Badges (Shown when viewing Shop or general Coming Soon) */}
      {showShopHighlights && (
        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 border-t border-gray-100 mb-12">
          <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 shadow-xs mb-3">
              <Palette className="w-5 h-5 text-gray-700" />
            </div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">
              100% Original Art
            </h4>
            <p className="text-xs text-gray-500">
              Hand-drawn graphite & charcoal on archival fine art paper.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 shadow-xs mb-3">
              <Truck className="w-5 h-5 text-gray-700" />
            </div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">
              Worldwide Delivery
            </h4>
            <p className="text-xs text-gray-500">
              Carefully packaged in heavy-duty tubes with tracked courier delivery.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-100 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 shadow-xs mb-3">
              <ShieldCheck className="w-5 h-5 text-gray-700" />
            </div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">
              Certificate of Authenticity
            </h4>
            <p className="text-xs text-gray-500">
              Every piece comes signed and verified by the master artist.
            </p>
          </div>
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="w-full max-w-md mx-auto pt-6 border-t border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Be the first to know when we launch
        </p>
        <NewsletterForm />
      </div>
    </div>
  );
};
