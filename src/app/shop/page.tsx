"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, ChevronRight, Filter, Loader2, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { PauseBanner } from "@/components/store/PauseBanner";
import { CategoryType, Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatINR } from "@/lib/utils";
import { Sheet as SheetRoot, SheetContent as Content, SheetTrigger } from "@/components/ui/sheet";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as CategoryType | null;
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | "All">(initialCategory || "All");
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [wtOnly, setWtOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: (CategoryType | "All")[] = ["All", "Beginner Dobok", "Advanced Competition Dobok", "Kids Dobok", "Black Belt Dobok", "Belts & Accessories"];
  const availableSizes = [110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240];

  useEffect(() => {
    fetch("/api/products")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.products)) setProducts(data.products);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProducts = useMemo(() => products.filter((product) => {
    if (selectedCategory !== "All" && product.category !== selectedCategory) return false;
    if (selectedSize !== null && !product.availableSizes.includes(selectedSize)) return false;
    if (product.price > maxPrice) return false;
    if (wtOnly && !product.isWTApproved) return false;
    if (searchQuery.trim() && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && !product.category.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  }), [products, selectedCategory, selectedSize, maxPrice, wtOnly, sortBy, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedSize(null);
    setMaxPrice(5000);
    setWtOnly(false);
    setSearchQuery("");
    setSortBy("featured");
  };

  const FilterSidebarContent = (
    <div className="space-y-7">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-ink"><Filter className="h-4 w-4 text-accent" /> Filters</h3>
        <button onClick={resetFilters} className="flex items-center gap-1 text-xs font-medium text-muted hover:text-ink"><RotateCcw className="h-3.5 w-3.5" /> Reset</button>
      </div>
      <div className="space-y-3">
        <p className="text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">Category</p>
        <div className="space-y-1">
          {categories.map((category) => <button key={category} onClick={() => setSelectedCategory(category)} className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition-colors ${selectedCategory === category ? "bg-ink font-semibold text-white" : "text-muted hover:bg-surface-2 hover:text-ink"}`}><span>{category}</span>{selectedCategory === category && <Check className="h-3.5 w-3.5 text-accent" />}</button>)}
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">Athlete height</p>
        <div className="grid grid-cols-5 gap-1.5">
          {availableSizes.map((size) => <button key={size} onClick={() => setSelectedSize(selectedSize === size ? null : size)} className={`rounded-md border py-2 text-xs font-medium transition-colors ${selectedSize === size ? "border-ink bg-ink text-white" : "border-border bg-background text-muted hover:border-ink hover:text-ink"}`}>{size}</button>)}
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between"><p className="text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">Maximum price</p><span className="text-xs font-semibold text-ink">{formatINR(maxPrice)}</span></div>
        <input type="range" min="500" max="5000" step="100" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} className="w-full accent-[#2563eb]" />
        <div className="flex justify-between text-[10px] text-muted"><span>₹500</span><span>₹5,000</span></div>
      </div>
      <label className="flex cursor-pointer items-center gap-3 border-t border-border pt-5 text-sm font-medium text-ink"><input type="checkbox" checked={wtOnly} onChange={(event) => setWtOnly(event.target.checked)} className="h-4 w-4 accent-[#2563eb]" /> WT-approved only</label>
    </div>
  );

  return (
    <div className="editorial-page min-h-screen py-8 sm:py-12">
      <PauseBanner />
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6">
        <nav className="flex items-center gap-2 text-xs text-muted"><Link href="/" className="hover:text-ink">Home</Link><ChevronRight className="h-3 w-3" /><span className="font-semibold text-ink">Shop</span></nav>

        <div className="flex flex-col justify-between gap-5 border-b border-border pb-8 md:flex-row md:items-end">
          <div><p className="section-kicker mb-3">The collection</p><h1 className="section-title">Shop all gear.</h1><p className="mt-3 text-sm text-muted">{filteredProducts.length} pieces for training, competition, and the next generation.</p></div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative w-full sm:w-64"><Search className="absolute left-3.5 top-3 h-4 w-4 text-subtle" /><Input placeholder="Search the collection" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} className="h-10 rounded-full bg-surface pl-10 text-sm" /></div>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="h-10 rounded-full border border-border bg-surface px-4 text-xs font-semibold text-ink outline-none focus:border-accent"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Highest rated</option></select>
            <div className="lg:hidden"><SheetRoot><SheetTrigger asChild><Button variant="outline" size="sm" className="h-10 rounded-full gap-2"><SlidersHorizontal className="h-4 w-4 text-accent" /> Filters</Button></SheetTrigger><Content side="left" className="w-[min(88vw,360px)] bg-surface p-6">{FilterSidebarContent}</Content></SheetRoot></div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[230px_1fr]">
          <aside className="surface-card hidden h-fit rounded-2xl p-5 lg:sticky lg:top-28 lg:block">{FilterSidebarContent}</aside>
          <main>
            {isLoading ? <div className="flex min-h-80 items-center justify-center gap-2 text-sm text-muted"><Loader2 className="h-5 w-5 animate-spin text-accent" /> Loading the collection...</div> : filteredProducts.length === 0 ? <div className="surface-card rounded-2xl py-20 text-center"><h2 className="text-xl font-medium text-ink">Nothing matches those filters.</h2><p className="mt-2 text-sm text-muted">Try a different size, category, or price range.</p><Button onClick={resetFilters} className="mt-6 rounded-full bg-ink text-xs text-white hover:bg-accent">Reset filters</Button></div> : <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return <Suspense fallback={<div className="editorial-page flex min-h-screen items-center justify-center text-sm text-muted">Loading shop...</div>}><ShopContent /></Suspense>;
}
