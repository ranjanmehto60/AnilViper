"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Mail, KeyRound, Lock, Send, RotateCcw, Smartphone } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [step, setStep] = useState<"identifier" | "otp">("identifier");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [twilioStatus, setTwilioStatus] = useState("");

  const sendOtp = async () => {
    if (!identifier.trim()) {
      toast.error("Enter your admin email or phone.");
      return;
    }

    setIsSendingOtp(true);
    setTwilioStatus("");
    try {
      const res = await fetch("/api/admin/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setTwilioStatus(`⚠️ ${data.error || "Unable to send OTP"}`);
        toast.error(data.error || "Unable to send OTP.");
        return;
      }
      setStep("otp");
      if (data.devOtp) {
        setTwilioStatus(`🔧 Dev mode: your OTP is ${data.devOtp} (Twilio not configured)`);
        toast.info(`Dev mode: your OTP is ${data.devOtp}`);
      } else {
        setTwilioStatus("📱 SMS OTP sent via Twilio to +91-9871674886");
        toast.success("SMS OTP sent via Twilio!");
      }
    } catch {
      setTwilioStatus("⚠️ Network error connecting to OTP service");
      toast.error("Network error connecting to OTP service.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleIdentifierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendOtp();
  };

  const handleOtpVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otpInput.trim())) {
      toast.error("Enter the 6-digit OTP sent to your phone.");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), otp: otpInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Invalid OTP. Please try again.");
        return;
      }
      toast.success("Verified successfully! Welcome back Admin.");
      router.push("/admin");
    } catch {
      toast.error("Network error while verifying OTP.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] py-20 min-h-screen text-slate-900 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-md">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-2xl text-center">
          
          <div className="relative w-16 h-16 rounded-2xl bg-slate-900 p-2 mx-auto shadow-md overflow-hidden flex items-center justify-center text-[#FF3B30]">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 px-3 py-1 rounded-full text-xs font-bold text-[#FF6B61] mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF3B30]" /> SECURE ADMIN PORTAL
            </div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-wider">
              STORE ADMIN LOGIN
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              OTP is verified server-side. Only authorized identifiers can log in.
            </p>
          </div>

          {step === "identifier" ? (
            <form onSubmit={handleIdentifierSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Admin Email or Phone *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="ranjanmehto60@gmail.com or 9871674886"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-10 h-11 text-xs"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={isSendingOtp}
                className="w-full text-xs font-black gap-2 h-11 bg-[#FF3B30] hover:bg-[#D92D20] text-white shadow-md"
              >
                {isSendingOtp ? "Sending SMS OTP via Twilio..." : (
                  <>
                    <Send className="w-4 h-4" /> Send OTP via Twilio
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpVerifySubmit} className="space-y-4 text-left">
              <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-center space-y-1 shadow-sm">
                <Smartphone className="w-5 h-5 text-[#FF3B30] mx-auto" />
                <h4 className="text-xs font-black uppercase text-slate-900">
                  OTP DISPATCHED
                </h4>
                {twilioStatus && (
                  <p className="text-[11px] font-bold text-slate-700">{twilioStatus}</p>
                )}
                <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                  The code is valid for 10 minutes and is never shown on screen.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Enter 6-Digit OTP *
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Enter SMS OTP"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="pl-10 h-11 text-xs font-mono text-center tracking-widest text-lg font-bold"
                    maxLength={6}
                    autoFocus
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={isVerifying}
                className="w-full text-xs font-black h-11 bg-[#FF3B30] hover:bg-[#D92D20] text-white shadow-md"
              >
                {isVerifying ? "Verifying..." : "Verify & Log In"}
              </Button>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={isSendingOtp}
                  className="text-xs text-[#FF3B30] hover:underline font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Resend SMS OTP
                </button>

                <button
                  type="button"
                  onClick={() => { setStep("identifier"); setOtpInput(""); }}
                  className="text-xs text-slate-500 hover:text-slate-900 underline"
                >
                  Change Identifier
                </button>
              </div>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Access is restricted to the authorized store owner.
          </div>

        </div>
      </div>
    </div>
  );
}