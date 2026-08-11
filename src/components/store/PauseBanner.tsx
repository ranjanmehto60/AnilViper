"use client";

import { useEffect, useState } from "react";
import { PauseCircle } from "lucide-react";

interface StoreStatus {
  ordersPaused: boolean;
  message: string | null;
}

export function PauseBanner() {
  const [status, setStatus] = useState<StoreStatus | null>(null);

  useEffect(() => {
    fetch("/api/store-status", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data) setStatus(data);
      })
      .catch(() => {});
  }, []);

  if (!status?.ordersPaused) return null;

  return (
    <div className="border-b border-accent/25 bg-accent/10 text-ink">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-3 text-center sm:px-6">
        <PauseCircle className="h-5 w-5 shrink-0 text-accent" />
        <p className="text-xs font-semibold sm:text-sm">
          {status.message || "We are currently not accepting new orders. Please check back soon."}
        </p>
      </div>
    </div>
  );
}
