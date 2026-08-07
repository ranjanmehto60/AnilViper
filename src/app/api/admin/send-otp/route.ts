import { NextResponse } from "next/server";
import { generateOtp } from "@/lib/store-db";
import { isAllowedAdminIdentifier } from "@/lib/auth";
import { formatIndianPhone, hasTwilioCredentials, sendSms } from "@/lib/twilio";

export const runtime = "nodejs";

const ADMIN_OTP_PHONE = "9871674886";

export async function POST(req: Request) {
  let body: { identifier?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const identifier = typeof body.identifier === "string" ? body.identifier.trim() : "";
  if (!identifier || !isAllowedAdminIdentifier(identifier)) {
    return NextResponse.json({ error: "Access denied: identifier is not authorized." }, { status: 403 });
  }

  const { code, rateLimited } = await generateOtp("admin", identifier);

  if (rateLimited) {
    return NextResponse.json(
      { error: "Please wait at least 60 seconds before requesting a new OTP." },
      { status: 429 }
    );
  }

  const devMode = !hasTwilioCredentials();
  if (devMode) {
    console.log(`[admin-otp] Dev mode: OTP for ${identifier} is ${code}`);
  } else {
    const phone = identifier.replace(/\D/g, "").length >= 10 ? formatIndianPhone(identifier) : formatIndianPhone(ADMIN_OTP_PHONE);
    const result = await sendSms(phone, `Your Viper Gears Store Admin OTP is ${code}. Valid for 10 minutes.`);
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error, code: result.code }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, ...(devMode ? { devOtp: code } : {}) });
}