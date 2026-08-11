"use client";

import React from "react";
import { PolicyLayout, PolicySection } from "@/components/content/PolicyLayout";

export default function TermsPage() {
  return <PolicyLayout title="Terms of service" label="Terms of service" meta="Effective date: July 2026"><PolicySection title="1. General overview"><p>This website is operated by Viper Gears, registered in Chattarpur, New Delhi, India. By purchasing a dobok, belt, or protective gear, you agree to these terms.</p></PolicySection><PolicySection title="2. Product specifications"><p>Products marked WT-approved are designed according to World Taekwondo rules. Sizing and manufacturing specifications may vary within normal production tolerance.</p></PolicySection><PolicySection title="3. Pricing and taxes"><p>Prices listed on vipergears.in are in Indian Rupees and include applicable GST. Prices may change without prior notice.</p></PolicySection><PolicySection title="4. Payments, COD, and cancellation"><p>Prepaid orders are processed through Razorpay. COD orders require the applicable online booking fee at checkout; the remaining balance is payable to the courier at delivery. Booking fees are non-refundable once the order is placed.</p></PolicySection><PolicySection title="5. Governing law"><p>Disputes are subject to the exclusive jurisdiction of the courts of New Delhi, India.</p></PolicySection></PolicyLayout>;
}
