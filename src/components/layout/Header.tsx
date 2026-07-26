"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { CartDrawer } from "@/components/cart/CartDrawer";
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  PhoneCall,
  User,
  Zap,
} from "lucide-react";
import {
  Sheet as SheetRoot,
  SheetContent as Content,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PRODUCTS } from "@/data/products";
import { formatINR } from "@/lib/utils";
import Image from "next/image";

export function Header() {
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = searchQuery.trim() === "" 
    ? [] 
    : PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop Catalog", href: "/shop" },
    { name: "About Us", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Top Banner Bar - Light Modern Theme */}
      <div className="bg-slate-900 py-2 text-center text-xs font-semibold text-slate-200">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-300">
            <span>📍 Chattarpur, Delhi, India</span>
            <span>📞 +91-9871674886</span>
          </div>
          <p className="mx-auto md:mx-0 flex items-center gap-1.5 text-[#00E676] font-bold">
            <Zap className="w-3.5 h-3.5 fill-[#00E676]" /> FREE Shipping across India on orders above ₹999!
          </p>
          <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-300">
            <Link href="/account" className="hover:text-white transition-colors">Track Order</Link>
            <span>|</span>
            <Link href="/contact" className="hover:text-white transition-colors">Bulk Academy Orders</Link>
          </div>
        </div>
      </div>

      {/* Main Header - Clean Glassmorphism */}
      <header className="sticky top-0 z-40 glass-header bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
          
          {/* Mobile Navigation Drawer */}
          <div className="flex items-center lg:hidden">
            <SheetRoot>
              <SheetTrigger asChild>
                <button
                  className="p-2 text-slate-700 hover:text-[#00C853] transition-colors"
                  aria-label="Open Mobile Menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <Content side="left" className="w-80 bg-white border-r border-slate-200 p-6 flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Brand logo */}
                  <Link href="/" className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex items-center justify-center p-1">
                      <Image
                        src="/images/viper-logo.jpg"
                        alt="Viper Gears Official Logo"
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <span className="text-xl font-black tracking-widest text-slate-900 block leading-none bebas-font">
                        VIPER <span className="text-[#00C853]">GEARS</span>
                      </span>
                      <span className="text-[9px] tracking-widest text-emerald-600 font-bold uppercase">
                        Taekwondo Armor
                      </span>
                    </div>
                  </Link>

                  {/* Nav links */}
                  <nav className="flex flex-col space-y-1.5 pt-4 border-t border-slate-100">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`px-4 py-3 rounded-xl text-sm font-bold tracking-wider transition-colors ${
                          pathname === link.href
                            ? "bg-[#00C853] text-white shadow-md shadow-emerald-500/20"
                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Footer details in menu */}
                <div className="space-y-2 pt-6 border-t border-slate-100 text-xs">
                  <a
                    href="tel:+919871674886"
                    className="flex items-center gap-2 text-emerald-600 font-bold hover:underline"
                  >
                    <PhoneCall className="w-4 h-4" /> +91-9871674886
                  </a>
                  <p className="text-slate-500">Chattarpur, Delhi, India</p>
                </div>
              </Content>
            </SheetRoot>
          </div>

          {/* Logo with official uploaded VIPER brand image */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 shadow-md group-hover:shadow-emerald-500/20 transition-all duration-300 overflow-hidden">
              <Image
                src="/images/viper-logo.jpg"
                alt="Viper Gears Official Brand Logo"
                fill
                priority
                className="object-contain p-0.5 group-hover:scale-105 transition-transform"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-widest text-slate-900 leading-none bebas-font">
                  VIPER <span className="text-[#00C853]">GEARS</span>
                </span>
              </div>
              <span className="text-[10px] tracking-widest text-slate-500 font-bold uppercase block mt-0.5">
                Strike With Precision
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold tracking-wider uppercase transition-colors relative py-1 ${
                  pathname === link.href
                    ? "text-[#00C853]"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                {link.name}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00C853] rounded-full shadow-sm" />
                )}
              </Link>
            ))}
          </nav>

          {/* Header Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 text-slate-700 hover:text-[#00C853] hover:bg-slate-100 rounded-full transition-colors relative"
              aria-label="Search Products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/account?tab=wishlist"
              className="p-2.5 text-slate-700 hover:text-[#00C853] hover:bg-slate-100 rounded-full transition-colors relative hidden sm:flex"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E53935] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Account */}
            <Link
              href="/account"
              className="p-2.5 text-slate-700 hover:text-[#00C853] hover:bg-slate-100 rounded-full transition-colors hidden sm:flex"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Drawer Button */}
            <CartDrawer>
              <button
                className="flex items-center gap-2 bg-[#00C853] hover:bg-[#00b248] text-white font-extrabold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
                aria-label="Open Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2.5 bg-slate-900 text-[#00E676] text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline-block text-xs font-black uppercase tracking-wider">
                  Cart
                </span>
              </button>
            </CartDrawer>
          </div>
        </div>
      </header>

      {/* Global Search Dialog - Light Theme */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-2xl bg-white border-slate-200 text-slate-900">
          <DialogHeader>
            <DialogTitle className="text-base font-bold uppercase tracking-wider text-slate-700">
              Search Viper Gears Catalog
            </DialogTitle>
          </DialogHeader>

          <div className="relative mt-2">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search doboks, belts, hogu, headguards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-slate-50 border-slate-200 text-slate-900"
              autoFocus
            />
          </div>

          <div className="mt-4 max-h-80 overflow-y-auto space-y-2">
            {searchQuery.trim() !== "" && filteredProducts.length === 0 && (
              <p className="text-center text-sm text-slate-500 py-8">
                No products found matching &quot;{searchQuery}&quot;
              </p>
            )}

            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                onClick={() => setSearchOpen(false)}
                className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-slate-100 transition-colors group"
              >
                <div className="relative w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#00C853] transition-colors">
                    {product.name}
                  </h4>
                  <span className="text-[11px] text-slate-500">{product.category}</span>
                </div>
                <span className="text-xs font-black text-[#00C853]">{formatINR(product.price)}</span>
              </Link>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
