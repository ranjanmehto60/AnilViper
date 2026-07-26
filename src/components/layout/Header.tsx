"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { PRODUCTS } from "@/data/products";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ShieldCheck,
  Crown,
} from "lucide-react";
import {
  Sheet as SheetRoot,
  SheetContent as Content,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const itemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop Uniforms", href: "/shop" },
    { name: "Our Story", href: "/about" },
    { name: "Action Gallery", href: "/gallery" },
    { name: "Contact & Bulk", href: "/contact" },
  ];

  const filteredSearchResults = searchQuery.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      {/* Top Banner Bar */}
      <div className="bg-slate-900 text-white py-2 px-4 text-center text-xs font-bold tracking-wider flex items-center justify-center gap-2 border-b border-slate-800">
        <span className="inline-block w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
        <span className="text-emerald-300 font-extrabold uppercase">WT & KPNP APPROVED:</span>
        <span className="hidden sm:inline text-slate-200">
          Official KPNP Competition Taekwondo Doboks India Edition | Free Pan-India Shipping above ₹999
        </span>
        <span className="sm:hidden text-slate-200">KPNP Competition Uniforms</span>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-md py-3"
            : "bg-white border-b border-slate-200 py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          
          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center">
            <SheetRoot>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-900 hover:bg-slate-100">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <Content side="left" className="bg-white border-r border-slate-200 w-80 p-6 flex flex-col justify-between text-slate-900">
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
                    <Link
                      href="/admin"
                      className="px-4 py-3 rounded-xl text-sm font-bold tracking-wider text-[#00C853] bg-emerald-50 border border-emerald-200 flex items-center gap-2 mt-2"
                    >
                      <Crown className="w-4 h-4" /> Admin Portal
                    </Link>
                  </nav>
                </div>

                <div className="pt-6 border-t border-slate-100 text-xs text-slate-500 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-[#00C853]" /> WT Certified Equipment
                  </div>
                  <p>Chattarpur, New Delhi - 110074</p>
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
              className="p-2.5 text-slate-700 hover:text-[#00C853] hover:bg-slate-100 rounded-full transition-colors"
              aria-label="User Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Admin Portal Direct Link */}
            <Link
              href="/admin"
              className="p-2.5 text-slate-700 hover:text-[#00C853] hover:bg-emerald-50 rounded-full transition-colors hidden md:flex"
              title="Store Admin Dashboard"
              aria-label="Admin Portal"
            >
              <Crown className="w-5 h-5 text-[#00C853]" />
            </Link>

            {/* Cart Drawer */}
            <CartDrawer>
              <button
                className="relative p-2.5 bg-[#00C853] hover:bg-[#00b248] text-white rounded-full transition-all duration-300 shadow-md hover:shadow-lg shadow-emerald-500/20"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow">
                    {itemCount}
                  </span>
                )}
              </button>
            </CartDrawer>
          </div>

        </div>
      </header>

      {/* Global Search Dialog Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-[#00C853] uppercase tracking-widest">
                Search Catalog
              </span>
              <button
                onClick={() => setSearchOpen(false)}
                className="text-slate-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search KPNP Competition Doboks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="pl-10 h-11 text-xs bg-slate-50 border-slate-200"
              />
            </div>

            {filteredSearchResults.length > 0 && (
              <div className="max-h-64 overflow-y-auto space-y-2 pt-2 divide-y divide-slate-100">
                {filteredSearchResults.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/product/${prod.slug}`}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 pt-2 first:pt-0 hover:bg-slate-50 p-2 rounded-xl transition-colors"
                  >
                    <div className="relative w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={prod.images[0]}
                        alt={prod.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {prod.name}
                      </h4>
                      <span className="text-[10px] text-[#00C853] font-bold">
                        ₹{prod.price}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
