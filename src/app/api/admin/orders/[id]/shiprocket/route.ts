import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/admin-api";
import { finalizePaidOrder } from "@/lib/order-flow";
import { resetMockShiprocketShipment } from "@/lib/store-db";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAuthorizedAdmin(request))) {
    return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
  }

  const orderId = (await context.params).id;
  const repairedMockShipment = await resetMockShiprocketShipment(orderId);
  const result = await finalizePaidOrder(orderId, {});

  if (result.shiprocketError === "Order not found") {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: !result.shiprocketError,
    awb: result.awb || null,
    courierName: result.courierName || null,
    shiprocketOrderId: result.shiprocketOrderId || null,
    shipmentId: result.shipmentId || null,
    shiprocketError: result.shiprocketError || null,
    alreadyHandled:
      !result.shiprocketError &&
      !result.shiprocketPushClaimed &&
      Boolean(result.shiprocketOrderId || result.shipmentId || result.awb),
    repairedMockShipment,
  });
}
