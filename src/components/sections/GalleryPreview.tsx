"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GALLERY_ITEMS } from "@/data/gallery";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Camera } from "lucide-react";


export function GalleryPreview() {
  const previewItems = GALLERY_ITEMS.slice(0, 6);

  return (
    <section className="py-20 bg-[#08080C] border-b border-zinc-800/80">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-black text-[#FF3B30] uppercase tracking-widest bg-red-950/60 border border-[#FF3B30]/40 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 w-fit shadow-md">
              <Camera className="w-3.5 h-3.5" /> VIPER ACTION GALLERY
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight bebas-font mt-2">
              TOURNAMENTS & DOJANG ACTION
            </h2>
          </div>

          <Button variant="outline" size="sm" asChild className="gap-2 border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl">
            <Link href="/gallery">
              View Full Gallery <ArrowRight className="w-4 h-4 text-[#FF3B30]" />
            </Link>
          </Button>
        </div>

        {/* 6 Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewItems.map((item) => (
            <Link
              key={item.id}
              href="/gallery"
              className="group relative aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-xl glass-card-hover"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                <span className="text-[10px] bg-[#FF3B30] text-black font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {item.category}
                </span>
                <h3 className="text-base font-black mt-2 leading-snug group-hover:text-[#FF3B30] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#FF3B30]" /> {item.location}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

