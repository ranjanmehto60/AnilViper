"use client";

import React, { useState } from "react";
import { Check, Mail } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    toast.success("You are on the Viper list.");
  };

  return (
    <section className="bg-accent py-12 text-white sm:py-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-7 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <p className="mb-3 text-[10px] font-semibold tracking-[0.18em] text-white/65 uppercase">Stay in the loop</p>
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">New drops, useful kit notes, no noise.</h2>
        </div>
        {subscribed ? (
          <div className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink"><Check className="h-4 w-4 text-accent" /> You&apos;re on the list.</div>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-3.5 h-4 w-4 text-white/55" />
              <Input type="email" placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 rounded-full border-white/25 bg-white/10 pl-11 text-white placeholder:text-white/55 focus:border-white" />
            </div>
            <Button type="submit" className="h-12 rounded-full bg-white px-6 text-sm text-ink hover:bg-ink hover:text-white">Sign me up</Button>
          </form>
        )}
      </div>
    </section>
  );
}
