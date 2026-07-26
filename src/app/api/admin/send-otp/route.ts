import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioPhone) {
      return NextResponse.json(
        { error: "Twilio credentials missing in Environment Variables" },
        { status: 400 }
      );
    }

    const client = twilio(accountSid, authToken);

    const targetPhone = phone.startsWith("+") ? phone : `+91${phone}`;

    const message = await client.messages.create({
      body: `Your Viper Gears Store Admin OTP verification code is: ${otp}. Valid for 10 minutes.`,
      from: twilioPhone,
      to: targetPhone,
    });

    return NextResponse.json({ success: true, sid: message.sid });
  } catch (error: any) {
    console.error("Twilio SMS Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send SMS via Twilio" },
      { status: 500 }
    );
  }
}
