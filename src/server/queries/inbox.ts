import "server-only";
import { connectDB } from "@/server/db/mongodb";
import { Lead } from "@/server/models/lead.model";
import { Ticket } from "@/server/models/support.model";
import { services } from "@/content/services";

// One inbox for everything people send the team:
// - website inquiries (public Contact / Get a quote / Book a call forms) — Lead
// - client messages (signed-in clients, dashboard → Support & Messages) — Ticket

export type InboxItem = {
  key: string;
  source: "website" | "client";
  kind: string; // "Message", "Quote request", "Consultation", "Client message"
  href: string;
  name: string;
  email: string;
  title: string;
  preview: string;
  fromUs: boolean; // the latest message in the thread was ours
  needsReply: boolean;
  status: string;
  at: string; // ISO, latest activity
};

const KIND: Record<string, string> = { contact: "Message", quote: "Quote request", consultation: "Consultation" };
const serviceTitle = (slug?: string | null) => (slug ? (services.find((s) => s.slug === slug)?.title ?? slug) : "");

export async function listInbox(): Promise<InboxItem[]> {
  await connectDB();
  const [leads, tickets] = await Promise.all([
    Lead.find().sort({ updatedAt: -1 }).limit(150).lean(),
    Ticket.find().sort({ updatedAt: -1 }).limit(150).populate<{ customer: { name: string; email: string } | null }>("customer", "name email").lean(),
  ]);

  const fromLeads: InboxItem[] = leads.map((l) => {
    const replies = (l.replies ?? []) as { body: string; createdAt?: Date }[];
    const last = replies[replies.length - 1];
    const svc = serviceTitle(l.service);
    return {
      key: `lead-${String(l._id)}`,
      source: "website",
      kind: KIND[l.type] ?? "Message",
      href: `/admin/leads/${String(l._id)}`,
      name: l.name,
      email: l.email,
      title: svc ? `${KIND[l.type] ?? "Message"} · ${svc}` : (KIND[l.type] ?? "Message"),
      preview: last ? last.body : l.message,
      fromUs: Boolean(last),
      needsReply: l.status === "new" && replies.length === 0,
      status: l.status,
      at: new Date(last?.createdAt ?? l.createdAt).toISOString(),
    };
  });

  const fromTickets: InboxItem[] = tickets.map((t) => {
    const msgs = (t.messages ?? []) as { body: string; fromStaff?: boolean | null }[];
    const last = msgs[msgs.length - 1];
    return {
      key: `ticket-${String(t._id)}`,
      source: "client",
      kind: "Client message",
      href: `/admin/support/${String(t._id)}`,
      name: t.customer?.name ?? "Client",
      email: t.customer?.email ?? "",
      title: t.subject,
      preview: last?.body ?? "",
      fromUs: Boolean(last?.fromStaff),
      needsReply: t.status === "open",
      status: t.status,
      at: new Date((t as { updatedAt?: Date }).updatedAt ?? Date.now()).toISOString(),
    };
  });

  return [...fromLeads, ...fromTickets].sort((a, b) => (a.at < b.at ? 1 : -1));
}
