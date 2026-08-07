import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/admin-api";
import { getPauseMessage, getSetting, isOrdersPaused, setSetting } from "@/lib/store-db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAuthorizedAdmin(request))) {
    return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
  }

  return NextResponse.json({
    ordersPaused: await isOrdersPaused(),
    message: (await getSetting("pause_message")) ?? (await getPauseMessage()),
  });
}

export async function PATCH(request: Request) {
  if (!(await isAuthorizedAdmin(request))) {
    return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
  }

  let body: { ordersPaused?: unknown; message?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (body.ordersPaused !== undefined) {
    await setSetting("orders_paused", body.ordersPaused === true ? "1" : "0");
  }

  if (typeof body.message === "string" && body.message.trim()) {
    await setSetting("pause_message", body.message.trim());
  }

  return NextResponse.json({
    ordersPaused: await isOrdersPaused(),
    message: (await getSetting("pause_message")) ?? (await getPauseMessage()),
  });
}
