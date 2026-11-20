import type { NextRequest } from "next/server";
import { leadStatusUpdateSchema } from "@/lib/validations/lead";
import { getSession } from "@/server/auth/session";
import { can } from "@/lib/permissions";
import { updateLead } from "@/server/services/lead.service";
import { fail, ok, serverError, validationError } from "@/server/lib/http";

export const runtime = "nodejs";

// PATCH /api/admin/leads/:id — change pipeline stage and/or add a note
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || !can(session.role, "leads")) return fail("FORBIDDEN", "Not allowed.", 403);

  const parsed = leadStatusUpdateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);
  if (!parsed.data.status && !parsed.data.note) return fail("BAD_REQUEST", "Nothing to update.", 400);

  try {
    const { id } = await params;
    const result = await updateLead(id, session.email, parsed.data);
    if (!result) return fail("NOT_FOUND", "Lead not found.", 404);
    return ok(result);
  } catch (err) {
    return serverError(err, "PATCH /api/admin/leads/:id");
  }
}
