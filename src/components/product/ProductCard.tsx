"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Eye, Heart, Ruler, ShoppingBag, Star } from "lucide-react";
import { DEFAULT_BACK_PRINT_OPTION, getBackPrintLabel, Product, supportsBackIndPrint } from "@/types/product";
import { formatINR } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { QuickViewModal } from "./QuickViewModal";
import { SizeGuideModal } from "./SizeGuideModal";
import { BackPrintSelector } from "./BackPrintSelector";
import { toast } from "sonner";
import { useHydrated } from "@/hooks/useHydrated";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const initialSize = product.availableSizes?.[0] || 170;
  const [selectedSize, setSelectedSize] = useState(initialSize);
  const [selectedBackPrint, setSelectedBackPrint] = useState(DEFAULT_BACK_PRINT_OPTION);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const hydrated = useHydrated();
  const isWishlisted = hydrated && isInWishlist(product.id);
  const discount = product.originalPrice > product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedBackPrint, 1);
    toast.success(`Added ${product.name} (${selectedSize} cm, ${getBackPrintLabel(selectedBackPrint)}) to cart.`);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    toast[isWishlisted ? "info" : "success"](isWishlisted ? "Removed from wishlist." : "Added to wishlist.");
  };

  return (
    <>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background transition duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md">
        <div className="relative aspect-[0.82] overflow-hidden bg-surface-2">
          <Link href={`/product/${product.slug}`} className="block h-full">
            <Image src={product.images[0] || "/images/kpnp-dobok-1.jpg"} alt={product.name} fill className="object-cover object-top transition duration-700 group-hover:scale-[1.03]" />
          </Link>
          <div className="absolute left-3 top-3 flex gap-2">
            {product.isNewArrival && <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-semibold tracking-[0.08em] text-white uppercase">New</span>}
            {!product.isNewArrival && product.isBestSeller && <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold tracking-[0.08em] text-ink uppercase backdrop-blur-sm">Bestseller</span>}
          </div>
          <div className="absolute right-3 top-3 flex flex-col gap-2">
            <button onClick={handleToggleWishlist} aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"} className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-colors ${isWishlisted ? "bg-accent text-white" : "bg-white/90 text-ink hover:bg-ink hover:text-white"}`}>
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
            </button>
            <button onClick={() => setIsQuickViewOpen(true)} aria-label="Quick view" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink backdrop-blur-sm transition-colors hover:bg-ink hover:text-white">
              <Eye className="h-4 w-4" />
            </button>
          </div>
          {product.isWTApproved && <span className="absolute bottom-3 left-3 rounded-full bg-ink/80 px-3 py-1 text-[10px] font-semibold tracking-[0.08em] text-white uppercase backdrop-blur-sm">WT-approved</span>}
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[10px] font-semibold tracking-[0.12em] text-accent uppercase">{product.category}</p>
            <span className="flex items-center gap-1 text-[11px] font-medium text-muted"><Star className="h-3 w-3 fill-accent text-accent" /> {product.rating}</span>
          </div>
          <h3 className="mt-2 line-clamp-2 min-h-[2.7rem] text-base font-medium leading-snug tracking-tight text-ink">
            <Link href={`/product/${product.slug}`} className="transition-colors hover:text-accent">{product.name}</Link>
          </h3>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-base font-semibold text-ink">{formatINR(product.price)}</span>
            {discount > 0 && <><span className="text-xs text-muted line-through">{formatINR(product.originalPrice)}</span><span className="text-[10px] font-semibold text-accent">-{discount}%</span></>}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
            <label className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-muted">
              <span className="hidden sm:inline">Size</span>
              <select value={selectedSize} onChange={(event) => setSelectedSize(Number(event.target.value))} aria-label={`Select size for ${product.name}`} className="max-w-[92px] rounded-md border border-border bg-surface px-2 py-1.5 text-[11px] font-semibold text-ink outline-none focus:border-accent">
                {(product.availableSizes || [160, 170, 180, 190]).map((size) => <option key={size} value={size}>{size} cm</option>)}
              </select>
            </label>
            <button onClick={() => setIsSizeGuideOpen(true)} className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-muted transition-colors hover:text-ink"><Ruler className="h-3.5 w-3.5 text-accent" /> Guide</button>
          </div>
          {supportsBackIndPrint(product) && <BackPrintSelector value={selectedBackPrint} onChange={setSelectedBackPrint} compact />}
          <button onClick={handleAddToCart} disabled={!product.inStock} className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink text-xs font-semibold text-white transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40">
            {product.inStock ? <><ShoppingBag className="h-4 w-4" /> Add to bag</> : <><Check className="h-4 w-4" /> Out of stock</>}
          </button>
        </div>
      </article>

      <QuickViewModal product={product} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
      <SizeGuideModal open={isSizeGuideOpen} onOpenChange={setIsSizeGuideOpen} />
    </>
  );
}
