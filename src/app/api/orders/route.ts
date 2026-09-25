import { NextResponse } from "next/server";
import { createOrder, getPauseMessage, isOrdersPaused, listOrders } from "@/lib/store-db";
import { computePricing, getCodBookingAmount } from "@/lib/pricing";
import { getStockLevel } from "@/lib/inventory-db";
import { isAuthorizedAdmin } from "@/lib/admin-api";
import { finalizeCodOrder } from "@/lib/order-flow";

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
  backPrintOption?: unknown;
  quantity?: unknown;
}

export async function POST(request: Request) {
  let body: { items?: OrderItemInput[]; address?: OrderAddress; paymentMethod?: unknown };
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
    backPrintOption: item?.backPrintOption,
    quantity: Number(item?.quantity),
  }));

  const paymentMethod = body.paymentMethod === "COD" ? "COD" : "PREPAID";
  const { breakdown, error } = await computePricing(lines);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const isCod = paymentMethod === "COD";
  const bookingAmount = isCod ? getCodBookingAmount(breakdown.subtotal) : 0;
  const codAmount = isCod ? breakdown.subtotal : 0;
  const orderTotal = isCod ? codAmount + bookingAmount : breakdown.total;

  for (const item of breakdown.items) {
    const available = await getStockLevel(item.productId, item.size);
    if (available < item.quantity) {
      return NextResponse.json(
        {
          error:
            available === 0
              ? `"${item.name}" (${item.size} cm) is out of stock. Please remove it from your cart.`
              : `Only ${available} unit${available === 1 ? "" : "s"} of "${item.name}" (${item.size} cm) left in stock.`,
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
    shipping: isCod ? bookingAmount : breakdown.shipping,
    total: orderTotal,
    discountCode: breakdown.discountCode,
    paymentMethod,
    bookingAmount,
    codAmount,
  });

  if (paymentMethod === "COD") {
    await finalizeCodOrder(order.id);
  }

  return NextResponse.json(
    {
      success: true,
      orderId: order.id,
      total: order.total,
      subtotal: order.subtotal,
      discount: order.discount,
      shipping: order.shipping,
      paymentMethod,
      bookingAmount,
      codAmount,
      paymentStatus: order.paymentStatus,
    },
    { status: 201 }
  );
}

export async function GET(request: Request) {
  if (!(await isAuthorizedAdmin(request))) {
    return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
  }
  return NextResponse.json({ orders: await listOrders() });
}
