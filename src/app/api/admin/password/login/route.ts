import { NextResponse } from "next/server";
import { ADMIN_CONFIG } from "@/config/admin";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSession,
  sessionCookieHeader,
} from "@/lib/auth";
import { safeStringEqual } from "@/lib/google-oauth";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 10;
const MAX_TRACKED_CLIENTS = 1_000;
const failedAttempts = new Map<string, { count: number; resetAt: number }>();

function getClientKey(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function getAttemptRecord(key: string, now: number) {
  const current = failedAttempts.get(key);
  if (!current || current.resetAt <= now) {
    if (failedAttempts.size >= MAX_TRACKED_CLIENTS) {
      for (const [clientKey, record] of failedAttempts) {
        if (record.resetAt <= now) failedAttempts.delete(clientKey);
      }
      if (failedAttempts.size >= MAX_TRACKED_CLIENTS) {
        failedAttempts.delete(failedAttempts.keys().next().value as string);
      }
    }
    const next = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    failedAttempts.set(key, next);
    return next;
  }
  return current;
}

export async function POST(request: Request) {
  const clientKey = getClientKey(request);
  const now = Date.now();
  const attempts = getAttemptRecord(clientKey, now);

  if (attempts.count >= MAX_FAILED_ATTEMPTS) {
    return NextResponse.json(
      { error: "Too many failed attempts. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((attempts.resetAt - now) / 1000)) },
      }
    );
  }

  let body: { password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword) {
    return NextResponse.json(
      { error: "Admin password login is not configured." },
      { status: 503 }
    );
  }

  if (!safeStringEqual(password, configuredPassword)) {
    attempts.count += 1;
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }

  failedAttempts.delete(clientKey);

  const identifier = ADMIN_CONFIG.allowedEmails[0];
  if (!identifier) {
    return NextResponse.json({ error: "Admin login is not configured." }, { status: 500 });
  }

  try {
    const { token, ttlMs } = await createAdminSession(identifier);
    const response = NextResponse.json({ success: true });
    response.headers.set(
      "set-cookie",
      sessionCookieHeader(
        ADMIN_SESSION_COOKIE,
        token,
        Math.floor(ttlMs / 1000),
        process.env.NODE_ENV === "production"
      )
    );
    return response;
  } catch (error) {
    console.error("[Admin Password Session Creation Error]", error);
    return NextResponse.json(
      { error: "Could not create the admin session. Check the database connection." },
      { status: 500 }
    );
  }
}
