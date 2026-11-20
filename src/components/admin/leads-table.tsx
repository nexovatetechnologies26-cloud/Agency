"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Sparkles } from "lucide-react";
import { summarizeLeadAction } from "@/server/actions/leads";
import clsx from "clsx";
import { LEAD_STATUSES, LEAD_STATUS_LABELS, type LeadStatus } from "@/lib/constants";
import { COUNTRIES } from "@/content/countries";
import { services } from "@/content/services";
import type { LeadListItem } from "@/types/lead";

const countryName = (code: string) => COUNTRIES.find((c) => c.code === code)?.name ?? code;
const serviceName = (slug?: string) => (slug ? (services.find((s) => s.slug === slug)?.title ?? slug) : "—");
const fmt = (iso: string) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

const statusColor: Record<LeadStatus, string> = {
  new: "bg-brand-soft text-brand",
  contacted: "bg-blue-50 text-blue-700",
  qualified: "bg-indigo-50 text-indigo-700",
  consultation_scheduled: "bg-amber-50 text-amber-700",
  proposal_sent: "bg-orange-50 text-orange-700",
  negotiation: "bg-yellow-50 text-yellow-800",
  won: "bg-emerald-50 text-emerald-700",
  lost: "bg-gray-100 text-gray-600",
};

export function LeadsTable({ leads, canAi = false, canPropose = false }: { leads: LeadListItem[]; canAi?: boolean; canPropose?: boolean }) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function patch(id: string, body: { status?: LeadStatus; note?: string }) {
    setBusy(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error?.message ?? "Update failed");
      router.refresh();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
      return false;
    } finally {
      setBusy(null);
    }
  }

  if (leads.length === 0) {
    return (
      <div className="card mt-6 p-12 text-center">
        <p className="font-semibold">No leads yet</p>
        <p className="mt-1 text-sm text-muted">New inquiries from the website will appear here.</p>
      </div>
    );
  }

  return (
    <div className="card mt-6 overflow-hidden">
      {error && <p className="border-b border-line bg-red-50 px-5 py-3 text-sm text-red-700" role="alert">{error}</p>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-5 py-3 font-medium">Contact</th>
              <th className="px-5 py-3 font-medium">Country</th>
              <th className="px-5 py-3 font-medium">Service</th>
              <th className="px-5 py-3 font-medium">Received</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => {
              const open = openId === l.id;
              return (
                <Fragment key={l.id}>
                  <tr className="border-b border-line last:border-0">
                    <td className="px-5 py-4">
                      <p className="font-semibold">{l.name}</p>
                      <a href={`mailto:${l.email}`} className="text-muted hover:text-brand">{l.email}</a>
                    </td>
                    <td className="px-5 py-4">{countryName(l.country)}</td>
                    <td className="px-5 py-4">
                      {serviceName(l.service)}
                      <span className="ml-2 rounded bg-paper px-1.5 py-0.5 text-[11px] uppercase text-muted">{l.type}</span>
                    </td>
                    <td className="px-5 py-4 text-muted">{fmt(l.createdAt)}</td>
                    <td className="px-5 py-4">
                      <select
                        aria-label={`Status for ${l.name}`}
                        value={l.status}
                        disabled={busy === l.id}
                        onChange={(e) => patch(l.id, { status: e.target.value as LeadStatus })}
                        className={clsx("rounded-full border-0 px-3 py-1.5 text-xs font-semibold", statusColor[l.status])}
                      >
                        {LEAD_STATUSES.map((s) => (
                          <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? null : l.id)}
                        aria-expanded={open}
                        className="inline-flex items-center gap-1 text-xs font-medium text-brand"
                      >
                        Details <ChevronDown size={14} className={clsx("transition", open && "rotate-180")} />
                      </button>
                    </td>
                  </tr>
                  {open && (
                    <tr className="border-b border-line bg-paper/60">
                      <td colSpan={6} className="px-5 py-6">
                        <LeadDetails lead={l} busy={busy === l.id} canAi={canAi} canPropose={canPropose} onNote={(note) => patch(l.id, { note })} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeadDetails({
  lead,
  busy,
  canAi,
  canPropose,
  onNote,
}: {
  lead: LeadListItem;
  busy: boolean;
  canAi: boolean;
  canPropose: boolean;
  onNote: (n: string) => Promise<boolean>;
}) {
  const [note, setNote] = useState("");
  const [summary, setSummary] = useState(lead.aiSummary ?? "");
  const [aiState, setAiState] = useState<"idle" | "loading" | string>("idle");

  async function summarize() {
    setAiState("loading");
    const r = await summarizeLeadAction(lead.id);
    if (r.ok && r.summary) {
      setSummary(r.summary);
      setAiState("idle");
    } else setAiState(r.error ?? "Failed");
  }
  const rows: [string, string | undefined][] = [
    ["Phone", lead.phone],
    ["Company", lead.company],
    ["Website", lead.website],
    ["Budget", lead.budget],
    ["Timeline", lead.timeline],
    ["Preferred contact", lead.preferredContact],
    ["Source", lead.source],
    ["Newsletter consent", lead.marketingConsent ? "Yes" : "No"],
  ];

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Message</p>
        <p className="mt-2 whitespace-pre-wrap leading-relaxed">{lead.message}</p>
        {(canAi || canPropose) && (
          <div className="mt-5 flex flex-wrap gap-2">
            {canPropose && (
              <Link href={`/admin/proposals/new?lead=${lead.id}`} className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white">
                Create proposal
              </Link>
            )}
            {canAi && (
              <button type="button" onClick={summarize} disabled={aiState === "loading"} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-xs font-semibold disabled:opacity-60">
                <Sparkles size={14} className="text-brand" /> {aiState === "loading" ? "Analysing…" : "AI qualify"}
              </button>
            )}
          </div>
        )}
        {aiState !== "idle" && aiState !== "loading" && <p className="mt-2 text-xs text-red-600">{aiState}</p>}
        {summary && (
          <div className="mt-4 rounded-xl border border-brand/20 bg-brand-soft/50 p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">AI notes — verify before acting</p>
            <p className="mt-2 whitespace-pre-wrap">{summary}</p>
          </div>
        )}
        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {rows.filter(([, v]) => v).map(([k, v]) => (
            <Fragment key={k}>
              <dt className="text-muted">{k}</dt>
              <dd className="break-words">{v}</dd>
            </Fragment>
          ))}
        </dl>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Notes</p>
        <ul className="mt-2 space-y-2">
          {lead.notes.length === 0 && <li className="text-sm text-muted">No notes yet.</li>}
          {lead.notes.map((n, i) => (
            <li key={i} className="rounded-xl border border-line bg-white p-3 text-sm">
              <p className="whitespace-pre-wrap">{n.body}</p>
              <p className="mt-1 text-xs text-muted">{n.author} · {fmt(n.createdAt)}</p>
            </li>
          ))}
        </ul>
        <form
          className="mt-3 flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!note.trim()) return;
            if (await onNote(note.trim())) setNote("");
          }}
        >
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note…" className="field h-10 py-2" />
          <button type="submit" disabled={busy} className="rounded-full bg-brand px-4 text-sm font-semibold text-white disabled:opacity-60">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
