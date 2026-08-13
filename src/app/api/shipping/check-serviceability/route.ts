import { NextResponse } from "next/server";
import { DRESS_PACKAGE } from "@/config/commerce";
import { checkShiprocketServiceability } from "@/lib/shiprocket";

export const runtime = "nodejs";
export const maxDuration = 60;

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const MAX_CACHE_ENTRIES = 500;
const serviceabilityCache = new Map<
  string,
  { result: Awaited<ReturnType<typeof checkShiprocketServiceability>>; expiresAt: number }
>();

function cacheResponse(result: Awaited<ReturnType<typeof checkShiprocketServiceability>>) {
  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, max-age=900, s-maxage=3600, stale-while-revalidate=21600",
    },
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get("pincode")?.trim();
  const weight = searchParams.get("weight") ? Number(searchParams.get("weight")) : DRESS_PACKAGE.weightKg;
  const cod = searchParams.get("cod") === "1" || searchParams.get("cod") === "true";

  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return NextResponse.json(
      { error: "Please enter a valid 6-digit Indian pincode" },
      { status: 400 }
    );
  }

  if (!Number.isFinite(weight) || weight < 0.1 || weight > 10) {
    return NextResponse.json({ error: "Weight must be between 0.1 and 10 kg" }, { status: 400 });
  }

  const cacheKey = `${pincode}:${weight.toFixed(2)}:${cod ? 1 : 0}`;
  const cached = serviceabilityCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cacheResponse(cached.result);
  }

  const result = await checkShiprocketServiceability({
    deliveryPincode: pincode,
    weightKg: weight,
    cod,
  });

  if (serviceabilityCache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = serviceabilityCache.keys().next().value;
    if (oldestKey) serviceabilityCache.delete(oldestKey);
  }
  serviceabilityCache.set(cacheKey, { result, expiresAt: Date.now() + CACHE_TTL_MS });

  return cacheResponse(result);
}
