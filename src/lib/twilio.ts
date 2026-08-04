import "server-only";

import twilio from "twilio";

export function hasTwilioCredentials(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID?.trim() &&
      process.env.TWILIO_AUTH_TOKEN?.trim() &&
      process.env.TWILIO_PHONE_NUMBER?.trim()
  );
}

export async function sendSms(phone: string, body: string): Promise<{ ok: true; sid: string } | { ok: false; error: string; code?: string }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER?.trim();

  if (!accountSid || !authToken || !twilioPhone) {
    return { ok: false, error: "Twilio credentials missing in environment variables" };
  }

  try {
    const client = twilio(accountSid, authToken);
    const message = await client.messages.create({ body, from: twilioPhone, to: phone });
    return { ok: true, sid: message.sid };
  } catch (error) {
    const err = error as { message?: string; code?: string };
    return { ok: false, error: err?.message || "Failed to send SMS via Twilio", code: err?.code };
  }
}

export function formatIndianPhone(digits: string): string {
  const clean = digits.replace(/\D/g, "");
  return clean.length === 10 ? `+91${clean}` : `+${clean}`;
}