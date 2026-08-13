"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { GALLERY_ITEMS, type GalleryCategory, type GalleryItem } from "@/data/gallery";

const FILTERS: Array<"All" | GalleryCategory> = ["All", "Lookbook", "Details", "Belts"];

export function GalleryGrid() {
  const [activeFilter, setActiveFilter] = useState<"All" | GalleryCategory>("All");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (!selectedImage) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedImage(null);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  const visibleImages = activeFilter === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((image) => image.category === activeFilter);

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2 border-y border-border py-4">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
              activeFilter === filter
                ? "border-ink bg-ink text-white"
                : "border-border-strong bg-surface text-muted hover:border-ink hover:text-ink"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
        {visibleImages.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setSelectedImage(image)}
            className="group text-left"
            aria-label={`Open ${image.title}`}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-2">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index < 3}
                sizes="(min-width: 768px) 33vw, 50vw"
                className="object-cover transition duration-700 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent p-4 pt-14 sm:p-5 sm:pt-16">
                <p className="text-[10px] font-semibold tracking-[0.14em] text-white/65 uppercase">{image.category}</p>
                <p className="mt-1 text-sm font-semibold text-white sm:text-base">{image.title}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.title}
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 p-3 text-white transition-colors hover:bg-white/20 sm:right-7 sm:top-7"
            aria-label="Close image"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative h-[82vh] w-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-5 left-0 right-0 text-center sm:bottom-7">
            <p className="text-xs font-semibold tracking-[0.14em] text-white/55 uppercase">{selectedImage.category}</p>
            <p className="mt-1 text-base font-semibold text-white">{selectedImage.title}</p>
          </div>
        </div>
      )}
    </>
  );
}
