"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";
import { ShieldCheck, ArrowRight, Ruler, Trophy, Flame } from "lucide-react";

export function HeroSection() {
  const [sizeModalOpen, setSizeModalOpen] = useState(false);


  return (
    <>
      <section className="relative min-h-[75vh] lg:min-h-[82vh] flex items-center justify-center overflow-hidden bg-[#08080C] py-16 lg:py-24 border-b border-zinc-800/80 carbon-grid">
        
        {/* Ambient Dark Atmospheric Glow Spheres */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF3B30]/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/4 right-10 w-[350px] h-[350px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Championship Badge */}
            <div className="inline-flex items-center gap-2.5 bg-red-950/80 border border-[#FF3B30]/40 px-5 py-2 rounded-full text-xs sm:text-sm font-black text-[#FF3B30] shadow-xl backdrop-blur-md">
              <Trophy className="w-4 h-4 text-[#FF3B30] fill-[#FF3B30]" />
              <span className="tracking-widest uppercase">OFFICIAL WT APPROVED TAEKWONDO UNIFORMS 🇮🇳</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3 max-w-4xl mx-auto">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight text-white uppercase leading-[0.9] bebas-font">
                STRIKE WITH <br className="hidden sm:inline" />
                <span className="crimson-gradient-text">PRECISION & POWER</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-zinc-300 max-w-2xl mx-auto font-medium leading-relaxed pt-2">
                Engineered specifically for Indian Taekwondo champions. Lightweight 210 GSM moisture-wicking fabric, 180° kick freedom, and official Indian Flag detailing certified for World Taekwondo tournaments.
              </p>
            </div>

            {/* Specs Badges Grid - 4 Columns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl mx-auto text-left">
              <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-2xl backdrop-blur-md hover:border-[#FF3B30]/50 transition-colors shadow-lg">
                <div className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-1">
                  210 <span className="text-xs text-[#FF3B30]">GSM</span>
                </div>
                <span className="text-[11px] text-zinc-400 font-bold block mt-0.5">Aeroflex Moisture Weave</span>
              </div>

              <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-2xl backdrop-blur-md hover:border-[#FF3B30]/50 transition-colors shadow-lg">
                <div className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-1">
                  180° <span className="text-xs text-[#FF3B30]">SPAN</span>
                </div>
                <span className="text-[11px] text-zinc-400 font-bold block mt-0.5">Zero-Drag Crotch Gusset</span>
              </div>

              <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-2xl backdrop-blur-md hover:border-[#FF3B30]/50 transition-colors shadow-lg">
                <div className="text-xl sm:text-2xl font-black text-[#FF3B30] font-mono flex items-center gap-1">
                  🇮🇳 INDIA
                </div>
                <span className="text-[11px] text-zinc-400 font-bold block mt-0.5">Sleeve Flag &amp; Back &quot;IND&quot;</span>
              </div>

              <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-2xl backdrop-blur-md hover:border-[#FF3B30]/50 transition-colors shadow-lg">
                <div className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-1">
                  100% <span className="text-xs text-[#FF3B30]">WT</span>
                </div>
                <span className="text-[11px] text-zinc-400 font-bold block mt-0.5">World Certified Standard</span>
              </div>
            </div>

            {/* CTAs Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 max-w-xl mx-auto">
              <Button
                variant="default"
                size="lg"
                asChild
                className="w-full sm:w-auto h-14 px-8 text-sm gap-3 bg-[#FF3B30] hover:bg-[#D92D20] text-black font-black uppercase tracking-wider rounded-2xl shadow-2xl neon-crimson-glow group"
              >
                <Link href="/product/kpnp-competition-taekwondo-dobok-india-edition">
                  <span>BUY VIPER GEARS INDIA EDITION</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => setSizeModalOpen(true)}
                className="w-full sm:w-auto h-14 px-6 text-sm gap-2.5 border-zinc-700 bg-zinc-900/90 text-zinc-200 hover:bg-zinc-800 hover:text-white rounded-2xl backdrop-blur-md"
              >
                <Ruler className="w-4 h-4 text-[#FF3B30]" /> Height Sizing Guide
              </Button>
            </div>

            {/* Social Proof & Trust Line */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-3 text-xs text-zinc-400 font-semibold border-t border-zinc-800/80 max-w-xl mx-auto">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FF3B30]" />
                <span>WT Approved Competition Standard</span>
              </div>
              <span className="hidden sm:inline text-zinc-700">•</span>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#FF3B30] fill-[#FF3B30]" />
                <span>Trusted by <strong className="text-white">500+ Indian Dojangs</strong></span>
              </div>
            </div>

          </motion.div>

        </div>
      </section>

      <SizeGuideModal open={sizeModalOpen} onOpenChange={setSizeModalOpen} />
    </>
  );
}


