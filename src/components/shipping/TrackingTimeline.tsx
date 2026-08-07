"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PackageSearch, Truck, MapPin, Loader2, PackageX } from "lucide-react";

interface TrackingScan {
  location: string;
  activity: string;
  date: string;
}

interface TrackingData {
  awb: string;
  status: string;
  courierName?: string;
  currentStatus?: string;
  eta?: string;
  scans: TrackingScan[];
}

interface TrackingTimelineProps {
  awb: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatScanDate(raw: string): string {
  if (!raw) return "";
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})[\sT](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return raw;
  const [, year, month, day, hour, minute] = match;
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute)
  );
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatEta(raw: string): string {
  if (!raw) return "";
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return raw;
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function TrackingTimeline({ awb, open, onOpenChange }: TrackingTimelineProps) {
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTracking = useCallback(async () => {
    if (!awb) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/shipping/track/${encodeURIComponent(awb)}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to fetch tracking details.");
      }
      setTracking(data.tracking as TrackingData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to fetch tracking details.");
    } finally {
      setLoading(false);
    }
  }, [awb]);

  useEffect(() => {
    if (open) {
      setTracking(null);
      loadTracking();
    }
  }, [open, loadTracking]);

  const latestScans = tracking?.scans ?? [];
  const timelineScans = [...latestScans].reverse(); // oldest → newest

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white border-slate-200 text-slate-900 p-6 rounded-3xl shadow-2xl">
        <DialogHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="text-base font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <PackageSearch className="w-5 h-5 text-[#FF3B30]" /> Track Shipment
            </DialogTitle>
            <span className="text-[10px] bg-red-50 text-[#FF6B61] font-bold px-2.5 py-0.5 rounded-full border border-red-200">
              AWB {awb}
            </span>
          </div>
          <DialogDescription className="text-xs text-slate-500 mt-1">
            Live courier status from Shiprocket
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-xs text-slate-500 gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#FF3B30]" /> Fetching tracking updates...
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
              <PackageX className="w-8 h-8 text-slate-300" />
              <p className="text-xs text-slate-500">{error}</p>
            </div>
          ) : tracking ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                  <p className="text-[10px] uppercase font-extrabold text-slate-500">Status</p>
                  <p className="text-sm font-black text-[#FF3B30] mt-0.5">{tracking.status || "In Transit"}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
                  <p className="text-[10px] uppercase font-extrabold text-slate-500">Courier</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{tracking.courierName || "Shiprocket Express"}</p>
                </div>
              </div>

              {tracking.eta && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-xs text-red-700 font-bold">
                  <Truck className="w-4 h-4 text-[#FF3B30] shrink-0" />
                  Expected delivery by {formatEta(tracking.eta)}
                </div>
              )}

              {timelineScans.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">
                  No tracking scans available yet. The shipment is being processed.
                </p>
              ) : (
                <div className="space-y-0">
                  {timelineScans.map((scan, index) => {
                    const isLatest = index === timelineScans.length - 1;
                    return (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-3 h-3 rounded-full border-2 mt-1 shrink-0 ${
                              isLatest
                                ? "bg-[#FF3B30] border-[#FF3B30]"
                                : "bg-white border-slate-300"
                            }`}
                          />
                          {index < timelineScans.length - 1 && (
                            <div className="w-px flex-1 bg-slate-200" />
                          )}
                        </div>
                        <div className={`pb-6 ${isLatest ? "" : ""}`}>
                          <p className={`text-xs font-black ${isLatest ? "text-[#FF3B30]" : "text-slate-900"}`}>
                            {scan.activity || "Shipment update"}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {scan.location || "—"}
                          </p>
                          {scan.date && (
                            <p className="text-[11px] text-slate-400 mt-0.5">{formatScanDate(scan.date)}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
