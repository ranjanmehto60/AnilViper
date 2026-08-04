import "server-only";

import { createSession, deleteSession, readSession } from "@/lib/store-db";
import { ADMIN_CONFIG } from "@/config/admin";

export const ADMIN_SESSION_COOKIE = "viper_admin_session";
export const ACCOUNT_SESSION_COOKIE = "viper_account_session";

export function getCookieValue(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    if (key === name) return decodeURIComponent(part.slice(idx + 1).trim());
  }
  return null;
}

export function sessionCookieHeader(
  name: string,
  token: string,
  maxAgeSeconds: number,
  secure = process.env.NODE_ENV === "production"
): string {
  return `${name}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${secure ? "; Secure" : ""}`;
}

export function clearCookieHeader(name: string): string {
  return `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function isAllowedAdminIdentifier(identifier: string): boolean {
  const clean = identifier.trim().toLowerCase();
  return (
    ADMIN_CONFIG.allowedEmails.some((email) => email.toLowerCase() === clean) ||
    ADMIN_CONFIG.allowedPhones.some((phone) => phone.replace(/\D/g, "") === clean.replace(/\D/g, ""))
  );
}

export function isAdminSession(token: string | null | undefined): boolean {
  if (!token) return false;
  const session = readSession(token);
  if (!session || session.role !== "admin") return false;
  return isAllowedAdminIdentifier(session.identifier);
}

export function isCustomerSession(token: string | null | undefined): boolean {
  if (!token) return false;
  const session = readSession(token);
  return session !== null && session.role === "customer";
}

export function getCustomerPhone(token: string | null | undefined): string | null {
  if (!token) return null;
  const session = readSession(token);
  return session && session.role === "customer" ? session.identifier : null;
}

export function createAdminSession(identifier: string): { token: string; ttlMs: number } {
  return createSession("admin", identifier);
}

export function createCustomerSession(phone: string): { token: string; ttlMs: number } {
  return createSession("customer", phone);
}

export function endSession(token: string | null | undefined) {
  deleteSession(token);
}