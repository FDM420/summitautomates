import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";

/**
 * Cheap presence-only gate for /admin. If the session cookie is missing, bounce
 * to login before rendering. This is NOT the security boundary — it can't reach
 * the database on the Edge runtime, so it never validates the token. The real
 * check (validate session + role) happens in the /admin server layout and in
 * every Server Action / route handler.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login/setup page is public.
  if (pathname === "/admin/login") return NextResponse.next();

  const hasCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  if (!hasCookie) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
