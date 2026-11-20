import { requireUser } from "@/server/auth/session";
import { listMyBookings } from "@/server/queries/booking";
import { fmtDateTime } from "@/lib/format";
import { PageHeader } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";

export default async function MyBookings() {
  const s = await requireUser();
  const bookings = await listMyBookings(s.email);
  return (
    <>
      <PageHeader title="Consultations" actions={<ButtonLink href="/book-consultation">Book a call</ButtonLink>} />
      {bookings.length ? (
        <ul className="card divide-y divide-line">
          {bookings.map((b) => (
            <li key={b._id} className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <p className="font-semibold">{fmtDateTime(b.startsAt, b.timezone)}</p>
                <p className="text-xs text-muted">{b.timezone} · {b.durationMinutes} min{b.topic ? ` · ${b.topic}` : ""}</p>
                {b.meetingLink && b.status === "confirmed" && (
                  <a href={b.meetingLink} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-brand">Join link</a>
                )}
              </div>
              <StatusBadge status={b.status} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No consultations booked" action={{ label: "Book a call", href: "/book-consultation" }} />
      )}
    </>
  );
}
