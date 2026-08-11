"use client";

import React from "react";
import { PolicyLayout, PolicySection } from "@/components/content/PolicyLayout";

export default function ShippingPolicyPage() {
  return <PolicyLayout title="Shipping policy" label="Shipping policy"><div className="rounded-xl border border-accent/25 bg-accent/10 p-4 text-sm font-semibold text-ink">Shipping fees and thresholds are calculated at checkout based on the items in your order.</div><PolicySection title="1. Dispatch timelines"><p>Orders are fulfilled from our Chattarpur, Delhi warehouse. Dispatch timing may vary by order volume and payment confirmation.</p></PolicySection><PolicySection title="2. Delivery timeframe"><ul className="list-inside list-disc space-y-1"><li><strong className="font-semibold text-ink">Delhi NCR and North India:</strong> typically 1–2 business days.</li><li><strong className="font-semibold text-ink">Major metros:</strong> typically 2–4 business days.</li><li><strong className="font-semibold text-ink">Rest of India:</strong> typically 3–5 business days.</li></ul></PolicySection><PolicySection title="3. COD and tracking"><p>COD is available for selected pincodes. Tracking details are shared by SMS or WhatsApp once the courier scans the shipment.</p></PolicySection></PolicyLayout>;
}
