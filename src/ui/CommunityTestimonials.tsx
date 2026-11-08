"use client";

import React, { useState, useEffect, useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { LeaveTestimonial } from "@/ui/LeaveTestimonial";
import { SocialEmbed } from "@/ui/SocialEmbed";
import {
  Clock,
  CheckCircle2,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export type TestimonialItem = {
  id?: string;
  _id?: string;
  name: string;
  role?: string | null;
  text: string;
  status: "pending" | "approved" | string;
  created_at?: string;
  social_post_url?: string | null;
};

interface CommunityTestimonialsProps {
  initialTestimonials: TestimonialItem[];
}

const LOCAL_STORAGE_KEY = "user_pending_testimonials";

function formatTestimonialDate(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export const CommunityTestimonials: React.FC<CommunityTestimonialsProps> = ({
  initialTestimonials,
}) => {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(
    initialTestimonials || []
  );
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(true);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  // Load any previously submitted pending testimonials from local storage so the author still sees them
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const localPending: TestimonialItem[] = JSON.parse(stored);
        if (Array.isArray(localPending) && localPending.length > 0) {
          setTestimonials((prev) => {
            const existingIds = new Set(
              prev.map((item) => item.id || item._id || item.text)
            );
            const toAdd = localPending.filter(
              (item) => !existingIds.has(item.id || item._id || item.text)
            );
            return [...toAdd, ...prev];
          });
        }
      }
    } catch (e) {
      console.warn("Could not load local pending testimonials:", e);
    }
  }, []);

  // Embla carousel synchronization
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    setScrollSnaps(api.scrollSnapList());
    onSelect();

    api.on("select", onSelect);
    api.on("reInit", () => {
      setScrollSnaps(api.scrollSnapList());
      onSelect();
    });

    return () => {
      api.off("select", onSelect);
    };
  }, [api, testimonials.length]);

  // When a user leaves a new review, immediately add it to the list in pending state and scroll to it
  const handleTestimonialSubmitted = (newTestimonial: TestimonialItem) => {
    setTestimonials((prev) => [newTestimonial, ...prev]);

    // Persist in localStorage so it stays visible to the user across refreshes
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      const existing: TestimonialItem[] = stored ? JSON.parse(stored) : [];
      const updated = [
        newTestimonial,
        ...existing.filter(
          (t) => (t.id || t.text) !== (newTestimonial.id || newTestimonial.text)
        ),
      ];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save pending testimonial to local storage:", e);
    }

    // Scroll to the new testimonial at index 0
    setTimeout(() => {
      api?.scrollTo(0);
    }, 100);
  };

  return (
    <section className="max-w-7xl mx-auto py-12 md:py-16 px-4 md:px-8 overflow-hidden">
      {/* Section Header */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          What Our Community Says
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Genuine experiences from collectors, clients, and fellow pencil artists.
        </p>
      </div>

      {/* Testimonials Slider */}
      {testimonials.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 p-8 flex flex-col items-center gap-4">
          <p className="text-gray-500 font-medium">
            No testimonials yet. Be the first to share your experience!
          </p>
          <LeaveTestimonial
            onTestimonialSubmitted={handleTestimonialSubmitted}
          />
        </div>
      ) : (
        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: testimonials.length > 2,
            }}
            plugins={[autoplayPlugin.current]}
            className="w-full"
            onMouseEnter={autoplayPlugin.current.stop}
            onMouseLeave={autoplayPlugin.current.reset}
          >
            <CarouselContent className="-ml-4 md:-ml-6 py-2">
              {testimonials.map((t, idx) => {
                const isPending = t.status === "pending";

                return (
                  <CarouselItem
                    key={t.id || t._id || idx}
                    className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3 flex"
                  >
                    <div
                      className={`w-full rounded-2xl p-6 flex flex-col justify-between transition-all ${
                        isPending
                          ? "bg-gray-50/70 border border-dashed border-gray-300 shadow-2xs"
                          : "bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md"
                      }`}
                    >
                      <div className="w-full">
                        {/* Status Indicator Badge */}
                        <div className="flex items-center justify-between w-full mb-3">
                          {isPending ? (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-500 bg-gray-200/70 border border-gray-300/60 px-2.5 py-0.5 rounded-full">
                              <Clock className="w-3 h-3 text-gray-400" />
                              Pending Review
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Verified Review
                            </span>
                          )}

                          {t.created_at && (
                            <span className="text-[11px] text-gray-400 font-medium">
                              {formatTestimonialDate(t.created_at)}
                            </span>
                          )}
                        </div>

                        {/* Author Header */}
                        <div className="flex items-center mb-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 font-semibold text-sm shrink-0 ${
                              isPending
                                ? "bg-gray-200 text-gray-400"
                                : "bg-gray-900 text-white"
                            }`}
                          >
                            {t.name ? (
                              t.name.charAt(0).toUpperCase()
                            ) : (
                              <UserIcon className="w-5 h-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            {/* Name in gray if pending, dark if approved */}
                            <div
                              className={`font-semibold text-sm sm:text-base truncate ${
                                isPending ? "text-gray-500" : "text-gray-900"
                              }`}
                            >
                              {t.name}
                            </div>
                            {/* Role in gray */}
                            <div className="text-xs text-gray-400 truncate">
                              {t.role || "Collector"}
                            </div>
                          </div>
                        </div>

                        {/* Testimonial Quote: GRAY TEXT when pending review as requested */}
                        <p
                          className={`text-sm sm:text-base mt-2 leading-relaxed ${
                            isPending
                              ? "text-gray-400 italic"
                              : "text-gray-700 font-normal"
                          }`}
                        >
                          &ldquo;{t.text}&rdquo;
                        </p>

                        {/* Embedded Social Media Post if attached */}
                        {t.social_post_url && (
                          <div className="mt-4 pt-3 border-t border-gray-100 w-full">
                            <SocialEmbed url={t.social_post_url} />
                          </div>
                        )}
                      </div>

                      {/* Micro note for pending reviews */}
                      {isPending && (
                        <div className="w-full mt-4 pt-2.5 border-t border-gray-200/50 flex items-center justify-between text-[11px] text-gray-400">
                          <span>Awaiting admin review</span>
                          <span>Visible to you</span>
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>

          {/* Bottom Controls: Navigation Arrows, Leave Review Button, and Indicator Dots */}
          <div className="mt-10 flex flex-col items-center gap-5">
            {/* Slide Indicator Dots */}
            {scrollSnaps.length > 1 && (
              <div className="flex justify-center items-center gap-2">
                {scrollSnaps.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => api?.scrollTo(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === selectedIndex
                        ? "w-8 bg-gray-900"
                        : "w-2 bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Bottom Actions Row: Previous, Leave a Testimonial, Next */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
              {testimonials.length > 1 && (
                <button
                  type="button"
                  onClick={() => api?.scrollPrev()}
                  disabled={!canScrollPrev}
                  className="w-11 h-11 rounded-full border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-gray-700 transition-all shadow-xs hover:shadow-sm cursor-pointer"
                  aria-label="Previous testimonials"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <LeaveTestimonial
                onTestimonialSubmitted={handleTestimonialSubmitted}
              />

              {testimonials.length > 1 && (
                <button
                  type="button"
                  onClick={() => api?.scrollNext()}
                  disabled={!canScrollNext}
                  className="w-11 h-11 rounded-full border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-gray-700 transition-all shadow-xs hover:shadow-sm cursor-pointer"
                  aria-label="Next testimonials"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
