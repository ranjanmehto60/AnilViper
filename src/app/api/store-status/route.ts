import { NextResponse } from "next/server";
import { getPauseMessage, getSetting, isOrdersPaused } from "@/lib/store-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ordersPaused: isOrdersPaused(),
    message: getSetting("pause_message") ?? getPauseMessage(),
  });
}
