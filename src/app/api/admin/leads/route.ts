import type { NextRequest } from "next/server";
import { getSession } from "@/server/auth/session";
import { can } from "@/lib/permissions";
import { listLeads } from "@/server/services/lead.service";
import { fail, ok, serverError } from "@/server/lib/http";

export const runtime = "nodejs";

// GET /api/admin/leads?status=&q=&page= — admin only
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || !can(session.role, "leads")) return fail("FORBIDDEN", "Not allowed.", 403);

  const sp = req.nextUrl.searchParams;
  try {
    const result = await listLeads({
      status: sp.get("status") ?? undefined,
      q: sp.get("q") ?? undefined,
      page: Number(sp.get("page")) || 1,
    });
    return ok(result);
  } catch (err) {
    return serverError(err, "GET /api/admin/leads");
  }
}
