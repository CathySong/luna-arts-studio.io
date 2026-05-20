import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  ADMIN_SESSION_COOKIE,
  adminPassword,
  CRM_ADMIN_HEADER,
  validateSessionCookie,
} from "@/lib/crm/session-cookie";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/studio") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/login/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  if (pathname !== "/admin" && !pathname.startsWith("/admin/")) {
    return NextResponse.next();
  }

  const secret = adminPassword();
  if (!secret) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("reason", "missing-admin-secret");
    return NextResponse.redirect(url);
  }

  const cookieVal = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const valid = await validateSessionCookie(cookieVal, secret);
  if (!valid) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  res.headers.set(CRM_ADMIN_HEADER, "1");
  return res;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/studio"],
};
