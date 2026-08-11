"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Tag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatINR } from "@/lib/utils";
import { Sheet as SheetRoot, SheetContent as Content, SheetHeader as Header, SheetTitle as Title, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CartDrawerProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export function CartDrawer({ children, isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getSubtotal, getShippingFee, getDiscountAmount, getTotal, getItemCount, applyDiscountCode, discountCode, removeDiscountCode, discountPercentage } = useCartStore();
  const [promoInput, setPromoInput] = useState("");
  const [internalOpen, setInternalOpen] = useState(false);
  const controlled = typeof isOpen === "boolean";
  const openState = controlled ? isOpen : internalOpen;
  const handleOpenChange = (value: boolean) => controlled ? (!value && onClose?.()) : setInternalOpen(value);
  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const discount = getDiscountAmount();
  const total = getTotal();

  const handleApplyPromo = (event: React.FormEvent) => {
    event.preventDefault();
    if (applyDiscountCode(promoInput)) {
      toast.success(`Promo code ${promoInput.toUpperCase()} applied.`);
      setPromoInput("");
    } else toast.error("Invalid code. Try VIPER10 or DOJANG20.");
  };

  return (
    <SheetRoot open={openState} onOpenChange={handleOpenChange}>
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}
      <Content side="right" className="flex h-full w-full flex-col border-border bg-surface p-0 text-foreground shadow-lg sm:max-w-md">
        <Header className="border-b border-border px-6 py-5 text-left">
          <Title className="flex items-center gap-2 text-lg font-medium tracking-tight text-ink"><ShoppingBag className="h-5 w-5 text-accent" /> Your bag <span className="text-muted">({getItemCount()})</span></Title>
        </Header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background text-muted"><ShoppingBag className="h-7 w-7" /></div>
            <div><h3 className="text-lg font-medium text-ink">Your bag is empty.</h3><p className="mt-1 text-sm text-muted">Start with a dobok built for movement.</p></div>
            <Button asChild onClick={() => handleOpenChange(false)} className="rounded-full bg-ink px-6 text-xs text-white hover:bg-accent"><Link href="/shop">Shop the collection</Link></Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="relative flex gap-3 border-b border-border pb-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-2"><Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover object-top" /></div>
                  <div className="min-w-0 flex-1"><h4 className="line-clamp-2 pr-5 text-sm font-medium leading-snug text-ink">{item.product.name}</h4><p className="mt-1 text-xs text-accent">{item.selectedSize} cm</p><div className="mt-3 flex items-center justify-between gap-3"><div className="flex items-center rounded-full border border-border bg-background"><button onClick={() => updateQuantity(item.product.id, item.selectedSize, -1)} className="p-1.5 text-muted hover:text-ink"><Minus className="h-3 w-3" /></button><span className="min-w-6 text-center text-xs font-semibold text-ink">{item.quantity}</span><button onClick={() => updateQuantity(item.product.id, item.selectedSize, 1)} className="p-1.5 text-muted hover:text-ink"><Plus className="h-3 w-3" /></button></div><span className="text-sm font-semibold text-ink">{formatINR(item.product.price * item.quantity)}</span></div></div>
                  <button onClick={() => removeItem(item.product.id, item.selectedSize)} aria-label={`Remove ${item.product.name}`} className="absolute right-0 top-0 text-subtle transition-colors hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
              {discountCode ? <div className="flex items-center justify-between rounded-lg border border-accent/25 bg-accent/10 p-3 text-xs"><span className="flex items-center gap-1.5 font-semibold text-accent"><Tag className="h-3.5 w-3.5" /> {discountCode} ({discountPercentage}% off)</span><button onClick={removeDiscountCode} className="text-muted underline">Remove</button></div> : <form onSubmit={handleApplyPromo} className="flex gap-2"><Input placeholder="Promo code" value={promoInput} onChange={(event) => setPromoInput(event.target.value)} className="h-10 bg-background text-xs" /><Button type="submit" variant="outline" className="h-10 rounded-full px-4 text-xs">Apply</Button></form>}
            </div>
            <div className="space-y-4 border-t border-border bg-background p-6">
              <div className="space-y-2 text-sm"><div className="flex justify-between text-muted"><span>Subtotal</span><span className="font-semibold text-ink">{formatINR(subtotal)}</span></div>{discount > 0 && <div className="flex justify-between text-accent"><span>Discount</span><span>-{formatINR(discount)}</span></div>}<div className="flex justify-between text-muted"><span>Shipping</span><span className="font-semibold text-ink">{shipping === 0 ? "Free" : formatINR(shipping)}</span></div><div className="flex justify-between border-t border-border pt-3 text-base font-semibold text-ink"><span>Total</span><span>{formatINR(total)}</span></div></div>
              <Button asChild onClick={() => handleOpenChange(false)} className="h-12 w-full rounded-full bg-ink text-sm text-white hover:bg-accent"><Link href="/checkout">Checkout <ArrowRight className="h-4 w-4" /></Link></Button>
              <p className="text-center text-[11px] text-muted">Secure checkout via Razorpay.</p>
            </div>
          </>
        )}
      </Content>
    </SheetRoot>
  );
}
