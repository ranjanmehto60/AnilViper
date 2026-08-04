"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getShippingFee,
    getDiscountAmount,
    getTotal,
    applyDiscountCode,
    discountCode,
    removeDiscountCode,
  } = useCartStore();

  const [promoInput, setPromoInput] = useState("");

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const discount = getDiscountAmount();
  const total = getTotal();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyDiscountCode(promoInput)) {
      toast.success(`Promo code ${promoInput.toUpperCase()} applied!`);
      setPromoInput("");
    } else {
      toast.error("Invalid coupon! Use 'VIPER10' or 'DOJANG20'");
    }
  };

  return (
    <div className="bg-[#F8FAFC] py-12 min-h-screen text-slate-900">
      <div className="container mx-auto px-4 space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#FF3B30] font-bold">Shopping Cart</span>
        </nav>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase tracking-tight bebas-font">
          YOUR VIPER SHOPPING CART ({items.length})
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 space-y-4 max-w-lg mx-auto shadow-sm">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 border border-slate-200">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 uppercase">Your Cart is Currently Empty</h2>
            <p className="text-xs text-slate-500">
              Explore our KPNP India competition doboks, black belt uniforms, and sparring gear.
            </p>
            <Button variant="default" size="lg" asChild className="text-xs font-black bg-[#FF3B30] hover:bg-[#D92D20] text-white">
              <Link href="/shop">Explore Shop Catalog</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Items List */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}`}
                  className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between shadow-sm"
                >
                  <div className="flex gap-4 items-center">
                    <div className="relative w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-200">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-[#FF3B30] uppercase">
                        {item.product.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug max-w-md">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Height Size: <span className="font-bold text-slate-900">{item.selectedSize} cm</span>
                      </p>
                      <span className="text-sm font-black text-[#FF3B30] block sm:hidden">
                        {formatINR(item.product.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                    <div className="flex items-center border border-slate-200 bg-slate-50 rounded-xl">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, -1)}
                        className="p-2 text-slate-600 hover:text-slate-900"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, 1)}
                        className="p-2 text-slate-600 hover:text-slate-900"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-base font-black text-[#FF3B30] hidden sm:block">
                      {formatINR(item.product.price * item.quantity)}
                    </span>

                    <button
                      onClick={() => removeItem(item.product.id, item.selectedSize)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 h-fit space-y-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
                Order Summary
              </h2>

              {/* Promo Code Form */}
              {discountCode ? (
                <div className="flex items-center justify-between bg-red-50 border border-red-200 px-3 py-2.5 rounded-xl text-xs">
                  <span className="text-[#FF6B61] font-bold flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#FF3B30]" /> Code {discountCode} (-{formatINR(discount)})
                  </span>
                  <button onClick={removeDiscountCode} className="text-slate-500 hover:text-slate-900 underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <Input
                    placeholder="Promo Code (VIPER10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="h-10 text-xs bg-slate-50 border-slate-200"
                  />
                  <Button type="submit" variant="secondary" size="sm" className="h-10 px-4 text-xs font-bold bg-slate-900 text-white">
                    Apply
                  </Button>
                </form>
              )}

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-bold">{formatINR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#FF3B30]">
                    <span>Discount</span>
                    <span>-{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Pan-India Shipping</span>
                  <span className="text-slate-900 font-bold">
                    {shipping === 0 ? <span className="text-[#FF3B30]">FREE</span> : formatINR(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-[#FF3B30] text-xl">{formatINR(total)}</span>
                </div>
              </div>

              <Button variant="default" size="lg" asChild className="w-full text-xs font-black gap-2 h-12 bg-[#FF3B30] hover:bg-[#D92D20] text-white shadow-lg shadow-red-500/20">
                <Link href="/checkout">
                  Proceed To Checkout <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-red-700 font-bold pt-2">
                <ShieldCheck className="w-4 h-4 text-[#FF3B30]" /> 100% Secure Razorpay Checkout
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
