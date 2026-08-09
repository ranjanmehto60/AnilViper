"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Feather, Shield, Flag, Sparkles } from "lucide-react";


export function WhyViperSection() {
  const pillars = [
    {
      title: "210 GSM Aeroflex Fabric",
      desc: "Crafted from ultra-lightweight, breathable, and moisture-wicking micro-mesh fabric engineered to keep you cool, dry, and agile during intense sparring.",
      icon: Feather,
      image: "/images/kpnp-dobok-1.jpg",
      highlight: "Lightweight Weave"
    },
    {
      title: "180° Kicking Ergonomics",
      desc: "Designed with an explosive zero-resistance crotch gusset to provide complete 180-degree freedom of movement for high kicks and fluid footwork.",
      icon: Shield,
      image: "/images/kpnp-dobok-2.jpg",
      highlight: "Full Mobility"
    },
    {
      title: "National Pride & WT Branding",
      desc: "Features an official Indian Flag patch on right sleeve, bold 'IND' lettering across back tail, and World Taekwondo emblem certified for competition.",
      icon: Flag,
      image: "/images/kpnp-dobok-chest.jpg",
      highlight: "India Edition"
    },
  ];

  return (
    <section className="py-20 bg-[#08080C] relative overflow-hidden border-b border-zinc-800/80">
      
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#FF3B30]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black text-[#FF3B30] uppercase tracking-widest bg-red-950/60 border border-[#FF3B30]/40 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-md">
            <Sparkles className="w-4 h-4 text-[#FF3B30]" /> ENGINEERED FOR CHAMPIONS
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight bebas-font">
            WHY VIPER GEARS EXCELS
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium">
            Designed for national and international Taekwondo championships to give Indian athletes an unmatched competitive advantage.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-zinc-950/90 rounded-3xl border border-zinc-800 p-6 flex flex-col justify-between group hover:border-[#FF3B30]/60 transition-all duration-500 shadow-xl glass-card-hover"
              >
                <div className="space-y-5">
                  <div className="relative h-64 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                    <Image
                      src={pillar.image}
                      alt={pillar.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-zinc-950/90 backdrop-blur-md flex items-center justify-center text-[#FF3B30] border border-zinc-700 shadow-md">
                      <Icon className="w-5 h-5 stroke-[2.2]" />
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-black bg-[#FF3B30] text-black px-2.5 py-0.5 rounded-full uppercase">
                        {pillar.highlight}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-white uppercase tracking-wide group-hover:text-[#FF3B30] transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

