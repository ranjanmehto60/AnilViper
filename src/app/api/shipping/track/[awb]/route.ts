import { NextResponse } from "next/server";
import { getShiprocketTracking } from "@/lib/shiprocket";

export const runtime = "nodejs";
export const maxDuration = 60;

const TRACKING_CACHE_TTL_MS = 60 * 1000;
const trackingCache = new Map<
  string,
  { tracking: Awaited<ReturnType<typeof getShiprocketTracking>>; expiresAt: number }
>();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ awb: string }> }
) {
  const { awb } = await params;

  if (!awb || !/^[A-Za-z0-9_-]{4,64}$/.test(awb)) {
    return NextResponse.json({ error: "Valid AWB parameter required" }, { status: 400 });
  }

  const cached = trackingCache.get(awb);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json({ awb, tracking: cached.tracking }, {
      headers: { "Cache-Control": "private, max-age=30" },
    });
  }

  const tracking = await getShiprocketTracking(awb);
  if (trackingCache.size >= 200) {
    const oldestKey = trackingCache.keys().next().value;
    if (oldestKey) trackingCache.delete(oldestKey);
  }
  trackingCache.set(awb, { tracking, expiresAt: Date.now() + TRACKING_CACHE_TTL_MS });
  return NextResponse.json({ awb, tracking }, {
    headers: { "Cache-Control": "private, max-age=30" },
  });
}
