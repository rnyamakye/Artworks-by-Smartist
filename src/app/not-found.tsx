import Link from "next/link";
import { ArrowLeft, Home, Compass, BookOpen, Mail, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-full min-h-[75vh] flex flex-col items-center justify-center py-12 md:py-24 px-4 md:px-8 text-center">
      {/* 404 Visual Badge */}
      <div className="relative mb-6">
        <span className="text-8xl sm:text-9xl md:text-[140px] font-black tracking-tighter text-gray-100 select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-xs font-bold text-gray-800 uppercase tracking-widest">
            <HelpCircle className="w-4 h-4 text-gray-500" />
            <span>Page Not Found</span>
          </div>
        </div>
      </div>

      {/* Headline */}
      <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 tracking-tight max-w-xl mx-auto mb-4">
        Lost in the Gallery?
      </h1>

      {/* Description */}
      <p className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto mb-10 leading-relaxed font-normal">
        The artwork or page you are looking for doesn't exist, may have been relocated, or is temporarily unavailable.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white font-medium hover:bg-black transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-800 font-medium border border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-sm"
        >
          <Compass className="w-4 h-4" />
          <span>Browse Gallery</span>
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-gray-600 font-medium hover:text-gray-900 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          <span>Read Blog</span>
        </Link>
      </div>

      {/* Popular Destinations */}
      <div className="w-full max-w-md pt-8 border-t border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Popular Exhibition Categories
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {["Portrait", "Children", "Family Portrait", "Landscape", "Abstract"].map(
            (category) => (
              <Link
                key={category}
                href={`/gallery?category=${encodeURIComponent(category)}`}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {category}
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}

