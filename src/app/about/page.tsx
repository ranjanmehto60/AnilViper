"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Check, X, Award, PhoneCall } from "lucide-react";

export default function AboutPage() {
  const comparisonData = [
    {
      feature: "Fabric Technology",
      viper: "Lightweight Moisture-Wicking KPNP Poly-Blend",
      normal: "Heavy 300+ GSM Stiff Canvas",
    },
    {
      feature: "Weight & Drag",
      viper: "Featherlight (~450g total weight)",
      normal: "Heavy & draggy (~850g total weight)",
    },
    {
      feature: "National Detailing",
      viper: "Official Indian Flag Patch & 'IND' Back Print",
      normal: "Plain local blank import",
    },
    {
      feature: "Pre-Shrunk Shrinkage",
      viper: "Under 1.5% (Pre-washed)",
      normal: "Shrinks 5-8% after 2 washes",
    },
    {
      feature: "Stitching & Collar",
      viper: "Black V-Neck Dan Collar + WT Emblem",
      normal: "Standard 4-row single lock stitch",
    },
  ];

  return (
    <div className="bg-[#F8FAFC] py-12 lg:py-20 space-y-16 text-slate-900">
      <div className="container mx-auto px-4">
        
        {/* Header Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-extrabold text-[#FF3B30] uppercase tracking-widest bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1 shadow-sm">
            <Award className="w-3.5 h-3.5" /> BORN IN CHATTARPUR, DELHI
          </span>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 uppercase tracking-tight bebas-font">
            THE VIPER GEARS STORY
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            We started with a simple mission: To empower every Taekwondo student, coach, and dojang across India with world-class, ultra-light competition armor made right here in India.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-12">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl">
            <Image
              src="/images/kpnp-dobok-1.jpg"
              alt="Viper Gears Chattarpur Delhi Workshop & KPNP Athlete"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-xs font-bold text-[#FF3B30] flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Head Office & Warehouse: Chattarpur, Delhi
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
              Solving India&apos;s Taekwondo Gear Crisis
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              For years, Indian Taekwondo athletes had to choose between paying exorbitant prices for imported foreign brands or wearing heavy, stiff, non-breathable local uniforms that shrink after two washes and tear during competition kicks.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              In 2024, our founders—national level Taekwondo masters based in Chattarpur, Delhi—partnered with world-leading technical manufacturers to bring official **KPNP Competition Taekwondo Doboks (India Edition)** to Indian practitioners.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="text-xl font-black text-[#FF3B30] bebas-font">OUR MISSION</h4>
                <p className="text-[11px] text-slate-500 font-medium">Make WT & KPNP Approved quality accessible to every young practitioner in India.</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="text-xl font-black text-[#FF3B30] bebas-font">OUR PROMISE</h4>
                <p className="text-[11px] text-slate-500 font-medium">7-day easy exchanges & direct factory support via WhatsApp.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="mt-20 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-tight bebas-font">
              VIPER GEARS VS NORMAL DOBOK
            </h2>
            <p className="text-xs text-slate-500">
              See why over 500 Dojangs and championship coaches recommend Viper & KPNP uniforms.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider border-b border-slate-200 text-xs">
                <tr>
                  <th className="p-4 font-extrabold text-slate-500">Feature</th>
                  <th className="p-4 font-black text-[#FF6B61] bg-red-50 border-x border-red-100">
                    🐍 KPNP / Viper Gears Dobok
                  </th>
                  <th className="p-4 font-extrabold text-slate-400">Normal / Generic Dobok</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{row.feature}</td>
                    <td className="p-4 font-extrabold text-slate-900 bg-red-50/50 border-x border-red-100 flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#FF3B30] shrink-0" />
                      <span>{row.viper}</span>
                    </td>
                    <td className="p-4 text-slate-400 flex items-center gap-2">
                      <X className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{row.normal}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Contact Banner */}
        <div className="mt-20 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight bebas-font">
            WANT TO PARTNER YOUR DOJANG / ACADEMY WITH VIPER?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            We provide custom logo embroidery, academy discount pricing, and wholesale shipments for Taekwondo clubs across India.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="default" size="lg" asChild className="text-xs font-black bg-[#FF3B30] hover:bg-[#D92D20] text-white shadow-lg">
              <Link href="/contact">Inquire Bulk Dojang Pricing</Link>
            </Button>
            <a
              href="tel:+919871674886"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#FF3B30] hover:underline"
            >
              <PhoneCall className="w-4 h-4" /> Call +91-9871674886
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
