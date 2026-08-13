"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types/product";

export function FlashDropBanner({ product }: { product?: Product }) {
  const price = product?.price ?? 2999;
  const originalPrice = product?.originalPrice ?? 3999;
  const slug = product?.slug ?? "kpnp-competition-taekwondo-dobok-india-edition";

  return (
    <section className="bg-ink py-14 text-white sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
        <div className="max-w-xl">
          <p className="mb-4 text-[10px] font-semibold tracking-[0.18em] text-accent uppercase">The India Edition</p>
          <h2 className="display-title text-6xl leading-[0.88] sm:text-8xl">A uniform that keeps up.</h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/65 sm:text-base">
            Lightweight competition fabric, a clean black V-neck, and the details that make it unmistakably yours on the mat.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href={`/product/${slug}`} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-accent hover:text-white">
              View the India Edition <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="text-sm text-white/65">
              <strong className="font-semibold text-white">₹{price.toLocaleString("en-IN")}</strong>{" "}
              <span className="line-through">₹{originalPrice.toLocaleString("en-IN")}</span>
            </span>
          </div>
        </div>

        <div className="relative mx-auto aspect-[1.05] w-full max-w-xl overflow-hidden rounded-2xl bg-surface-2 ring-1 ring-white/10">
          <Image src="/images/gallery/gallery-03.webp" alt="Athlete wearing a competition taekwondo uniform" fill sizes="(max-width: 1024px) 100vw, 45vw" className="animate-image-pan object-cover object-center transition duration-700 hover:scale-[1.03]" />
          <div className="absolute bottom-4 left-4 rounded-full bg-ink/80 px-4 py-2 text-[10px] font-semibold tracking-[0.12em] text-white uppercase backdrop-blur-sm">
            210 GSM / WT-approved options
          </div>
        </div>
      </div>
    </section>
  );
}
