"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Award,
  Flame,
  CheckCircle2
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-white via-slate-50 to-[#F8FAFC] py-12 lg:py-20 overflow-hidden border-b border-slate-200">
      
      {/* Decorative Background Grid Pattern */}
      <div className="absolute inset-0 hero-grid-pattern opacity-60 pointer-events-none" />

      {/* Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-black text-[#008137] shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#00C853] animate-pulse" />
              <span>WT APPROVED • KPNP OFFICIAL DOBOK INDIA EDITION</span>
            </div>

            {/* Main Title */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.05] uppercase">
                DOMINATE THE <br className="hidden sm:block" />
                <span className="text-[#00C853] drop-shadow-sm">MAT WITH PRECISION</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-slate-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed pt-2">
                Engineered for maximum speed, mobility, and championship durability. Crafted from ultra-lightweight <span className="font-bold text-slate-900">220 GSM Jacquard Ripstop fabric</span> with classic India V-Neck detailing.
              </p>
            </div>

            {/* Key Feature Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[#00C853]" />
                <span>220 GSM Ultra-Light</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[#00C853]" />
                <span>Moisture-Wicking Air Mesh</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-[#00C853]" />
                <span>India Flag Back Embroidery</span>
              </div>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-sm font-black bg-[#00C853] hover:bg-[#00b248] text-white rounded-2xl shadow-xl emerald-glow transition-all hover:scale-105 gap-2 uppercase tracking-wider"
              >
                <Link href="/shop">
                  <span>SHOP KPNP INDIA EDITION</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-14 px-8 text-sm font-bold border-slate-300 text-slate-800 hover:bg-slate-100 rounded-2xl gap-2"
              >
                <Link href="/gallery">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>VIEW ACTION GALLERY</span>
                </Link>
              </Button>
            </div>

            {/* Trust Footer Stats */}
            <div className="pt-6 border-t border-slate-200/80 flex items-center justify-center lg:justify-start gap-8 text-left">
              <div>
                <span className="text-xl font-black text-slate-900 block font-mono">100%</span>
                <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">WT Certified</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-xl font-black text-slate-900 block font-mono">24 HR</span>
                <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Delhi Dispatch</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-xl font-black text-slate-900 block font-mono">4.9 ★</span>
                <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Dojang Rating</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Product Showcase Card */}
          <div className="lg:col-span-5 relative">
            
            {/* Main Product Card Surround */}
            <div className="relative rounded-3xl bg-white border border-slate-200 p-4 sm:p-6 shadow-2xl overflow-hidden group">
              
              {/* Image Container */}
              <div className="relative h-[380px] sm:h-[440px] w-full rounded-2xl overflow-hidden bg-slate-100">
                <Image
                  src="/images/kpnp-dobok-1.jpg"
                  alt="KPNP Competition Taekwondo Dobok India Edition"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                
                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md border border-slate-200 px-3 py-1 rounded-full text-xs font-black text-slate-900 flex items-center gap-1.5 shadow-md">
                  <ShieldCheck className="w-4 h-4 text-[#00C853]" />
                  <span>KPNP OFFICIAL</span>
                </div>

                {/* Floating Bottom Info Pill */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#00C853] tracking-widest block">
                      FEATURED UNIFORM
                    </span>
                    <h3 className="text-xs font-black text-slate-900 uppercase">
                      KPNP Black V-Neck Dan Dobok
                    </h3>
                  </div>
                  <span className="text-base font-black text-[#00C853] font-mono">
                    ₹2,999
                  </span>
                </div>
              </div>

            </div>

            {/* Floating Decorative Glass Card Top Right */}
            <div className="absolute -top-6 -right-6 hidden xl:flex items-center gap-3 bg-white/90 backdrop-blur-md border border-slate-200 p-3.5 rounded-2xl shadow-xl z-20">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00C853] flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-black text-slate-900 block uppercase">Ultra Light</span>
                <span className="text-[10px] text-slate-500">220 GSM Jacquard</span>
              </div>
            </div>

            {/* Floating Decorative Glass Card Bottom Left */}
            <div className="absolute -bottom-6 -left-6 hidden xl:flex items-center gap-3 bg-white/90 backdrop-blur-md border border-slate-200 p-3.5 rounded-2xl shadow-xl z-20">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-[#00C853] flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-black text-slate-900 block uppercase">WT Approved</span>
                <span className="text-[10px] text-slate-500">India Competition</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
