"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { HeroSection } from "@/components/sections/HeroSection";
import { FlashDropBanner } from "@/components/sections/FlashDropBanner";
import { WhyViperSection } from "@/components/sections/WhyViperSection";
import { DojangBulkSection } from "@/components/sections/DojangBulkSection";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { ProductCard } from "@/components/product/ProductCard";
import { PauseBanner } from "@/components/store/PauseBanner";
import { Product } from "@/types/product";

type FilterCategory = "ALL" | "WT" | "BEST" | "KIDS";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("ALL");

  useEffect(() => {
    fetch("/api/products")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.products)) setProducts(data.products);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProducts = products.filter((product) => {
    if (activeFilter === "WT") return product.isWTApproved;
    if (activeFilter === "BEST") return product.isBestSeller;
    if (activeFilter === "KIDS") return product.category.toLowerCase().includes("kids") || product.category.toLowerCase().includes("junior");
    return true;
  });

  return (
    <div className="editorial-page">
      <HeroSection />
      <PauseBanner />

      <section className="border-b border-border bg-surface py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="section-kicker mb-3">Shop the edit</p>
              <h2 className="section-title max-w-2xl">Made for your next round.</h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                ["ALL", "All gear"],
                ["WT", "WT-approved"],
                ["BEST", "Bestsellers"],
                ["KIDS", "Junior"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setActiveFilter(id as FilterCategory)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${activeFilter === id ? "border-ink bg-ink text-white" : "border-border-strong text-muted hover:border-ink hover:text-ink"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="product-grid-stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              <div className="col-span-full flex min-h-64 flex-col items-center justify-center gap-3 text-sm text-muted">
                <Loader2 className="h-5 w-5 animate-spin text-accent" /> Loading the edit...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-border bg-background py-16 text-center text-sm text-muted">No products match this edit.</div>
            ) : (
              filteredProducts.slice(0, 8).map((product) => <ProductCard key={product.id} product={product} />)
            )}
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-accent">
              Explore the full collection <ArrowRight className="h-4 w-4 text-accent" />
            </Link>
          </div>
        </div>
      </section>

      <WhyViperSection />
      <FlashDropBanner product={products.find((product) => product.slug.includes("competition-taekwondo-dobok-india-edition"))} />
      <DojangBulkSection />
      <TestimonialsCarousel />
      <NewsletterSection />
    </div>
  );
}
