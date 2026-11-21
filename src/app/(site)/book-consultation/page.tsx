import type { Metadata } from "next";
import { CalendarCheck, Globe2, Video } from "lucide-react";
import { getAvailableSlots } from "@/server/queries/booking";
import { getSession } from "@/server/auth/session";
import { safe } from "@/server/lib/safe";
import { config } from "@/server/config";
import { SectionHeading } from "@/components/ui/section-heading";
import { BookingForm } from "@/components/forms/booking-form";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Book a free consultation call with Nexovate at a time that suits your timezone.",
  alternates: { canonical: "/book-consultation" },
};

export const dynamic = "force-dynamic";

export default async function BookPage() {
  const [slots, session] = await Promise.all([safe(getAvailableSlots, [], "slots"), getSession()]);
  return (
    <section className="section hero-wash">
      <div className="container grid gap-14 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <SectionHeading
            as="h1"
            eyebrow="Consultation"
            title="Talk to us about your project"
            description="Pick a time that works for you. Times are shown in your own timezone."
          />
          <ul className="mt-10 space-y-4 text-sm text-muted">
            <li className="flex gap-3"><CalendarCheck size={18} className="text-brand" aria-hidden /> {config.booking.durationMinutes}-minute call</li>
            <li className="flex gap-3"><Video size={18} className="text-brand" aria-hidden /> Online video meeting</li>
            <li className="flex gap-3"><Globe2 size={18} className="text-brand" aria-hidden /> Available to clients worldwide</li>
          </ul>
        </div>
        <BookingForm slots={slots} durationMinutes={config.booking.durationMinutes} defaults={session ? { name: session.name, email: session.email } : undefined} />
      </div>
    </section>
  );
}
