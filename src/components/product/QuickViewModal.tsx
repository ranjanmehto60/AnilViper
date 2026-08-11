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
  const [quantity] = useState<number>(1);
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
        <DialogContent className="max-w-3xl overflow-hidden border-border bg-surface p-0 text-foreground shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Preview */}
            <div className="relative aspect-square bg-surface-2 md:h-full">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                {product.isWTApproved && (
                  <Badge variant="wtApproved" className="bg-surface/90 text-accent">
                    <ShieldCheck className="mr-1 h-3 w-3 text-accent" /> WT-approved
                  </Badge>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6 flex flex-col justify-between space-y-4">
              <div>
                <span className="section-kicker">
                  {product.category}
                </span>

                <DialogTitle className="mt-1 text-xl font-medium leading-snug text-ink">
                  {product.name}
                </DialogTitle>

                <div className="mt-2 flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 font-semibold text-accent">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-muted">({product.reviewCount} reviews)</span>
                  <span className="text-border-strong">|</span>
                  {product.inStock ? (
                    <span className="font-semibold text-accent">In stock</span>
                  ) : (
                    <span className="font-semibold text-danger">Out of stock</span>
                  )}
                </div>

                <div className="flex items-baseline gap-2.5 mt-3">
                  <span className="text-xl font-semibold text-ink">
                    {formatINR(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-muted line-through">
                      {formatINR(product.originalPrice)}
                    </span>
                  )}
                </div>

                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                  {product.description}
                </p>

                {/* Size Selector */}
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-ink">Select height (cm)</span>
                    <button
                      onClick={() => setSizeGuideOpen(true)}
                      className="flex items-center gap-1 font-semibold text-accent hover:underline"
                    >
                      <Ruler className="w-3.5 h-3.5" /> Size Chart
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                          selectedSize === size
                            ? "border-ink bg-ink text-white"
                            : "border-border bg-background text-muted hover:border-ink hover:text-ink"
                        }`}
                      >
                        {size} cm
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 border-t border-border pt-4">
                <Button
                  variant="default"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full gap-2 rounded-full bg-ink text-xs font-semibold text-white hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" /> {product.inStock ? "Add To Cart" : "Out of Stock"}
                </Button>

                <Button
                  variant="ghost"
                  onClick={onClose}
                  asChild
                  className="w-full text-xs text-muted hover:text-ink"
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
