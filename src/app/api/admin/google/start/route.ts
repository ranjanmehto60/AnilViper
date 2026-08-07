import { NextResponse } from "next/server";
import {
  buildGoogleAuthUrl,
  buildRedirectUri,
  generateOAuthState,
  OAUTH_COOKIE_MAX_AGE,
  OAUTH_STATE_COOKIE,
  OAUTH_VERIFIER_COOKIE,
} from "@/lib/google-oauth";

export const runtime = "nodejs";

export function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/admin/login?error=not_configured", request.url));
  }

  const { state, verifier, challenge } = generateOAuthState();
  const redirectUri = buildRedirectUri(request);
  const authUrl = buildGoogleAuthUrl(clientId, redirectUri, state, challenge);

  const response = NextResponse.redirect(authUrl);
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure,
    maxAge: OAUTH_COOKIE_MAX_AGE,
  });
  response.cookies.set(OAUTH_VERIFIER_COOKIE, verifier, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure,
    maxAge: OAUTH_COOKIE_MAX_AGE,
  });
  return response;
}
