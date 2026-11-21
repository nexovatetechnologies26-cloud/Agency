import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, SESSION_MAX_AGE, verifySession } from "@/server/auth/jwt";
import { isStaff } from "@/lib/permissions";
import { ACCOUNT_HINT_COOKIE } from "@/lib/constants";

// First line of defence for protected areas. Pages, server actions and API
// routes ALSO check the session and permissions themselves.
export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);

  const needsStaff = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const needsUser = needsStaff || pathname.startsWith("/dashboard") || pathname.startsWith("/checkout");

  if (needsUser && !session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ ok: false, error: { code: "UNAUTHORIZED", message: "Please sign in." } }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  if (needsStaff && session && !isStaff(session.role)) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ ok: false, error: { code: "FORBIDDEN", message: "Not allowed." } }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const res = NextResponse.next();
  if (session && !req.cookies.get(ACCOUNT_HINT_COOKIE)) {
    res.cookies.set(ACCOUNT_HINT_COOKIE, isStaff(session.role) ? "staff" : "customer", {
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_MAX_AGE,
    });
  }
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/dashboard/:path*", "/checkout/:path*"],
};
