import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/store-db";
import { ACCOUNT_SESSION_COOKIE, createCustomerSession, sessionCookieHeader } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { phone?: unknown; otp?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const phoneDigits = typeof body.phone === "string" ? body.phone.replace(/\D/g, "") : "";
  const otp = typeof body.otp === "string" ? body.otp.trim() : "";

  if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
    return NextResponse.json({ error: "Please enter a valid 10-digit Indian mobile number." }, { status: 400 });
  }
  if (!/^\d{6}$/.test(otp)) {
    return NextResponse.json({ error: "Enter the 6-digit OTP sent to your phone." }, { status: 400 });
  }

  const status = verifyOtp("customer", phoneDigits, otp);
  if (status !== "ok") {
    const message = status === "expired" || status === "missing"
      ? "OTP expired or no active OTP. Please request a new code."
      : "Incorrect OTP. Please try again.";
    return NextResponse.json({ error: message }, { status: 401 });
  }

  const { token, ttlMs } = createCustomerSession(phoneDigits);
  const response = NextResponse.json({ success: true });
  response.headers.set("set-cookie", sessionCookieHeader(ACCOUNT_SESSION_COOKIE, token, ttlMs / 1000));
  return response;
}