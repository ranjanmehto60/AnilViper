"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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

function AccountContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "orders";

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const { items: wishlistItems } = useWishlistStore();

  useEffect(() => {
    const saved = localStorage.getItem("viper_user_logged_in");
    if (saved === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[0-9]{10}$/.test(phoneInput)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    setOtpSent(true);
    toast.success(`OTP 8888 sent to +91-${phoneInput}`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === "8888" || otpInput.length === 4) {
      setIsLoggedIn(true);
      localStorage.setItem("viper_user_logged_in", "true");
      toast.success("Logged in successfully! Welcome back athlete.");
    } else {
      toast.error("Invalid OTP! Enter '8888'");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("viper_user_logged_in");
    toast.info("Logged out of Viper Gears");
  };

  const mockOrders = [
    {
      id: "ORD_VIPER_948102",
      date: "18 July 2026",
      status: "Delivered",
      total: 2999,
      item: "KPNP Competition Taekwondo Dobok – India Edition (170 cm)",
      courier: "Delhivery Air",
      tracking: "DLV9817264821",
    },
    {
      id: "ORD_VIPER_884192",
      date: "02 June 2026",
      status: "Shipped",
      total: 1899,
      item: "Viper WT Sparring Arm & Shin Guards Combo (180 cm)",
      courier: "Shiprocket Express",
      tracking: "SR881920194",
    },
  ];

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
                      placeholder="9871674886"
                      maxLength={10}
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="pl-12 h-11 text-xs"
                      autoFocus
                    />
                  </div>
                </div>

                <Button type="submit" variant="default" size="lg" className="w-full text-xs font-black h-11 bg-[#00C853] hover:bg-[#00b248] text-white shadow-md">
                  Send OTP Code
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-slate-700 uppercase">Enter 4-Digit OTP (Use 8888) *</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="8888"
                      maxLength={4}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="pl-10 h-11 text-xs font-mono text-center tracking-widest text-lg"
                      autoFocus
                    />
                  </div>
                </div>

                <Button type="submit" variant="default" size="lg" className="w-full text-xs font-black h-11 bg-[#00C853] hover:bg-[#00b248] text-white shadow-md">
                  Verify & Log In
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
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-[#00C853] flex items-center justify-center text-[#00C853] text-2xl font-black shadow-sm">
              VS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 uppercase">Vikram Sharma</h1>
                <span className="bg-emerald-50 text-[#008137] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  BLACK BELT ATHLETE
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-medium">
                <span>📞 +91-9871674886</span>
                <span>•</span>
                <span>📍 Chattarpur, Delhi</span>
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
              <Package className="w-4 h-4" /> My Orders ({mockOrders.length})
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
            {mockOrders.map((order) => (
              <div key={order.id} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div>
                    <span className="text-xs font-mono text-[#00C853] font-bold">{order.id}</span>
                    <span className="text-xs text-slate-500 ml-3 font-medium">Placed on {order.date}</span>
                  </div>
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full w-fit ${
                    order.status === "Delivered" ? "bg-emerald-50 text-[#008137] border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>
                    Status: {order.status}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{order.item}</h4>
                    <p className="text-slate-500 mt-0.5">Courier: {order.courier} (Tracking: {order.tracking})</p>
                  </div>
                  <span className="text-base font-black text-[#00C853]">{formatINR(order.total)}</span>
                </div>
              </div>
            ))}
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
                <span className="text-[10px] bg-[#00C853] text-white font-extrabold px-2 py-0.5 rounded-full">DEFAULT</span>
              </div>
              <div className="text-xs text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">Vikram Sharma</p>
                <p>House 42, Ward 3, Main Market</p>
                <p>Chattarpur, Delhi - 110074</p>
                <p className="text-slate-500">Phone: +91-9871674886</p>
              </div>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="pt-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 max-w-lg shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-100 pb-2">Profile Information</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-500 block font-semibold mb-1">Full Name</label>
                  <Input value="Vikram Sharma" readOnly className="bg-slate-50" />
                </div>
                <div>
                  <label className="text-slate-500 block font-semibold mb-1">Mobile Number</label>
                  <Input value="+91-9871674886" readOnly className="bg-slate-50" />
                </div>
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
