"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/server/db/mongodb";
import { Lead } from "@/server/models/lead.model";
import { assertPermission } from "@/server/auth/session";
import { AiUnavailableError, complete } from "@/server/lib/ai";
import { services } from "@/content/services";
import { replyToLead } from "@/server/services/lead.service";

/**
 * AI-assisted qualification: summarises the request, lists missing information and
 * suggests follow-up questions. It never promises prices or dates — a human decides.
 */
export async function summarizeLeadAction(id: string): Promise<{ ok: boolean; summary?: string; error?: string }> {
  await assertPermission("ai");
  await connectDB();
  const lead = await Lead.findById(id).lean();
  if (!lead) return { ok: false, error: "Lead not found" };

  const service = services.find((s) => s.slug === lead.service)?.title ?? lead.service ?? "not specified";
  const system =
    "You help a digital agency's sales team qualify inquiries. Be concise. Output three short sections: " +
    "'Summary' (2-3 sentences), 'Missing information' (bullets), 'Suggested follow-up questions' (3-5 bullets). " +
    "Never suggest prices, discounts, availability or delivery dates.";
  const content = [
    `Service: ${service}`,
    `Country: ${lead.country}`,
    lead.company ? `Company: ${lead.company}` : "",
    lead.website ? `Website: ${lead.website}` : "",
    lead.budget ? `Budget range: ${lead.budget}` : "",
    lead.timeline ? `Timeline: ${lead.timeline}` : "",
    `Message:\n${lead.message}`,
  ].filter(Boolean).join("\n");

  try {
    const summary = await complete(system, [{ role: "user", content }], 500);
    await Lead.updateOne({ _id: id }, { aiSummary: summary.slice(0, 4000) });
    revalidatePath("/admin/leads");
    return { ok: true, summary };
  } catch (err) {
    if (err instanceof AiUnavailableError) return { ok: false, error: "AI is not configured or unavailable right now." };
    console.error("[ai] summarize failed", err);
    return { ok: false, error: "AI request failed. Please try again." };
  }
}

/** Email a reply to the person who sent the inquiry; it is stored on the lead as a conversation. */
export async function replyToLeadAction(
  id: string,
  input: { subject: string; body: string },
): Promise<{ ok: boolean; sent?: boolean; emailConfigured?: boolean; error?: string }> {
  const session = await assertPermission("leads");
  const subject = (input.subject ?? "").trim().slice(0, 200);
  const body = (input.body ?? "").trim().slice(0, 10000);
  if (subject.length < 2) return { ok: false, error: "Please add a subject." };
  if (body.length < 2) return { ok: false, error: "Please write your reply." };
  try {
    const result = await replyToLead(id, session.email, { subject, body });
    if (!result) return { ok: false, error: "Message not found." };
    revalidatePath("/admin/leads");
    return { ok: true, ...result };
  } catch (err) {
    console.error("[leads] reply failed", err);
    return { ok: false, error: "Could not send the reply. Please try again." };
  }
}
