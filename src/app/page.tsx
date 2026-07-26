"use client";

import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { HighlightsBar } from "@/components/sections/HighlightsBar";
import { WhyViperSection } from "@/components/sections/WhyViperSection";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { ProductCard } from "@/components/product/ProductCard";
import { PRODUCTS } from "@/data/products";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame } from "lucide-react";

export default function HomePage() {
  const featuredProducts = PRODUCTS.slice(0, 8);

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <HeroSection />

      {/* Highlights Bar */}
      <HighlightsBar />

      {/* Featured Products Showcase */}
      <section className="py-20 bg-[#0E0E10] border-b border-zinc-800/80">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-[#00E676] uppercase tracking-widest bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-1 rounded-full flex items-center gap-1.5 w-fit">
                <Flame className="w-3.5 h-3.5 fill-[#00E676]" /> TOP CHAMPIONSHIP GEAR
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight bebas-font mt-2">
                FEATURED DOBOKS & SPARRING ARMOR
              </h2>
            </div>

            <Button variant="outline" size="sm" asChild className="gap-2 border-zinc-700 text-zinc-300 hover:text-white">
              <Link href="/shop">
                Explore Full Catalog <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="viperAccent" size="lg" asChild className="px-8 text-sm">
              <Link href="/shop">
                View All {PRODUCTS.length} Products <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
          </div>

        </div>
      </section>

      {/* Why Viper Section */}
      <WhyViperSection />

      {/* Gallery Preview */}
      <GalleryPreview />

      {/* Testimonials */}
      <TestimonialsCarousel />

      {/* Newsletter Capture */}
      <NewsletterSection />
    </div>
  );
}
