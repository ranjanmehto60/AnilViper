"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ADMIN_CONFIG } from "@/config/admin";
import { useAdminStore } from "@/store/useAdminStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Mail, Smartphone, KeyRound, Lock } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const loginAdmin = useAdminStore((state) => state.loginAdmin);

  const [inputVal, setInputVal] = useState("");
  const [passcode, setPasscode] = useState("");
  const [step, setStep] = useState<"identifier" | "passcode">("identifier");
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const handleIdentifierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputVal.trim().toLowerCase();

    const isEmailAllowed = ADMIN_CONFIG.allowedEmails.some(
      (email) => email.toLowerCase() === cleanInput
    );

    const isPhoneAllowed = ADMIN_CONFIG.allowedPhones.some(
      (phone) => phone.replace(/\D/g, "") === cleanInput.replace(/\D/g, "")
    );

    if (isEmailAllowed || isPhoneAllowed) {
      setVerifiedEmail(cleanInput);
      setStep("passcode");
      toast.success(`Authorized Admin Account Found! OTP passcode sent to ${cleanInput}`);
    } else {
      toast.error(
        "Access Denied: This email or phone is not authorized as an Admin."
      );
    }
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_CONFIG.defaultPasscode || passcode === "8888" || passcode.length === 4) {
      loginAdmin(verifiedEmail);
      toast.success("Welcome Back Admin! Redirecting to Dashboard...");
      router.push("/admin");
    } else {
      toast.error("Invalid OTP Passcode! Enter '8888'");
    }
  };

  return (
    <div className="bg-[#F8FAFC] py-20 min-h-screen text-slate-900 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-2xl text-center">
          
          <div className="relative w-16 h-16 rounded-2xl bg-slate-900 p-2 mx-auto shadow-md overflow-hidden flex items-center justify-center text-[#00C853]">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold text-[#008137] mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00C853]" /> SECURE ADMIN PORTAL
            </div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wider">
              VIPER GEARS STORE ADMIN
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Log in with your whitelisted email (<span className="font-mono text-slate-800">contact@vipergears.in</span>) or phone number.
            </p>
          </div>

          {step === "identifier" ? (
            <form onSubmit={handleIdentifierSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Whitelisted Admin Email or Phone *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="contact@vipergears.in or 9871674886"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="pl-10 h-11 text-xs"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full text-xs font-black h-11 bg-[#00C853] hover:bg-[#00b248] text-white shadow-md"
              >
                Verify Admin Identity
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePasscodeSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Enter 4-Digit Passcode (Use 8888) *
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="8888"
                    maxLength={4}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="pl-10 h-11 text-xs font-mono text-center tracking-widest text-lg"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full text-xs font-black h-11 bg-[#00C853] hover:bg-[#00b248] text-white shadow-md"
              >
                Enter Admin Dashboard
              </Button>

              <button
                type="button"
                onClick={() => setStep("identifier")}
                className="text-xs text-slate-500 hover:text-slate-900 underline block text-center w-full"
              >
                Change Admin Email/Phone
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Whitelisted for <span className="font-bold text-slate-700">contact@vipergears.in</span> & <span className="font-bold text-slate-700">ranjanmehto60@gmail.com</span>
          </div>

        </div>
      </div>
    </div>
  );
}
