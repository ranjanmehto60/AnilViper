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
    <section className="py-20 bg-gradient-to-br from-[#1A0507] via-red-950 to-[#0A0B12] text-white relative overflow-hidden border-b border-[#FF3B30]/30 shadow-2xl">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF3B30]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl text-center space-y-6 relative z-10">
        
        <div className="inline-flex items-center gap-2 bg-red-950/80 border border-[#FF3B30]/40 px-4 py-1.5 rounded-full text-xs font-black text-[#FF3B30] shadow-md backdrop-blur-md">
          <Zap className="w-4 h-4 fill-[#FF3B30]" /> JOIN THE VIPER SQUAD
        </div>

        <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight bebas-font leading-none">
          GET <span className="text-[#FF3B30]">10% OFF</span> YOUR FIRST CHAMPIONSHIP DOBOK
        </h2>

        <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto leading-relaxed font-medium">
          Subscribe for exclusive dojang discounts, bulk academy offers, and early access to new WT Approved competition gear drops.
        </p>

        {subscribed ? (
          <div className="bg-zinc-950/90 border border-[#FF3B30] p-4 rounded-2xl max-w-md mx-auto flex items-center justify-center gap-2 text-xs text-white font-bold backdrop-blur-md shadow-xl">
            <CheckCircle2 className="w-5 h-5 text-[#FF3B30]" /> You&apos;re subscribed! Use promo code <span className="text-[#FF3B30] font-black underline">VIPER10</span> at checkout.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400" />
              <Input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11 h-12 text-xs bg-zinc-900/90 text-white border-zinc-700 focus:border-[#FF3B30] focus:ring-1 focus:ring-[#FF3B30] rounded-xl"
              />
            </div>
            <Button
              type="submit"
              variant="default"
              className="h-12 px-7 text-xs font-black uppercase tracking-wider bg-[#FF3B30] hover:bg-[#D92D20] text-black rounded-xl shadow-xl neon-crimson-glow"
            >
              Claim 10% Off
            </Button>
          </form>
        )}

      </div>
    </section>
  );
}

