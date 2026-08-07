"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="bg-[#0A0A0A] py-12 min-h-screen text-zinc-300">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <nav className="flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#FF3B30] font-semibold">Terms of Service</span>
        </nav>

        <h1 className="text-4xl font-black text-white uppercase bebas-font">
          TERMS OF SERVICE - VIPER GEARS
        </h1>
        <p className="text-xs text-zinc-400">Effective Date: July 2026</p>

        <div className="space-y-4 text-xs leading-relaxed border-t border-zinc-800 pt-6">
          <h2 className="text-base font-bold text-white uppercase">1. General Overview</h2>
          <p>
            This website is operated by Viper Gears, registered in Chattarpur, New Delhi, India. By purchasing Taekwondo Doboks, belts, or protective gear, you agree to bound by these terms.
          </p>

          <h2 className="text-base font-bold text-white uppercase">2. Product Specifications & WT Standards</h2>
          <p>
            Viper Gears uniforms marked as &quot;WT Approved&quot; are designed according to World Taekwondo rules. Colors and sizing specifications (110cm to 200cm height) are accurate within a 1.5% manufacturing tolerance.
          </p>

          <h2 className="text-base font-bold text-white uppercase">3. Pricing & Taxes</h2>
          <p>
            All prices listed on vipergears.in are in Indian Rupees (₹) and include applicable Goods and Services Tax (GST). Prices may be modified without prior notice.
          </p>

          <h2 className="text-base font-bold text-white uppercase">4. Payments, Cash on Delivery & Cancellation</h2>
          <p>
            Prepaid orders are payable online via UPI, credit/debit card or netbanking through Razorpay. Cash on Delivery (COD) orders require a non-refundable online booking fee of ₹400 at the time of placing the order; the remaining balance is payable to the courier at the time of delivery.
          </p>
          <p>
            The ₹400 COD booking fee is non-refundable once the order is placed. The delivery balance is payable only after you receive and inspect the parcel. Refunds, if any, are processed exclusively to the original payment method.
          </p>

          <h2 className="text-base font-bold text-white uppercase">5. Governing Law</h2>
          <p>
            Any disputes arising shall be subject to the exclusive jurisdiction of the courts of New Delhi, India.
          </p>
        </div>
      </div>
    </div>
  );
}
