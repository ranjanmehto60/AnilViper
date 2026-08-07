"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";
import { ShieldCheck, ArrowRight, Ruler, Sparkles } from "lucide-react";

export function HeroSection() {
  const [sizeModalOpen, setSizeModalOpen] = React.useState(false);

  return (
    <>
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-b from-white via-slate-50 to-red-50/30 py-12 lg:py-20 border-b border-slate-200/80">
        {/* Background Ambient Elements */}
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-red-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-1.5 rounded-full text-xs font-extrabold text-[#FF3B30] shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#FF3B30]" />
                <span>OFFICIAL WT APPROVED TAEKWONDO UNIFORMS</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 uppercase leading-[0.95] bebas-font">
                ELEVATE YOUR PERFORMANCE WITH <br />
                <span className="text-[#FF3B30]">VIPER GEARS INDIA EDITION</span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-700 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Elevate your martial arts performance with the Viper Gears Official Taekwondo Uniform (Dobok). Designed for maximum agility, comfort, and durability with a classic black V-neck collar and bold Indian flag detailing.
              </p>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-4 pt-2 max-w-lg mx-auto lg:mx-0 text-left">
                <div className="border-l-3 border-[#FF3B30] pl-3.5">
                  <span className="text-xl font-black text-slate-900 block leading-none">210 GSM</span>
                  <span className="text-[11px] text-slate-500 font-semibold">Moisture-Wicking</span>
                </div>
                <div className="border-l-3 border-[#FF3B30] pl-3.5">
                  <span className="text-xl font-black text-slate-900 block leading-none">INDIA FLAG</span>
                  <span className="text-[11px] text-slate-500 font-semibold">National Pride Patch</span>
                </div>
                <div className="border-l-3 border-[#FF3B30] pl-3.5">
                  <span className="text-xl font-black text-slate-900 block leading-none">100% WT</span>
                  <span className="text-[11px] text-slate-500 font-semibold">World Certified</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Button
                  variant="default"
                  size="lg"
                  asChild
                  className="w-full sm:w-auto text-sm gap-2 bg-[#FF3B30] hover:bg-[#D92D20] text-white font-extrabold shadow-lg shadow-red-500/20"
                >
                  <Link href="/product/kpnp-competition-taekwondo-dobok-india-edition">
                    Buy Viper Gears India Edition <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setSizeModalOpen(true)}
                  className="w-full sm:w-auto text-sm gap-2 border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  <Ruler className="w-4 h-4 text-[#FF3B30]" /> Height Sizing Guide
                </Button>
              </div>
            </motion.div>

            {/* Right Hero Visual Column - Featuring uploaded KPNP athlete photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-white group">
                <Image
                  src="/images/kpnp-dobok-1.jpg"
                  alt="Viper Gears Competition Taekwondo Dobok - India Edition"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Overlay Card */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl glass-card bg-white/95 border border-slate-200/80 shadow-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#FF3B30] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-4 h-4" /> Viper Gears Official
                    </span>
                    <span className="text-[10px] bg-[#E53935] text-white font-extrabold px-2.5 py-0.5 rounded-full">
                      India Edition
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Viper Gears Black V-Neck Dobok</h3>
                  <p className="text-[11px] text-slate-500">Official Indian Flag Patch & WT emblem certified</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <SizeGuideModal open={sizeModalOpen} onOpenChange={setSizeModalOpen} />
    </>
  );
}
