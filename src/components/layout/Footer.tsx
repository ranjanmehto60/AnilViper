import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-12 border-b border-white/15 pb-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm space-y-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="relative block h-10 w-10 overflow-hidden rounded-md bg-white">
                <Image src="/images/viper-logo.jpg" alt="Viper Gears logo" fill className="object-contain p-0.5" />
              </span>
              <span className="text-xl font-semibold tracking-[0.12em]">VIPER <span className="text-accent">GEARS</span></span>
            </Link>
            <p className="text-sm leading-relaxed text-white/65">
              Taekwondo equipment made for movement, training, and the moments that matter on the mat.
            </p>
            <div className="space-y-2 text-sm text-white/70">
              <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> Chattarpur, New Delhi, India — 110074</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-accent" /><a href="tel:+919958419286" className="hover:text-white">+91 99584 19286</a></p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0 text-accent" /><a href="mailto:contact@vipergears.in" className="hover:text-white">contact@vipergears.in</a></p>
            </div>
          </div>

          <FooterColumn
            title="Shop"
            links={[
              ["All doboks", "/shop"],
              ["Competition doboks", "/shop?category=Advanced+Competition+Dobok"],
              ["Black belt doboks", "/shop?category=Black+Belt+Dobok"],
              ["Junior doboks", "/shop?category=Kids+Dobok"],
              ["Belts & accessories", "/shop?category=Belts+%26+Accessories"],
            ]}
          />
          <FooterColumn
            title="Explore"
            links={[
              ["Our story", "/about"],
              ["Gallery", "/gallery"],
              ["Bulk academy orders", "/contact"],
              ["Account & orders", "/account"],
              ["Shopping cart", "/cart"],
            ]}
          />
          <FooterColumn
            title="Support"
            links={[
              ["Shipping policy", "/shipping-policy"],
              ["Returns", "/return-policy"],
              ["Terms", "/terms"],
              ["Privacy", "/privacy-policy"],
            ]}
          />
        </div>

        <div className="flex flex-col gap-5 pt-7 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Viper Gears India. Made for the mat.</p>
          <div className="flex items-center gap-3">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-colors hover:text-white"><Instagram className="h-4 w-4" /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="transition-colors hover:text-white"><Youtube className="h-4 w-4" /></a>
            <span className="ml-2 border-l border-white/20 pl-3">Secure payments via Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h3 className="mb-5 text-xs font-semibold tracking-[0.16em] text-white/50 uppercase">{title}</h3>
      <ul className="space-y-3 text-sm text-white/75">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="transition-colors hover:text-white">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
