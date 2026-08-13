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
  paymentMethod: "PREPAID" | "COD";
  codAmount?: number;
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
  paymentMethod,
  codAmount = 0,
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
        body: JSON.stringify({ items, address, discountCode, paymentMethod }),
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
          color: "#2563EB",
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
      <DialogContent className="max-w-md rounded-2xl border-border bg-surface p-6 text-foreground shadow-lg">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-base font-medium tracking-tight text-ink">
              <Lock className="h-4 w-4 text-accent" /> Secure payment
            </DialogTitle>
            <span className="rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] text-accent uppercase">
              Secure checkout
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">
            {paymentMethod === "COD" ? (
              <>
                Paying <span className="font-semibold text-ink">{formatINR(totalAmount)}</span> as COD booking fee ·{" "}
                <span className="text-muted">{formatINR(codAmount)}</span> payable at delivery
              </>
            ) : (
              <>
                Paying <span className="font-semibold text-ink">{formatINR(totalAmount)}</span> to Viper Gears India
              </>
            )}
          </p>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">Select payment mode</label>

            <div
              onClick={() => setSelectedMethod("upi")}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedMethod === "upi"
                  ? "border-ink bg-accent/10"
                  : "border-border bg-background hover:border-border-strong"
              }`}
            >
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-accent" />
                <div>
                  <h4 className="text-sm font-semibold text-ink">Instant UPI / QR code</h4>
                  <p className="text-[10px] text-muted">Google Pay, PhonePe, Paytm, BHIM</p>
                </div>
              </div>
              {selectedMethod === "upi" && <CheckCircle2 className="h-4 w-4 text-accent" />}
            </div>

            <div
              onClick={() => setSelectedMethod("card")}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedMethod === "card"
                  ? "border-ink bg-accent/10"
                  : "border-border bg-background hover:border-border-strong"
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-accent" />
                <div>
                  <h4 className="text-sm font-semibold text-ink">Credit / debit cards</h4>
                  <p className="text-[10px] text-muted">Visa, Mastercard, RuPay, Maestro</p>
                </div>
              </div>
              {selectedMethod === "card" && <CheckCircle2 className="h-4 w-4 text-accent" />}
            </div>

            <div
              onClick={() => setSelectedMethod("netbanking")}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedMethod === "netbanking"
                  ? "border-ink bg-accent/10"
                  : "border-border bg-background hover:border-border-strong"
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-accent" />
                <div>
                  <h4 className="text-sm font-semibold text-ink">Netbanking & wallets</h4>
                  <p className="text-[10px] text-muted">HDFC, SBI, ICICI, Axis, Mobikwik</p>
                </div>
              </div>
              {selectedMethod === "netbanking" && <CheckCircle2 className="h-4 w-4 text-accent" />}
            </div>
          </div>

          <div className="space-y-1 rounded-xl bg-surface-2 p-3.5 text-[11px] text-muted">
            <p><span className="font-semibold text-ink">Billed to:</span> {customerName || "Viper Athlete"} ({customerPhone || "+91-**********"})</p>
            <p className="flex items-center gap-1 font-semibold text-ink">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" /> 256-bit SSL encrypted Razorpay payment
            </p>
          </div>

          <Button
            variant="default"
            size="lg"
            onClick={handlePayNow}
            disabled={isProcessing}
            className="h-12 w-full gap-2 rounded-full bg-ink text-xs font-semibold text-white hover:bg-accent"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Connecting to Razorpay...
              </>
            ) : paymentMethod === "COD" ? (
              <>
                Pay {formatINR(totalAmount)} Booking & Place Order <ArrowRight className="w-4 h-4" />
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
