import "server-only";

import { ADMIN_SESSION_COOKIE, getCookieValue, isAdminSession } from "@/lib/auth";

export async function isAuthorizedAdmin(request: Request): Promise<boolean> {
  return isAdminSession(getCookieValue(request, ADMIN_SESSION_COOKIE));
}
