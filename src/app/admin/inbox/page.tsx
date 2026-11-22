import Link from "next/link";
import clsx from "clsx";
import { Globe2, Search, UserRound } from "lucide-react";
import { requireStaffPage } from "@/server/auth/session";
import { listInbox, type InboxItem } from "@/server/queries/inbox";
import { PageHeader } from "@/components/layout/app-shell";

export const dynamic = "force-dynamic";

type Tab = "all" | "reply" | "website" | "client";
const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "reply", label: "Needs reply" },
  { key: "website", label: "Website" },
  { key: "client", label: "Clients" },
];

function timeAgo(iso: string) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)}d`;
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short" }).format(new Date(iso));
}

export default async function InboxPage({ searchParams }: { searchParams: Promise<{ tab?: string; q?: string }> }) {
  await requireStaffPage("leads");
  const sp = await searchParams;
  const tab: Tab = TABS.some((t) => t.key === sp.tab) ? (sp.tab as Tab) : "all";
  const q = (sp.q ?? "").trim().toLowerCase();

  let all: InboxItem[] = [];
  let dbError = false;
  try {
    all = await listInbox();
  } catch (err) {
    console.error("[admin] inbox", err);
    dbError = true;
  }

  const counts: Record<Tab, number> = {
    all: all.length,
    reply: all.filter((i) => i.needsReply).length,
    website: all.filter((i) => i.source === "website").length,
    client: all.filter((i) => i.source === "client").length,
  };
  const items = all
    .filter((i) => (tab === "reply" ? i.needsReply : tab === "website" ? i.source === "website" : tab === "client" ? i.source === "client" : true))
    .filter((i) => !q || `${i.name} ${i.email} ${i.title} ${i.preview}`.toLowerCase().includes(q));

  const href = (t: Tab) => {
    const p = new URLSearchParams();
    if (t !== "all") p.set("tab", t);
    if (sp.q) p.set("q", sp.q);
    const s = p.toString();
    return s ? `/admin/inbox?${s}` : "/admin/inbox";
  };

  return (
    <>
      <PageHeader title="Inbox" description="Everything people send you, in one place — website inquiries and messages from signed-in clients. Open one to read the conversation and reply." />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <nav aria-label="Filter" className="flex flex-wrap gap-1 rounded-2xl border border-line bg-surface p-1.5">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <Link
                key={t.key}
                href={href(t.key)}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
                  active ? "bg-brand text-white" : "text-ink/70 hover:bg-brand-soft hover:text-brand",
                )}
              >
                {t.label}
                <span
                  className={clsx(
                    "rounded-full px-2 py-0.5 text-[11px]",
                    active ? "bg-white/20" : t.key === "reply" && counts.reply ? "bg-brand text-white" : "bg-paper text-muted",
                  )}
                >
                  {counts[t.key]}
                </span>
              </Link>
            );
          })}
        </nav>
        <form action="/admin/inbox" className="relative md:w-80">
          {tab !== "all" && <input type="hidden" name="tab" value={tab} />}
          <Search size={16} aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input name="q" defaultValue={sp.q} placeholder="Search name, email or message…" aria-label="Search the inbox" className="field h-11 py-2 pl-10" />
        </form>
      </div>

      {dbError ? (
        <div className="card mt-6 p-6 text-sm text-red-700" role="alert">Could not connect to the database. Check MONGODB_URI and your Atlas network access settings.</div>
      ) : items.length === 0 ? (
        <div className="card mt-6 flex flex-col items-center p-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
            <Search size={20} aria-hidden />
          </span>
          <p className="mt-4 font-semibold">{q ? "No conversations match your search" : tab === "reply" ? "You're all caught up" : "No conversations yet"}</p>
          <p className="mt-1 max-w-sm text-sm text-muted">Website inquiries and client messages appear here as soon as they arrive.</p>
        </div>
      ) : (
        <ul className="card mt-6 divide-y divide-line overflow-hidden">
          {items.map((i) => (
            <li key={i.key}>
              <Link href={i.href} className={clsx("group flex items-start gap-4 px-5 py-4 transition-colors hover:bg-brand-soft/40 md:px-6", i.needsReply && "bg-brand-soft/25")}>
                <span
                  aria-hidden
                  className={clsx(
                    "relative mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    i.source === "client" ? "bg-ink text-white" : "bg-brand-soft text-brand",
                  )}
                >
                  {i.name.charAt(0).toUpperCase()}
                  {i.needsReply && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-surface bg-brand" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={clsx("truncate text-[15px]", i.needsReply ? "font-bold text-ink" : "font-semibold text-ink/90")}>{i.name}</p>
                    <span
                      className={clsx(
                        "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold",
                        i.source === "client" ? "bg-ink/[0.06] text-ink/70" : "bg-brand-soft text-brand",
                      )}
                    >
                      {i.source === "client" ? <UserRound size={11} aria-hidden /> : <Globe2 size={11} aria-hidden />}
                      {i.source === "client" ? "Client" : "Website"}
                    </span>
                    <span className="ml-auto shrink-0 text-xs text-muted">{timeAgo(i.at)}</span>
                  </div>
                  <p className={clsx("mt-0.5 truncate text-sm", i.needsReply ? "font-semibold text-ink" : "text-ink/80")}>{i.title}</p>
                  <p className="mt-0.5 truncate text-sm text-muted">
                    {i.fromUs && <span className="font-medium text-ink/60">You: </span>}
                    {i.preview}
                  </p>
                </div>
                {i.needsReply && (
                  <span className="mt-1 hidden shrink-0 rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold text-white sm:inline">Needs reply</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
