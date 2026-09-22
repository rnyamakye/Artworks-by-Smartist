"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface Slide {
  id: number;
  src: string;
}

const sliderImages: Slide[] = [
  { id: 1, src: "/Artist-holding-commissioned-portrait-1.JPG" },
  { id: 2, src: "/satisfied-costumer-5.jpg" },
  { id: 3, src: "/satisfied-costumer-3.jpg" },
  { id: 4, src: "/satisfied-costumer-6.jpg" },
  { id: 5, src: "/MeekMill-profile.JPG" },
  { id: 6, src: "/satisfied-customer-7.jpg" }
];

const ImageSlider = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (sliderImages.length === 0) {
    return <div className="text-center p-0"></div>;
  }

  return (
    <div className="relative w-[90vw] md:w-full h-full rounded-lg overflow-hidden group">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="h-full ml-0">
          {sliderImages.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0 basis-full">
              <div className="w-full h-full min-h-[350px] md:min-h-[500px] relative">
                <img
                  src={slide.src}
                  alt={`Slide ${slide.id}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Previous button */}
        <CarouselPrevious className="absolute left-4 bg-black/50 hover:bg-black/70 text-white border-0 h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Next button */}
        <CarouselNext className="absolute right-4 bg-black/50 hover:bg-black/70 text-white border-0 h-12 w-12 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Carousel>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-3 w-3 rounded-full transition-colors ${
              index === current ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
