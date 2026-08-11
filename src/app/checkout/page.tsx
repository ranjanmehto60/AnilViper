"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Banknote, CheckCircle2, ChevronRight, CreditCard, PauseCircle, ShieldCheck, Truck } from "lucide-react";
import { z } from "zod";
import { useCartStore } from "@/store/useCartStore";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RazorpayCheckoutModal } from "@/components/checkout/RazorpayCheckoutModal";
import { toast } from "sonner";
import { useHydrated } from "@/hooks/useHydrated";

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
  const hydrated = useHydrated();
  const subtotal = getSubtotal();
  const shipping = getShippingFee();
  const discount = getDiscountAmount();
  const total = getTotal();
  const [step, setStep] = useState<1 | 2>(1);
  const [razorpayOpen, setRazorpayOpen] = useState(false);
  const [ordersPaused, setOrdersPaused] = useState(false);
  const [pauseMessage, setPauseMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"PREPAID" | "COD">("PREPAID");
  const [codChecking, setCodChecking] = useState(false);
  const [codServiceable, setCodServiceable] = useState<boolean | null>(null);
  const [orderComplete, setOrderComplete] = useState<{ orderId: string; paymentId: string; paymentMethod?: "PREPAID" | "COD"; codAmount?: number } | null>(null);
  const [formData, setFormData] = useState({ fullName: "", phone: "", street: "", city: "", state: "", pincode: "" });
  const hasAccessories = items.some((item) => item.product.category === "Belts & Accessories");
  const bookingAmount = hasAccessories ? 200 : 400;
  const codAvailable = total > bookingAmount;
  const codAmount = total - bookingAmount;

  useEffect(() => {
    fetch("/api/store-status", { cache: "no-store" }).then((response) => response.ok ? response.json() : null).then((data) => { if (data) { setOrdersPaused(Boolean(data.ordersPaused)); setPauseMessage(String(data.message || "")); } }).catch(() => {});
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  const handleStep1Next = (event: React.FormEvent) => {
    event.preventDefault();
    const result = checkoutSchema.safeParse(formData);
    if (!result.success) { toast.error(result.error.issues[0]?.message || "Please check your address."); return; }
    setStep(2);
  };
  const checkCodServiceability = async () => {
    if (codChecking || codServiceable !== null) return;
    setCodChecking(true);
    try { const response = await fetch(`/api/shipping/check-serviceability?pincode=${formData.pincode}&cod=1`, { cache: "no-store" }); const data = await response.json(); setCodServiceable(data?.available === false ? false : true); } catch { setCodServiceable(true); } finally { setCodChecking(false); }
  };
  const selectPaymentMethod = (method: "PREPAID" | "COD") => { setPaymentMethod(method); if (method === "COD" && codServiceable === null) checkCodServiceability(); };
  const handlePaymentSuccess = (orderId: string, paymentId: string) => { setRazorpayOpen(false); setOrderComplete({ orderId, paymentId, paymentMethod, codAmount: paymentMethod === "COD" ? codAmount : 0 }); clearCart(); toast.success("Order placed successfully."); };

  if (!hydrated) return <div className="editorial-page flex min-h-screen items-center justify-center text-sm text-muted">Loading checkout...</div>;

  if (orderComplete) return <div className="editorial-page flex min-h-screen items-center justify-center px-4 py-16"><div className="surface-card w-full max-w-lg rounded-2xl p-8 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent"><CheckCircle2 className="h-8 w-8" /></div><p className="section-kicker mt-6">Thank you, {formData.fullName}</p><h1 className="mt-2 text-3xl font-medium tracking-tight text-ink">Order confirmed.</h1><p className="mt-3 text-sm leading-relaxed text-muted">Your order is with the Viper dispatch team. We&apos;ll keep you updated through the contact details you shared.</p><div className="mt-7 space-y-2 rounded-xl border border-border bg-background p-4 text-left text-xs text-muted"><p>Order ID: <span className="font-semibold text-ink">{orderComplete.orderId}</span></p><p>Payment ID: <span className="font-semibold text-ink">{orderComplete.paymentId}</span></p><p>Delivering to: <span className="font-semibold text-ink">{formData.city} — {formData.pincode}</span></p>{orderComplete.paymentMethod === "COD" && <p>Balance at delivery: <span className="font-semibold text-accent">{formatINR(orderComplete.codAmount || 0)}</span></p>}</div><Button asChild className="mt-7 h-12 w-full rounded-full bg-ink text-sm text-white hover:bg-accent"><Link href="/account">View order status</Link></Button></div></div>;

  return (
    <div className="editorial-page min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6">
        <nav className="flex items-center gap-2 text-xs text-muted"><Link href="/" className="hover:text-ink">Home</Link><ChevronRight className="h-3 w-3" /><Link href="/cart" className="hover:text-ink">Bag</Link><ChevronRight className="h-3 w-3" /><span className="font-semibold text-ink">Checkout</span></nav>
        <div><p className="section-kicker mb-3">Almost there</p><h1 className="section-title">Checkout.</h1></div>
        {ordersPaused && <div className="flex items-start gap-3 rounded-xl border border-accent/25 bg-accent/10 p-4 text-sm text-ink"><PauseCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" /><div><p className="font-semibold">Orders are temporarily paused.</p><p className="mt-1 text-muted">{pauseMessage || "Please check back soon."}</p></div></div>}

        <div className="mx-auto flex max-w-2xl items-center justify-between border-b border-border pb-5 text-xs font-semibold"><Step number="1" label="Delivery" active={step >= 1} /><span className="h-px flex-1 bg-border mx-3" /><Step number="2" label="Review & pay" active={step >= 2} /><span className="h-px flex-1 bg-border mx-3" /><Step number="3" label="Confirmation" active={false} /></div>

        {items.length === 0 ? <div className="surface-card rounded-2xl py-16 text-center text-sm text-muted">Your bag is empty. <Link href="/shop" className="font-semibold text-accent hover:underline">Return to shop.</Link></div> : <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <section className="surface-card rounded-2xl p-6 sm:p-8">
            {step === 1 ? <form onSubmit={handleStep1Next} className="space-y-5"><div><p className="section-kicker mb-2">Step 1</p><h2 className="text-2xl font-medium tracking-tight text-ink">Where should we send it?</h2><p className="mt-2 text-sm text-muted">Use the address that should receive your order updates.</p></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Full name" name="fullName" value={formData.fullName} onChange={handleChange} /><Field label="Phone number" name="phone" value={formData.phone} onChange={handleChange} /></div><Field label="Flat / house / street address" name="street" value={formData.street} onChange={handleChange} /><div className="grid grid-cols-1 gap-4 sm:grid-cols-3"><Field label="City" name="city" value={formData.city} onChange={handleChange} /><Field label="State" name="state" value={formData.state} onChange={handleChange} /><Field label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} maxLength={6} /></div><Button type="submit" disabled={ordersPaused} className="mt-2 h-12 w-full rounded-full bg-ink text-sm text-white hover:bg-accent">Continue to review <ArrowRight className="h-4 w-4" /></Button></form> : <div className="space-y-7"><div className="flex items-end justify-between border-b border-border pb-5"><div><p className="section-kicker mb-2">Step 2</p><h2 className="text-2xl font-medium tracking-tight text-ink">Review & pay</h2></div><button onClick={() => setStep(1)} className="text-xs font-semibold text-accent hover:underline">Edit address</button></div><div className="rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-muted"><p><strong className="font-semibold text-ink">{formData.fullName}</strong> · {formData.phone}</p><p>{formData.street}, {formData.city}, {formData.state} — {formData.pincode}</p></div><div className="space-y-4">{items.map((item) => <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center justify-between gap-3 border-b border-border pb-4"><div className="flex min-w-0 items-center gap-3"><div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-md bg-surface-2"><Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover object-top" /></div><div className="min-w-0"><p className="line-clamp-1 text-sm font-medium text-ink">{item.product.name}</p><p className="mt-1 text-xs text-muted">{item.selectedSize} cm · Qty {item.quantity}</p></div></div><span className="shrink-0 text-sm font-semibold text-ink">{formatINR(item.product.price * item.quantity)}</span></div>)}</div><div><p className="mb-3 text-xs font-semibold tracking-[0.12em] text-muted uppercase">Payment method</p><div className="space-y-2"><PaymentOption selected={paymentMethod === "PREPAID"} onClick={() => selectPaymentMethod("PREPAID")} icon={<CreditCard className="h-5 w-5 text-accent" />} title="Pay online" description={`UPI, cards, or netbanking · ${formatINR(total)} now`} /><PaymentOption selected={paymentMethod === "COD"} disabled={!codAvailable} onClick={() => codAvailable && selectPaymentMethod("COD")} icon={<Banknote className="h-5 w-5 text-accent" />} title="Cash on delivery" description={codChecking ? "Checking serviceability..." : codAvailable ? `${formatINR(bookingAmount)} online + ${formatINR(codAmount)} at delivery` : `Available above ${formatINR(bookingAmount)}`} /></div>{paymentMethod === "COD" && codServiceable === false && <p className="mt-2 text-xs font-semibold text-danger">COD is not available for this pincode. Choose online payment instead.</p>}</div><Button onClick={() => { if (paymentMethod === "COD" && codServiceable === false) { toast.error("COD is not available for this pincode."); return; } setRazorpayOpen(true); }} disabled={ordersPaused || codChecking} className="h-12 w-full rounded-full bg-ink text-sm text-white hover:bg-accent">{paymentMethod === "COD" ? <>Pay {formatINR(bookingAmount)} booking fee <Banknote className="h-4 w-4" /></> : <>Pay {formatINR(total)} via Razorpay <ArrowRight className="h-4 w-4" /></>}</Button></div>}
          </section>

          <aside className="surface-card rounded-2xl p-6 lg:sticky lg:top-28"><h2 className="text-xl font-medium tracking-tight text-ink">Order summary</h2><div className="mt-6 space-y-3 text-sm"><div className="flex justify-between text-muted"><span>Items subtotal</span><span className="font-semibold text-ink">{formatINR(subtotal)}</span></div>{discount > 0 && <div className="flex justify-between text-accent"><span>Discount</span><span>-{formatINR(discount)}</span></div>}<div className="flex justify-between text-muted"><span>Shipping</span><span className="font-semibold text-ink">{shipping === 0 ? "Free" : formatINR(shipping)}</span></div><div className="flex justify-between border-t border-border pt-4 text-lg font-semibold text-ink"><span>Total</span><span>{formatINR(total)}</span></div></div>{paymentMethod === "COD" && <div className="mt-6 rounded-xl border border-accent/25 bg-accent/10 p-4 text-xs text-muted"><p className="flex justify-between"><span>Paid online</span><strong className="text-ink">{formatINR(bookingAmount)}</strong></p><p className="mt-2 flex justify-between"><span>Due at delivery</span><strong className="text-ink">{formatINR(codAmount)}</strong></p></div>}<div className="mt-6 border-t border-border pt-5 text-xs text-muted"><p className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> Secure checkout and trackable delivery updates.</p><p className="mt-3 flex items-start gap-2"><Truck className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> Need help? Message the Viper team before placing your order.</p></div></aside>
        </div>}
      </div>
      <RazorpayCheckoutModal isOpen={razorpayOpen} onClose={() => setRazorpayOpen(false)} totalAmount={paymentMethod === "COD" ? bookingAmount : total} customerName={formData.fullName} customerPhone={formData.phone} items={items.map((item) => ({ productId: item.product.id, size: item.selectedSize, quantity: item.quantity }))} address={{ ...formData }} discountCode={discountCode} paymentMethod={paymentMethod} codAmount={paymentMethod === "COD" ? codAmount : 0} onSuccess={handlePaymentSuccess} />
    </div>
  );
}

function Field({ label, name, value, onChange, maxLength }: { label: string; name: string; value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; maxLength?: number }) {
  return <label className="space-y-1.5"><span className="text-xs font-semibold text-ink">{label}</span><Input name={name} value={value} onChange={onChange} maxLength={maxLength} required className="bg-background" /></label>;
}

function Step({ number, label, active }: { number: string; label: string; active: boolean }) {
  return <div className={`flex items-center gap-2 whitespace-nowrap ${active ? "text-ink" : "text-muted"}`}><span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${active ? "bg-ink text-white" : "border border-border bg-background"}`}>{number}</span><span className="hidden sm:inline">{label}</span></div>;
}

function PaymentOption({ selected, disabled = false, onClick, icon, title, description }: { selected: boolean; disabled?: boolean; onClick: () => void; icon: React.ReactNode; title: string; description: string }) {
  return <button type="button" onClick={onClick} disabled={disabled} className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors ${disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer"} ${selected ? "border-ink bg-ink/5" : "border-border bg-background hover:border-border-strong"}`}><span className="flex items-center gap-3">{icon}<span><span className="block text-sm font-semibold text-ink">{title}</span><span className="mt-1 block text-xs text-muted">{description}</span></span></span>{selected && <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />}</button>;
}
