import { NextResponse } from "next/server";
import { checkShiprocketServiceability } from "@/lib/shiprocket";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get("pincode")?.trim();
  const weight = searchParams.get("weight") ? Number(searchParams.get("weight")) : 0.8;
  const cod = searchParams.get("cod") === "1" || searchParams.get("cod") === "true";

  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return NextResponse.json(
      { error: "Please enter a valid 6-digit Indian pincode" },
      { status: 400 }
    );
  }

  const result = await checkShiprocketServiceability({
    deliveryPincode: pincode,
    weightKg: weight,
    cod,
  });

  return NextResponse.json(result);
}
