"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { formatINR } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag, Eye, Star, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { QuickViewModal } from "@/components/product/QuickViewModal";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const isFavorite = isInWishlist(product.id);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.availableSizes.includes(170) ? 170 : product.availableSizes[0];
    addItem(product, defaultSize, 1);
    toast.success(`Added ${product.name} (${defaultSize}cm) to Cart!`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!isFavorite) {
      toast.success(`Added ${product.name} to Wishlist!`);
    } else {
      toast.info(`Removed ${product.name} from Wishlist`);
    }
  };

  const discountPercentage = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group relative bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-[#00C853] hover:shadow-xl transition-all duration-300 shadow-sm"
      >
        {/* Top Badges & Image */}
        <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isWTApproved && (
              <Badge variant="wtApproved" className="text-[10px] py-1 px-2.5 flex items-center gap-1 shadow-sm bg-white/90 backdrop-blur-md text-[#008137] border-emerald-300 font-extrabold">
                <ShieldCheck className="w-3 h-3 text-[#00C853]" /> WT Approved
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge variant="default" className="text-[10px] bg-slate-900 text-white font-extrabold">
                BESTSELLER
              </Badge>
            )}
            {discountPercentage > 0 && (
              <Badge variant="destructive" className="text-[10px]">
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 p-2.5 rounded-full z-10 transition-all ${
              isFavorite
                ? "bg-[#E53935] text-white shadow-md"
                : "bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white backdrop-blur-md shadow-sm"
            }`}
            aria-label="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-white" : ""}`} />
          </button>

          {/* Hover Quick View Overlay */}
          <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                setQuickViewOpen(true);
              }}
              className="bg-white/95 text-slate-900 hover:bg-white text-xs font-bold gap-1.5 backdrop-blur-sm shadow-md"
            >
              <Eye className="w-3.5 h-3.5 text-[#00C853]" /> Quick View
            </Button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-bold text-slate-500">{product.category}</span>
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400">({product.reviewCount})</span>
              </div>
            </div>

            <Link href={`/product/${product.slug}`}>
              <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#00C853] transition-colors line-clamp-2 leading-snug">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-[#00C853]">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 block font-medium">Free Shipping above ₹999</span>
            </div>

            <Button
              variant="default"
              size="sm"
              onClick={handleAddToCart}
              className="px-3.5 text-xs font-extrabold gap-1.5 shadow-md bg-[#00C853] hover:bg-[#00b248] text-white"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Add
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
