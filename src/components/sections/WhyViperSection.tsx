"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, Feather, Flag, Move3d } from "lucide-react";

const pillars = [
  {
    number: "01",
    title: "Light on the body",
    description: "Breathable 210 GSM fabric keeps the uniform responsive through long training sessions and tournament days.",
    icon: Feather,
    image: "/images/gallery/gallery-04.webp",
  },
  {
    number: "02",
    title: "Made to move",
    description: "A considered cut and generous gusset leave room for high kicks, deep stances, and quick footwork.",
    icon: Move3d,
    image: "/images/gallery/gallery-05.webp",
  },
  {
    number: "03",
    title: "Proudly India",
    description: "Thoughtful flag and WT details let the uniform carry your identity without getting in the way.",
    icon: Flag,
    image: "/images/gallery/gallery-08.webp",
  },
];

export function WhyViperSection() {
  return (
    <section className="border-b border-border bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 max-w-xl">
          <p className="section-kicker mb-3">The details matter</p>
          <h2 className="section-title">Performance, without the noise.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <article
                key={pillar.number}
                className="animate-float-in surface-card surface-card-hover overflow-hidden rounded-2xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-[1.08] overflow-hidden bg-surface-2">
                  <Image src={pillar.image} alt={pillar.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="animate-image-pan object-cover object-center transition duration-700 hover:scale-[1.03]" />
                  <span className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-semibold text-ink shadow-sm">{pillar.number}</span>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-medium tracking-tight text-ink">{pillar.title}</h3>
                    <Icon className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.6} />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{pillar.description}</p>
                  <span className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-ink">Explore the details <ArrowUpRight className="h-3.5 w-3.5 text-accent" /></span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
