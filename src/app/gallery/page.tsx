"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GALLERY_ITEMS, GalleryItem } from "@/data/gallery";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Camera, MapPin } from "lucide-react";

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const categories = ["All", "Tournaments", "Dojangs", "Behind The Scenes"];

  const filteredItems = selectedCategory === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <div className="bg-[#F8FAFC] py-12 min-h-screen text-slate-900">
      <div className="container mx-auto px-4 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-[#00C853] uppercase tracking-widest bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm">
            <Camera className="w-3.5 h-3.5" /> ACTION PHOTO SHOWCASE
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 uppercase tracking-tight bebas-font">
            VIPER GEARS IN ACTION
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Explore state championships, academy sparring sessions, and our Chattarpur Delhi manufacturing workshop.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#00C853] text-white shadow-md shadow-emerald-500/20"
                    : "bg-white text-slate-600 border border-slate-200 hover:text-slate-900 shadow-sm"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200 bg-white cursor-pointer shadow-md"
            >
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] bg-[#00C853] text-white font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  {item.category}
                </span>
                <h3 className="text-sm font-bold mt-1.5 group-hover:text-[#00E676] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#00E676]" /> {item.location}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Dialog */}
        <Dialog open={!!lightboxItem} onOpenChange={() => setLightboxItem(null)}>
          <DialogContent className="max-w-4xl bg-white border-slate-200 p-0 overflow-hidden text-slate-900 shadow-2xl">
            {lightboxItem && (
              <div className="space-y-0">
                <div className="relative aspect-video w-full bg-slate-900">
                  <Image
                    src={lightboxItem.imageUrl}
                    alt={lightboxItem.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="p-6 bg-white border-t border-slate-200 space-y-1">
                  <span className="text-xs font-extrabold text-[#00C853] uppercase">
                    {lightboxItem.category}
                  </span>
                  <h3 className="text-lg font-black text-slate-900">{lightboxItem.title}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00C853]" /> {lightboxItem.location}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
