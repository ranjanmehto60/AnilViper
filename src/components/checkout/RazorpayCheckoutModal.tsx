"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/utils";
import { ShieldCheck, CheckCircle2, CreditCard, Smartphone, Building2, Lock, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface CartOrderLine {
  productId: string;
  size: number;
  quantity: number;
}

interface AddressPayload {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  items: CartOrderLine[];
  address: AddressPayload;
  discountCode?: string | null;
  onSuccess: (orderId: string, paymentId: string) => void;
}

export function RazorpayCheckoutModal({
  isOpen,
  onClose,
  totalAmount,
  customerName,
  customerPhone,
  items,
  address,
  discountCode,
  onSuccess,
}: RazorpayCheckoutModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  // Load Razorpay SDK script dynamically
  useEffect(() => {
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayNow = async () => {
    if (isProcessing || items.length === 0) return;
    setIsProcessing(true);

    try {
      // Helper function to safely parse JSON responses without throwing JSON syntax errors
      const parseJsonResponse = async (res: Response) => {
        const text = await res.text();
        if (!text || text.trim() === "") return {};
        try {
          return JSON.parse(text);
        } catch {
          return { error: text };
        }
      };

      // Step 1: Create Razorpay Order via Backend API
      const createResponse = await fetch("/api/payments/create-razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, address, discountCode }),
      });

      const created = await parseJsonResponse(createResponse);
      if (!createResponse.ok) {
        throw new Error(created.error || "Unable to initialize payment.");
      }

      const { orderId, razorpayOrderId, amount, currency, keyId } = created;

      // Step 2: Check if Razorpay JS SDK is loaded and Key ID is configured
      if (window.Razorpay && keyId && !keyId.includes("mock")) {
        onClose(); // Close modal while SDK opens

        const options = {
          key: keyId,
          amount: amount,
          currency: currency || "INR",
          name: "Viper Gears India",
          description: `Order ${orderId}`,
          order_id: razorpayOrderId,
          prefill: {
            name: customerName,
            contact: customerPhone,
          },
          theme: {
            color: "#FF3B30",
          },
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            toast.loading("Verifying payment & generating delivery shipment...", { id: "pay-verify" });
            try {
              const verifyResponse = await fetch("/api/payments/verify-razorpay-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              });

              const verifiedData = await parseJsonResponse(verifyResponse);
              if (!verifyResponse.ok) {
                throw new Error(verifiedData.error || "Payment verification failed.");
              }

              toast.dismiss("pay-verify");
              onSuccess(orderId, response.razorpay_payment_id);
            } catch (err) {
              toast.dismiss("pay-verify");
              toast.error(err instanceof Error ? err.message : "Payment verification failed.");
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      } else {
        // Dev Simulation Fallback when live keys are not set
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const paymentId = `pay_sim_${Math.floor(100000 + Math.random() * 900000)}`;

        const verifyResponse = await fetch("/api/payments/verify-razorpay-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            razorpayOrderId,
            razorpayPaymentId: paymentId,
            razorpaySignature: "simulated_sig",
          }),
        });

        const verifiedData = await parseJsonResponse(verifyResponse);
        if (!verifyResponse.ok) {
          throw new Error(verifiedData.error || "Payment processing failed.");
        }

        onSuccess(orderId, paymentId);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border-slate-200 text-slate-900 p-6 rounded-3xl shadow-2xl">
        <DialogHeader className="border-b border-slate-200 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#FF3B30]" /> Razorpay Gateway
            </DialogTitle>
            <span className="text-xs bg-red-50 text-[#FF6B61] font-bold px-2.5 py-0.5 rounded-full border border-red-200">
              SECURE CHECKOUT
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Paying <span className="text-[#FF3B30] font-black">{formatINR(totalAmount)}</span> to Viper Gears India
          </p>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Select Payment Mode:</label>

            <div
              onClick={() => setSelectedMethod("upi")}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedMethod === "upi"
                  ? "bg-red-50 border-[#FF3B30] shadow-sm"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-[#FF3B30]" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Instant UPI / QR Code</h4>
                  <p className="text-[10px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
                </div>
              </div>
              {selectedMethod === "upi" && <CheckCircle2 className="w-4 h-4 text-[#FF3B30]" />}
            </div>

            <div
              onClick={() => setSelectedMethod("card")}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedMethod === "card"
                  ? "bg-red-50 border-[#FF3B30] shadow-sm"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-[#FF3B30]" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Credit / Debit Cards</h4>
                  <p className="text-[10px] text-slate-500">Visa, Mastercard, RuPay, Maestro</p>
                </div>
              </div>
              {selectedMethod === "card" && <CheckCircle2 className="w-4 h-4 text-[#FF3B30]" />}
            </div>

            <div
              onClick={() => setSelectedMethod("netbanking")}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedMethod === "netbanking"
                  ? "bg-red-50 border-[#FF3B30] shadow-sm"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-[#FF3B30]" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Netbanking & Wallets</h4>
                  <p className="text-[10px] text-slate-500">HDFC, SBI, ICICI, Axis, Mobikwik</p>
                </div>
              </div>
              {selectedMethod === "netbanking" && <CheckCircle2 className="w-4 h-4 text-[#FF3B30]" />}
            </div>
          </div>

          <div className="bg-slate-100 p-3.5 rounded-xl text-[11px] text-slate-600 space-y-1">
            <p><span className="text-slate-900 font-semibold">Billed To:</span> {customerName || "Viper Athlete"} ({customerPhone || "+91-**********"})</p>
            <p className="flex items-center gap-1 text-red-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF3B30]" /> 256-Bit SSL Encrypted Secure Razorpay Payment
            </p>
          </div>

          <Button
            variant="default"
            size="lg"
            onClick={handlePayNow}
            disabled={isProcessing}
            className="w-full text-xs font-black gap-2 h-12 bg-[#FF3B30] hover:bg-[#D92D20] text-white shadow-lg shadow-red-500/20"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Connecting to Razorpay...
              </>
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