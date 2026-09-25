"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { DEFAULT_BACK_PRINT_OPTION, getBackPrintLabel, supportsBackIndPrint } from "@/types/product";
import { formatINR } from "@/lib/utils";
import { Sheet as SheetRoot, SheetContent as Content, SheetHeader as Header, SheetTitle as Title, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface CartDrawerProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export function CartDrawer({ children, isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getSubtotal, getShippingFee, getTotal, getItemCount } = useCartStore();
  const [internalOpen, setInternalOpen] = useState(false);
  const controlled = typeof isOpen === "boolean";
  const openState = controlled ? isOpen : internalOpen;
  const handleOpenChange = (value: boolean) => controlled ? (!value && onClose?.()) : setInternalOpen(value);
  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const total = getTotal();

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
                <div key={`${item.product.id}-${item.selectedSize}-${item.selectedBackPrint ?? DEFAULT_BACK_PRINT_OPTION}`} className="relative flex gap-3 border-b border-border pb-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-2"><Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover object-top" /></div>
                  <div className="min-w-0 flex-1"><h4 className="line-clamp-2 pr-5 text-sm font-medium leading-snug text-ink">{item.product.name}</h4><p className="mt-1 text-xs text-accent">{item.selectedSize} cm</p>{supportsBackIndPrint(item.product) && <p className="mt-1 text-[11px] text-muted">{getBackPrintLabel(item.selectedBackPrint)}</p>}<div className="mt-3 flex items-center justify-between gap-3"><div className="flex items-center rounded-full border border-border bg-background"><button onClick={() => updateQuantity(item.product.id, item.selectedSize, -1, item.selectedBackPrint)} aria-label="Decrease quantity" className="p-2 sm:p-1.5 text-muted hover:text-ink active:scale-90"><Minus className="h-3.5 w-3.5" /></button><span className="min-w-6 text-center text-xs font-semibold text-ink">{item.quantity}</span><button onClick={() => updateQuantity(item.product.id, item.selectedSize, 1, item.selectedBackPrint)} aria-label="Increase quantity" className="p-2 sm:p-1.5 text-muted hover:text-ink active:scale-90"><Plus className="h-3.5 w-3.5" /></button></div><span className="text-sm font-semibold text-ink">{formatINR(item.product.price * item.quantity)}</span></div></div>
                  <button onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedBackPrint)} aria-label={`Remove ${item.product.name}`} className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full text-subtle transition-colors hover:text-danger active:text-danger"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
            <div className="space-y-4 border-t border-border bg-background p-5 sm:p-6 pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+1rem))]">
              <div className="space-y-2 text-sm"><div className="flex justify-between text-muted"><span>Subtotal</span><span className="font-semibold text-ink">{formatINR(subtotal)}</span></div><div className="flex justify-between text-muted"><span>Shipping</span><span className="font-semibold text-ink">{shipping === 0 ? "Free" : formatINR(shipping)}</span></div><div className="flex justify-between border-t border-border pt-3 text-base font-semibold text-ink"><span>Total</span><span>{formatINR(total)}</span></div></div>
              <Button asChild onClick={() => handleOpenChange(false)} className="h-12 w-full rounded-full bg-ink text-sm text-white hover:bg-accent"><Link href="/checkout">Checkout <ArrowRight className="h-4 w-4" /></Link></Button>
              <p className="text-center text-[11px] text-muted">Secure checkout via Razorpay.</p>
            </div>
          </>
        )}
      </Content>
    </SheetRoot>
  );
}
