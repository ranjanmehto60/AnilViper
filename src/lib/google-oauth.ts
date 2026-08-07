import "server-only";

import { createHash, createVerify, randomBytes, timingSafeEqual } from "crypto";
import { ADMIN_CONFIG } from "@/config/admin";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];

export const OAUTH_STATE_COOKIE = "viper_oauth_state";
export const OAUTH_VERIFIER_COOKIE = "viper_oauth_verifier";
export const OAUTH_COOKIE_MAX_AGE = 10 * 60;

export function generateOAuthState(): { state: string; verifier: string; challenge: string } {
  const state = randomBytes(32).toString("base64url");
  const verifier = randomBytes(48).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { state, verifier, challenge };
}

export function buildRedirectUri(request: Request): string {
  const rawHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const host = rawHost ? rawHost.split(",")[0].trim() : null;
  const rawProto = request.headers.get("x-forwarded-proto");
  let proto = rawProto ? rawProto.split(",")[0].trim() : "https";

  if (host && host.includes("localhost")) {
    proto = "http";
  }

  if (host) {
    return `${proto}://${host}/api/admin/google/callback`;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl && !appUrl.includes("localhost")) {
    return `${appUrl.replace(/\/$/, "")}/api/admin/google/callback`;
  }

  return "http://localhost:3000/api/admin/google/callback";
}

export function buildGoogleAuthUrl(
  clientId: string,
  redirectUri: string,
  state: string,
  challenge: string
): string {
  const cleanClientId = clientId.replace(/^["']|["']$/g, "").trim();
  const params = new URLSearchParams({
    client_id: cleanClientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForTokens(params: {
  code: string;
  verifier: string;
  redirectUri: string;
  clientId: string;
  clientSecret: string;
}): Promise<{ id_token?: string; access_token?: string; error?: string }> {
  const cleanClientId = params.clientId.replace(/^["']|["']$/g, "").trim();
  const cleanClientSecret = params.clientSecret.replace(/^["']|["']$/g, "").trim();

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: params.code,
      client_id: cleanClientId,
      client_secret: cleanClientSecret,
      redirect_uri: params.redirectUri,
      grant_type: "authorization_code",
      code_verifier: params.verifier,
    }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[Google Token Exchange Error ${res.status}]`, errorText);
    throw new Error(`Google token exchange failed (${res.status}): ${errorText}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Google ID token verification (RS256, via Google's public JWKS)
// ---------------------------------------------------------------------------

interface GoogleJwk {
  kid?: string;
  alg?: string;
  n?: string;
  e?: string;
}

interface GoogleIdTokenClaims {
  iss?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  email?: string;
  email_verified?: boolean;
}

let jwksCache: { keys: GoogleJwk[]; fetchedAt: number } | null = null;

async function getGoogleJwks(): Promise<GoogleJwk[]> {
  if (jwksCache && Date.now() - jwksCache.fetchedAt < 15 * 60 * 1000) {
    return jwksCache.keys;
  }
  const res = await fetch(GOOGLE_JWKS_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch Google JWKS");
  }
  const data = await res.json();
  jwksCache = { keys: (data.keys ?? []) as GoogleJwk[], fetchedAt: Date.now() };
  return jwksCache.keys;
}

function base64UrlDecode(input: string): Buffer {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + pad, "base64");
}

function derLength(len: number): Buffer {
  if (len < 128) return Buffer.from([len]);
  const bytes: number[] = [];
  let n = len;
  while (n > 0) {
    bytes.unshift(n & 0xff);
    n >>= 8;
  }
  return Buffer.from([0x80 | bytes.length, ...bytes]);
}

function derInteger(value: Buffer): Buffer {
  let v = value;
  if (v[0] & 0x80) v = Buffer.concat([Buffer.from([0x00]), v]);
  return Buffer.concat([Buffer.from([0x02]), derLength(v.length), v]);
}

function derSequence(parts: Buffer[]): Buffer {
  const content = Buffer.concat(parts);
  return Buffer.concat([Buffer.from([0x30]), derLength(content.length), content]);
}

function jwkToPem(jwk: { n: string; e: string }): string {
  const n = derInteger(base64UrlDecode(jwk.n));
  const e = derInteger(base64UrlDecode(jwk.e));
  const der = derSequence([n, e]);
  const body = der.toString("base64").match(/.{1,64}/g)?.join("\n") ?? "";
  return `-----BEGIN PUBLIC KEY-----\n${body}\n-----END PUBLIC KEY-----`;
}

export async function verifyGoogleIdToken(
  idToken: string,
  clientId: string
): Promise<GoogleIdTokenClaims | null> {
  const parts = idToken.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signatureB64] = parts;

  let header: { kid?: string; alg?: string };
  let payload: GoogleIdTokenClaims;
  try {
    header = JSON.parse(base64UrlDecode(headerB64).toString("utf8"));
    payload = JSON.parse(base64UrlDecode(payloadB64).toString("utf8"));
  } catch {
    return null;
  }

  if (header.alg !== "RS256") return null;
  if (!payload.iss || !GOOGLE_ISSUERS.includes(payload.iss)) return null;
  if (payload.aud !== clientId) return null;
  if (typeof payload.exp !== "number" || Date.now() >= payload.exp * 1000) return null;
  if (typeof payload.iat === "number" && payload.iat * 1000 > Date.now() + 60_000) return null;

  let keys: GoogleJwk[];
  try {
    keys = await getGoogleJwks();
  } catch {
    return null;
  }
  const key = keys.find((k) => k.kid === header.kid && k.alg === "RS256" && k.n && k.e);
  if (!key || !key.n || !key.e) return null;

  const signer = createVerify("RSA-SHA256");
  signer.update(`${headerB64}.${payloadB64}`);
  signer.end();
  const valid = signer.verify(jwkToPem({ n: key.n, e: key.e }), base64UrlDecode(signatureB64));
  if (!valid) return null;

  return payload;
}

// ---------------------------------------------------------------------------
// Admin allowlist gate + helpers
// ---------------------------------------------------------------------------

export function isAllowedAdminEmail(email: string): boolean {
  const clean = email.trim().toLowerCase();
  return ADMIN_CONFIG.allowedEmails.some((allowed) => allowed.toLowerCase() === clean);
}

export function safeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
