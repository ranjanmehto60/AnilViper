import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/store-db";
import { isRazorpayConfigured, verifyRazorpaySignature } from "@/lib/razorpay";
import { finalizePaidOrder } from "@/lib/order-flow";

export const runtime = "nodejs";
export const maxDuration = 60;

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

  const order = await getOrderById(orderId);
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

  // Mark paid (atomic), decrement inventory and push to Shiprocket exactly once.
  // The Razorpay webhook may run concurrently — both paths share this guard.
  const result = await finalizePaidOrder(orderId, {
    razorpayOrderId: razorpayOrderId || order.razorpayOrderId || undefined,
    razorpayPaymentId,
  });

  return NextResponse.json({
    success: true,
    orderId: order.id,
    paymentId: razorpayPaymentId,
    awb: result.awb || null,
    courierName: result.courierName || "Shiprocket Express",
    shiprocketError: result.shiprocketError || null,
  });
}
