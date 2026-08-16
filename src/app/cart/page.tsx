"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Minus, Plus, ShoppingBag, Tag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { DEFAULT_BACK_PRINT_OPTION, getBackPrintLabel, supportsBackIndPrint } from "@/types/product";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useHydrated } from "@/hooks/useHydrated";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getShippingFee, getDiscountAmount, getTotal, applyDiscountCode, discountCode, removeDiscountCode } = useCartStore();
  const hydrated = useHydrated();
  const [promoInput, setPromoInput] = useState("");
  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const discount = getDiscountAmount();
  const total = getTotal();

  if (!hydrated) {
    return <div className="editorial-page flex min-h-screen items-center justify-center text-sm text-muted">Loading your bag...</div>;
  }

  const handleApplyPromo = (event: React.FormEvent) => {
    event.preventDefault();
    if (applyDiscountCode(promoInput)) { toast.success(`Promo code ${promoInput.toUpperCase()} applied.`); setPromoInput(""); }
    else toast.error("Invalid code. Try VIPER10 or DOJANG20.");
  };

  return (
    <div className="editorial-page min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6">
        <nav className="flex items-center gap-2 text-xs text-muted"><Link href="/" className="hover:text-ink">Home</Link><ChevronRight className="h-3 w-3" /><span className="font-semibold text-ink">Your bag</span></nav>
        <div><p className="section-kicker mb-3">Ready when you are</p><h1 className="section-title">Your bag.</h1></div>

        {items.length === 0 ? <div className="surface-card mx-auto max-w-lg rounded-2xl p-10 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-muted"><ShoppingBag className="h-7 w-7" /></div><h2 className="mt-5 text-xl font-medium text-ink">Nothing here yet.</h2><p className="mt-2 text-sm text-muted">Explore the collection and find your next uniform.</p><Button asChild className="mt-6 rounded-full bg-ink text-sm text-white hover:bg-accent"><Link href="/shop">Shop the collection <ArrowRight className="h-4 w-4" /></Link></Button></div> : <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="space-y-3">
            {items.map((item) => <div key={`${item.product.id}-${item.selectedSize}-${item.selectedBackPrint ?? DEFAULT_BACK_PRINT_OPTION}`} className="surface-card flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:p-5"><div className="flex min-w-0 flex-1 gap-4"><div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-2"><Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover object-top" /></div><div className="min-w-0"><p className="text-[10px] font-semibold tracking-[0.12em] text-accent uppercase">{item.product.category}</p><h2 className="mt-1 line-clamp-2 text-base font-medium leading-snug text-ink">{item.product.name}</h2><p className="mt-2 text-xs text-muted">Size <span className="font-semibold text-ink">{item.selectedSize} cm</span></p>{supportsBackIndPrint(item.product) && <p className="mt-1 text-xs text-muted">Back print <span className="font-semibold text-ink">{getBackPrintLabel(item.selectedBackPrint)}</span></p>}<p className="mt-2 text-sm font-semibold text-ink sm:hidden">{formatINR(item.product.price * item.quantity)}</p></div></div><div className="flex items-center justify-between gap-5 border-t border-border pt-3 sm:border-0 sm:pt-0"><div className="flex items-center rounded-full border border-border bg-background"><button onClick={() => updateQuantity(item.product.id, item.selectedSize, -1, item.selectedBackPrint)} className="p-2 text-muted hover:text-ink"><Minus className="h-3.5 w-3.5" /></button><span className="min-w-8 text-center text-xs font-semibold text-ink">{item.quantity}</span><button onClick={() => updateQuantity(item.product.id, item.selectedSize, 1, item.selectedBackPrint)} className="p-2 text-muted hover:text-ink"><Plus className="h-3.5 w-3.5" /></button></div><span className="hidden text-sm font-semibold text-ink sm:block">{formatINR(item.product.price * item.quantity)}</span><button onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedBackPrint)} aria-label={`Remove ${item.product.name}`} className="text-subtle hover:text-danger"><Trash2 className="h-4 w-4" /></button></div></div>)}
          </div>

          <aside className="surface-card rounded-2xl p-6 lg:sticky lg:top-28"><h2 className="text-xl font-medium tracking-tight text-ink">Order summary</h2><div className="mt-6">{discountCode ? <div className="flex items-center justify-between rounded-lg border border-accent/25 bg-accent/10 p-3 text-xs"><span className="flex items-center gap-1.5 font-semibold text-accent"><Tag className="h-3.5 w-3.5" /> {discountCode}</span><button onClick={removeDiscountCode} className="text-muted underline">Remove</button></div> : <form onSubmit={handleApplyPromo} className="flex gap-2"><Input placeholder="Promo code" value={promoInput} onChange={(event) => setPromoInput(event.target.value)} className="h-10 bg-background text-xs" /><Button type="submit" variant="outline" className="h-10 rounded-full px-4 text-xs">Apply</Button></form>}</div><div className="mt-6 space-y-3 text-sm"><div className="flex justify-between text-muted"><span>Subtotal</span><span className="font-semibold text-ink">{formatINR(subtotal)}</span></div>{discount > 0 && <div className="flex justify-between text-accent"><span>Discount</span><span>-{formatINR(discount)}</span></div>}<div className="flex justify-between text-muted"><span>Shipping</span><span className="font-semibold text-ink">{shipping === 0 ? "Free" : formatINR(shipping)}</span></div><div className="flex justify-between border-t border-border pt-4 text-lg font-semibold text-ink"><span>Total</span><span>{formatINR(total)}</span></div></div><Button asChild className="mt-7 h-12 w-full rounded-full bg-ink text-sm text-white hover:bg-accent"><Link href="/checkout">Continue to checkout <ArrowRight className="h-4 w-4" /></Link></Button><p className="mt-4 text-center text-[11px] text-muted">Secure checkout via Razorpay.</p></aside>
        </div>}
      </div>
    </div>
  );
}
