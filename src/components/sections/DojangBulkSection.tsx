"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export function DojangBulkSection() {
  const whatsappUrl = "https://wa.me/919958419286?text=Hi%20Viper%20Gears%2C%20I%20am%20a%20Taekwondo%20Coach%2FInstructor%20interested%20in%20bulk%20dobok%20orders%20for%20my%20Dojang.";

  return (
    <section className="ink-section border-b border-white/10 py-14 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.75fr] lg:items-end lg:gap-20">
        <div>
          <p className="mb-4 text-[10px] font-semibold tracking-[0.18em] text-accent uppercase">For coaches & academies</p>
          <h2 className="display-title max-w-3xl text-6xl leading-[0.88] text-white sm:text-8xl">Equip the whole dojang.</h2>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/65 sm:text-base">
            Bulk pricing, custom academy embroidery, and straightforward support for teams preparing for their next season.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-ink transition-colors hover:bg-accent hover:text-white">
              <MessageCircle className="h-4 w-4" /> Talk on WhatsApp
            </a>
            <Link href="/contact" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10">
              Bulk order enquiry <ArrowRight className="h-4 w-4 text-accent" />
            </Link>
          </div>
        </div>

        <div className="border-t border-white/15 pt-6 text-sm text-white/65 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="text-xs font-semibold tracking-[0.14em] text-white/45 uppercase">A simple process</p>
          <ol className="mt-5 space-y-4">
            <li className="flex gap-4"><span className="text-accent">01</span><span>Share your academy sizes and quantities.</span></li>
            <li className="flex gap-4"><span className="text-accent">02</span><span>Get a clear quote and embroidery timeline.</span></li>
            <li className="flex gap-4"><span className="text-accent">03</span><span>Receive the kit, ready for the next class.</span></li>
          </ol>
        </div>
      </div>
    </section>
  );
}
