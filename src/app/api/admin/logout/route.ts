import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, clearCookieHeader } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.headers.set("set-cookie", clearCookieHeader(ADMIN_SESSION_COOKIE));
  return response;
}