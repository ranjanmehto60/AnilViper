"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#0A0A0A] py-12 min-h-screen text-zinc-300">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        <nav className="flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#FF3B30] font-semibold">Privacy Policy</span>
        </nav>

        <h1 className="text-4xl font-black text-white uppercase bebas-font">
          PRIVACY POLICY - VIPER GEARS INDIA
        </h1>
        <p className="text-xs text-zinc-400">Last updated: July 2026</p>

        <div className="space-y-4 text-xs leading-relaxed border-t border-zinc-800 pt-6">
          <h2 className="text-base font-bold text-white uppercase">1. Information We Collect</h2>
          <p>
            Viper Gears (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;), headquartered in Chattarpur, New Delhi, India, collects essential personal information required to process your Taekwondo uniform and sparring gear orders. This includes your name, shipping address, mobile phone number for order updates, and email address.
          </p>

          <h2 className="text-base font-bold text-white uppercase">2. Payment Security</h2>
          <p>
            All online transactions on Viper Gears are securely processed via Razorpay. We do not store your credit card numbers, debit card PINs, or UPI passwords on our servers. All transactions use 256-bit SSL encryption.
          </p>

          <h2 className="text-base font-bold text-white uppercase">3. Shipping Data Sharing</h2>
          <p>
            Your delivery address and phone number are shared solely with our authorized Pan-India logistics partners (Shiprocket and Delhivery) to facilitate package delivery.
          </p>

          <h2 className="text-base font-bold text-white uppercase">4. Contact Us</h2>
          <p>
            For privacy inquiries or data requests, contact our Chattarpur Delhi office at +91-9871674886 or email contact@vipergears.in.
          </p>
        </div>
      </div>
    </div>
  );
}
