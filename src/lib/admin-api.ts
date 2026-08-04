import "server-only";

import { ADMIN_SESSION_COOKIE, getCookieValue, isAdminSession } from "@/lib/auth";

export function isAuthorizedAdmin(request: Request): boolean {
  return isAdminSession(getCookieValue(request, ADMIN_SESSION_COOKIE));
}
