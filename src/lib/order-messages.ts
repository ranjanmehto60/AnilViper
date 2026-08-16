import "server-only";

import type { OrderRecord } from "@/lib/store-db";
import { sendWhatsApp } from "@/lib/twilio";
import { getBackPrintLabel, isBackPrintOption } from "@/types/product";

interface StoredItem {
  name?: string;
  productId?: string;
  size?: number;
  backPrintOption?: unknown;
  quantity?: number;
  price?: number;
}

function formatMoney(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function parseItems(raw: string): StoredItem[] {
  try {
    const parsed = JSON.parse(raw) as StoredItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getPublicAppUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (configuredUrl && !configuredUrl.includes("localhost") && !configuredUrl.includes("127.0.0.1")) {
    return configuredUrl;
  }
  return "https://vipergears.fit";
}

export function buildWhatsAppOrderMessage(order: OrderRecord): string {
  const items = parseItems(order.items);
  const itemLines = items.map((item) => {
    const name = item.name || "Viper Gear Item";
    const size = item.size ? ` (${item.size} cm)` : "";
    const backPrint = isBackPrintOption(item.backPrintOption) ? ` — ${getBackPrintLabel(item.backPrintOption)}` : "";
    const qty = Number(item.quantity || 1);
    return `• ${name}${size}${backPrint} x${qty}`;
  });

  const lines = [
    "Viper Gears — Order Confirmed",
    "",
    `Hi ${order.customerName},`,
    `Your order ${order.id} has been placed successfully.`,
    "",
    "Items:",
    ...(itemLines.length > 0 ? itemLines : ["• Viper Gear Equipment"]),
    "",
    order.paymentMethod === "COD"
      ? `Total: ${formatMoney(order.total)} (${formatMoney(order.bookingAmount)} booking paid online, ${formatMoney(order.codAmount)} payable at delivery)`
      : `Total: ${formatMoney(order.total)} (paid online)`,
    "",
    "Estimated delivery: 2-4 business days.",
    "",
    `Track your order anytime: ${getPublicAppUrl()}/account?tab=orders`,
    "",
    "Viper Gears India — Chattarpur, New Delhi",
  ];

  return lines.join("\n");
}

export async function sendOrderNotification(order: OrderRecord): Promise<void> {
  try {
    const result = await sendWhatsApp(order.phone, buildWhatsAppOrderMessage(order));
    if (!result.ok) {
      console.error(`[WhatsApp Notification Failed] order=${order.id}: ${result.error}`);
    }
  } catch (error) {
    console.error(`[WhatsApp Notification Error] order=${order.id}`, error);
  }
}
