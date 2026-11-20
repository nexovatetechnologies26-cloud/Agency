import "server-only";
import { NextResponse } from "next/server";
import type { ZodError } from "zod";

// Consistent JSON shape for every API response:
//   success → { ok: true, data }
//   failure → { ok: false, error: { code, message, fields? } }

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function fail(code: string, message: string, status: number, fields?: Record<string, string>) {
  return NextResponse.json({ ok: false, error: { code, message, ...(fields ? { fields } : {}) } }, { status });
}

export function validationError(err: ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".");
    if (!fields[key]) fields[key] = issue.message;
  }
  return fail("VALIDATION_ERROR", "Please check the highlighted fields.", 422, fields);
}

export function serverError(err: unknown, context: string) {
  // log details on the server only — never send them to the client
  console.error(`[${context}]`, err);
  return fail("SERVER_ERROR", "Something went wrong. Please try again shortly.", 500);
}
