"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Truck } from "lucide-react";

export default function ReturnPolicyPage() {
  return (
    <div className="bg-[#0A0A0A] py-12 min-h-screen text-zinc-300">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <nav className="flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#FF3B30] font-semibold">Shipping & Order Policy</span>
        </nav>

        <h1 className="text-4xl font-black text-white uppercase bebas-font flex items-center gap-3">
          <Truck className="w-8 h-8 text-[#FF3B30]" /> 100% FREE SHIPPING & ORDER POLICY
        </h1>

        <div className="space-y-4 text-xs leading-relaxed border-t border-zinc-800 pt-6">
          <h2 className="text-base font-bold text-white uppercase">1. 100% Free Pan-India Delivery</h2>
          <p>
            Viper Gears provides 100% Free Express Shipping on all uniform and gear orders across India. Orders are dispatched within 24 hours from our Chattarpur, Delhi warehouse via Shiprocket & Delhivery.
          </p>

          <h2 className="text-base font-bold text-white uppercase">2. Quality Guarantee & Damaged Goods Replacement</h2>
          <p>
            Every uniform is inspected for World Taekwondo (WT) competition fabric standards before dispatch. If your order arrives damaged, defective, or incorrect, we will immediately send a free replacement.
          </p>

          <h2 className="text-base font-bold text-white uppercase">3. Customer Care & Support</h2>
          <p>
            For any delivery queries or assistance, contact our Chattarpur Delhi customer care team via WhatsApp at <a href="https://wa.me/919958419286" className="text-[#FF3B30] font-bold underline">+91-9958419286</a> or call <a href="tel:+919958419286" className="text-[#FF3B30] font-bold underline">+91-9958419286</a> with your Order ID.
          </p>
        </div>
      </div>
    </div>
  );
}
