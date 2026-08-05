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
    <div className="bg-[#FF3B30]/10 border-b border-[#FF3B30]/30 text-[#FF3B30]">
      <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-3 text-center">
        <PauseCircle className="w-5 h-5 shrink-0" />
        <p className="text-xs sm:text-sm font-bold">
          {status.message || "We are currently not accepting new orders. Please check back soon."}
        </p>
      </div>
    </div>
  );
}
