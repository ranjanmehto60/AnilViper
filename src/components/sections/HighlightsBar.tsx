"use client";

import React from "react";
import { ShieldCheck, Truck, RefreshCw, Users } from "lucide-react";

export function HighlightsBar() {
  const highlights = [
    {
      icon: ShieldCheck,
      title: "WT & KPNP Approved",
      desc: "Official competition fabric",
    },
    {
      icon: Truck,
      title: "Free Shipping Pan-India",
      desc: "On all orders above ₹999",
    },
    {
      icon: RefreshCw,
      title: "Easy 7-Day Returns",
      desc: "Hassle-free size exchange",
    },
    {
      icon: Users,
      title: "Trusted by 500+ Dojangs",
      desc: "Coaches & academies in India",
    },
  ];

  return (
    <section className="bg-white border-y border-slate-200 py-8 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center gap-3.5 group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#00C853] group-hover:bg-[#00C853] group-hover:text-white transition-all shrink-0 shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
