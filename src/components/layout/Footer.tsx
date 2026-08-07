"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, Instagram, Facebook, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Trust Badges Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#FF3B30]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">WT Approved Quality</h4>
              <p className="text-[11px] text-slate-400">Certified competition standards</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#FF3B30]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fast Pan-India Express</h4>
              <p className="text-[11px] text-slate-400">Shiprocket & Delhivery shipping</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#FF3B30]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Free Delivery</h4>
              <p className="text-[11px] text-slate-400">Free Pan-India Express shipping</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-[#FF3B30]">
              <span className="text-sm font-black">₹</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Secure Payments</h4>
              <p className="text-[11px] text-slate-400">UPI, Cards, Net Banking via Razorpay</p>
            </div>
          </div>
        </div>

        {/* Main 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand & Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg bg-white p-0.5 border border-slate-700 overflow-hidden shrink-0">
                <Image
                  src="/images/viper-logo.jpg"
                  alt="Viper Gears Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <span className="text-xl font-black text-white tracking-widest bebas-font">
                VIPER <span className="text-[#FF3B30]">GEARS</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Viper Gears is India&apos;s premier Taekwondo uniform (Dobok) and sparring gear manufacturer. Engineered for maximum speed, mobility, and championship durability.
            </p>
            <div className="space-y-2 text-xs text-slate-300 pt-2">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
                <span>Chattarpur, New Delhi, India - 110074</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF3B30] shrink-0" />
                <a href="tel:+919958419286" className="hover:text-[#FF3B30] transition-colors font-semibold">
                  +91-9958419286
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF3B30] shrink-0" />
                <a href="mailto:contact@vipergears.in" className="hover:text-[#FF3B30] transition-colors font-semibold">
                  contact@vipergears.in
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-[#FF3B30] pl-2.5">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs">
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
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-[#FF3B30] pl-2.5">
              Uniform Categories
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/shop?category=Advanced+Competition+Dobok" className="hover:text-[#FF3B30] transition-colors">
                  KPNP India Competition Dobok
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Black+Belt+Dobok" className="hover:text-[#FF3B30] transition-colors">
                  Black Belt Elite Dobok
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

          {/* Column 4: Customer Support & Policies */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-[#FF3B30] pl-2.5">
              Support & Policies
            </h3>
            <ul className="space-y-2.5 text-xs">
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
                <Link href="/return-policy" className="hover:text-[#FF3B30] transition-colors">Order & Shipping Policy</Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#FF3B30] transition-colors">Order Tracking & History</Link>
              </li>
            </ul>

            <div className="pt-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Connect With Us</h4>
              <div className="flex gap-3">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-[#FF3B30] hover:bg-slate-700 transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-[#FF3B30] hover:bg-slate-700 transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-[#FF3B30] hover:bg-slate-700 transition-colors">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 Viper Gears India. All rights reserved. Chattarpur, Delhi.</p>

          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <span className="flex items-center gap-1 text-red-400 font-bold">
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
