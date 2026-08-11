import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PolicyLayout({ title, label, meta, children }: { title: string; label: string; meta?: string; children: React.ReactNode }) {
  return (
    <div className="editorial-page min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-7 px-4 sm:px-6">
        <nav className="flex items-center gap-2 text-xs text-muted"><Link href="/" className="hover:text-ink">Home</Link><ChevronRight className="h-3 w-3" /><span className="font-semibold text-ink">{label}</span></nav>
        <div className="border-b border-border pb-7"><p className="section-kicker mb-3">Viper Gears information</p><h1 className="text-4xl font-medium tracking-tight text-ink sm:text-5xl">{title}</h1>{meta && <p className="mt-3 text-xs text-muted">{meta}</p>}</div>
        <div className="space-y-6 text-sm leading-relaxed text-muted">{children}</div>
      </div>
    </div>
  );
}

export function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-2"><h2 className="text-lg font-medium tracking-tight text-ink">{title}</h2><div>{children}</div></section>;
}
