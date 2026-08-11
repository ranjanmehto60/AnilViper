"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Product } from "@/types/product";
import {
  ArrowUpRight,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/useHydrated";

const navLinks = [
  { name: "Shop doboks", href: "/shop" },
  { name: "Our story", href: "/about" },
  { name: "Bulk orders", href: "/contact" },
];

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const hydrated = useHydrated();

  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.products)) setProducts(data.products);
      })
      .catch(() => {});

    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      <div className="bg-ink px-4 py-2 text-center text-[10px] font-semibold tracking-[0.14em] text-white/75 uppercase">
        Made in India <span className="mx-2 text-accent">/</span> WT-approved competition gear <span className="mx-2 text-accent">/</span> Pan-India delivery
      </div>

      <header
        className={`sticky top-0 z-40 w-full border-b transition-all duration-300 ${
          scrolled
            ? "border-border bg-background/95 py-3 shadow-sm backdrop-blur-xl"
            : "border-border/70 bg-background/90 py-4 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[min(88vw,360px)] bg-surface p-6 text-foreground">
                <SheetHeader className="border-b border-border pb-5 text-left">
                  <SheetTitle className="flex items-center gap-3 text-foreground">
                    <BrandMark compact />
                    <span className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">Navigation</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col py-6">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between border-b border-border py-4 text-lg font-medium"
                  >
                    Home <ArrowUpRight className="h-4 w-4 text-accent" />
                  </Link>
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between border-b border-border py-4 text-lg font-medium"
                    >
                      {link.name} <ArrowUpRight className="h-4 w-4 text-accent" />
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto border-t border-border pt-5">
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-semibold text-muted"
                  >
                    <User className="h-4 w-4" /> Account & orders
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Link href="/" className="shrink-0" aria-label="Viper Gears home">
            <BrandMark />
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[11px] font-semibold tracking-[0.12em] text-muted uppercase transition-colors hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setIsSearchOpen((open) => !open)}
              className="rounded-full p-2.5 text-foreground transition-colors hover:bg-surface-2"
              aria-label="Search products"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <Link
              href="/account?tab=wishlist"
              className="relative hidden rounded-full p-2.5 text-foreground transition-colors hover:bg-surface-2 sm:flex"
              aria-label="Wishlist"
            >
              <Heart className="h-[18px] w-[18px]" />
              {hydrated && wishlistCount > 0 && <CountBubble count={wishlistCount} />}
            </Link>
            <Link
              href="/account"
              className="hidden rounded-full p-2.5 text-foreground transition-colors hover:bg-surface-2 sm:flex"
              aria-label="Account"
            >
              <User className="h-[18px] w-[18px]" />
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative ml-1 flex items-center gap-2 rounded-full bg-ink px-3.5 py-2.5 text-white transition-colors hover:bg-accent"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-[17px] w-[17px]" />
              <span className="hidden text-[11px] font-semibold tracking-[0.1em] uppercase sm:inline">Bag</span>
              {hydrated && cartItemCount > 0 && <CountBubble count={cartItemCount} inverted />}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="border-t border-border bg-surface px-4 py-4 shadow-md">
            <div className="relative mx-auto max-w-xl">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-subtle" />
              <input
                type="text"
                placeholder="Search doboks, belts, sparring gear..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-11 w-full rounded-lg border border-border bg-background px-11 pr-11 text-sm text-foreground outline-none transition-colors placeholder:text-subtle focus:border-accent"
                autoFocus
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="absolute right-3 top-3 rounded-full p-0.5 text-muted hover:text-foreground"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>

              {searchQuery.trim() && (
                <div className="surface-card absolute left-0 right-0 top-14 z-50 max-h-80 overflow-y-auto rounded-lg p-2 shadow-lg">
                  {filteredProducts.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted">No products found.</div>
                  ) : (
                    filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-surface-2"
                      >
                        <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md bg-surface-2">
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover object-top" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="line-clamp-1 text-sm font-medium text-foreground">{product.name}</h4>
                          <span className="text-xs font-semibold text-accent">₹{product.price.toLocaleString("en-IN")}</span>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-subtle" />
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
      <span className={`relative block shrink-0 overflow-hidden rounded-md bg-white ${compact ? "h-9 w-9" : "h-10 w-10"}`}>
                <Image src="/images/viper-logo.jpg" alt="Viper Gears logo" fill className="object-contain p-0.5" />
      </span>
      <span className="leading-none">
        <span className={`block font-semibold tracking-[0.12em] text-foreground ${compact ? "text-lg" : "text-xl sm:text-2xl"}`}>
          VIPER <span className="text-accent">GEARS</span>
        </span>
        {!compact && <span className="mt-1 block text-[9px] font-semibold tracking-[0.18em] text-muted uppercase">Taekwondo equipment</span>}
      </span>
    </span>
  );
}

function CountBubble({ count, inverted = false }: { count: number; inverted?: boolean }) {
  return (
    <span className={`absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold ${inverted ? "bg-accent text-white" : "bg-accent text-white"}`}>
      {count}
    </span>
  );
}
