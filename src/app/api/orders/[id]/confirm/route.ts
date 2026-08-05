import { NextResponse } from "next/server";
import { getOrderById, getPauseMessage, isOrdersPaused, markOrderPaid } from "@/lib/store-db";
import { decrementInventory, getStockLevel } from "@/lib/inventory-db";

export const runtime = "nodejs";

interface StoredOrderLine {
  productId: string;
  size: number;
  quantity: number;
}

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const orderId = (await context.params).id;
  const order = getOrderById(orderId);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.paymentStatus === "PAID") {
    return NextResponse.json({ success: true, alreadyPaid: true });
  }

  if (isOrdersPaused()) {
    return NextResponse.json(
      { error: getPauseMessage(), paused: true },
      { status: 503 }
    );
  }

  const items = JSON.parse(order.items) as StoredOrderLine[];

  for (const item of items) {
    const available = getStockLevel(item.productId, item.size);
    if (available < item.quantity) {
      return NextResponse.json(
        {
          error: `Insufficient stock for "${item.productId}" (${item.size} cm). Only ${available} units left. Please contact support.`,
        },
        { status: 409 }
      );
    }
  }

  let allDecremented = true;
  for (const item of items) {
    if (!decrementInventory(item.productId, item.size, item.quantity)) {
      allDecremented = false;
      break;
    }
  }

  if (!allDecremented) {
    return NextResponse.json({ error: "Stock changed while processing your payment. Please retry." }, { status: 409 });
  }

  markOrderPaid(orderId);
  return NextResponse.json({ success: true });
}