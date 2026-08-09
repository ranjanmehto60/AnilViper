"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Phone, MessageSquare, CheckCircle2, ArrowRight } from "lucide-react";


export function DojangBulkSection() {
  const whatsappUrl = "https://wa.me/919958419286?text=Hi%20Viper%20Gears%2C%20I%20am%20a%20Taekwondo%20Coach%2FInstructor%20interested%20in%20bulk%20dobok%20orders%20for%20my%20Dojang.";

  return (
    <section className="py-20 bg-[#07080D] border-b border-zinc-800/80 relative overflow-hidden">
      
      {/* Background Subtle Accent Light */}
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#FF3B30]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-[#0F101A] border border-zinc-800 rounded-3xl p-8 lg:p-12 shadow-2xl glass-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="text-xs font-black text-[#FF3B30] uppercase tracking-widest bg-red-950/60 border border-[#FF3B30]/40 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-md">
              <Users className="w-4 h-4 text-[#FF3B30]" /> FOR INSTRUCTORS & ACADEMY OWNERS
            </span>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight bebas-font leading-none">
              DOJANG BULK ORDERS & <br />
              <span className="text-[#FF3B30]">CUSTOM CLUB EMBROIDERIES</span>
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl font-medium leading-relaxed">
              Equip your Taekwondo academy, state team, or club with official WT Approved competition uniforms. Custom academy logos, master discounts, and express pan-India bulk shipping available.
            </p>

            {/* Checklist Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-zinc-300 font-bold max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2 bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-[#FF3B30] shrink-0" />
                <span>Special Wholesale Prices for Coaches</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-[#FF3B30] shrink-0" />
                <span>Custom Dojang Back Embroidery</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-[#FF3B30] shrink-0" />
                <span>Sizes 110 cm to 200 cm Available</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-[#FF3B30] shrink-0" />
                <span>GST Tax Invoice & Fast Dispatch</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto h-13 px-8 text-xs font-black uppercase tracking-wider bg-[#25D366] hover:bg-[#20bd5a] text-black rounded-xl shadow-lg gap-2"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="w-4 h-4 fill-black stroke-[2.5]" /> WhatsApp Wholesale Inquiry
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-13 px-6 text-xs font-black uppercase tracking-wider border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white rounded-xl gap-2"
              >
                <Link href="/contact">
                  <span>Contact Bulk Sales</span>
                  <ArrowRight className="w-4 h-4 text-[#FF3B30]" />
                </Link>
              </Button>
            </div>

          </div>

          {/* Right Card / Contact Highlight */}
          <div className="lg:col-span-5 bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <div className="w-12 h-12 rounded-xl bg-red-950 border border-[#FF3B30]/40 flex items-center justify-center text-[#FF3B30] shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 font-extrabold uppercase block">Direct Bulk Hotline</span>
                <a href="tel:+919958419286" className="text-lg font-black text-white font-mono hover:text-[#FF3B30] transition-colors">
                  +91-9958419286
                </a>
              </div>
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Min. Bulk Order:</span>
                <span className="font-bold text-white">5 Uniform Sets</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span className="text-zinc-400">Embroidery Turnaround:</span>
                <span className="font-bold text-white">3-5 Business Days</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Shipping Partner:</span>
                <span className="font-bold text-white">Delhivery / Shiprocket Express</span>
              </div>
            </div>

            <div className="p-3 bg-red-950/40 border border-[#FF3B30]/30 rounded-xl text-[11px] text-zinc-300 text-center font-semibold">
              🏆 Certified Official Equipment Partner for 500+ Taekwondo Academies in India
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
