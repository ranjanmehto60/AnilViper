"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Flame, ArrowRight, Zap } from "lucide-react";


export function FlashDropBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 bg-gradient-to-r from-red-950/80 via-[#140608] to-[#0A0B12] border-y border-[#FF3B30]/30 relative overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#FF3B30]/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-zinc-950/90 border border-[#FF3B30]/40 rounded-3xl p-6 lg:p-10 shadow-2xl backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Info Column */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#FF3B30] text-black px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
              <Zap className="w-4 h-4 stroke-[3] fill-black" /> LIMITED BATCH DROP 2026
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight bebas-font leading-none">
              INDIA EDITION DOBOK <span className="text-[#FF3B30]">– SPECIAL CHAMPIONSHIP PRICE</span>
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl font-medium leading-relaxed">
              Official World Taekwondo certified uniform with Indian flag sleeve patch and black V-neck lapel. High demand championship allocation—grab yours before batch exhausts.
            </p>

            {/* Countdown Timer Boxes */}
            <div className="flex items-center justify-center lg:justify-start gap-3 pt-1">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 text-center min-w-[70px]">
                <span className="text-2xl font-black text-[#FF3B30] font-mono block leading-none">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-zinc-400 font-bold uppercase block mt-1">HOURS</span>
              </div>
              <span className="text-2xl font-black text-zinc-600">:</span>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 text-center min-w-[70px]">
                <span className="text-2xl font-black text-[#FF3B30] font-mono block leading-none">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-zinc-400 font-bold uppercase block mt-1">MINUTES</span>
              </div>
              <span className="text-2xl font-black text-zinc-600">:</span>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 text-center min-w-[70px]">
                <span className="text-2xl font-black text-[#FF3B30] font-mono block leading-none">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-zinc-400 font-bold uppercase block mt-1">SECONDS</span>
              </div>
            </div>

            {/* Stock Progress Bar */}
            <div className="max-w-md mx-auto lg:mx-0 space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1 text-[#FF3B30]">
                  <Flame className="w-3.5 h-3.5 fill-[#FF3B30]" /> 84% BATCH SOLD OUT
                </span>
                <span className="text-zinc-400">ONLY 16 LEFT IN STOCK</span>
              </div>
              <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden border border-zinc-700">
                <div className="bg-[#FF3B30] h-full w-[84%] rounded-full shadow-md animate-pulse" />
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-3">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto h-13 px-8 text-sm gap-2 bg-[#FF3B30] hover:bg-[#D92D20] text-black font-black uppercase tracking-wider rounded-xl shadow-xl neon-crimson-glow"
              >
                <Link href="/product/kpnp-competition-taekwondo-dobok-india-edition">
                  CLAIM YOUR DOBOK NOW (₹2,999) <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Visual Image */}
          <div className="lg:col-span-5 relative aspect-square max-w-sm mx-auto lg:max-w-none rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
            <Image
              src="/images/kpnp-dobok-chest.jpg"
              alt="Viper Gears India Edition Chest Detail"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 right-4 p-3 bg-zinc-950/90 border border-zinc-800 rounded-xl backdrop-blur-md text-xs text-white font-bold flex items-center justify-between">
              <span>🇮🇳 Official WT Chest Emblem & Flag</span>
              <span className="text-[#FF3B30] font-mono">SAVE ₹1,000</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
