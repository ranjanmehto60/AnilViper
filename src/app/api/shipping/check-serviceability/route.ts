import { NextResponse } from "next/server";
import { checkShiprocketServiceability } from "@/lib/shiprocket";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get("pincode")?.trim();
  const weight = searchParams.get("weight") ? Number(searchParams.get("weight")) : 0.8;

  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return NextResponse.json(
      { error: "Please enter a valid 6-digit Indian pincode" },
      { status: 400 }
    );
  }

  const result = await checkShiprocketServiceability({
    deliveryPincode: pincode,
    weightKg: weight,
    cod: false,
  });

  return NextResponse.json(result);
}
