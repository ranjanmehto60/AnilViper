"use client";

import React from "react";
import { Truck, Users, Zap, Award } from "lucide-react";


export function HighlightsBar() {
  const highlights = [
    {
      icon: Award,
      title: "WT Approved Quality",
      desc: "World Taekwondo certified standards",
    },
    {
      icon: Truck,
      title: "100% Free Pan-India Delivery",
      desc: "Fast express shipping on all orders",
    },
    {
      icon: Zap,
      title: "210 GSM Aeroflex Fabric",
      desc: "Lightweight & moisture-wicking",
    },
    {
      icon: Users,
      title: "Trusted by 500+ Dojangs",
      desc: "Coaches & academies across India",
    },
  ];

  return (
    <section className="bg-[#0B0C12] border-y border-zinc-800/80 py-8 relative z-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center gap-4 group p-3 rounded-2xl transition-all duration-300 hover:bg-zinc-900/60 border border-transparent hover:border-zinc-800">
                <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-[#FF3B30]/40 flex items-center justify-center text-[#FF3B30] group-hover:bg-[#FF3B30] group-hover:text-black transition-all shrink-0 shadow-lg group-hover:shadow-[#FF3B30]/30">
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-semibold mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

