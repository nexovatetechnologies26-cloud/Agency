import Link from "next/link";
import { requireStaffPage } from "@/server/auth/session";
import { listBookings } from "@/server/queries/booking";
import { setBookingStatusAction } from "@/server/actions/booking";
import { config } from "@/server/config";
import { fmtDateTime } from "@/lib/format";
import { PageHeader } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PendingButton } from "@/components/forms/pending-button";

export default async function AdminBookings({ searchParams }: { searchParams: Promise<{ past?: string }> }) {
  await requireStaffPage("bookings");
  const { past } = await searchParams;
  const rows = await listBookings(past ? "past" : "upcoming");
  const tz = config.booking.slots().timeZone;

  return (
    <>
      <PageHeader
        title="Consultations"
        description={`Times shown in ${tz}. Availability is set with the BOOKING_* environment variables.`}
        actions={<Link href={past ? "/admin/bookings" : "/admin/bookings?past=1"} className="text-sm font-semibold text-brand">{past ? "Show upcoming" : "Show past"}</Link>}
      />
      {rows.length ? (
        <ul className="card divide-y divide-line">
          {rows.map((b) => (
            <li key={b._id} className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <p className="font-semibold">{fmtDateTime(b.startsAt, tz)} <span className="font-normal text-muted">· {b.durationMinutes} min</span></p>
                <p className="text-sm">{b.name} · <a href={`mailto:${b.email}`} className="text-brand">{b.email}</a> · client timezone {b.timezone}</p>
                {(b.topic || b.notes) && <p className="mt-1 text-xs text-muted">{[b.topic, b.notes].filter(Boolean).join(" — ")}</p>}
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={b.status} />
                {b.status === "confirmed" && (
                  <>
                    <form action={setBookingStatusAction}><input type="hidden" name="id" value={b._id} /><input type="hidden" name="status" value="completed" /><PendingButton>Completed</PendingButton></form>
                    <form action={setBookingStatusAction}><input type="hidden" name="id" value={b._id} /><input type="hidden" name="status" value="cancelled" /><PendingButton tone="danger" confirm="Cancel this booking? Please also let the client know.">Cancel</PendingButton></form>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title={past ? "No past consultations" : "No upcoming consultations"} />
      )}
    </>
  );
}
