"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";

const slides = [
  {
    image: "/images/kpnp-dobok-1.jpg",
    label: "India Edition",
    detail: "Black V-neck competition dobok",
  },
  {
    image: "/images/kpnp-dobok-2.jpg",
    label: "India Edition",
    detail: "Color-belt competition dobok",
  },
  {
    image: "/images/kpnp-dobok-chest.jpg",
    label: "Built for the details",
    detail: "WT emblem, flag patch, and clean finish",
  },
];

export function HeroSection() {
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slide = slides[activeSlide];

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const moveSlide = (direction: 1 | -1) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div className="pointer-events-none absolute -right-32 top-0 h-[32rem] w-[32rem] rounded-full bg-accent/10 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative z-10 max-w-xl"
        >
          <p className="section-kicker mb-5">Taekwondo equipment / India</p>
          <h1 className="display-title text-[clamp(4.2rem,10vw,8.6rem)] leading-[0.82] text-ink">
            TRAIN IN IT.<br />
            <span className="text-accent">COMPETE IN IT.</span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-relaxed text-muted sm:text-lg">
            Performance doboks and training gear made for clean movement, hard rounds, and the long road to your next belt.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full bg-ink px-7 text-sm text-white hover:bg-accent">
              <Link href="/shop">
                Shop doboks <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setSizeModalOpen(true)}
              className="h-12 rounded-full border-border-strong px-6 text-sm"
            >
              <Ruler className="h-4 w-4 text-accent" /> Find your size
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-2xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative aspect-[0.94] overflow-hidden rounded-[2rem] bg-[#d8d6d4] shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.image}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0"
              >
                <Image
                  src={slide.image}
                  alt={`${slide.label}: ${slide.detail}`}
                  fill
                  priority={activeSlide === 0}
                  className="object-cover object-top"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />

            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white sm:inset-x-6 sm:bottom-6">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.16em] text-white/65 uppercase">{slide.label}</p>
                <p className="mt-1 text-lg font-medium">{slide.detail}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => moveSlide(-1)}
                  aria-label="Previous dress"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-ink/35 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-ink"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveSlide(1)}
                  aria-label="Next dress"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink transition-colors hover:bg-accent hover:text-white"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between px-1">
            <div className="flex items-center gap-2" aria-label="Dress slides">
              {slides.map((item, index) => (
                <button
                  key={item.image}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show dress ${index + 1}`}
                  aria-current={activeSlide === index}
                  className={`h-1.5 rounded-full transition-all ${activeSlide === index ? "w-8 bg-accent" : "w-1.5 bg-border-strong hover:bg-ink"}`}
                />
              ))}
            </div>
            <span className="text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">{String(activeSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
          </div>
        </motion.div>
      </div>

      <SizeGuideModal open={sizeModalOpen} onOpenChange={setSizeModalOpen} />
    </section>
  );
}
