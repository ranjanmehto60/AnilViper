"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Truck } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#0A0A0A] py-12 min-h-screen text-zinc-300">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <nav className="flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#00E676] font-semibold">Shipping Policy</span>
        </nav>

        <h1 className="text-4xl font-black text-white uppercase bebas-font flex items-center gap-3">
          <Truck className="w-8 h-8 text-[#00E676]" /> PAN-INDIA SHIPPING POLICY
        </h1>

        <div className="space-y-4 text-xs leading-relaxed border-t border-zinc-800 pt-6">
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl text-emerald-300 font-bold">
            ⚡ FREE Express Shipping across India on all orders over ₹999!
          </div>

          <h2 className="text-base font-bold text-white uppercase">1. Dispatch Timelines</h2>
          <p>
            All orders are fulfilled directly from our main warehouse in Chattarpur, Delhi. Orders placed before 2:00 PM IST are processed and dispatched on the same business day.
          </p>

          <h2 className="text-base font-bold text-white uppercase">2. Delivery Timeframe (Shiprocket & Delhivery)</h2>
          <ul className="list-disc list-inside space-y-1 text-zinc-400">
            <li><strong className="text-white">Delhi NCR & North India:</strong> 1 - 2 Business Days</li>
            <li><strong className="text-white">Metros (Mumbai, Bangalore, Kolkata, Chennai, Hyderabad):</strong> 2 - 4 Business Days</li>
            <li><strong className="text-white">Rest of India & Remote Dojangs:</strong> 3 - 5 Business Days</li>
          </ul>

          <h2 className="text-base font-bold text-white uppercase">3. Cash on Delivery (COD) & Tracking</h2>
          <p>
            Cash on Delivery (COD) is available for selected pincodes in India. Tracking numbers are dispatched via SMS and WhatsApp as soon as your courier partner scans the shipment.
          </p>
        </div>
      </div>
    </div>
  );
}
