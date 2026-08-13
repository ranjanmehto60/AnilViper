import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery | Viper Gears",
  description: "Explore Viper Gears taekwondo uniforms, movement, details, and training-ready equipment.",
};

export default function GalleryPage() {
  return (
    <div className="editorial-page min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl sm:mb-14">
          <p className="section-kicker mb-4">Viper Gears / Gallery</p>
          <h1 className="section-title">Built for the mat. Designed to move.</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            A closer look at the silhouettes, construction, and details behind competition-ready taekwondo gear.
          </p>
        </div>

        <GalleryGrid />
      </div>
    </div>
  );
}
