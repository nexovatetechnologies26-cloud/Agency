import type { NextRequest } from "next/server";
import { getSession } from "@/server/auth/session";
import { connectDB } from "@/server/db/mongodb";
import { Invoice } from "@/server/models/commerce.model";
import { Lead } from "@/server/models/lead.model";
import { audit } from "@/server/lib/audit";
import { can, type Permission } from "@/lib/permissions";
import { fail } from "@/server/lib/http";

export const runtime = "nodejs";

const cell = (v: unknown) => {
  const s = v == null ? "" : String(v);
  // quote + neutralise spreadsheet formula injection
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};
const toCsv = (rows: unknown[][]) => rows.map((r) => r.map(cell).join(",")).join("\n");

const EXPORTS: Record<string, { perm: Permission; build: () => Promise<unknown[][]> }> = {
  invoices: {
    perm: "finance",
    build: async () => {
      const rows = await Invoice.find().sort({ issuedAt: -1 }).lean();
      return [
        ["number", "issued", "bill_to", "email", "country", "currency", "total_minor", "paid_minor", "status"],
        ...rows.map((i) => [i.number, new Date(i.issuedAt).toISOString(), i.billTo?.name, i.billTo?.email, i.billTo?.country, i.currency, i.total, i.amountPaid, i.status]),
      ];
    },
  },
  leads: {
    perm: "leads",
    build: async () => {
      const rows = await Lead.find().sort({ createdAt: -1 }).lean();
      return [
        ["created", "type", "status", "name", "email", "country", "service", "budget", "utm_source", "utm_campaign"],
        ...rows.map((l) => [new Date(l.createdAt).toISOString(), l.type, l.status, l.name, l.email, l.country, l.service, l.budget, l.source?.utmSource, l.source?.utmCampaign]),
      ];
    },
  },
};

// GET /api/admin/export/:kind — CSV export (audit-logged)
export async function GET(_req: NextRequest, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  const exp = EXPORTS[kind];
  if (!exp) return fail("NOT_FOUND", "Unknown export.", 404);
  const s = await getSession();
  if (!s || !can(s.role, exp.perm)) return fail("FORBIDDEN", "Not allowed.", 403);

  await connectDB();
  const csv = toCsv(await exp.build());
  await audit(s.email, "data_export", kind);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="nexovate-${kind}-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
