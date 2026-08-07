import { NextResponse } from "next/server";
import { getPauseMessage, getSetting, isOrdersPaused } from "@/lib/store-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ordersPaused: await isOrdersPaused(),
    message: (await getSetting("pause_message")) ?? (await getPauseMessage()),
  });
}
