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
      <DialogContent className="max-w-md rounded-2xl border-border bg-surface p-6 text-foreground shadow-lg">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="flex items-center gap-2 text-base font-medium tracking-tight text-ink">
              <PackageSearch className="h-5 w-5 text-accent" /> Track shipment
            </DialogTitle>
            <span className="rounded-full border border-accent/25 bg-accent/10 px-2.5 py-1 text-[10px] font-semibold text-accent">
              AWB {awb}
            </span>
          </div>
          <DialogDescription className="mt-1 text-xs text-muted">
            Live courier status from Shiprocket
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-xs text-muted">
              <Loader2 className="h-4 w-4 animate-spin text-accent" /> Fetching tracking updates...
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
              <PackageX className="h-8 w-8 text-border-strong" />
              <p className="text-xs text-muted">{error}</p>
            </div>
          ) : tracking ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="text-[10px] font-semibold uppercase text-muted">Status</p>
                  <p className="mt-0.5 text-sm font-semibold text-accent">{tracking.status || "In Transit"}</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="text-[10px] font-semibold uppercase text-muted">Courier</p>
                  <p className="mt-0.5 text-sm font-semibold text-ink">{tracking.courierName || "Shiprocket Express"}</p>
                </div>
              </div>

              {tracking.eta && (
                <div className="flex items-center gap-2 rounded-xl border border-accent/25 bg-accent/10 px-4 py-3 text-xs font-semibold text-ink">
                  <Truck className="h-4 w-4 shrink-0 text-accent" />
                  Expected delivery by {formatEta(tracking.eta)}
                </div>
              )}

              {timelineScans.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted">
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
                                ? "border-accent bg-accent"
                                : "border-border-strong bg-surface"
                            }`}
                          />
                          {index < timelineScans.length - 1 && (
                            <div className="w-px flex-1 bg-border" />
                          )}
                        </div>
                        <div className={`pb-6 ${isLatest ? "" : ""}`}>
                          <p className={`text-xs font-semibold ${isLatest ? "text-accent" : "text-ink"}`}>
                            {scan.activity || "Shipment update"}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted">
                            <MapPin className="w-3 h-3" /> {scan.location || "—"}
                          </p>
                          {scan.date && (
                            <p className="mt-0.5 text-[11px] text-subtle">{formatScanDate(scan.date)}</p>
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
