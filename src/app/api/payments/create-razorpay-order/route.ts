import { NextResponse } from "next/server";
import { createOrder, getPauseMessage, isOrdersPaused, updateOrderPaymentAndShipping } from "@/lib/store-db";
import { computePricing, getCodBookingAmount } from "@/lib/pricing";
import { getStockLevel } from "@/lib/inventory-db";
import { getRazorpayInstance, isRazorpayConfigured } from "@/lib/razorpay";

export const runtime = "nodejs";

interface OrderAddress {
  fullName?: unknown;
  phone?: unknown;
  street?: unknown;
  city?: unknown;
  state?: unknown;
  pincode?: unknown;
}

interface OrderItemInput {
  productId?: unknown;
  size?: unknown;
  quantity?: unknown;
}

export async function POST(request: Request) {
  try {
    let body: { items?: OrderItemInput[]; address?: OrderAddress; discountCode?: unknown; paymentMethod?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const address = body.address || {};
    const name = typeof address.fullName === "string" ? address.fullName.trim() : "";
    const phoneDigits = typeof address.phone === "string" ? address.phone.replace(/\D/g, "") : "";
    const street = typeof address.street === "string" ? address.street.trim() : "";
    const city = typeof address.city === "string" ? address.city.trim() : "";
    const state = typeof address.state === "string" ? address.state.trim() : "";
    const pincode = typeof address.pincode === "string" ? address.pincode.trim() : "";

    if (!name || !/^[6-9]\d{9}$/.test(phoneDigits) || !street || !city || !state || !/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        { error: "Please provide a valid full name, 10-digit phone, street, city, state and 6-digit pincode." },
        { status: 400 }
      );
    }

    if (await isOrdersPaused()) {
      return NextResponse.json(
        { error: await getPauseMessage(), paused: true },
        { status: 503 }
      );
    }

    const lines = (Array.isArray(body.items) ? body.items : []).map((item) => ({
      productId: typeof item?.productId === "string" ? item.productId : "",
      size: Number(item?.size),
      quantity: Number(item?.quantity),
    }));

    const discountCode = typeof body.discountCode === "string" ? body.discountCode : null;
    const paymentMethod = body.paymentMethod === "COD" ? "COD" : "PREPAID";
    const { breakdown, error } = await computePricing(lines, discountCode);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const targetBookingAmount = getCodBookingAmount(breakdown.shipping);

    if (paymentMethod === "COD" && targetBookingAmount === 0) {
      return NextResponse.json(
        { error: "COD is unavailable on free-delivery orders. Please choose prepaid online payment." },
        { status: 400 }
      );
    }

    if (paymentMethod === "COD" && breakdown.total <= targetBookingAmount) {
      return NextResponse.json(
        { error: `Cash on Delivery requires an order total above the ₹${targetBookingAmount} delivery booking amount. Please choose prepaid online payment instead.` },
        { status: 400 }
      );
    }

    const bookingAmount = paymentMethod === "COD" ? targetBookingAmount : 0;
    const codAmount = paymentMethod === "COD" ? Math.max(0, breakdown.total - targetBookingAmount) : 0;

    for (const item of breakdown.items) {
      const available = await getStockLevel(item.productId, item.size);
      if (available < item.quantity) {
        return NextResponse.json(
          {
            error:
              available === 0
                ? `"${item.name}" (${item.size} cm) is out of stock.`
                : `Only ${available} unit${available === 1 ? "" : "s"} of "${item.name}" (${item.size} cm) left.`,
          },
          { status: 409 }
        );
      }
    }

    const orderId = `ORD_VIPER_${Math.floor(100000 + Math.random() * 900000)}`;
    const order = await createOrder({
      id: orderId,
      customerName: name,
      phone: phoneDigits,
      address: JSON.stringify({
        fullName: name,
        phone: phoneDigits,
        street,
        city,
        state,
        pincode,
      }),
      items: JSON.stringify(breakdown.items),
      subtotal: breakdown.subtotal,
      discount: breakdown.discount,
      shipping: breakdown.shipping,
      total: breakdown.total,
      discountCode: breakdown.discountCode,
      paymentMethod,
      bookingAmount,
      codAmount,
    });

    const amountPaise = Math.round((paymentMethod === "COD" ? bookingAmount : breakdown.total) * 100);
    let razorpayOrderId = `order_sim_${Math.floor(100000 + Math.random() * 900000)}`;

    if (isRazorpayConfigured()) {
      const razorpay = getRazorpayInstance();
      if (razorpay) {
        try {
          const rzpOrder = await razorpay.orders.create({
            amount: amountPaise,
            currency: "INR",
            receipt: orderId,
            notes: {
              customerName: name,
              phone: phoneDigits,
            },
          });
          razorpayOrderId = rzpOrder.id;
        } catch (err) {
          console.error("[Razorpay Create Order Error]", err);
          return NextResponse.json(
            { error: "Failed to initialize payment gateway with Razorpay." },
            { status: 500 }
          );
        }
      }
    }

    // Update order with razorpayOrderId
    await updateOrderPaymentAndShipping(orderId, { razorpayOrderId });

    return NextResponse.json(
      {
        orderId: order.id,
        razorpayOrderId,
        amount: amountPaise,
        currency: "INR",
        keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_mock",
        paymentMethod,
        bookingAmount,
        codAmount,
        customer: {
          name,
          phone: phoneDigits,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[Create Razorpay Order Unhandled Exception]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
