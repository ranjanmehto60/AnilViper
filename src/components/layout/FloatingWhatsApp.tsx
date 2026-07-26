"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/919871674886?text=Hi%20Viper%20Gears!%20I%20want%20to%20inquire%20about%20Taekwondo%20doboks%20and%20gear."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Viper Gears on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#25D366] text-black font-extrabold px-4 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group duration-300 border-2 border-white/20"
    >
      <MessageCircle className="w-6 h-6 fill-black group-hover:rotate-12 transition-transform" />
      <span className="hidden sm:inline-block text-xs font-black tracking-wider uppercase">
        Chat on WhatsApp
      </span>
      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
      </span>
    </a>
  );
}
