import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, getCookieValue, isAdminSession } from "@/lib/auth";
import { readSession } from "@/lib/store-db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const token = getCookieValue(request, ADMIN_SESSION_COOKIE);
  if (!isAdminSession(token)) {
    return NextResponse.json({ error: "Admin authentication required" }, { status: 401 });
  }
  const session = readSession(token);
  return NextResponse.json({ email: session?.identifier ?? "" });
}