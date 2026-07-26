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
  children: React.ReactNode;
}

export function CartDrawer({ children }: CartDrawerProps) {
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
  const [isOpen, setIsOpen] = useState(false);

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
    <SheetRoot open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <Content side="right" className="flex flex-col h-full bg-white border-l border-slate-200 p-0 sm:max-w-md w-full shadow-2xl text-slate-900">
        {/* Header */}
        <Header className="px-6 py-5 border-b border-slate-200 bg-slate-50">
          <Title className="flex items-center gap-2.5 text-lg font-black tracking-wider uppercase text-slate-900">
            <ShoppingBag className="w-5 h-5 text-[#00C853]" />
            Your Viper Cart ({itemCount})
          </Title>
        </Header>

        {/* Free Shipping Progress Bar */}
        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200">
          {subtotal >= 999 ? (
            <p className="text-xs text-[#008137] font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00C853]" /> 🎉 You qualified for FREE Shipping across India!
            </p>
          ) : (
            <div>
              <p className="text-xs text-slate-700 font-medium mb-1.5">
                Add <span className="text-[#00C853] font-black">{formatINR(999 - subtotal)}</span> more for FREE Shipping!
              </p>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#00C853] h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / 999) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 border border-slate-200">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">Your Cart is Empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explore our KPNP India competition doboks and high performance sparring gear.
              </p>
              <Button
                variant="default"
                onClick={() => setIsOpen(false)}
                className="mt-2 bg-[#00C853] hover:bg-[#00b248] text-white text-xs font-bold"
                asChild
              >
                <Link href="/shop">Explore Shop Catalog</Link>
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.product.id}-${item.selectedSize}`} className="pt-4 first:pt-0 flex gap-4">
                <div className="relative w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 pr-2">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.product.id, item.selectedSize)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                      Height Size: <span className="font-bold text-slate-900">{item.selectedSize} cm</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 bg-slate-50 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, -1)}
                        className="p-1.5 text-slate-600 hover:text-slate-900"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, 1)}
                        className="p-1.5 text-slate-600 hover:text-slate-900"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-black text-[#00C853]">
                      {formatINR(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 p-6 space-y-3.5">
            {/* Promo Code Input */}
            {discountCode ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
                <span className="text-xs text-[#008137] font-bold flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Promo {discountCode} (-{formatINR(discount)})
                </span>
                <button
                  onClick={removeDiscountCode}
                  className="text-xs text-slate-500 hover:text-slate-900 underline"
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
                  className="h-9 text-xs bg-white border-slate-200"
                />
                <Button type="submit" variant="secondary" size="sm" className="h-9 px-4 text-xs font-bold bg-slate-900 text-white">
                  Apply
                </Button>
              </form>
            )}

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-900 font-bold">{formatINR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#00C853]">
                  <span>Discount</span>
                  <span>-{formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-slate-900 font-bold">
                  {shipping === 0 ? <span className="text-[#00C853]">FREE</span> : formatINR(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount (Incl. GST)</span>
                <span className="text-[#00C853] text-base">{formatINR(total)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                asChild
                className="w-full text-xs font-bold border-slate-300"
              >
                <Link href="/cart">View Cart</Link>
              </Button>
              <Button
                variant="default"
                onClick={() => setIsOpen(false)}
                asChild
                className="w-full text-xs bg-[#00C853] hover:bg-[#00b248] text-white font-extrabold shadow-md"
              >
                <Link href="/checkout" className="flex items-center justify-center gap-1.5">
                  Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </Content>
    </SheetRoot>
  );
}
