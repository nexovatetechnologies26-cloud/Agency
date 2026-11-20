import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidObjectId } from "mongoose";
import { can, isRole, isStaff, type Permission } from "@/lib/permissions";
import { connectDB } from "@/server/db/mongodb";
import { User } from "@/server/models/user.model";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession, type Session } from "@/server/auth/jwt";

export type { Session };

export async function startSession(s: Session) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, await signSession(s), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/**
 * Current session or null. Cached per request.
 * The signed cookie is checked against the user record so that disabling an
 * account or changing a role takes effect immediately, not when the cookie expires.
 * If the database is briefly unreachable the signed claims are used as-is.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const jar = await cookies();
  const s = await verifySession(jar.get(SESSION_COOKIE)?.value);
  if (!s) return null;
  if (!isValidObjectId(s.sub)) return null;
  try {
    await connectDB();
    const u = await User.findById(s.sub).select("role active name email").lean();
    if (!u || u.active === false || !isRole(u.role)) return null;
    return { sub: s.sub, email: u.email, name: u.name, role: u.role };
  } catch (err) {
    console.error("[session] user lookup failed, using signed claims", err);
    return s;
  }
});

/** For pages: signed-in user or redirect to login. */
export async function requireUser(next?: string) {
  const s = await getSession();
  if (!s) redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  return s;
}

/** For admin pages: staff with the given permission, or redirect. */
export async function requireStaffPage(permission: Permission = "dashboard") {
  const s = await requireUser("/admin");
  if (!isStaff(s.role)) redirect("/dashboard");
  if (!can(s.role, permission)) redirect("/admin?denied=1");
  return s;
}

export class AuthError extends Error {
  constructor(message = "You are not allowed to do this.") {
    super(message);
    this.name = "AuthError";
  }
}

/** For server actions / API routes: throws instead of redirecting. */
export async function assertPermission(permission: Permission) {
  const s = await getSession();
  if (!s || !can(s.role, permission)) throw new AuthError();
  return s;
}

export async function assertUser() {
  const s = await getSession();
  if (!s) throw new AuthError("Please sign in.");
  return s;
}
