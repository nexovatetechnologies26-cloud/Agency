import { SignJWT, jwtVerify } from "jose";
import { isRole, type Role } from "@/lib/permissions";

// Edge-safe session token helpers (used by middleware.ts and server code).

export const SESSION_COOKIE = "nx_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface Session {
  sub: string; // user id
  email: string;
  name: string;
  role: Role;
}

function getKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error("AUTH_SECRET must be set and at least 32 characters long.");
  return new TextEncoder().encode(secret);
}

export async function signSession(s: Session) {
  return new SignJWT({ email: s.email, name: s.name, role: s.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(s.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getKey());
}

export async function verifySession(token: string | undefined): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), { algorithms: ["HS256"] });
    if (!payload.sub || typeof payload.email !== "string" || !isRole(payload.role)) return null;
    return { sub: payload.sub, email: payload.email, name: String(payload.name ?? ""), role: payload.role };
  } catch {
    return null;
  }
}
