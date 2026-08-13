import "server-only";

import {
  claimShiprocketPush,
  getOrderById,
  markOrderPaid,
  resetShiprocketPushClaim,
  updateOrderPaymentAndShipping,
} from "@/lib/store-db";
import { decrementInventory } from "@/lib/inventory-db";
import { createShiprocketOrder } from "@/lib/shiprocket";
import { sendOrderNotification } from "@/lib/order-messages";

export interface FinalizePaidOrderInput {
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
}

export interface FinalizePaidOrderResult {
  claimed: boolean;
  shiprocketPushClaimed: boolean;
  awb?: string | null;
  courierName?: string | null;
  shiprocketOrderId?: number | string | null;
  shipmentId?: number | string | null;
  shiprocketError?: string | null;
}

interface AddressData {
  fullName?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface StoredItem {
  name?: string;
  productId?: string;
  category?: string;
  size?: number;
  quantity?: number;
  price?: number;
  unitPrice?: number;
}

function parseAddress(raw: string, fallbackName: string, fallbackPhone: string): AddressData {
  try {
    return JSON.parse(raw) as AddressData;
  } catch {
    return { fullName: fallbackName, phone: fallbackPhone };
  }
}

function parseItems(raw: string, fallbackTotal: number): Array<{ name: string; sku: string; units: number; selling_price: number; category?: string }> {
  try {
    const parsed = JSON.parse(raw) as StoredItem[];
    if (Array.isArray(parsed)) {
      return parsed.map((it) => ({
        name: `${it.name || "Viper Gear Item"} (${it.size || ""} cm)`,
        sku: `${it.productId || "SKU"}_${it.size || "STD"}`,
        units: Number(it.quantity || 1),
        selling_price: Number(it.unitPrice ?? it.price ?? 0),
        category: it.category,
      }));
    }
  } catch {
    // fall through to placeholder item
  }
  return [{ name: "Viper Gear Equipment", sku: "VIPER_EQ", units: 1, selling_price: fallbackTotal }];
}

/**
 * Single source of truth for post-payment order finalization:
 * 1. Atomically claims the order as PAID (only one caller wins); the winner
 *    decrements inventory.
 * 2. The Shiprocket push is claimed independently, so a webhook retry or a
 *    late client verification can still complete a previously failed push,
 *    but duplicates are impossible.
 * 3. If the push fails, the claim is released so the next retry can re-push.
 */
export async function finalizePaidOrder(
  orderId: string,
  payment: FinalizePaidOrderInput
): Promise<FinalizePaidOrderResult> {
  const order = await getOrderById(orderId);
  if (!order) {
    return { claimed: false, shiprocketPushClaimed: false, shiprocketError: "Order not found" };
  }

  const claimed = await markOrderPaid(orderId);

  if (claimed) {
    try {
      const items = JSON.parse(order.items) as StoredItem[];
      if (Array.isArray(items)) {
        for (const item of items) {
          if (item.productId && item.size && item.quantity) {
            await decrementInventory(item.productId, Number(item.size), Number(item.quantity));
          }
        }
      }
    } catch {
      // Ignore malformed items — payment is still recorded
    }

    // Fire-and-forget order confirmation (never blocks or fails finalization)
    await sendOrderNotification(order);
  }

  const pushClaimed = await claimShiprocketPush(orderId);
  let awb = order.awb;
  let courierName = order.courierName;
  let shiprocketOrderId: string | number | null = order.shiprocketOrderId ?? null;
  let shipmentId: string | number | null = order.shipmentId ?? null;
  let shiprocketError: string | null = null;

  if (pushClaimed) {
    const address = parseAddress(order.address, order.customerName, order.phone);
    const shiprocketRes = await createShiprocketOrder({
      orderId: order.id,
      orderDate: new Date(order.createdAt).toISOString(),
      customerName: address.fullName || order.customerName,
      phone: address.phone || order.phone,
      street: address.street || "Main Street",
      city: address.city || "Delhi",
      state: address.state || "Delhi",
      pincode: address.pincode || "110001",
      items: parseItems(order.items, order.total),
      subtotal: order.subtotal,
      paymentMethod: order.paymentMethod,
      codAmount: order.codAmount,
    });

    if (shiprocketRes.success) {
      awb = shiprocketRes.awb || order.awb;
      courierName = shiprocketRes.courierName || order.courierName;
      shiprocketOrderId = shiprocketRes.shiprocketOrderId ?? order.shiprocketOrderId ?? null;
      shipmentId = shiprocketRes.shipmentId ?? order.shipmentId ?? null;
    } else {
      shiprocketError = shiprocketRes.error || "Shiprocket push failed";
      console.error(`[Shiprocket Push Failed] order=${order.id}: ${shiprocketError}`);
      // Release the claim so a webhook retry / manual sync can re-push
      await resetShiprocketPushClaim(order.id);
    }

    await updateOrderPaymentAndShipping(order.id, {
      razorpayOrderId: payment.razorpayOrderId ?? order.razorpayOrderId,
      razorpayPaymentId: payment.razorpayPaymentId ?? order.razorpayPaymentId,
      shiprocketOrderId,
      shipmentId,
      awb,
      courierName,
      orderStatus: "Processing",
    });
  } else if (payment.razorpayOrderId || payment.razorpayPaymentId) {
    // Another caller (webhook / verification) already handled the shipment;
    // still persist the payment IDs we learned here.
    await updateOrderPaymentAndShipping(order.id, {
      razorpayOrderId: payment.razorpayOrderId ?? order.razorpayOrderId,
      razorpayPaymentId: payment.razorpayPaymentId ?? order.razorpayPaymentId,
    });
  }

  return { claimed, shiprocketPushClaimed: pushClaimed, awb, courierName, shiprocketOrderId, shipmentId, shiprocketError };
}
