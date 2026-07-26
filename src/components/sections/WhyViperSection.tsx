"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Feather, Shield, Flag } from "lucide-react";

export function WhyViperSection() {
  const pillars = [
    {
      title: "Elite Performance Fabric",
      desc: "Crafted from lightweight, breathable, and moisture-wicking material engineered to keep you cool and dry during intense sparring and training.",
      icon: Feather,
      image: "/images/kpnp-dobok-1.jpg",
    },
    {
      title: "Ergonomic Freedom of Movement",
      desc: "Designed to provide full 180-degree freedom of movement, allowing seamless high kicks, explosive footwork, and fluid transitions.",
      icon: Shield,
      image: "/images/kpnp-dobok-2.jpg",
    },
    {
      title: "National Pride & Official Branding",
      desc: "Features an official Indian Flag patch on right sleeve, bold 'IND' lettering across back tail, and World Taekwondo emblem on chest.",
      icon: Flag,
      image: "/images/kpnp-dobok-chest.jpg",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden border-t border-slate-200">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-extrabold text-[#00C853] uppercase tracking-widest bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full shadow-sm">
            ENGINEERED FOR CHAMPIONS
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight bebas-font">
            WHY KPNP & VIPER GEARS EXCEL
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Crafted for national and international Taekwondo championships to give Indian athletes a competitive edge.
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
                className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between group hover:border-[#00C853] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="space-y-4">
                  <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <Image
                      src={pillar.image}
                      alt={pillar.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-[#00C853] border border-slate-200 shadow-md">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
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
