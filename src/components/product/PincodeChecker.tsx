"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Truck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function PincodeChecker({ weightKg = 1 }: { weightKg?: number }) {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    checked: boolean;
    available: boolean;
    message: string;
    courierName?: string;
    deliveryTime?: string;
  } | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setStatus({
        checked: true,
        available: false,
        message: "Please enter a valid 6-digit Indian pincode.",
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`/api/shipping/check-serviceability?pincode=${cleanPin}&weight=${weightKg}`);
      const text = await res.text();
      let data: { available?: boolean; courierName?: string; message?: string; estimatedDays?: string; etd?: string; error?: string } = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { error: text || "Invalid response format" };
      }

      if (!res.ok) {
        throw new Error(data.error || "Pincode serviceability check failed.");
      }

      if (data.available) {
        setStatus({
          checked: true,
          available: true,
          courierName: data.courierName,
          message: data.message || `Delivery available to ${cleanPin}`,
          deliveryTime: data.estimatedDays || data.etd || "2-4 Business Days",
        });
      } else {
        setStatus({
          checked: true,
          available: false,
          message: data.message || "Pincode is unserviceable.",
        });
      }
    } catch (err) {
      setStatus({
        checked: true,
        available: false,
        message: err instanceof Error ? err.message : "Unable to verify pincode.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-border bg-background p-4">
      <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-ink uppercase">
        <Truck className="h-4 w-4 text-accent" />
        Check delivery availability
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-subtle" />
          <Input
            placeholder="Enter 6-digit Pincode (e.g. 110074)"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            maxLength={6}
            className="h-10 bg-surface pl-9 text-xs text-foreground"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          variant="secondary"
          size="sm"
          className="h-10 gap-1.5 rounded-full bg-ink px-4 text-xs font-semibold text-white hover:bg-accent"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Check"}
        </Button>
      </form>

      {status?.checked && (
        <div
          className={`p-3 rounded-xl text-xs flex items-start gap-2.5 border ${
            status.available
              ? "border-accent/25 bg-accent/10 text-ink"
              : "border-danger/25 bg-danger/10 text-danger"
          }`}
        >
          {status.available ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
          )}
          <div>
            <p className="font-bold">{status.message}</p>
            {status.deliveryTime && (
              <p className="mt-0.5 text-[11px] text-muted">
                Courier: <span className="font-semibold text-ink">{status.courierName || "Shiprocket Express"}</span> • Estimated delivery: <span className="font-semibold text-ink">{status.deliveryTime}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
