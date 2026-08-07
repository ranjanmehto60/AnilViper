import { NextResponse } from "next/server";
import { generateOtp } from "@/lib/store-db";
import { formatIndianPhone, hasTwilioCredentials, sendSms } from "@/lib/twilio";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { phone?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const phoneDigits = typeof body.phone === "string" ? body.phone.replace(/\D/g, "") : "";
  if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
    return NextResponse.json({ error: "Please enter a valid 10-digit Indian mobile number." }, { status: 400 });
  }

  const { code, rateLimited } = await generateOtp("customer", phoneDigits);
  if (rateLimited) {
    return NextResponse.json(
      { error: "Please wait at least 60 seconds before requesting a new OTP." },
      { status: 429 }
    );
  }

  const devMode = !hasTwilioCredentials();
  if (devMode) {
    console.log(`[account-otp] Dev mode: OTP for +91${phoneDigits} is ${code}`);
  } else {
    const result = await sendSms(
      formatIndianPhone(phoneDigits),
      `Your Viper Gears OTP is ${code}. Valid for 10 minutes. Do not share this code.`
    );
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error, code: result.code }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, ...(devMode ? { devOtp: code } : {}) });
}