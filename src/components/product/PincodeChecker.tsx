"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Truck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function PincodeChecker() {
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
      const res = await fetch(`/api/shipping/check-serviceability?pincode=${cleanPin}`);
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
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
        <Truck className="w-4 h-4 text-[#FF3B30]" />
        Check Delivery Availability & Serviceability
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Enter 6-digit Pincode (e.g. 110074)"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            maxLength={6}
            className="pl-9 h-10 text-xs bg-white border-slate-200 text-slate-900"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          variant="secondary"
          size="sm"
          className="h-10 px-4 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white gap-1.5"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Check"}
        </Button>
      </form>

      {status?.checked && (
        <div
          className={`p-3 rounded-xl text-xs flex items-start gap-2.5 border ${
            status.available
              ? "bg-red-50 border-red-200 text-slate-800"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {status.available ? (
            <CheckCircle2 className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-bold">{status.message}</p>
            {status.deliveryTime && (
              <p className="text-[11px] text-slate-600 mt-0.5">
                Courier Partner: <span className="font-bold text-slate-900">{status.courierName || "Shiprocket Express"}</span> • Estimated Delivery: <span className="font-extrabold text-slate-900">{status.deliveryTime}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
