"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatINR } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { QuickViewModal } from "./QuickViewModal";
import { SizeGuideModal } from "./SizeGuideModal";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Eye,
  Ruler,
  ShoppingBag,
  ShieldCheck,
  Check,
  Star
} from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const initialSize = product.availableSizes?.[0] || 170;
  const [selectedSize, setSelectedSize] = useState<number>(initialSize);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, selectedSize, 1);
    toast.success(`Added ${product.name} (${selectedSize} cm) to cart!`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
    if (!isWishlisted) {
      toast.success(`Added to Wishlist!`);
    } else {
      toast.info(`Removed from Wishlist.`);
    }
  };

  return (
    <>
      <div className="group relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between">
        
        <div>
          {/* Image & Badge Area */}
          <div className="relative h-64 sm:h-72 w-full bg-slate-50 overflow-hidden">
            
            <Link href={`/product/${product.slug}`} className="block w-full h-full">
              <Image
                src={product.images[0] || "/images/kpnp-dobok-1.jpg"}
                alt={product.name}
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
            </Link>

            {/* Badges Overlay */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.isNewArrival && (
                <span className="bg-[#00C853] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm tracking-wider">
                  NEW
                </span>
              )}
              {product.isBestSeller && (
                <span className="bg-slate-900 text-amber-400 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm tracking-wider flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" /> BESTSELLER
                </span>
              )}
              <span className="bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#00C853]" /> WT APPROVED
              </span>
            </div>

            {/* Quick Action Buttons (Wishlist & Quick View) */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
              <button
                onClick={handleToggleWishlist}
                className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
                  isWishlisted
                    ? "bg-red-500 text-white"
                    : "bg-white/90 text-slate-700 hover:bg-white hover:text-red-500"
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`} />
              </button>

              <button
                onClick={() => setIsQuickViewOpen(true)}
                className="p-2.5 rounded-full bg-white/90 text-slate-700 hover:bg-white hover:text-[#00C853] backdrop-blur-md transition-all shadow-md"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {/* Size Selector Strip at Bottom of Image */}
            <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md border border-slate-200/80 p-2 rounded-2xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between gap-1 z-10">
              <span className="text-[10px] font-bold text-slate-500 uppercase pl-1 hidden sm:inline">Size:</span>
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {(product.availableSizes || [160, 170, 180, 190]).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors ${
                      selectedSize === sz
                        ? "bg-[#00C853] text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {sz} cm
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Product Info Section */}
          <div className="p-5 space-y-3">
            
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span className="uppercase text-[10px] tracking-wider text-emerald-700 font-extrabold">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-mono font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400">({product.reviewCount})</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-sm font-black text-slate-900 line-clamp-2 leading-tight hover:text-[#00C853] transition-colors">
              <Link href={`/product/${product.slug}`}>{product.name}</Link>
            </h3>

            {/* Price Row */}
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-lg font-black text-slate-900 font-mono">
                {formatINR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through font-mono">
                  {formatINR(product.originalPrice)}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-[10px] font-extrabold text-[#008137] bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                  SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

          </div>
        </div>

        {/* Action Button Footer */}
        <div className="p-5 pt-0 space-y-2">
          
          <div className="flex items-center justify-between text-[11px]">
            <button
              onClick={() => setIsSizeGuideOpen(true)}
              className="text-slate-500 hover:text-slate-900 underline flex items-center gap-1 font-semibold"
            >
              <Ruler className="w-3.5 h-3.5 text-[#00C853]" /> Size Chart Guide
            </button>
            <span className="text-emerald-700 font-extrabold flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-[#00C853]" /> IN STOCK
            </span>
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full text-xs font-black uppercase tracking-wider h-11 bg-slate-900 hover:bg-[#00C853] text-white hover:text-white rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group/btn"
          >
            <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            <span>ADD TO CART • {selectedSize} CM</span>
          </Button>

        </div>

      </div>

      {/* Modals */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />

      <SizeGuideModal
        open={isSizeGuideOpen}
        onOpenChange={setIsSizeGuideOpen}
      />
    </>
  );
}
