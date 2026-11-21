"use client";

import { useMemo, useState } from "react";
import { CalendarCheck } from "lucide-react";
import clsx from "clsx";
import { COUNTRIES } from "@/content/countries";
import { publishedServices } from "@/content/services";
import { bookConsultationAction } from "@/server/actions/booking";
import { ActionForm, Checkbox, Field, Select, SubmitButton, TextArea } from "@/components/forms/action-form";
import { TimezoneSelect } from "@/components/forms/timezone-select";
import Link from "next/link";

export function BookingForm({ slots, durationMinutes, defaults }: { slots: string[]; durationMinutes: number; defaults?: { name?: string; email?: string; country?: string } }) {
  const [tz, setTz] = useState("UTC");
  const [slot, setSlot] = useState("");

  // group available slots by the visitor's local date
  const days = useMemo(() => {
    const dayFmt = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short", month: "short", day: "numeric" });
    const map = new Map<string, string[]>();
    for (const s of slots) {
      const key = dayFmt.format(new Date(s));
      map.set(key, [...(map.get(key) ?? []), s]);
    }
    return [...map.entries()];
  }, [slots, tz]);

  const [dayIndex, setDay] = useState(0);
  const day = Math.min(dayIndex, Math.max(days.length - 1, 0));
  const timeFmt = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" });

  return (
    <ActionForm
      action={bookConsultationAction}
      className="card p-6 md:p-8"
      success={(message) => (
        <div className="card flex flex-col items-center p-10 text-center" role="status">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
            <CalendarCheck size={26} strokeWidth={1.75} />
          </span>
          <h2 className="mt-5 text-2xl">You&apos;re booked in</h2>
          <p className="mt-3 max-w-md text-muted">{message}</p>
          <p className="mt-2 max-w-md text-sm text-muted">The email includes a link to cancel or rebook if your plans change.</p>
        </div>
      )}
    >
      <div>
        <label htmlFor="tz" className="field-label">Your timezone</label>
        <TimezoneSelect id="tz" name="timezone" value={tz} onChange={(v) => { setTz(v); setSlot(""); setDay(0); }} />
      </div>

      {days.length === 0 ? (
        <p className="rounded-xl bg-paper p-4 text-sm text-muted">
          No times are available right now. Please <Link href="/contact" className="text-brand">contact us</Link> and we&apos;ll find a time.
        </p>
      ) : (
        <div>
          <p className="field-label">Pick a day</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {days.map(([label], i) => (
              <button
                key={label}
                type="button"
                onClick={() => { setDay(i); setSlot(""); }}
                aria-pressed={i === day}
                className={clsx("shrink-0 rounded-xl border px-3.5 py-2 text-sm font-medium transition", i === day ? "border-brand bg-brand text-white" : "border-line bg-surface hover:border-brand")}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="field-label mt-5">Pick a time ({durationMinutes} min)</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {(days[day]?.[1] ?? []).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={slot === s}
                onClick={() => setSlot(s)}
                className={clsx("rounded-xl border px-3 py-2 text-sm transition", slot === s ? "border-brand bg-brand-soft font-semibold text-brand" : "border-line hover:border-brand")}
              >
                {timeFmt.format(new Date(s))}
              </button>
            ))}
          </div>
          <input type="hidden" name="slot" value={slot} />
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" autoComplete="name" defaultValue={defaults?.name} />
        <Field label="Email" name="email" type="email" autoComplete="email" defaultValue={defaults?.email} />
        <Select label="Country" name="country" placeholder="Select your country" defaultValue={defaults?.country ?? ""} options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))} />
        <Select label="Topic" name="topic" optional placeholder="General" options={publishedServices.map((s) => ({ value: s.title, label: s.title }))} />
      </div>
      <TextArea label="Anything we should know?" name="notes" optional rows={3} />
      <Checkbox name="privacy">
        I agree to the <Link href="/privacy-policy" className="text-brand">privacy policy</Link>.
      </Checkbox>
      <SubmitButton>Confirm booking</SubmitButton>
    </ActionForm>
  );
}
