import "server-only";
import { headers } from "next/headers";
import type { ZodError } from "zod";
import type { FormState } from "@/lib/form-state";
import { clientIp, rateLimit } from "@/server/lib/rate-limit";

/** FormData → plain object of trimmed strings (checkboxes become "on"). */
export function formObject(fd: FormData) {
  const out: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === "string") out[k] = v.trim();
  return out;
}

export function fieldErrors(err: ZodError): FormState {
  const fields: Record<string, string> = {};
  for (const i of err.issues) fields[i.path.join(".")] ??= i.message;
  return { error: "Please check the highlighted fields.", fields };
}

/** Rate limit keyed by action name + client IP. Returns an error state when blocked. */
export async function limitAction(name: string, limit: number, windowMs: number): Promise<FormState | null> {
  const ip = clientIp(await headers());
  const r = rateLimit(`${name}:${ip}`, limit, windowMs);
  return r.ok ? null : { error: "Too many attempts. Please wait a few minutes and try again." };
}

/** Resolves a safe in-app redirect target (blocks open redirects). */
export function safeNext(next: string | undefined, fallback: string) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}
