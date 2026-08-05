import { NextResponse } from "next/server";
import { getOrderById, updateOrderPaymentAndShipping } from "@/lib/store-db";
import { decrementInventory } from "@/lib/inventory-db";
import { isRazorpayConfigured, verifyRazorpaySignature } from "@/lib/razorpay";
import { createShiprocketOrder } from "@/lib/shiprocket";


export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: {
    orderId?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

  if (!orderId || !razorpayPaymentId) {
    return NextResponse.json({ error: "Missing orderId or paymentId" }, { status: 400 });
  }

  const order = getOrderById(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Signature verification if Razorpay is configured
  if (isRazorpayConfigured()) {
    if (!razorpayOrderId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing payment signature parameters" }, { status: 400 });
    }

    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature verification failed" }, { status: 400 });
    }
  }

  // Mark payment paid & update inventory stock
  if (order.paymentStatus !== "PAID") {
    try {
      const items = JSON.parse(order.items);
      if (Array.isArray(items)) {
        for (const item of items) {
          if (item.productId && item.size && item.quantity) {
            decrementInventory(item.productId, Number(item.size), Number(item.quantity));
          }
        }
      }
    } catch {
      // Ignore JSON parse error if invalid items format
    }
  }

  // Parse address for Shiprocket payload
  let addressData: { fullName?: string; phone?: string; street?: string; city?: string; state?: string; pincode?: string } = {};
  try {
    addressData = JSON.parse(order.address);
  } catch {
    addressData = { fullName: order.customerName, phone: order.phone };
  }

  let itemsData: Array<{ name: string; sku: string; units: number; selling_price: number }> = [];
  try {
    const rawItems = JSON.parse(order.items);
    if (Array.isArray(rawItems)) {
      itemsData = rawItems.map((it: { name?: string; productId?: string; size?: number; quantity?: number; price?: number }) => ({
        name: `${it.name || "Viper Gear Item"} (${it.size || ""} cm)`,
        sku: `${it.productId || "SKU"}_${it.size || "STD"}`,
        units: Number(it.quantity || 1),
        selling_price: Number(it.price || 0),
      }));
    }
  } catch {
    itemsData = [{ name: "Viper Gear Equipment", sku: "VIPER_EQ", units: 1, selling_price: order.total }];
  }

  // Push order directly to Shiprocket for dispatch
  const shiprocketRes = await createShiprocketOrder({
    orderId: order.id,
    orderDate: new Date(order.createdAt).toISOString().replace("T", " ").substring(0, 16),
    customerName: addressData.fullName || order.customerName,
    phone: addressData.phone || order.phone,
    street: addressData.street || "Main Street",
    city: addressData.city || "Delhi",
    state: addressData.state || "Delhi",
    pincode: addressData.pincode || "110001",
    items: itemsData,
    subtotal: order.subtotal,
  });

  // Update order with payment & shiprocket details
  const updatedOrder = updateOrderPaymentAndShipping(order.id, {
    paymentStatus: "PAID",
    razorpayOrderId: razorpayOrderId || order.razorpayOrderId,
    razorpayPaymentId,
    shiprocketOrderId: shiprocketRes.shiprocketOrderId,
    shipmentId: shiprocketRes.shipmentId,
    awb: shiprocketRes.awb || order.awb,
    courierName: shiprocketRes.courierName || "Delhivery / Shiprocket",
    orderStatus: "Processing",
  });

  return NextResponse.json({
    success: true,
    orderId: order.id,
    paymentId: razorpayPaymentId,
    awb: updatedOrder?.awb || shiprocketRes.awb || null,
    courierName: updatedOrder?.courierName || shiprocketRes.courierName || "Shiprocket Express",
  });
}
