"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { formatINR } from "@/lib/utils";
import {
  Sheet as SheetRoot,
  SheetContent as Content,
  SheetHeader as Header,
  SheetTitle as Title,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CartDrawerProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export function CartDrawer({ children, isOpen, onClose }: CartDrawerProps) {
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getShippingFee,
    getDiscountAmount,
    getTotal,
    getItemCount,
    applyDiscountCode,
    discountCode,
    removeDiscountCode,
  } = useCartStore();

  const [promoInput, setPromoInput] = useState("");
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = typeof isOpen === "boolean";
  const openState = isControlled ? isOpen : internalOpen;
  const handleOpenChange = (val: boolean) => {
    if (isControlled) {
      if (!val && onClose) onClose();
    } else {
      setInternalOpen(val);
    }
  };

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const discount = getDiscountAmount();
  const total = getTotal();
  const itemCount = getItemCount();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyDiscountCode(promoInput)) {
      toast.success(`Promo code ${promoInput.toUpperCase()} applied successfully!`);
      setPromoInput("");
    } else {
      toast.error("Invalid code! Try 'VIPER10' or 'DOJANG20'");
    }
  };

  return (
    <SheetRoot open={openState} onOpenChange={handleOpenChange}>
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}
      <Content side="right" className="flex flex-col h-full bg-[#0F172A] border-l border-slate-800 p-0 sm:max-w-md w-full shadow-2xl text-white">
        {/* Header */}
        <Header className="px-6 py-5 border-b border-slate-800 bg-[#0B101D]">
          <Title className="flex items-center gap-2.5 text-lg font-black tracking-wider uppercase text-white">
            <ShoppingBag className="w-5 h-5 text-[#00E676]" />
            <span>Shopping Cart ({itemCount})</span>
          </Title>
        </Header>

        {/* Content Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white uppercase">Your cart is empty</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Explore our WT Approved KPNP Taekwondo Doboks India Edition and add gear to your cart.
              </p>
            </div>
            <Button
              asChild
              onClick={() => handleOpenChange(false)}
              className="bg-[#00E676] hover:bg-[#00c853] text-black font-black text-xs uppercase tracking-wider px-6 h-11 rounded-xl shadow-md"
            >
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Scrollable Item List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}`}
                  className="flex gap-4 p-3 bg-slate-900 border border-slate-800 rounded-2xl relative group"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="pr-6">
                      <h4 className="text-xs font-bold text-white line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-[#00E676] font-bold mt-0.5">
                        Size: {item.selectedSize} cm
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden bg-slate-950">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, -1)}
                          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold font-mono text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, 1)}
                          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-xs font-black text-white font-mono">
                        {formatINR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.product.id, item.selectedSize)}
                    className="absolute top-3 right-3 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Promo Code Input */}
              <div className="pt-2">
                {discountCode ? (
                  <div className="flex items-center justify-between p-3 bg-[#00E676]/10 border border-[#00E676]/30 rounded-xl text-xs">
                    <div className="flex items-center gap-2 text-[#00E676] font-bold">
                      <Tag className="w-4 h-4" />
                      <span>CODE: {discountCode} ({useCartStore.getState().discountPercentage}% OFF)</span>
                    </div>
                    <button
                      onClick={removeDiscountCode}
                      className="text-xs text-red-400 underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <Input
                      placeholder="Promo Code (VIPER10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="bg-slate-900 border-slate-800 text-white placeholder-slate-500 text-xs h-10"
                    />
                    <Button type="submit" variant="outline" className="text-xs font-bold border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 h-10 px-4">
                      Apply
                    </Button>
                  </form>
                )}
              </div>
            </div>

            {/* Footer Order Summary */}
            <div className="p-6 border-t border-slate-800 bg-[#0B101D] space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">{formatINR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#00E676] font-bold">
                    <span>Discount</span>
                    <span className="font-mono">-{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Pan-India Express Shipping</span>
                  <span className="font-mono text-[#00E676]">
                    {shipping === 0 ? "FREE" : formatINR(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                  <span>Total</span>
                  <span className="font-mono text-[#00E676]">{formatINR(total)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  asChild
                  onClick={() => handleOpenChange(false)}
                  className="w-full bg-[#00E676] hover:bg-[#00c853] text-black font-black text-xs uppercase tracking-wider h-12 rounded-xl shadow-lg flex items-center justify-center gap-2 neon-emerald-glow"
                >
                  <Link href="/checkout">
                    <span>PROCEED TO CHECKOUT</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
                  <span>Razorpay 100% Encrypted Payment</span>
                </div>
              </div>
            </div>
          </>
        )}
      </Content>
    </SheetRoot>
  );
}
