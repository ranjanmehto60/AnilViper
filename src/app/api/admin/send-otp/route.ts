import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
    const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER?.trim();

    if (!accountSid || !authToken || !twilioPhone) {
      console.error("Missing Twilio credentials in process.env");
      return NextResponse.json(
        {
          success: false,
          error: "Vercel Environment Variables missing! Please add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in Vercel and Redeploy.",
        },
        { status: 400 }
      );
    }

    const client = twilio(accountSid, authToken);

    // Format target Indian phone number: +919871674886
    const cleanDigits = phone.replace(/\D/g, "");
    const targetPhone = cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`;

    const message = await client.messages.create({
      body: `Your Viper Gears Store Admin OTP verification code is: ${otp}. Valid for 10 minutes.`,
      from: twilioPhone,
      to: targetPhone,
    });

    console.log("Twilio SMS sent successfully, SID:", message.sid);
    return NextResponse.json({ success: true, sid: message.sid });
  } catch (error: any) {
    console.error("Twilio SMS Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to send SMS via Twilio",
        code: error?.code,
      },
      { status: 500 }
    );
  }
}
