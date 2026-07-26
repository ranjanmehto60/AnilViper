"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { SizeGuideModal } from "@/components/product/SizeGuideModal";
import { ShieldCheck, Star, ShoppingBag, Ruler, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<number>(
    product.availableSizes.includes(170) ? 170 : product.availableSizes[0]
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, selectedSize, quantity);
    toast.success(`Added ${quantity}x ${product.name} (${selectedSize}cm) to Cart!`);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl bg-white border-slate-200 text-slate-900 p-0 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Preview */}
            <div className="relative aspect-square md:h-full bg-slate-100">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                {product.isWTApproved && (
                  <Badge variant="wtApproved" className="text-[10px] bg-white/90 text-[#008137] border-emerald-300 font-extrabold shadow-sm">
                    <ShieldCheck className="w-3 h-3 text-[#00C853] mr-1" /> WT Approved
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-extrabold text-[#00C853] uppercase tracking-wider">
                  {product.category}
                </span>

                <DialogTitle className="text-lg font-black text-slate-900 mt-1 leading-snug">
                  {product.name}
                </DialogTitle>

                <div className="flex items-center gap-2 mt-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-slate-400">({product.reviewCount} Reviews)</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-emerald-600 font-bold">In Stock</span>
                </div>

                <div className="flex items-baseline gap-2.5 mt-3">
                  <span className="text-xl font-black text-[#00C853]">
                    {formatINR(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-slate-400 line-through">
                      {formatINR(product.originalPrice)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 mt-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Size Selector */}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">Select Height Size (cm):</span>
                    <button
                      onClick={() => setSizeGuideOpen(true)}
                      className="text-[#00C853] hover:underline font-bold flex items-center gap-1"
                    >
                      <Ruler className="w-3.5 h-3.5" /> Size Chart
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                          selectedSize === size
                            ? "bg-[#00C853] text-white border-[#00C853] shadow-md shadow-emerald-500/20"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {size} cm
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <Button
                  variant="default"
                  onClick={handleAddToCart}
                  className="w-full text-xs font-black gap-2 bg-[#00C853] hover:bg-[#00b248] text-white shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" /> Add To Cart
                </Button>

                <Button
                  variant="ghost"
                  onClick={onClose}
                  asChild
                  className="w-full text-xs text-slate-600 hover:text-slate-900"
                >
                  <Link href={`/product/${product.slug}`} className="flex items-center justify-center gap-1">
                    View Full Product Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SizeGuideModal open={sizeGuideOpen} onOpenChange={setSizeGuideOpen} />
    </>
  );
}
