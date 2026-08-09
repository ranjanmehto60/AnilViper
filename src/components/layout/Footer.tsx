"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, ShieldCheck, Truck, Instagram, Facebook, Youtube, Award, CreditCard } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#05060A] border-t border-zinc-800 text-zinc-400 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Trust Badges Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#FF3B30] shadow-md">
              <Award className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">WT Approved Quality</h4>
              <p className="text-[11px] text-zinc-400 font-semibold">World certified standards</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#FF3B30] shadow-md">
              <Truck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">100% Free Express Delivery</h4>
              <p className="text-[11px] text-zinc-400 font-semibold">Delhivery & Shiprocket pan-India</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#FF3B30] shadow-md">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">210 GSM Aeroflex Fabric</h4>
              <p className="text-[11px] text-zinc-400 font-semibold">Moisture-wicking mesh</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#FF3B30] shadow-md">
              <CreditCard className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">100% Secure Payments</h4>
              <p className="text-[11px] text-zinc-400 font-semibold">UPI, Cards, Netbanking via Razorpay</p>
            </div>
          </div>
        </div>

        {/* Main 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-zinc-800/80">
          
          {/* Column 1: Brand & Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-zinc-900 p-0.5 border border-zinc-700 overflow-hidden shrink-0 shadow-md">
                <Image
                  src="/images/viper-logo.jpg"
                  alt="Viper Gears Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <span className="text-2xl font-black text-white tracking-widest bebas-font">
                VIPER <span className="text-[#FF3B30]">GEARS</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              Viper Gears is India&apos;s premier Taekwondo uniform (Dobok) and sparring gear manufacturer. Engineered for maximum speed, mobility, and championship durability.
            </p>
            <div className="space-y-2.5 text-xs text-zinc-300 pt-2 font-medium">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
                <span>Chattarpur, New Delhi, India - 110074</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FF3B30] shrink-0" />
                <a href="tel:+919958419286" className="hover:text-[#FF3B30] transition-colors font-mono font-bold text-white">
                  +91-9958419286
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FF3B30] shrink-0" />
                <a href="mailto:contact@vipergears.in" className="hover:text-[#FF3B30] transition-colors font-bold text-white">
                  contact@vipergears.in
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider border-l-2 border-[#FF3B30] pl-2.5">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link href="/" className="hover:text-[#FF3B30] transition-colors">Home Page</Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#FF3B30] transition-colors">Shop All Products</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FF3B30] transition-colors">Our Story & Mission</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#FF3B30] transition-colors">Tournament & Dojang Gallery</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FF3B30] transition-colors">Bulk Academy Orders</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider border-l-2 border-[#FF3B30] pl-2.5">
              Uniform Series
            </h3>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link href="/shop?category=Advanced+Competition+Dobok" className="hover:text-[#FF3B30] transition-colors">
                  Viper Gears Competition Dobok
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Black+Belt+Dobok" className="hover:text-[#FF3B30] transition-colors">
                  Black Belt Elite Dobok (India Edition)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Kids+Dobok" className="hover:text-[#FF3B30] transition-colors">
                  Junior Champion Dobok (Kids)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Beginner+Dobok" className="hover:text-[#FF3B30] transition-colors">
                  Standard Dojang Training Dobok
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Belts+%26+Accessories" className="hover:text-[#FF3B30] transition-colors">
                  Sparring Guards & Belts
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Support & Social */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider border-l-2 border-[#FF3B30] pl-2.5">
              Support & Policies
            </h3>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link href="/privacy-policy" className="hover:text-[#FF3B30] transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#FF3B30] transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#FF3B30] transition-colors">Shipping & Delivery Policy</Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-[#FF3B30] transition-colors">Order & Return Policy</Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#FF3B30] transition-colors">Order Tracking & Account</Link>
              </li>
            </ul>

            <div className="pt-2">
              <h4 className="text-xs font-black text-white uppercase tracking-wider mb-2">Connect With Us</h4>
              <div className="flex gap-3">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#FF3B30] hover:border-[#FF3B30] transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#FF3B30] hover:border-[#FF3B30] transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#FF3B30] hover:border-[#FF3B30] transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium">
          <p>© 2026 Viper Gears India. All rights reserved. Chattarpur, New Delhi.</p>

          <div className="flex items-center gap-4 text-zinc-400 font-semibold">
            <span className="flex items-center gap-1.5 text-white font-bold bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
              🇮🇳 Made in India
            </span>
            <span>|</span>
            <span>Razorpay Secure Payments (UPI, Cards, Netbanking)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

