import React from "react";
import { PolicyLayout, PolicySection } from "@/components/content/PolicyLayout";

export default function ReturnPolicyPage() {
  return <PolicyLayout title="Returns & order policy" label="Returns & order policy"><PolicySection title="1. Delivery and order support"><p>Orders are dispatched from our Chattarpur, Delhi warehouse and can be tracked through the courier information shared after dispatch.</p></PolicySection><PolicySection title="2. Damaged or incorrect goods"><p>If your order arrives damaged, defective, or incorrect, contact the Viper team with your Order ID and photos so we can review the issue and arrange the appropriate resolution.</p></PolicySection><PolicySection title="3. Contact care"><p>For delivery or return questions, message <a href="https://wa.me/919958419286" className="font-semibold text-accent underline">+91 99584 19286 on WhatsApp</a> or email <a href="mailto:contact@vipergears.in" className="font-semibold text-accent underline">contact@vipergears.in</a>.</p></PolicySection></PolicyLayout>;
}
