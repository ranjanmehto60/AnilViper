"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, MapPin, PhoneCall, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const comparisonData = [
  ["Fabric technology", "Lightweight moisture-wicking poly-blend", "Heavy, stiff canvas"],
  ["Weight & drag", "Featherlight and responsive", "Heavy through long sessions"],
  ["National detailing", "Indian flag patch and IND back print", "Plain, generic finish"],
  ["Pre-shrunk", "Pre-washed with under 1.5% shrinkage", "Can shrink after washing"],
  ["Collar & finish", "Black V-neck Dan collar and WT emblem", "Standard construction"],
];

export default function AboutPage() {
  return (
    <div className="editorial-page min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-7xl space-y-16 px-4 sm:px-6">
        <div className="max-w-3xl"><p className="section-kicker mb-4">Born in Chattarpur, Delhi</p><h1 className="section-title max-w-2xl">Better gear makes more room for better practice.</h1><p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">Viper Gears started with a simple aim: make competition-ready Taekwondo gear feel more accessible to athletes, coaches, and dojangs across India.</p></div>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"><div className="relative aspect-[1.12] overflow-hidden rounded-2xl bg-surface-2"><Image src="/images/kpnp-dobok-1.jpg" alt="Athlete wearing Viper Gears dobok" fill className="object-cover object-top" /><div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-ink/80 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm"><MapPin className="h-3.5 w-3.5 text-accent" /> Chattarpur, New Delhi</div></div><div className="max-w-xl"><p className="section-kicker mb-4">Why we started</p><h2 className="text-3xl font-medium tracking-tight text-ink sm:text-4xl">The uniform should help you forget you&apos;re wearing one.</h2><div className="mt-5 space-y-4 text-sm leading-relaxed text-muted sm:text-base"><p>Indian practitioners often had to choose between expensive imports and uniforms that felt heavy, stiff, or short-lived. We wanted a better middle ground: thoughtful cuts, breathable fabric, and details made for the way athletes here train and compete.</p><p>Our India Edition is built with technical partners and supported directly from our Delhi team, so athletes and coaches can get useful answers before and after the sale.</p></div><div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-border bg-surface p-5"><p className="text-[10px] font-semibold tracking-[0.14em] text-accent uppercase">Our mission</p><p className="mt-3 text-sm leading-relaxed text-ink">Make reliable, competition-ready equipment easier to access.</p></div><div className="rounded-xl border border-border bg-surface p-5"><p className="text-[10px] font-semibold tracking-[0.14em] text-accent uppercase">Our promise</p><p className="mt-3 text-sm leading-relaxed text-ink">Straightforward support from first size question to final delivery.</p></div></div></div></div>

        <section><div className="mb-7 max-w-xl"><p className="section-kicker mb-3">The difference is in the details</p><h2 className="text-3xl font-medium tracking-tight text-ink sm:text-4xl">Viper Gears vs. a generic dobok.</h2><p className="mt-3 text-sm leading-relaxed text-muted">A considered comparison of the choices that affect movement, comfort, and longevity.</p></div><div className="overflow-x-auto rounded-2xl border border-border bg-surface"><table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b border-border bg-surface-2 text-xs text-muted"><tr><th className="p-5 font-semibold">Feature</th><th className="border-x border-border p-5 font-semibold text-accent">Viper Gears</th><th className="p-5 font-semibold">Generic alternative</th></tr></thead><tbody className="divide-y divide-border">{comparisonData.map(([feature, viper, normal]) => <tr key={feature} className="transition-colors hover:bg-background"><td className="p-5 font-semibold text-ink">{feature}</td><td className="border-x border-border p-5 text-ink"><span className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {viper}</span></td><td className="p-5 text-muted"><span className="flex items-start gap-2"><X className="mt-0.5 h-4 w-4 shrink-0 text-subtle" /> {normal}</span></td></tr>)}</tbody></table></div></section>

        <section className="ink-section rounded-2xl p-8 sm:p-12"><div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="mb-4 text-[10px] font-semibold tracking-[0.18em] text-accent uppercase">For your academy</p><h2 className="display-title max-w-2xl text-6xl leading-[0.88] text-white sm:text-8xl">Let&apos;s kit out your dojang.</h2><p className="mt-5 max-w-xl text-sm leading-relaxed text-white/65">Custom embroidery, academy pricing, and support for bulk orders across India.</p></div><div className="flex flex-col items-start gap-4"><Button asChild className="h-12 rounded-full bg-white px-6 text-sm text-ink hover:bg-accent hover:text-white"><Link href="/contact">Start a bulk enquiry</Link></Button><a href="tel:+919958419286" className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 hover:text-white"><PhoneCall className="h-4 w-4 text-accent" /> +91 99584 19286</a></div></div></section>
      </div>
    </div>
  );
}
