import { NextResponse } from "next/server";
import { getShiprocketTracking } from "@/lib/shiprocket";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ awb: string }> }
) {
  const { awb } = await params;

  if (!awb) {
    return NextResponse.json({ error: "AWB parameter required" }, { status: 400 });
  }

  const trackingData = await getShiprocketTracking(awb);
  return NextResponse.json({ awb, tracking: trackingData });
}
