import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProposalByToken } from "@/server/queries/commerce";
import { getSession } from "@/server/auth/session";
import { acceptProposalAction, declineProposalAction } from "@/server/actions/commerce";
import { fmtDate } from "@/lib/format";
import { ItemsTable } from "@/components/commerce/items-table";
import { ActionForm, Checkbox, Field, SubmitButton } from "@/components/forms/action-form";
import { PendingButton } from "@/components/forms/pending-button";
import { StatusBadge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Proposal", robots: { index: false, follow: false } };

function List({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <section>
      <h2 className="text-lg">{title}</h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink/85">{items.map((i) => <li key={i}>{i}</li>)}</ul>
    </section>
  );
}

export default async function ProposalPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const p = await getProposalByToken(token);
  if (!p) notFound();
  const session = await getSession();
  const open = p.status === "sent" || p.status === "viewed";
  const rightUser = session?.email === p.clientEmail;
  const here = `/proposals/${token}`;

  return (
    <section className="section">
      <div className="container max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted">{p.number} · version {p.version}</p>
          <StatusBadge status={p.status} />
        </div>
        <h1 className="mt-3 text-4xl">{p.title}</h1>
        <p className="mt-2 text-muted">
          Prepared for {p.clientName}{p.clientCompany ? `, ${p.clientCompany}` : ""} · {p.validUntil ? `Valid until ${fmtDate(p.validUntil)}` : "No expiry date"}
        </p>

        <div className="card mt-10 space-y-10 p-7 md:p-10">
          {p.overview && (
            <section>
              <h2 className="text-lg">Project overview</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink/85">{p.overview}</p>
            </section>
          )}
          <List title="Scope of work" items={p.scope} />
          <List title="Deliverables" items={p.deliverables} />
          <List title="Milestones" items={p.milestones} />
          <List title="Not included" items={p.exclusions} />
          <dl className="grid gap-4 text-sm sm:grid-cols-3">
            {p.timeline && <div><dt className="text-muted">Timeline</dt><dd className="mt-1 font-medium">{p.timeline}</dd></div>}
            {p.revisions && <div><dt className="text-muted">Revisions</dt><dd className="mt-1 font-medium">{p.revisions}</dd></div>}
            {p.paymentTerms && <div><dt className="text-muted">Payment terms</dt><dd className="mt-1 font-medium">{p.paymentTerms}</dd></div>}
          </dl>
          <section>
            <h2 className="text-lg">Pricing</h2>
            <div className="mt-3"><ItemsTable items={p.items} currency={p.currency} subtotal={p.subtotal} discount={p.discount} total={p.total} /></div>
          </section>
          {p.terms && (
            <section>
              <h2 className="text-lg">Terms</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm text-muted">{p.terms}</p>
            </section>
          )}
        </div>

        <div className="card mt-8 p-7">
          {p.status === "accepted" && <p className="font-semibold text-emerald-700">Accepted by {p.acceptedByName} on {fmtDate(p.respondedAt)}. Thank you!</p>}
          {p.status === "declined" && <p className="font-semibold">This proposal was declined. Contact us if you&apos;d like to revisit it.</p>}
          {p.status === "expired" && <p className="font-semibold">This proposal has expired. Please contact us for an updated version.</p>}

          {open && !session && (
            <div className="space-y-4">
              <p className="text-sm text-muted">To accept, sign in or create an account using <strong>{p.clientEmail}</strong>.</p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href={`/login?next=${encodeURIComponent(here)}`}>Sign in to accept</ButtonLink>
                <ButtonLink href={`/register?next=${encodeURIComponent(here)}`} variant="secondary">Create account</ButtonLink>
              </div>
            </div>
          )}
          {open && session && !rightUser && (
            <p className="text-sm text-muted">You&apos;re signed in as {session.email}. Please sign in as {p.clientEmail} to accept this proposal.</p>
          )}
          {open && rightUser && (
            <>
              <h2 className="text-lg">Accept proposal</h2>
              <ActionForm action={acceptProposalAction} className="mt-4">
                <input type="hidden" name="token" value={token} />
                <Field label="Type your full name to sign" name="name" defaultValue={session?.name} autoComplete="name" />
                <Checkbox name="agree">
                  I accept this proposal, its pricing and terms, and Nexovate&apos;s <Link href="/terms" className="text-brand">terms</Link>.
                </Checkbox>
                <SubmitButton>Accept proposal</SubmitButton>
              </ActionForm>
              <form action={declineProposalAction} className="mt-8 flex flex-wrap items-end gap-3 border-t border-line pt-6">
                <input type="hidden" name="token" value={token} />
                <div className="flex-1">
                  <label htmlFor="reason" className="field-label">Not right for you? Tell us why <span className="font-normal text-muted">(optional)</span></label>
                  <input id="reason" name="reason" className="field" maxLength={1000} />
                </div>
                <PendingButton tone="danger" confirm="Decline this proposal?">Decline</PendingButton>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
