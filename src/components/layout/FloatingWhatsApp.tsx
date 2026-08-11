"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/919958419286?text=Hi%20Viper%20Gears!%20I%20want%20to%20inquire%20about%20Taekwondo%20doboks%20and%20gear."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Viper Gears on WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 font-semibold text-ink shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#20bd5a] active:scale-95 sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="h-5 w-5 fill-ink transition-transform group-hover:rotate-12" />
      <span className="hidden text-xs font-semibold tracking-[0.08em] uppercase sm:inline-block">
        Chat on WhatsApp
      </span>
    </a>
  );
}
