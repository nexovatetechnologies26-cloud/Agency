import "server-only";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/server/db/mongodb";
import { Lead } from "@/server/models/lead.model";
import type { LeadData } from "@/lib/validations/lead";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/constants";
import type { LeadListItem } from "@/types/lead";
import { layout, notifyTeam, sendEmail } from "@/server/lib/email";
import { config } from "@/server/config";

// Business logic for leads. API routes and admin pages call these functions;
// nothing outside src/server talks to the database directly.


export async function createLead(data: LeadData) {
  await connectDB();
  const lead = await Lead.create({
    type: data.type,
    name: data.name,
    email: data.email,
    country: data.country,
    phone: data.phone,
    company: data.company,
    website: data.website,
    service: data.service,
    budget: data.budget,
    timeline: data.timeline,
    preferredContact: data.preferredContact,
    message: data.message,
    consent: { marketing: data.marketingConsent, privacyAcceptedAt: new Date() },
    source: {
      utmSource: data.utm?.source,
      utmMedium: data.utm?.medium,
      utmCampaign: data.utm?.campaign,
      utmTerm: data.utm?.term,
      utmContent: data.utm?.content,
      referrer: data.referrer,
      landingPage: data.landingPage,
    },
    activity: [{ action: "created", actor: "website" }],
  });

  // Emails never block or fail the submission (sendEmail swallows errors).
  await Promise.all([
    sendEmail(
      data.email,
      "We've received your request",
      layout(`Thanks, ${data.name}`, [
        "We've received your message and our team will review it shortly.",
        "We'll get back to you by your preferred contact method.",
      ]),
    ),
    notifyTeam(`New ${data.type} lead: ${data.name}`, [`${data.email} · ${data.country}`, data.message.slice(0, 500)], `${config.siteUrl}/admin/leads`),
  ]);
  return { id: String(lead._id) };
}

export async function listLeads(opts: { status?: string; q?: string; page?: number; limit?: number } = {}) {
  await connectDB();
  const limit = Math.min(Math.max(opts.limit ?? 25, 1), 100);
  const page = Math.max(opts.page ?? 1, 1);

  const filter: Record<string, unknown> = {};
  if (opts.status && (LEAD_STATUSES as readonly string[]).includes(opts.status)) filter.status = opts.status;
  if (opts.q) {
    const rx = new RegExp(opts.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").slice(0, 100), "i");
    filter.$or = [{ name: rx }, { email: rx }, { company: rx }, { service: rx }];
  }

  const [rows, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Lead.countDocuments(filter),
  ]);

  const items: LeadListItem[] = rows.map((l) => ({
    id: String(l._id),
    type: l.type,
    status: l.status as LeadStatus,
    name: l.name,
    email: l.email,
    country: l.country,
    phone: l.phone ?? undefined,
    company: l.company ?? undefined,
    website: l.website ?? undefined,
    service: l.service ?? undefined,
    budget: l.budget ?? undefined,
    timeline: l.timeline ?? undefined,
    preferredContact: l.preferredContact ?? undefined,
    message: l.message,
    marketingConsent: Boolean(l.consent?.marketing),
    aiSummary: l.aiSummary ?? undefined,
    assignedTo: l.assignedTo ?? undefined,
    source: l.source?.utmSource ?? (l.source?.referrer ? safeHost(l.source.referrer) : undefined),
    notes: (l.notes ?? []).map((n) => ({
      body: n.body,
      author: n.author,
      createdAt: new Date((n as { createdAt?: Date }).createdAt ?? Date.now()).toISOString(),
    })),
    createdAt: new Date(l.createdAt).toISOString(),
  }));

  return { items, total, page, pages: Math.max(Math.ceil(total / limit), 1) };
}

export async function getLeadStats() {
  await connectDB();
  const grouped = await Lead.aggregate<{ _id: LeadStatus; count: number }>([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const byStatus = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0])) as Record<LeadStatus, number>;
  for (const g of grouped) byStatus[g._id] = g.count;
  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
  return { total, byStatus };
}

export async function updateLead(id: string, actor: string, update: { status?: LeadStatus; note?: string }) {
  if (!isValidObjectId(id)) return null;
  await connectDB();

  const lead = await Lead.findById(id);
  if (!lead) return null;

  if (update.status && update.status !== lead.status) {
    lead.activity.push({ action: "status_changed", actor, detail: `${lead.status} → ${update.status}` });
    lead.status = update.status;
  }
  if (update.note) {
    lead.notes.push({ body: update.note, author: actor });
    lead.activity.push({ action: "note_added", actor });
  }
  await lead.save();
  return { id: String(lead._id), status: lead.status };
}

function safeHost(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return undefined;
  }
}
