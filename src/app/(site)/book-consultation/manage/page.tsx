import type { Metadata } from "next";
import { getBookingByToken } from "@/server/queries/booking";
import { cancelBookingByTokenAction } from "@/server/actions/booking";
import { fmtDateTime } from "@/lib/format";
import { PendingButton } from "@/components/forms/pending-button";
import { ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Manage booking", robots: { index: false } };

export default async function ManageBookingPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  const b = await getBookingByToken(token);

  return (
    <section className="section">
      <div className="container max-w-lg">
        <h1 className="text-3xl">Your consultation</h1>
        {!b ? (
          <p className="mt-6 text-muted">This link is invalid. Please check the link in your confirmation email.</p>
        ) : (
          <div className="card mt-8 space-y-4 p-7">
            <StatusBadge status={b.status} />
            <p className="text-lg font-semibold">{fmtDateTime(b.startsAt, b.timezone)}</p>
            <p className="text-sm text-muted">{b.timezone} · {b.durationMinutes} minutes</p>
            {b.status === "confirmed" && new Date(b.startsAt) > new Date() && (
              <form action={cancelBookingByTokenAction} className="flex flex-wrap gap-3 pt-2">
                <input type="hidden" name="token" value={token} />
                <PendingButton tone="danger" confirm="Cancel this consultation?">Cancel booking</PendingButton>
                <ButtonLink href="/book-consultation" variant="secondary">Book another time</ButtonLink>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
