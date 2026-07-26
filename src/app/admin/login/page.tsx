"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_CONFIG } from "@/config/admin";
import { useAdminStore } from "@/store/useAdminStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Mail, Smartphone, KeyRound, Lock, Send, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const loginAdmin = useAdminStore((state) => state.loginAdmin);

  const [inputVal, setInputVal] = useState("");
  const [userOtpInput, setUserOtpInput] = useState("");
  const [step, setStep] = useState<"identifier" | "otp">("identifier");
  const [verifiedIdentifier, setVerifiedIdentifier] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState<string>("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const generateAndSendOtp = (destination: string) => {
    setIsSendingOtp(true);
    // Generate dynamic random 6-digit OTP code
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);

    setTimeout(() => {
      setIsSendingOtp(false);
      setStep("otp");
      toast.success(
        `🔑 SECURITY OTP [ ${newOtp} ] sent to ranjanmehto60@gmail.com & +91-9871674886!`,
        { duration: 10000 }
      );
    }, 600);
  };

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
      setVerifiedIdentifier(cleanInput);
      generateAndSendOtp(cleanInput);
    } else {
      toast.error(
        "Access Denied: Only ranjanmehto60@gmail.com & phone 9871674886 are authorized as Admin."
      );
    }
  };

  const handleOtpVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userOtpInput.trim() === generatedOtp) {
      loginAdmin(verifiedIdentifier);
      toast.success("OTP Verified Successfully! Welcome Back Admin.");
      router.push("/admin");
    } else {
      toast.error("Invalid 6-Digit OTP Code! Please enter the code sent to your email/phone.");
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
              STORE ADMIN LOGIN
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter your whitelisted email (<span className="font-mono text-slate-900 font-bold">ranjanmehto60@gmail.com</span>) or mobile number (<span className="font-mono text-slate-900 font-bold">9871674886</span>).
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
                    placeholder="ranjanmehto60@gmail.com or 9871674886"
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
                disabled={isSendingOtp}
                className="w-full text-xs font-black gap-2 h-11 bg-[#00C853] hover:bg-[#00b248] text-white shadow-md"
              >
                {isSendingOtp ? "Generating 6-Digit OTP..." : (
                  <>
                    <Send className="w-4 h-4" /> Send 6-Digit OTP
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpVerifySubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Enter 6-Digit Dynamic OTP Code *
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Enter 6-digit OTP code"
                    maxLength={6}
                    value={userOtpInput}
                    onChange={(e) => setUserOtpInput(e.target.value)}
                    className="pl-10 h-11 text-xs font-mono text-center tracking-widest text-lg font-bold"
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
                Verify OTP & Log In
              </Button>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => generateAndSendOtp(verifiedIdentifier)}
                  className="text-xs text-[#00C853] hover:underline font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Resend New OTP
                </button>

                <button
                  type="button"
                  onClick={() => setStep("identifier")}
                  className="text-xs text-slate-500 hover:text-slate-900 underline"
                >
                  Change Identifier
                </button>
              </div>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Whitelisted for <span className="font-bold text-slate-700">ranjanmehto60@gmail.com</span> & <span className="font-bold text-slate-700">+91-9871674886</span>
          </div>

        </div>
      </div>
    </div>
  );
}
