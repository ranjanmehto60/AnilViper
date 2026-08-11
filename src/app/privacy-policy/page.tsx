"use client";

import React from "react";
import { PolicyLayout, PolicySection } from "@/components/content/PolicyLayout";

export default function PrivacyPolicyPage() {
  return <PolicyLayout title="Privacy policy" label="Privacy policy" meta="Last updated: July 2026"><PolicySection title="1. Information we collect"><p>Viper Gears, headquartered in Chattarpur, New Delhi, India, collects the personal information needed to process Taekwondo uniform and sparring gear orders, including your name, shipping address, mobile number, and email address.</p></PolicySection><PolicySection title="2. Payment security"><p>Online transactions are processed securely through Razorpay. We do not store credit card numbers, debit card PINs, or UPI passwords on our servers.</p></PolicySection><PolicySection title="3. Shipping data sharing"><p>Your delivery address and phone number are shared only with authorized logistics partners, including Shiprocket and Delhivery, to deliver your package.</p></PolicySection><PolicySection title="4. Contact us"><p>For privacy inquiries or data requests, contact +91 99584 19286 or <a className="font-semibold text-accent hover:underline" href="mailto:contact@vipergears.in">contact@vipergears.in</a>.</p></PolicySection></PolicyLayout>;
}
