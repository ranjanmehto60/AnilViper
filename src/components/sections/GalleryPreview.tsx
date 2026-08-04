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
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-extrabold text-[#FF3B30] uppercase tracking-widest bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 w-fit shadow-sm">
              <Camera className="w-3.5 h-3.5" /> VIPER ACTION GALLERY
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight bebas-font mt-2">
              TOURNAMENTS & DOJANG ACTION
            </h2>
          </div>

          <Button variant="outline" size="sm" asChild className="gap-2 border-slate-300 text-slate-700 hover:text-slate-900">
            <Link href="/gallery">
              View Full Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* 6 Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewItems.map((item) => (
            <Link key={item.id} href="/gallery" className="group relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-md">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] bg-[#FF3B30] text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  {item.category}
                </span>
                <h3 className="text-sm font-bold mt-1.5 leading-snug group-hover:text-[#FF3B30] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#FF3B30]" /> {item.location}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
