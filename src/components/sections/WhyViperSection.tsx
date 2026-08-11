"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Feather, Flag, Move3d } from "lucide-react";

const pillars = [
  {
    number: "01",
    title: "Light on the body",
    description: "Breathable 210 GSM fabric keeps the uniform responsive through long training sessions and tournament days.",
    icon: Feather,
    image: "/images/kpnp-dobok-1.jpg",
  },
  {
    number: "02",
    title: "Made to move",
    description: "A considered cut and generous gusset leave room for high kicks, deep stances, and quick footwork.",
    icon: Move3d,
    image: "/images/kpnp-dobok-2.jpg",
  },
  {
    number: "03",
    title: "Proudly India",
    description: "Thoughtful flag and WT details let the uniform carry your identity without getting in the way.",
    icon: Flag,
    image: "/images/kpnp-dobok-chest.jpg",
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
              <motion.article
                key={pillar.number}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="surface-card surface-card-hover overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[1.25] overflow-hidden bg-surface-2">
                  <Image src={pillar.image} alt={pillar.title} fill className="object-cover object-top transition duration-700 hover:scale-[1.03]" />
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
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
