"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, RefreshCw } from "lucide-react";

export default function ReturnPolicyPage() {
  return (
    <div className="bg-[#0A0A0A] py-12 min-h-screen text-zinc-300">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <nav className="flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#00E676] font-semibold">Return & Refund Policy</span>
        </nav>

        <h1 className="text-4xl font-black text-white uppercase bebas-font flex items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#00E676]" /> 7-DAY RETURN & EXCHANGE POLICY
        </h1>

        <div className="space-y-4 text-xs leading-relaxed border-t border-zinc-800 pt-6">
          <h2 className="text-base font-bold text-white uppercase">1. 7-Day Easy Size Exchange Guarantee</h2>
          <p>
            We understand that getting the right Dobok height fit is crucial for Taekwondo athletes. If your uniform size is too small or too large, you can request a size exchange within 7 days of delivery.
          </p>

          <h2 className="text-base font-bold text-white uppercase">2. Return Conditions</h2>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li>The Dobok / Sparring gear must be unwashed, unworn, and unsoiled.</li>
            <li>Original tags and Viper Gears brand packaging must be intact.</li>
            <li>Custom embroidery orders are non-refundable unless a manufacturing defect exists.</li>
          </ul>

          <h2 className="text-base font-bold text-white uppercase">3. How to Initiate a Return</h2>
          <p>
            Simply WhatsApp our Chattarpur Delhi customer care team at <a href="https://wa.me/919871674886" className="text-[#00E676] font-bold underline">+91-9871674886</a> with your Order ID and photo of the item. We will arrange reverse pick-up from your doorstep.
          </p>
        </div>
      </div>
    </div>
  );
}
