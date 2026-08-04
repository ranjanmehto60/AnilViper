import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/store-db";
import { ADMIN_SESSION_COOKIE, createAdminSession, isAllowedAdminIdentifier, sessionCookieHeader } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { identifier?: unknown; otp?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const identifier = typeof body.identifier === "string" ? body.identifier.trim() : "";
  const otp = typeof body.otp === "string" ? body.otp.trim() : "";

  if (!identifier || !isAllowedAdminIdentifier(identifier)) {
    return NextResponse.json({ error: "Access denied: identifier is not authorized." }, { status: 403 });
  }
  if (!/^\d{6}$/.test(otp)) {
    return NextResponse.json({ error: "Enter the 6-digit OTP sent to your phone." }, { status: 400 });
  }

  const status = verifyOtp("admin", identifier, otp);
  if (status !== "ok") {
    const message = status === "expired" || status === "missing"
      ? "OTP expired or no active OTP. Please request a new code."
      : "Incorrect OTP. Please try again.";
    return NextResponse.json({ error: message }, { status: 401 });
  }

  const { token, ttlMs } = createAdminSession(identifier);
  const response = NextResponse.json({ success: true });
  response.headers.set("set-cookie", sessionCookieHeader(ADMIN_SESSION_COOKIE, token, ttlMs / 1000));
  return response;
}