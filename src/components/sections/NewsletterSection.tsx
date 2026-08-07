"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Zap, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    toast.success("Welcome to Viper Squad! Your 10% discount code 'VIPER10' is active.");
  };

  return (
    <section className="py-16 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden shadow-inner">
      <div className="container mx-auto px-4 max-w-4xl text-center space-y-4">
        
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-3.5 py-1 rounded-full text-xs font-bold text-white shadow-sm">
          <Zap className="w-3.5 h-3.5 fill-white" /> JOIN THE VIPER SQUAD
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight bebas-font">
          GET 10% OFF YOUR FIRST TAEKWONDO UNIFORM
        </h2>

        <p className="text-xs sm:text-sm text-red-100 max-w-lg mx-auto leading-relaxed">
          Subscribe for exclusive dojang discounts, bulk academy offers, and early access to new WT Approved competition gear drops.
        </p>

        {subscribed ? (
          <div className="bg-white/20 border border-white/40 p-4 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-2 text-xs text-white font-bold backdrop-blur-md">
            <CheckCircle2 className="w-5 h-5 text-white" /> You&apos;re subscribed! Use promo code <span className="underline font-black">VIPER10</span> at checkout.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <Input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11 text-xs bg-white text-slate-900 border-white focus:ring-2 focus:ring-red-300"
              />
            </div>
            <Button type="submit" variant="default" className="h-11 px-6 text-xs font-black bg-slate-900 hover:bg-slate-800 text-white shadow-lg">
              Claim 10% Off
            </Button>
          </form>
        )}

      </div>
    </section>
  );
}
