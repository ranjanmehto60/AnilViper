"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { PRODUCTS } from "@/data/products";
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Crown,
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

  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop Uniforms", href: "/shop" },
    { name: "Our Story", href: "/about" },
    { name: "Action Gallery", href: "/gallery" },
    { name: "Contact & Bulk", href: "/contact" },
  ];

  const filteredProducts = searchQuery.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      {/* Top Banner Bar */}
      <div className="bg-[#05080E] text-slate-300 py-2 px-4 text-center text-xs font-bold tracking-wider flex items-center justify-center gap-2 border-b border-slate-800/80">
        <span className="inline-block w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse" />
        <span className="text-[#FF3B30] font-extrabold uppercase">WT & KPNP APPROVED:</span>
        <span className="hidden sm:inline text-slate-200">
          Official KPNP Competition Taekwondo Doboks India Edition | Free Pan-India Shipping above ₹999
        </span>
        <span className="sm:hidden text-slate-200">KPNP Competition Uniforms</span>
      </div>

      {/* Main Glass Navigation Header */}
      <header className="sticky top-0 z-40 w-full transition-all duration-300 bg-[#0B101D]/90 backdrop-blur-md border-b border-slate-800 py-3.5">
        <div className="container mx-auto px-4 flex items-center justify-between">
          
          {/* Mobile Hamburger Toggle */}
          <div className="lg:hidden flex items-center">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-200 hover:bg-slate-800">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-[#0B101D] border-slate-800 text-white p-6">
                <SheetHeader className="text-left border-b border-slate-800 pb-4">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-900 border border-slate-700">
                      <Image src="/images/viper-logo.jpg" alt="Viper Logo" fill className="object-contain p-0.5" />
                    </div>
                    <span className="text-xl font-black tracking-widest text-white bebas-font">
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
                      className="text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-[#FF3B30] py-2 border-b border-slate-800/60"
                    >
                      {link.name}
                    </Link>
                  ))}
                  <div className="pt-4 space-y-3">
                    <Link
                      href="/admin/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-xs font-bold text-[#FF3B30] bg-slate-900 border border-slate-800 p-3 rounded-xl"
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
            <div className="relative w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 p-1 shadow-md group-hover:border-[#FF3B30]/60 transition-all duration-300 overflow-hidden">
              <Image
                src="/images/viper-logo.jpg"
                alt="Viper Gears Official Brand Logo"
                fill
                className="object-contain p-0.5 group-hover:scale-105 transition-transform"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-widest text-white leading-none bebas-font">
                  VIPER <span className="text-[#FF3B30]">GEARS</span>
                </span>
              </div>
              <span className="text-[10px] tracking-widest text-slate-400 font-bold uppercase block mt-0.5">
                Strike With Precision
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-bold tracking-wider uppercase transition-colors relative py-1 text-slate-300 hover:text-[#FF3B30]"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Icons Right Section */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 text-slate-300 hover:text-[#FF3B30] hover:bg-slate-800/70 rounded-full transition-colors relative"
              aria-label="Search Products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <Link
              href="/account?tab=wishlist"
              className="p-2.5 text-slate-300 hover:text-[#FF3B30] hover:bg-slate-800/70 rounded-full transition-colors relative hidden sm:flex"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            <Link
              href="/account"
              className="p-2.5 text-slate-300 hover:text-[#FF3B30] hover:bg-slate-800/70 rounded-full transition-colors"
              aria-label="User Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Store Admin Dashboard Button */}
            <Link
              href="/admin/login"
              className="p-2.5 text-slate-300 hover:text-amber-400 hover:bg-slate-800/70 rounded-full transition-colors hidden md:flex"
              title="Store Admin Dashboard"
            >
              <Crown className="w-5 h-5 text-amber-400" />
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-[#FF3B30] hover:bg-[#E12D25] text-black rounded-full transition-all duration-300 shadow-md neon-red-glow"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[10px] font-black w-5 h-5 rounded-full border-2 border-[#0B101D] flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* Instant Search Bar Dropdown */}
        {isSearchOpen && (
          <div className="bg-[#0F172A] border-b border-slate-800 p-4 transition-all animate-in slide-in-from-top-2">
            <div className="container mx-auto max-w-xl relative">
              <input
                type="text"
                placeholder="Search KPNP Dobok, Black Belt, Junior Kids..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white placeholder-slate-400 px-4 py-3 rounded-xl text-xs focus:outline-none focus:border-[#FF3B30]"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Live Search Results Overlay */}
              {searchQuery.trim() && (
                <div className="absolute top-14 left-0 right-0 bg-[#0F172A] border border-slate-800 rounded-xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto space-y-1">
                  {filteredProducts.length === 0 ? (
                    <div className="p-3 text-xs text-slate-400 text-center">No uniforms found matching &quot;{searchQuery}&quot;</div>
                  ) : (
                    filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg text-xs transition-colors"
                      >
                        <div className="relative w-10 h-10 rounded bg-slate-900 shrink-0 overflow-hidden">
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
