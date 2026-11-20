import type { NextRequest } from "next/server";
import { leadInputSchema } from "@/lib/validations/lead";
import { createLead } from "@/server/services/lead.service";
import { clientIp, rateLimit } from "@/server/lib/rate-limit";
import { fail, ok, serverError, validationError } from "@/server/lib/http";

export const runtime = "nodejs";

// POST /api/leads — public. Creates a lead from the contact or quote form.
export async function POST(req: NextRequest) {
  const limit = rateLimit(`lead:${clientIp(req.headers)}`, 5, 10 * 60 * 1000);
  if (!limit.ok) return fail("RATE_LIMITED", "Too many submissions. Please try again later.", 429);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("BAD_REQUEST", "Invalid request body.", 400);
  }

  // Honeypot filled → pretend success so bots learn nothing.
  if (body && typeof body === "object" && (body as Record<string, unknown>).companyFax) {
    return ok({ received: true }, 201);
  }

  const parsed = leadInputSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  try {
    await createLead(parsed.data);
    return ok({ received: true }, 201);
  } catch (err) {
    return serverError(err, "POST /api/leads");
  }
}
