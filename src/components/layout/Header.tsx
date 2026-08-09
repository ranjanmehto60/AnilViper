"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Product } from "@/types/product";
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Crown,
  ArrowRight,
  Flame
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [scrolled, setScrolled] = useState(false);

  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.products)) setProducts(data.products);
      })
      .catch(() => {});

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop Doboks", href: "/shop" },
    { name: "Our Story", href: "/about" },
    { name: "Action Gallery", href: "/gallery" },
    { name: "Contact & Bulk", href: "/contact" },
  ];

  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];


  return (
    <>
      {/* Top Banner Marquee Bar */}
      <div className="bg-[#05060A] text-zinc-300 py-2 border-b border-white/10 overflow-hidden relative z-50">
        <div className="flex items-center">
          <div className="animate-marquee whitespace-nowrap text-[11px] font-bold tracking-widest uppercase flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF3B30] live-pulse shrink-0" />
              <span className="text-[#FF3B30] font-black">WT APPROVED:</span>
              <span className="text-zinc-200">Official Viper Gears Competition Taekwondo Doboks India Edition | 100% Free Pan-India Express Delivery</span>
            </span>
            <span className="text-zinc-500">|</span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Flame className="w-3.5 h-3.5 text-[#FF3B30] fill-[#FF3B30]" /> 210 GSM LIGHTWEIGHT MOISTURE-WICKING AEROFLEX FABRIC
            </span>
            <span className="text-zinc-500">|</span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              🇮🇳 OFFICIAL INDIAN FLAG SLEEVE PATCH & WORLD TAEKWONDO EMBLEM
            </span>
            <span className="text-zinc-500">|</span>
            {/* Repeat for continuous loop */}
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF3B30] live-pulse shrink-0" />
              <span className="text-[#FF3B30] font-black">WT APPROVED:</span>
              <span className="text-zinc-200">Official Viper Gears Competition Taekwondo Doboks India Edition | 100% Free Pan-India Express Delivery</span>
            </span>
            <span className="text-zinc-500">|</span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Flame className="w-3.5 h-3.5 text-[#FF3B30] fill-[#FF3B30]" /> 210 GSM LIGHTWEIGHT MOISTURE-WICKING AEROFLEX FABRIC
            </span>
            <span className="text-zinc-500">|</span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              🇮🇳 OFFICIAL INDIAN FLAG SLEEVE PATCH & WORLD TAEKWONDO EMBLEM
            </span>
          </div>
        </div>
      </div>

      {/* Main Glass Navigation Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#090A10]/95 backdrop-blur-xl border-b border-[#FF3B30]/30 shadow-2xl py-3"
            : "bg-[#0A0B12]/85 backdrop-blur-md border-b border-white/10 py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          
          {/* Mobile Hamburger Toggle */}
          <div className="lg:hidden flex items-center">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-zinc-200 hover:bg-zinc-800 hover:text-white">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-[#0A0B12] border-zinc-800 text-white p-6">
                <SheetHeader className="text-left border-b border-zinc-800 pb-4">
                  <SheetTitle className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-zinc-900 border border-[#FF3B30]/40 p-1 shadow-md">
                      <Image src="/images/viper-logo.jpg" alt="Viper Logo" fill className="object-contain p-0.5" />
                    </div>
                    <span className="text-2xl font-black tracking-widest text-white bebas-font">
                      VIPER <span className="text-[#FF3B30]">GEARS</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-extrabold uppercase tracking-wider text-zinc-300 hover:text-[#FF3B30] py-2.5 border-b border-zinc-800/80 flex items-center justify-between"
                    >
                      <span>{link.name}</span>
                      <ArrowRight className="w-4 h-4 text-zinc-500" />
                    </Link>
                  ))}
                  <div className="pt-4 space-y-3">
                    <Link
                      href="/admin/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-xs font-black text-amber-400 bg-zinc-900 border border-amber-500/30 p-3 rounded-xl hover:border-amber-400 transition-colors"
                    >
                      <Crown className="w-4 h-4 text-amber-400" /> Admin Portal
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-2xl bg-zinc-900 border border-zinc-700/80 p-1 shadow-xl group-hover:border-[#FF3B30] transition-all duration-300 overflow-hidden group-hover:shadow-[#FF3B30]/30 group-hover:shadow-lg">
              <Image
                src="/images/viper-logo.jpg"
                alt="Viper Gears Official Brand Logo"
                fill
                className="object-contain p-0.5 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black tracking-widest text-white leading-none bebas-font">
                  VIPER <span className="text-[#FF3B30]">GEARS</span>
                </span>
                <span className="text-[10px] bg-red-950/80 text-[#FF3B30] font-black px-1.5 py-0.5 rounded border border-[#FF3B30]/40">
                  IN 🇮🇳
                </span>
              </div>
              <span className="text-[10px] tracking-[0.2em] text-zinc-400 font-extrabold uppercase block mt-0.5">
                Official Taekwondo Gear
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-black tracking-widest uppercase transition-all duration-200 relative py-1 text-zinc-300 hover:text-[#FF3B30] after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#FF3B30] hover:after:w-full after:transition-all"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Icons Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 text-zinc-300 hover:text-[#FF3B30] hover:bg-zinc-800/80 rounded-full transition-colors relative"
              aria-label="Search Products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <Link
              href="/account?tab=wishlist"
              className="p-2.5 text-zinc-300 hover:text-[#FF3B30] hover:bg-zinc-800/80 rounded-full transition-colors relative hidden sm:flex"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF3B30] text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            <Link
              href="/account"
              className="p-2.5 text-zinc-300 hover:text-[#FF3B30] hover:bg-zinc-800/80 rounded-full transition-colors"
              aria-label="User Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Store Admin Dashboard Button */}
            <Link
              href="/admin/login"
              className="p-2.5 text-zinc-300 hover:text-amber-400 hover:bg-zinc-800/80 rounded-full transition-colors hidden md:flex"
              title="Store Admin Dashboard"
            >
              <Crown className="w-5 h-5 text-amber-400" />
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-[#FF3B30] hover:bg-[#D92D20] text-black rounded-full transition-all duration-300 shadow-lg neon-crimson-glow"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-zinc-950 text-white text-[10px] font-black w-5 h-5 rounded-full border-2 border-[#FF3B30] flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* Instant Search Bar Dropdown */}
        {isSearchOpen && (
          <div className="bg-[#0A0B12] border-b border-zinc-800 p-4 transition-all animate-in slide-in-from-top-2">
            <div className="container mx-auto max-w-xl relative">
              <input
                type="text"
                placeholder="Search Viper Dobok, Black Belt, Junior Kids, Sparring..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/90 border border-zinc-700 text-white placeholder-zinc-400 px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#FF3B30] shadow-inner"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 top-3 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Live Search Results Overlay */}
              {searchQuery.trim() && (
                <div className="absolute top-14 left-0 right-0 bg-[#0F101A] border border-zinc-700 rounded-xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto space-y-1">
                  {filteredProducts.length === 0 ? (
                    <div className="p-4 text-xs text-zinc-400 text-center">No doboks found matching &quot;{searchQuery}&quot;</div>
                  ) : (
                    filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-3 p-2 hover:bg-zinc-800/80 rounded-lg text-xs transition-colors"
                      >
                        <div className="relative w-10 h-10 rounded-lg bg-zinc-900 shrink-0 overflow-hidden border border-zinc-800">
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white line-clamp-1">{product.name}</h4>
                          <span className="text-[#FF3B30] font-mono font-bold">₹{product.price}</span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </header>

      {/* Cart Drawer Component */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

