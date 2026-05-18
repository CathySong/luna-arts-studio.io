import { cookies } from "next/headers";

import {
  ADMIN_SESSION_COOKIE,
  adminPassword,
  clearAuthSession,
  isAuthenticatedFromRequest,
  setAuthSession,
  validateSessionCookie,
} from "./session-cookie";

export {
  ADMIN_SESSION_COOKIE,
  CRM_ADMIN_HEADER,
  adminPassword,
  clearAuthSession,
  isAuthenticatedFromRequest,
  setAuthSession,
  validateSessionCookie,
} from "./session-cookie";

/** Plain password compare vs ADMIN_PASSWORD (runtime env). */
export function verifyPassword(candidate: string): boolean {
  const expected = adminPassword();
  if (!expected || candidate.length === 0) return false;
  if (candidate.length !== expected.length) return false;
  let out = 0;
  for (let i = 0; i < candidate.length; i++) out |= candidate.charCodeAt(i) ^ expected.charCodeAt(i);
  return out === 0 && expected.length > 0;
}

export async function isAuthenticated(): Promise<boolean> {
  const secret = adminPassword();
  if (!secret) return false;
  const store = await cookies();
  const val = store.get(ADMIN_SESSION_COOKIE)?.value;
  return validateSessionCookie(val, secret);
}
