"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, CheckCircle2, Star } from "lucide-react";
import { REVIEWS } from "@/data/reviews";

export function TestimonialsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="border-b border-border bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="section-kicker mb-3">From the community</p>
            <h2 className="section-title">Good gear gets noticed.</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={scrollPrev} aria-label="Previous review" className="flex h-10 w-10 items-center justify-center rounded-full border border-border-strong text-ink transition-colors hover:bg-ink hover:text-white"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={scrollNext} aria-label="Next review" className="flex h-10 w-10 items-center justify-center rounded-full border border-border-strong text-ink transition-colors hover:bg-ink hover:text-white"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>

        <div ref={emblaRef} className="overflow-hidden">
          <div className="-ml-4 flex">
            {REVIEWS.map((review) => (
              <div key={review.id} className="min-w-0 flex-[0_0_100%] pl-4 md:flex-[0_0_50%] lg:flex-[0_0_33.33%]">
                <article className="flex h-full min-h-[245px] flex-col justify-between rounded-2xl border border-border bg-background p-5 sm:p-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5 text-accent">
                        {Array.from({ length: review.rating }).map((_, index) => <Star key={index} className="h-3.5 w-3.5 fill-current" />)}
                      </div>
                      <span className="text-[10px] font-semibold tracking-[0.12em] text-muted uppercase">Verified</span>
                    </div>
                    <p className="mt-5 text-base leading-relaxed text-ink">“{review.comment}”</p>
                  </div>
                  <div className="mt-7 flex items-center gap-3 border-t border-border pt-4">
                    {review.userImage && <div className="relative h-9 w-9 overflow-hidden rounded-full bg-surface-2"><Image src={review.userImage} alt={review.author} fill className="object-cover" /></div>}
                    <div>
                      <p className="flex items-center gap-1 text-xs font-semibold text-ink">{review.author} <CheckCircle2 className="h-3.5 w-3.5 text-accent" /></p>
                      <p className="mt-0.5 text-[11px] text-muted">{review.role}</p>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
