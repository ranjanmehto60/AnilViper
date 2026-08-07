import { NextResponse } from "next/server";
import { ACCOUNT_SESSION_COOKIE, clearCookieHeader, getCookieValue, getCustomerPhone } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const phone = await getCustomerPhone(getCookieValue(req, ACCOUNT_SESSION_COOKIE));
  if (!phone) {
    return NextResponse.json({ loggedIn: false }, { status: 200 });
  }
  return NextResponse.json({ loggedIn: true, phone });
}

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.headers.set("set-cookie", clearCookieHeader(ACCOUNT_SESSION_COOKIE));
  return response;
}