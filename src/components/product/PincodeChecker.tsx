"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Truck, CheckCircle2, AlertCircle } from "lucide-react";

export function PincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState<{
    checked: boolean;
    available: boolean;
    message: string;
    deliveryTime?: string;
  } | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setStatus({
        checked: true,
        available: false,
        message: "Please enter a valid 6-digit Indian pincode.",
      });
      return;
    }

    const codeNum = parseInt(pincode.trim(), 10);
    if (codeNum >= 110001 && codeNum <= 110096) {
      setStatus({
        checked: true,
        available: true,
        message: "Express Same-Day / Next-Day Delivery available in Delhi NCR!",
        deliveryTime: "1-2 Business Days (Shiprocket Local)",
      });
    } else {
      setStatus({
        checked: true,
        available: true,
        message: "Standard Air Express Delivery Available across India.",
        deliveryTime: "3-5 Business Days (Delhivery Air)",
      });
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
        <Truck className="w-4 h-4 text-[#00C853]" />
        Check Delivery Availability & COD
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
        <Button type="submit" variant="secondary" size="sm" className="h-10 px-4 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white">
          Check
        </Button>
      </form>

      {status?.checked && (
        <div
          className={`p-3 rounded-xl text-xs flex items-start gap-2.5 border ${
            status.available
              ? "bg-emerald-50 border-emerald-200 text-slate-800"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {status.available ? (
            <CheckCircle2 className="w-4 h-4 text-[#00C853] shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-bold">{status.message}</p>
            {status.deliveryTime && (
              <p className="text-[11px] text-slate-600 mt-0.5">
                Estimated Delivery: <span className="font-extrabold text-slate-900">{status.deliveryTime}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
