"use client";

import React, { useEffect, useState } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { HighlightsBar } from "@/components/sections/HighlightsBar";
import { CategoriesStrip } from "@/components/sections/CategoriesStrip";
import { FlashDropBanner } from "@/components/sections/FlashDropBanner";
import { WhyViperSection } from "@/components/sections/WhyViperSection";
import { DojangBulkSection } from "@/components/sections/DojangBulkSection";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { ProductCard } from "@/components/product/ProductCard";
import { PauseBanner } from "@/components/store/PauseBanner";
import { Product } from "@/types/product";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, Loader2 } from "lucide-react";

type FilterCategory = "ALL" | "WT" | "BEST" | "KIDS";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("ALL");

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.products)) setProducts(data.products);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProducts = products.filter((p) => {
    if (activeFilter === "WT") return p.isWTApproved;
    if (activeFilter === "BEST") return p.isBestSeller;
    if (activeFilter === "KIDS") return p.category.toLowerCase().includes("kids") || p.category.toLowerCase().includes("junior");
    return true;
  });

  const displayProducts = filteredProducts.slice(0, 8);

  return (
    <div className="space-y-0 bg-[#08080C] text-white overflow-hidden">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Highlights Bar */}
      <HighlightsBar />

      {/* 3. Categories Showcase Strip */}
      <CategoriesStrip />

      {/* 4. Store Pause Notice (if active) */}
      <PauseBanner />

      {/* 5. Limited Batch Drop Banner */}
      <FlashDropBanner />

      {/* 6. Featured Products Catalog Showcase */}
      <section className="py-20 bg-[#08080C] border-b border-zinc-800/80 relative">
        <div className="container mx-auto px-4">
          
          {/* Header & Filter Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-black text-[#FF3B30] uppercase tracking-widest bg-red-950/60 border border-[#FF3B30]/40 px-3.5 py-1 rounded-full flex items-center gap-1.5 w-fit shadow-md">
                <Flame className="w-3.5 h-3.5 fill-[#FF3B30]" /> TOP CHAMPIONSHIP GEAR
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight bebas-font mt-2">
                FEATURED DOBOKS & SPARRING ARMOR
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: "ALL" as FilterCategory, label: "All Gear" },
                { id: "WT" as FilterCategory, label: "WT Approved" },
                { id: "BEST" as FilterCategory, label: "Bestsellers" },
                { id: "KIDS" as FilterCategory, label: "Junior / Kids" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all whitespace-nowrap border ${
                    activeFilter === tab.id
                      ? "bg-[#FF3B30] text-black border-[#FF3B30] shadow-lg neon-crimson-glow"
                      : "bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-sm text-zinc-400 gap-2">
                <Loader2 className="w-6 h-6 text-[#FF3B30] animate-spin" />
                <span>Loading official championship gear...</span>
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="col-span-full py-12 text-center text-zinc-400 text-sm bg-zinc-900/50 rounded-2xl border border-zinc-800">
                No items found matching this filter category.
              </div>
            ) : (
              displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>

          {/* Explore Catalog Footer Action */}
          <div className="mt-14 text-center">
            <Button variant="default" size="lg" asChild className="h-13 px-9 text-xs font-black uppercase tracking-wider bg-[#FF3B30] hover:bg-[#D92D20] text-black rounded-2xl shadow-xl neon-crimson-glow">
              <Link href="/shop">
                Explore Full Catalog ({products.length} Items) <ArrowRight className="w-5 h-5 ml-1 stroke-[2.5]" />
              </Link>
            </Button>
          </div>

        </div>
      </section>

      {/* 7. Why Viper Section */}
      <WhyViperSection />

      {/* 8. Dojang Bulk & Academy Order Banner */}
      <DojangBulkSection />

      {/* 9. Action Gallery Preview */}
      <GalleryPreview />

      {/* 10. Testimonials & Reviews */}
      <TestimonialsCarousel />

      {/* 11. Newsletter VIP Squad Capture */}
      <NewsletterSection />
    </div>
  );
}


