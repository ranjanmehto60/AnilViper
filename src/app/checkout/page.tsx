"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RazorpayCheckoutModal } from "@/components/checkout/RazorpayCheckoutModal";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name"),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  street: z.string().trim().min(5, "Enter your street / house address"),
  city: z.string().trim().min(2, "Enter your city"),
  state: z.string().trim().min(2, "Enter your state"),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});

export default function CheckoutPage() {
  const { items, discountCode, getSubtotal, getShippingFee, getDiscountAmount, getTotal, clearCart } = useCartStore();

  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const discount = getDiscountAmount();
  const total = getTotal();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [razorpayOpen, setRazorpayOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState<{
    orderId: string;
    paymentId: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    const result = checkoutSchema.safeParse(formData);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message;
      toast.error(firstError || "Please fill in all required shipping address fields.");
      return;
    }
    setStep(2);
  };

  const handlePaymentSuccess = (orderId: string, paymentId: string) => {
    setRazorpayOpen(false);
    setOrderComplete({ orderId, paymentId });
    clearCart();
    toast.success("Order Placed Successfully! Confirmation sent via SMS & WhatsApp.");
  };

  if (orderComplete) {
    return (
      <div className="bg-[#F8FAFC] py-20 min-h-screen text-slate-900">
        <div className="container mx-auto px-4 max-w-lg text-center space-y-6 bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
          <div className="w-20 h-20 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto text-[#FF3B30]">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase bebas-font">ORDER CONFIRMED!</h1>
          <p className="text-xs text-slate-600">
            Thank you <span className="text-slate-900 font-bold">{formData.fullName}</span>! Your order has been registered with our Chattarpur Delhi dispatch center.
          </p>

          <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-1.5 text-left border border-slate-200">
            <p className="text-slate-500">Order ID: <span className="font-mono text-slate-900 font-bold">{orderComplete.orderId}</span></p>
            <p className="text-slate-500">Payment ID: <span className="font-mono text-[#FF3B30] font-bold">{orderComplete.paymentId}</span></p>
            <p className="text-slate-500">Delivery Address: <span className="text-slate-800">{formData.street}, {formData.city} - {formData.pincode}</span></p>
            <p className="text-slate-500">Status: <span className="text-[#FF3B30] font-bold">Processing Dispatch (Shiprocket / Delhivery)</span></p>
          </div>

          <Button variant="default" size="lg" asChild className="w-full text-xs font-black bg-[#FF3B30] hover:bg-[#D92D20] text-white">
            <Link href="/account">View Order Status in Account</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] py-12 min-h-screen text-slate-900">
      <div className="container mx-auto px-4 space-y-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/cart" className="hover:text-slate-900">Cart</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#FF3B30] font-bold">3-Step Checkout</span>
        </nav>

        {/* Stepper Header */}
        <div className="flex items-center justify-between max-w-2xl mx-auto pb-4 border-b border-slate-200">
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 1 ? "text-[#FF3B30]" : "text-slate-400"}`}>
            <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-xs">1</span>
            <span>Shipping Address</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200" />
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 2 ? "text-[#FF3B30]" : "text-slate-400"}`}>
            <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-xs">2</span>
            <span>Review Order</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200" />
          <div className={`flex items-center gap-2 text-xs font-bold ${step >= 3 ? "text-[#FF3B30]" : "text-slate-400"}`}>
            <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-xs">3</span>
            <span>Razorpay Payment</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            Your cart is empty. Please add products to proceed with checkout.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Form / Steps */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              
              {/* Step 1: Address */}
              {step === 1 && (
                <form onSubmit={handleStep1Next} className="space-y-4">
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#FF3B30]" /> Step 1: Pan-India Delivery Address
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">Full Name *</label>
                      <Input name="fullName" value={formData.fullName} onChange={handleChange} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">Phone Number (For Delivery SMS) *</label>
                      <Input name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 uppercase">Flat / House / Street Address *</label>
                    <Input name="street" value={formData.street} onChange={handleChange} required />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">City *</label>
                      <Input name="city" value={formData.city} onChange={handleChange} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">State *</label>
                      <Input name="state" value={formData.state} onChange={handleChange} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">Pincode *</label>
                      <Input name="pincode" value={formData.pincode} onChange={handleChange} required maxLength={6} />
                    </div>
                  </div>

                  <Button type="submit" variant="default" size="lg" className="w-full text-xs font-black gap-2 h-12 mt-4 bg-[#FF3B30] hover:bg-[#D92D20] text-white shadow-lg shadow-red-500/20">
                    Continue To Order Summary <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              )}

              {/* Step 2 & 3: Order Review & Razorpay Launch */}
              {step >= 2 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Truck className="w-5 h-5 text-[#FF3B30]" /> Step 2: Review Order Details
                    </h2>
                    <button onClick={() => setStep(1)} className="text-xs text-[#FF3B30] hover:underline font-bold">
                      Edit Address
                    </button>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-1 text-slate-700 border border-slate-200">
                    <p><strong className="text-slate-900">Shipping To:</strong> {formData.fullName} ({formData.phone})</p>
                    <p><strong className="text-slate-900">Address:</strong> {formData.street}, {formData.city}, {formData.state} - {formData.pincode}</p>
                  </div>

                  {/* Items summary */}
                  <div className="space-y-3 divide-y divide-slate-100">
                    {items.map((item) => (
                      <div key={`${item.product.id}-${item.selectedSize}`} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                            <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 line-clamp-1">{item.product.name}</h4>
                            <p className="text-[11px] text-slate-500">Size: {item.selectedSize}cm | Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-[#FF3B30]">{formatINR(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <Button
                      variant="default"
                      size="lg"
                      onClick={() => setRazorpayOpen(true)}
                      className="w-full text-xs font-black gap-2 h-12 bg-[#FF3B30] hover:bg-[#D92D20] text-white shadow-lg shadow-red-500/20"
                    >
                      <CreditCard className="w-4 h-4" /> Pay {formatINR(total)} via Razorpay
                    </Button>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Price Summary Box */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 h-fit space-y-4 shadow-sm">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
                Total Payable Breakdown
              </h3>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
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
                  <span className="text-[#FF3B30] font-bold">
                    {shipping === 0 ? "FREE" : formatINR(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                  <span>Total (Incl. GST)</span>
                  <span className="text-[#FF3B30] text-xl">{formatINR(total)}</span>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-2 text-xs text-slate-800">
                <h4 className="font-bold text-[#FF6B61] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#FF3B30]" /> 100% Viper Buyer Protection:
                </h4>
                <ul className="space-y-1 text-[11px] text-slate-600">
                  <li>• 7-Day hassle-free return & size exchange</li>
                  <li>• Shiprocket / Delhivery trackable dispatch</li>
                  <li>• Instant SMS & WhatsApp updates</li>
                </ul>
              </div>
            </div>

          </div>
        )}

      </div>

      <RazorpayCheckoutModal
        isOpen={razorpayOpen}
        onClose={() => setRazorpayOpen(false)}
        totalAmount={total}
        customerName={formData.fullName}
        customerPhone={formData.phone}
        items={items.map((item) => ({
          productId: item.product.id,
          size: item.selectedSize,
          quantity: item.quantity,
        }))}
        address={{ ...formData }}
        discountCode={discountCode}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
