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
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  KeyRound,
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
      <div className="bg-[#F8FAFC] py-16 min-h-screen text-slate-900">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-xl text-center">
            
            <div className="relative w-16 h-16 rounded-2xl bg-white border border-slate-200 p-1 mx-auto shadow-md overflow-hidden">
              <Image
                src="/images/viper-logo.jpg"
                alt="Viper Gears Brand Logo"
                fill
                className="object-contain p-1"
              />
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wider">
                Viper Athlete Portal
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Enter your mobile number to log in or create your Viper Gears account.
              </p>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-slate-700 uppercase">Mobile Number *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-xs text-slate-400 font-bold">+91</span>
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

                <Button type="submit" variant="default" size="lg" disabled={isSendingOtp} className="w-full text-xs font-black h-11 bg-[#FF3B30] hover:bg-[#D92D20] text-white shadow-md">
                  {isSendingOtp ? "Sending OTP..." : "Send OTP Code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-slate-700 uppercase">Enter 6-Digit OTP *</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
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

                <Button type="submit" variant="default" size="lg" disabled={isVerifying} className="w-full text-xs font-black h-11 bg-[#FF3B30] hover:bg-[#D92D20] text-white shadow-md">
                  {isVerifying ? "Verifying..." : "Verify & Log In"}
                </Button>

                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-xs text-slate-500 hover:text-slate-900 underline"
                >
                  Change Phone Number
                </button>
              </form>
            )}

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
              By logging in, you agree to Viper Gears Terms of Service and Privacy Policy.
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] py-12 min-h-screen text-slate-900">
      <div className="container mx-auto px-4 space-y-8">
        
        {/* Header User Profile Banner */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-[#FF3B30] flex items-center justify-center text-[#FF3B30] text-2xl font-black shadow-sm">
              VS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 uppercase">Athlete Account</h1>
                <span className="bg-red-50 text-[#FF6B61] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-red-200">
                  BLACK BELT ATHLETE
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                <span>Logged in as +91-{loggedInPhone || "••••••••••"}</span>
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-xs border-slate-300 text-slate-700 hover:bg-slate-100 gap-1.5"
          >
            <LogOut className="w-4 h-4 text-red-500" /> Log Out
          </Button>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList className="w-full justify-start bg-white border border-slate-200 p-1.5 rounded-2xl h-auto shadow-sm">
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
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-xs text-slate-500 shadow-sm">
                No orders yet. Place an order from the shop and it will appear here.
              </div>
            ) : (
              accountOrders.map((order) => (
                <div key={order.id} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <span className="text-xs font-mono text-[#FF3B30] font-bold">{order.id}</span>
                      <span className="text-xs text-slate-500 ml-3 font-medium">Placed on {order.date}</span>
                    </div>
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full w-fit ${
                      order.status === "Delivered" ? "bg-red-50 text-[#FF6B61] border border-red-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      Status: {order.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {(order.items as { name: string; size: number; quantity: number; lineTotal: number }[]).map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-xs">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                          <p className="text-slate-500 mt-0.5">Size: {item.size} cm × {item.quantity}</p>
                        </div>
                        <span className="font-bold text-slate-900">{formatINR(item.lineTotal)}</span>
                      </div>
                    ))}
                    {order.tracking && (
                      <p className="text-xs text-slate-500 pt-1">Courier: {order.courier} (Tracking: {order.tracking})</p>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-3">
                    <span className="text-slate-500 font-semibold">Payment: {order.paymentStatus}</span>
                    <span className="text-base font-black text-[#FF3B30]">{formatINR(order.total)}</span>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="pt-4">
            {wishlistItems.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-6 text-slate-500 text-xs shadow-sm">
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
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 max-w-lg shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase">Default Delivery Address</h3>
                <span className="text-[10px] bg-[#FF3B30] text-white font-extrabold px-2 py-0.5 rounded-full">DEFAULT</span>
              </div>
              <div className="text-xs text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">Athlete</p>
                <p>House 42, Ward 3, Main Market</p>
                <p>Chattarpur, Delhi - 110074</p>
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="pt-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 max-w-lg shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-100 pb-2">Profile Information</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-500 block font-semibold mb-1">Academy / Dojang</label>
                  <Input value="Delhi Taekwondo Academy (Chattarpur)" readOnly className="bg-slate-50" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading Account...</div>}>
      <AccountContent />
    </Suspense>
  );
}
