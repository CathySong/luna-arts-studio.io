import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { CRM_ADMIN_HEADER, isAuthenticatedFromRequest } from "@/lib/crm/session-cookie";

/**
 * Guards handlers under `/api/admin`.
 * Returns a 401 Response when the caller lacks a valid CRM cookie session.
 */
export async function requireAdmin(req: NextRequest): Promise<Response | null> {
  const allowed = await isAuthenticatedFromRequest(req);
  if (!allowed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/** Merge into successful JSON replies so downstream tooling can peek at admin context when needed. */
export function stampAdmin(headers = new Headers()): Headers {
  headers.set(CRM_ADMIN_HEADER, "1");
  return headers;
}
