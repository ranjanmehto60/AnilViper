"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Flame, ChevronRight } from "lucide-react";

export function CategoriesStrip() {
  const categories = [
    {
      title: "Black Belt Competition",
      slug: "Black Belt Dobok",
      subtitle: "Official Dan-Grade Lapel",
      badge: "BESTSELLER",
      image: "/images/kpnp-dobok-1.jpg",
      href: "/shop?category=Black+Belt+Dobok"
    },
    {
      title: "Color Belt Tournament",
      slug: "Advanced Competition Dobok",
      subtitle: "WT Competition Approved",
      badge: "POPULAR",
      image: "/images/kpnp-dobok-2.jpg",
      href: "/shop?category=Advanced+Competition+Dobok"
    },
    {
      title: "Junior Cadet & Kids",
      slug: "Kids Dobok",
      subtitle: "Soft Ergonomic Lining",
      badge: "NEW",
      image: "/images/kpnp-dobok-chest.jpg",
      href: "/shop?category=Kids+Dobok"
    },
    {
      title: "Master Poomsae Series",
      slug: "Black Belt Dobok",
      subtitle: "Heavy Acoustic Snap Weave",
      badge: "PREMIUM",
      image: "/images/kpnp-dobok-1.jpg",
      href: "/shop?category=Black+Belt+Dobok"
    }
  ];

  return (
    <section className="py-16 bg-[#08080C] relative border-b border-zinc-800/80">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-black text-[#FF3B30] uppercase tracking-widest bg-red-950/60 border border-[#FF3B30]/30 px-3.5 py-1 rounded-full flex items-center gap-1.5 w-fit">
              <Flame className="w-3.5 h-3.5 fill-[#FF3B30]" /> EXPLORE COLLECTIONS
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight bebas-font mt-2">
              CHAMPIONSHIP UNIFORM SERIES
            </h2>
          </div>

          <Link
            href="/shop"
            className="text-xs font-black text-zinc-300 hover:text-[#FF3B30] uppercase tracking-wider flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4 text-[#FF3B30] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <Link
              key={index}
              href={cat.href}
              className="group relative h-80 rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-xl hover:border-[#FF3B30]/60 transition-all duration-500 flex flex-col justify-end p-6 glass-card-hover"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover object-top opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-90" />

              {/* Badge top */}
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] font-black bg-[#FF3B30] text-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {cat.badge}
                </span>
              </div>

              <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-zinc-900/80 border border-zinc-700 flex items-center justify-center text-white group-hover:bg-[#FF3B30] group-hover:text-black group-hover:border-[#FF3B30] transition-all">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </div>

              {/* Content Bottom */}
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] text-[#FF3B30] font-mono font-bold uppercase tracking-wider block">
                  {cat.subtitle}
                </span>
                <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-[#FF3B30] transition-colors leading-tight">
                  {cat.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
