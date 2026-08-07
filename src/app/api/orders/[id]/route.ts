import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/store-db";
import { isAuthorizedAdmin } from "@/lib/admin-api";

export const runtime = "nodejs";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAuthorizedAdmin(request))) {
    return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
  }

  const id = (await context.params).id;
  const body = await request.json().catch(() => null);
  const orderStatus = typeof body?.orderStatus === "string" ? body.orderStatus : undefined;
  const awb = typeof body?.awb === "string" ? body.awb : undefined;

  if (orderStatus !== "Processing" && orderStatus !== "Shipped" && orderStatus !== "Delivered") {
    return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
  }

  const updated = await updateOrderStatus(id, orderStatus, awb);
  return updated
    ? NextResponse.json({ order: updated })
    : NextResponse.json({ error: "Order not found" }, { status: 404 });
}