import { NextResponse } from "next/server";
import { getOrderByRazorpayOrderId } from "@/lib/store-db";
import { verifyRazorpayWebhookSignature } from "@/lib/razorpay";
import { finalizePaidOrder } from "@/lib/order-flow";

export const runtime = "nodejs";
export const maxDuration = 60;

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
      const order = await getOrderByRazorpayOrderId(rzpOrderId);
      if (order) {
        const result = await finalizePaidOrder(order.id, {
          razorpayOrderId: rzpOrderId,
          razorpayPaymentId: rzpPaymentId || order.razorpayPaymentId || undefined,
        });

        if (result.shiprocketError) {
          // Order is PAID and stock is decremented, but the shipment push
          // failed. Return 500 so Razorpay retries the webhook; the atomic
          // shiprocket_pushed claim guarantees the push happens exactly once.
          return NextResponse.json({ error: "Shipment creation failed" }, { status: 500 });
        }
      }
    }
  }

  return NextResponse.json({ status: "ok" });
}
