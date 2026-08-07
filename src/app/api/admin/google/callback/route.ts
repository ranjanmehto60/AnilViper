import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSession,
  getCookieValue,
} from "@/lib/auth";
import {
  buildRedirectUri,
  exchangeCodeForTokens,
  isAllowedAdminEmail,
  OAUTH_STATE_COOKIE,
  OAUTH_VERIFIER_COOKIE,
  safeStringEqual,
  verifyGoogleIdToken,
} from "@/lib/google-oauth";

export const runtime = "nodejs";

type OAuthError =
  | "google_denied"
  | "invalid_request"
  | "state_mismatch"
  | "not_configured"
  | "token_exchange_failed"
  | "token_invalid"
  | "not_authorized";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fail = (error: OAuthError) =>
    NextResponse.redirect(new URL(`/admin/login?error=${error}`, request.url));

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const googleError = url.searchParams.get("error");

  if (googleError) return fail("google_denied");
  if (!code || !state) return fail("invalid_request");

  const expectedState = getCookieValue(request, OAUTH_STATE_COOKIE);
  const verifier = getCookieValue(request, OAUTH_VERIFIER_COOKIE);
  if (!expectedState || !verifier || !safeStringEqual(expectedState, state)) {
    return fail("state_mismatch");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return fail("not_configured");

  let tokens: Awaited<ReturnType<typeof exchangeCodeForTokens>>;
  try {
    tokens = await exchangeCodeForTokens({
      code,
      verifier,
      redirectUri: buildRedirectUri(request),
      clientId,
      clientSecret,
    });
  } catch {
    return fail("token_exchange_failed");
  }
  if (!tokens.id_token) return fail("token_exchange_failed");

  const claims = await verifyGoogleIdToken(tokens.id_token, clientId);
  if (!claims || !claims.email || claims.email_verified !== true) {
    return fail("token_invalid");
  }
  if (!isAllowedAdminEmail(claims.email)) {
    return fail("not_authorized");
  }

  const { token, ttlMs } = await createAdminSession(claims.email);
  const response = NextResponse.redirect(new URL("/admin", request.url));
  response.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: Math.floor(ttlMs / 1000),
  });
  return response;
}
