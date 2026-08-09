"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { REVIEWS } from "@/data/reviews";
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TestimonialsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-20 bg-[#08080C] border-b border-zinc-800/80 relative">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-black text-[#FF3B30] uppercase tracking-widest bg-red-950/60 border border-[#FF3B30]/40 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 w-fit shadow-md">
              <Award className="w-4 h-4 text-[#FF3B30]" /> ATHLETE & COACH REVIEWS
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight bebas-font mt-2">
              TRUSTED BY CHAMPIONS IN INDIA
            </h2>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="rounded-full bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white hover:border-[#FF3B30]"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="rounded-full bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white hover:border-[#FF3B30]"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Embla Carousel Viewport */}
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex -ml-4">
            {REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4"
              >
                <div className="bg-zinc-950/90 border border-zinc-800 rounded-3xl p-6 h-full flex flex-col justify-between space-y-4 hover:border-[#FF3B30]/60 transition-colors shadow-xl glass-card">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <Quote className="w-6 h-6 text-zinc-700" />
                    </div>

                    <p className="text-xs text-zinc-300 italic leading-relaxed font-medium">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                    {rev.userImage && (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-zinc-700">
                        <Image
                          src={rev.userImage}
                          alt={rev.author}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-black text-white flex items-center gap-1">
                        {rev.author}
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#FF3B30]" />
                      </h4>
                      <span className="text-[10px] text-zinc-400 block font-semibold">{rev.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

