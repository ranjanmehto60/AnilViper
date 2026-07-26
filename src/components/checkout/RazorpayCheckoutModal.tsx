"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import { ShieldCheck, CheckCircle2, CreditCard, Smartphone, Building2, Lock, ArrowRight } from "lucide-react";

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  onSuccess: (paymentId: string) => void;
}

export function RazorpayCheckoutModal({
  isOpen,
  onClose,
  totalAmount,
  customerName,
  customerPhone,
  onSuccess,
}: RazorpayCheckoutModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayNow = async () => {
    setIsProcessing(true);
    await new Promise((res) => setTimeout(res, 1200));
    setIsProcessing(false);
    const mockPaymentId = `pay_VIPER_${Math.floor(100000 + Math.random() * 900000)}`;
    onSuccess(mockPaymentId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border-slate-200 text-slate-900 p-6 rounded-3xl shadow-2xl">
        <DialogHeader className="border-b border-slate-200 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#00C853]" /> Razorpay Gateway
            </DialogTitle>
            <span className="text-xs bg-emerald-50 text-[#008137] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              TEST MODE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Paying <span className="text-[#00C853] font-black">{formatINR(totalAmount)}</span> to Viper Gears India
          </p>
        </DialogHeader>

        {/* Payment Methods */}
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Select Payment Mode:</label>

            {/* UPI Option */}
            <div
              onClick={() => setSelectedMethod("upi")}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedMethod === "upi"
                  ? "bg-emerald-50 border-[#00C853] shadow-sm"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-[#00C853]" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Instant UPI / QR Code</h4>
                  <p className="text-[10px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
                </div>
              </div>
              {selectedMethod === "upi" && <CheckCircle2 className="w-4 h-4 text-[#00C853]" />}
            </div>

            {/* Card Option */}
            <div
              onClick={() => setSelectedMethod("card")}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedMethod === "card"
                  ? "bg-emerald-50 border-[#00C853] shadow-sm"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-[#00C853]" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Credit / Debit Cards</h4>
                  <p className="text-[10px] text-slate-500">Visa, Mastercard, RuPay, Maestro</p>
                </div>
              </div>
              {selectedMethod === "card" && <CheckCircle2 className="w-4 h-4 text-[#00C853]" />}
            </div>

            {/* Netbanking Option */}
            <div
              onClick={() => setSelectedMethod("netbanking")}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedMethod === "netbanking"
                  ? "bg-emerald-50 border-[#00C853] shadow-sm"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-[#00C853]" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Netbanking & Wallets</h4>
                  <p className="text-[10px] text-slate-500">HDFC, SBI, ICICI, Axis, Mobikwik</p>
                </div>
              </div>
              {selectedMethod === "netbanking" && <CheckCircle2 className="w-4 h-4 text-[#00C853]" />}
            </div>
          </div>

          <div className="bg-slate-100 p-3.5 rounded-xl text-[11px] text-slate-600 space-y-1">
            <p><span className="text-slate-900 font-semibold">Billed To:</span> {customerName || "Viper Athlete"} ({customerPhone || "+91-9871674886"})</p>
            <p className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00C853]" /> 256-Bit SSL Encrypted Secure Razorpay Payment
            </p>
          </div>

          <Button
            variant="default"
            size="lg"
            onClick={handlePayNow}
            disabled={isProcessing}
            className="w-full text-xs font-black gap-2 h-12 bg-[#00C853] hover:bg-[#00b248] text-white shadow-lg shadow-emerald-500/20"
          >
            {isProcessing ? (
              <span>Connecting to Razorpay...</span>
            ) : (
              <>
                Pay {formatINR(totalAmount)} Now <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
