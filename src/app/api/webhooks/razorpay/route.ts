import { NextResponse } from "next/server";
import { getOrderByRazorpayOrderId, updateOrderPaymentAndShipping } from "@/lib/store-db";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import { createShiprocketOrder } from "@/lib/shiprocket";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature header" }, { status: 400 });
  }

  let rawBody = "";
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: "Cannot read raw body" }, { status: 400 });
  }

  const isValid = verifyRazorpayWebhookSignature(rawBody, signature);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  let event: { event?: string; payload?: { payment?: { entity?: { order_id?: string; id?: string } } } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event === "payment.authorized" || event.event === "order.paid") {
    const paymentEntity = event.payload?.payment?.entity;
    const rzpOrderId = paymentEntity?.order_id;
    const rzpPaymentId = paymentEntity?.id;

    if (rzpOrderId) {
      const order = getOrderByRazorpayOrderId(rzpOrderId);
      if (order && order.paymentStatus !== "PAID") {
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

        updateOrderPaymentAndShipping(order.id, {
          paymentStatus: "PAID",
          razorpayPaymentId: rzpPaymentId || order.razorpayPaymentId,
          shiprocketOrderId: shiprocketRes.shiprocketOrderId,
          shipmentId: shiprocketRes.shipmentId,
          awb: shiprocketRes.awb || order.awb,
          courierName: shiprocketRes.courierName || "Delhivery / Shiprocket",
        });
      }
    }
  }

  return NextResponse.json({ status: "ok" });
}
