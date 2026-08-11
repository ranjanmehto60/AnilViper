"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useWishlistStore } from "@/store/useWishlistStore";
import { formatINR } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product/ProductCard";
import { TrackingTimeline } from "@/components/shipping/TrackingTimeline";
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  KeyRound,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

interface AccountOrder {
  id: string;
  date: string;
  status: string;
  total: number;
  items: unknown[];
  courier: string | null;
  tracking: string | null;
  paymentStatus: string;
  paymentMethod?: "PREPAID" | "COD";
  codAmount?: number;
}

function AccountContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "orders";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInPhone, setLoggedInPhone] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [accountOrders, setAccountOrders] = useState<AccountOrder[]>([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [trackingAwb, setTrackingAwb] = useState<string | null>(null);

  const { items: wishlistItems } = useWishlistStore();

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) {
          setIsLoggedIn(true);
          setLoggedInPhone(data.phone || "");
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isLoggedIn || ordersLoaded) return;
    fetch("/api/account/orders", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.orders)) {
          setAccountOrders(data.orders);
        }
      })
      .catch(() => {})
      .finally(() => setOrdersLoaded(true));
  }, [isLoggedIn, ordersLoaded]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phoneInput)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsSendingOtp(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Unable to send OTP.");
        return;
      }
      setOtpSent(true);
      if (data.devOtp) {
        toast.info(`Dev mode: your OTP is ${data.devOtp} (not sent via SMS — add Twilio env vars).`);
      } else {
        toast.success(`OTP sent to +91-${phoneInput}`);
      }
    } catch {
      toast.error("Network error while sending OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otpInput)) {
      toast.error("Enter the 6-digit OTP sent to your phone.");
      return;
    }
    setIsVerifying(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneInput, otp: otpInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Invalid OTP. Please try again.");
        return;
      }
      setIsLoggedIn(true);
      setLoggedInPhone(phoneInput);
      setOrdersLoaded(false);
      toast.success("Logged in successfully! Welcome back athlete.");
    } catch {
      toast.error("Network error while verifying OTP.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/me", { method: "POST" });
    } catch {
      // session cookie will still expire server-side
    }
    setIsLoggedIn(false);
    setLoggedInPhone("");
    setAccountOrders([]);
    setOrdersLoaded(false);
    toast.info("Logged out of Viper Gears");
  };

  if (!isLoggedIn) {
    return (
      <div className="editorial-page min-h-screen py-16">
        <div className="mx-auto max-w-md px-4">
          <div className="surface-card space-y-6 rounded-2xl p-8 text-center">
            
            <div className="relative w-16 h-16 rounded-2xl bg-white border border-slate-200 p-1 mx-auto shadow-md overflow-hidden">
              <Image
                src="/images/viper-logo.jpg"
                alt="Viper Gears Brand Logo"
                fill
                className="object-contain p-1"
              />
            </div>

            <div>
              <h1 className="text-2xl font-medium tracking-tight text-ink">
                Viper athlete account
              </h1>
              <p className="mt-1 text-sm text-muted">
                Enter your mobile number to log in or create your Viper Gears account.
              </p>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-ink">Mobile number *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-xs font-semibold text-muted">+91</span>
                    <Input
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="pl-12 h-11 text-xs"
                      autoFocus
                    />
                  </div>
                </div>

                <Button type="submit" variant="default" size="lg" disabled={isSendingOtp} className="h-11 w-full rounded-full text-xs text-white">
                  {isSendingOtp ? "Sending OTP..." : "Send OTP Code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-ink">Enter 6-digit OTP *</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-muted" />
                    <Input
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="pl-10 h-11 text-xs font-mono text-center tracking-widest text-lg"
                      autoFocus
                    />
                  </div>
                </div>

                <Button type="submit" variant="default" size="lg" disabled={isVerifying} className="h-11 w-full rounded-full text-xs text-white">
                  {isVerifying ? "Verifying..." : "Verify & Log In"}
                </Button>

                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-xs text-muted underline hover:text-ink"
                >
                  Change Phone Number
                </button>
              </form>
            )}

            <div className="border-t border-border pt-4 text-[11px] text-muted">
              By logging in, you agree to Viper Gears Terms of Service and Privacy Policy.
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="editorial-page min-h-screen py-12">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6">
        
        {/* Header User Profile Banner */}
        <div className="surface-card flex flex-col items-center justify-between gap-6 rounded-2xl p-6 sm:flex-row sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent bg-accent/10 text-2xl font-semibold text-accent">
              VS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-medium tracking-tight text-ink">Athlete account</h1>
                <span className="rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold text-accent">
                  Viper member
                </span>
              </div>
              <p className="mt-0.5 flex items-center gap-2 text-xs font-medium text-muted">
                <span>Logged in as +91-{loggedInPhone || "••••••••••"}</span>
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-1.5 rounded-full text-xs"
          >
            <LogOut className="w-4 h-4 text-red-500" /> Log Out
          </Button>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList className="h-auto w-full justify-start rounded-2xl border border-border bg-surface p-1.5 shadow-sm">
            <TabsTrigger value="orders" className="gap-2 py-2.5">
              <Package className="w-4 h-4" /> My Orders ({accountOrders.length})
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-2 py-2.5">
              <Heart className="w-4 h-4" /> Saved Wishlist ({wishlistItems.length})
            </TabsTrigger>
            <TabsTrigger value="addresses" className="gap-2 py-2.5">
              <MapPin className="w-4 h-4" /> Saved Addresses
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2 py-2.5">
              <User className="w-4 h-4" /> Profile Details
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4 pt-4">
            {accountOrders.length === 0 ? (
              <div className="surface-card rounded-2xl p-8 text-center text-sm text-muted">
                No orders yet. Place an order from the shop and it will appear here.
              </div>
            ) : (
              accountOrders.map((order) => (
                <div key={order.id} className="surface-card space-y-4 rounded-2xl p-6">
                  <div className="flex flex-col justify-between gap-2 border-b border-border pb-3 sm:flex-row sm:items-center">
                    <div>
                      <span className="font-mono text-xs font-semibold text-accent">{order.id}</span>
                      <span className="ml-3 text-xs font-medium text-muted">Placed on {order.date}</span>
                    </div>
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full w-fit ${
                      order.status === "Delivered" ? "border border-accent/25 bg-accent/10 text-accent" : "border border-border bg-surface-2 text-muted"
                    }`}>
                      Status: {order.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {(order.items as { name: string; size: number; quantity: number; lineTotal: number }[]).map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-xs">
                        <div>
                          <h4 className="text-sm font-semibold text-ink">{item.name}</h4>
                          <p className="mt-0.5 text-muted">Size: {item.size} cm × {item.quantity}</p>
                        </div>
                        <span className="font-semibold text-ink">{formatINR(item.lineTotal)}</span>
                      </div>
                    ))}
                    {order.tracking && (
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <p className="text-xs text-muted">Courier: {order.courier} (AWB: {order.tracking})</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTrackingAwb(order.tracking)}
                          className="h-8 gap-1.5 rounded-full border-accent text-[10px] text-accent hover:bg-accent/10"
                        >
                          <Truck className="w-3.5 h-3.5" /> Track
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-3 text-xs">
                    <span className="font-semibold text-muted">
                      Payment: {order.paymentStatus}
                      {order.paymentMethod === "COD" && ` · COD (${formatINR(order.codAmount || 0)} at delivery)`}
                    </span>
                    <span className="text-base font-semibold text-ink">{formatINR(order.total)}</span>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="pt-4">
            {wishlistItems.length === 0 ? (
              <div className="surface-card rounded-2xl p-6 py-16 text-center text-sm text-muted">
                No items saved to your wishlist yet. Browse the catalog and click the heart icon on any product!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="pt-4">
            <div className="surface-card max-w-lg space-y-3 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-ink">Default delivery address</h3>
                <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold text-white">Default</span>
              </div>
              <div className="space-y-1 text-xs text-muted">
                <p className="font-semibold text-ink">Athlete</p>
                <p>House 42, Ward 3, Main Market</p>
                <p>Chattarpur, Delhi - 110074</p>
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="pt-4">
            <div className="surface-card max-w-lg space-y-4 rounded-2xl p-6">
              <h3 className="border-b border-border pb-2 text-sm font-semibold text-ink">Profile information</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="mb-1 block font-semibold text-muted">Academy / Dojang</label>
                  <Input value="Delhi Taekwondo Academy (Chattarpur)" readOnly className="bg-background" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

      </div>

      {trackingAwb && (
        <TrackingTimeline
          awb={trackingAwb}
          open={trackingAwb !== null}
          onOpenChange={(open) => { if (!open) setTrackingAwb(null); }}
        />
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="editorial-page flex min-h-screen items-center justify-center text-sm text-muted">Loading account...</div>}>
      <AccountContent />
    </Suspense>
  );
}
