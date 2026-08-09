"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { PauseBanner } from "@/components/store/PauseBanner";
import { CategoryType, Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatINR } from "@/lib/utils";
import {
  SlidersHorizontal,
  Search,
  ChevronRight,
  RotateCcw,
  Check,
  Filter,
  Loader2,
} from "lucide-react";
import {
  Sheet as SheetRoot,
  SheetContent as Content,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as CategoryType | null;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | "All">(
    initialCategory || "All"
  );
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [wtOnly, setWtOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories: (CategoryType | "All")[] = [
    "All",
    "Beginner Dobok",
    "Advanced Competition Dobok",
    "Kids Dobok",
    "Black Belt Dobok",
    "Belts & Accessories",
  ];

  const availableSizes = [110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240];

  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.products)) setProducts(data.products);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory !== "All" && product.category !== selectedCategory) {
        return false;
      }
      if (selectedSize !== null && !product.availableSizes.includes(selectedSize)) {
        return false;
      }
      if (product.price > maxPrice) {
        return false;
      }
      if (wtOnly && !product.isWTApproved) {
        return false;
      }
      if (
        searchQuery.trim() !== "" &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.category.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [products, selectedCategory, selectedSize, maxPrice, wtOnly, sortBy, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedSize(null);
    setMaxPrice(5000);
    setWtOnly(false);
    setSearchQuery("");
    setSortBy("featured");
  };

  const FilterSidebarContent = (
    <div className="space-y-6 text-slate-700">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#FF3B30]" /> Catalog Filters
        </h3>
        <button
          onClick={resetFilters}
          className="text-xs text-slate-500 hover:text-[#FF3B30] transition-colors flex items-center gap-1 font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
          Category
        </label>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                selectedCategory === cat
                  ? "bg-[#FF3B30] text-white shadow-md shadow-red-500/20"
                  : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>{cat}</span>
              {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Height Size Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
          Athlete Height (cm)
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(selectedSize === size ? null : size)}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                selectedSize === size
                  ? "bg-[#FF3B30] text-white border-[#FF3B30]"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <label className="font-bold text-slate-900 uppercase tracking-wider">Max Price</label>
          <span className="text-[#FF3B30] font-black">{formatINR(maxPrice)}</span>
        </div>
        <input
          type="range"
          min="500"
          max="5000"
          step="100"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#FF3B30] bg-slate-200 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
          <span>₹500</span>
          <span>₹5,000</span>
        </div>
      </div>

      {/* WT Approved Toggle */}
      <div className="pt-2 border-t border-slate-200">
        <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-slate-900">
          <input
            type="checkbox"
            checked={wtOnly}
            onChange={(e) => setWtOnly(e.target.checked)}
            className="w-4 h-4 rounded accent-[#FF3B30]"
          />
          <span>Show WT Approved Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10">
      <div className="container mx-auto px-4">
        
        <PauseBanner />

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#FF3B30] font-bold">Shop Catalog</span>
        </nav>

        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 border-b border-slate-200 gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight bebas-font">
              TAEKWONDO CATALOG
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Showing {filteredProducts.length} premium WT Approved uniforms & gear
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="relative w-48 sm:w-64">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Filter catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-xs bg-white border-slate-200 text-slate-900"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:ring-2 focus:ring-[#FF3B30]"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Mobile Filter Sheet Trigger */}
            <div className="lg:hidden">
              <SheetRoot>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 px-3 gap-1.5 text-xs font-bold border-slate-300">
                    <SlidersHorizontal className="w-4 h-4 text-[#FF3B30]" /> Filters
                  </Button>
                </SheetTrigger>
                <Content side="left" className="bg-white border-r border-slate-200 w-80 p-6 overflow-y-auto">
                  {FilterSidebarContent}
                </Content>
              </SheetRoot>
            </div>
          </div>
        </div>

        {/* Main Grid & Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 h-fit sticky top-28 shadow-sm">
            {FilterSidebarContent}
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            {isLoading ? (
              <div className="flex items-center justify-center py-20 text-sm text-slate-500">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading catalog...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 space-y-4 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider">No Products Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No Taekwondo gear matching your selected filters. Try broadening your height size or price parameters.
                </p>
                <Button variant="default" onClick={resetFilters} size="sm" className="text-xs bg-[#FF3B30] hover:bg-[#D92D20] text-white">
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
