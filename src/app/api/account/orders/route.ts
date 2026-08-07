import { NextResponse } from "next/server";
import { listOrdersByPhone } from "@/lib/store-db";
import { ACCOUNT_SESSION_COOKIE, getCookieValue, getCustomerPhone } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const phone = await getCustomerPhone(getCookieValue(request, ACCOUNT_SESSION_COOKIE));
  if (!phone) {
    return NextResponse.json({ error: "Please log in to view your orders." }, { status: 401 });
  }

  const orders = (await listOrdersByPhone(phone)).map((order) => ({
    id: order.id,
    date: new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    status: order.orderStatus,
    total: order.total,
    items: JSON.parse(order.items) as unknown[],
    courier: order.awb ? "Shiprocket / Delhivery" : null,
    tracking: order.awb,
    paymentStatus: order.paymentStatus,
  }));

  return NextResponse.json({ orders });
}