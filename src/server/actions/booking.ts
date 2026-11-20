"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/server/db/mongodb";
import { Booking } from "@/server/models/support.model";
import { Lead } from "@/server/models/lead.model";
import { assertPermission, getSession } from "@/server/auth/session";
import { hashToken, newToken } from "@/server/auth/tokens";
import { layout, notifyTeam, sendEmail } from "@/server/lib/email";
import { fieldErrors, formObject, limitAction } from "@/server/lib/forms";
import { audit } from "@/server/lib/audit";
import { config } from "@/server/config";
import { getTakenSlots } from "@/server/queries/booking";
import { generateSlots } from "@/lib/slots";
import { COUNTRY_CODES } from "@/content/countries";
import type { FormState } from "@/lib/form-state";

const bookingSchema = z.object({
  slot: z.string().datetime({ message: "Please choose a time" }),
  timezone: z
    .string()
    .min(1)
    .max(60)
    .refine((tz) => {
      try {
        new Intl.DateTimeFormat("en-US", { timeZone: tz });
        return true;
      } catch {
        return false;
      }
    }, "Please select a valid timezone"),
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),
  country: z.string().trim().toUpperCase().refine((c) => COUNTRY_CODES.has(c), "Please select your country"),
  topic: z.string().trim().max(100).optional(),
  notes: z.string().trim().max(2000).optional(),
  privacy: z.literal("on", { errorMap: () => ({ message: "Please accept the privacy policy" }) }),
});

const fmtIn = (d: Date, tz: string) =>
  new Intl.DateTimeFormat("en-US", { timeZone: tz, dateStyle: "full", timeStyle: "short" }).format(d);

export async function bookConsultationAction(_: FormState, fd: FormData): Promise<FormState> {
  const blocked = await limitAction("booking", 5, 60 * 60_000);
  if (blocked) return blocked;
  const parsed = bookingSchema.safeParse(formObject(fd));
  if (!parsed.success) return fieldErrors(parsed.error);
  const d = parsed.data;

  await connectDB();
  // The slot must be one we would actually offer right now — never trust the client.
  const startsAt = new Date(d.slot);
  const available = generateSlots(config.booking.slots(), new Date(), await getTakenSlots());
  if (!available.includes(startsAt.toISOString())) {
    return { error: "That time is no longer available. Please pick another slot." };
  }

  const session = await getSession();
  const manage = newToken();
  const lead = await Lead.create({
    type: "consultation",
    name: d.name,
    email: d.email,
    country: d.country,
    message: d.notes || `Consultation booked: ${d.topic || "general"}`,
    service: d.topic,
    status: "consultation_scheduled",
    consent: { marketing: false, privacyAcceptedAt: new Date() },
    activity: [{ action: "created", actor: "booking" }],
  });

  try {
    await Booking.create({
      startsAt,
      durationMinutes: config.booking.durationMinutes,
      name: d.name,
      email: d.email,
      country: d.country,
      timezone: d.timezone,
      topic: d.topic,
      notes: d.notes,
      meetingLink: config.booking.meetingLink || undefined,
      customer: session && session.role === "customer" ? session.sub : undefined,
      lead: lead._id,
      manageTokenHash: manage.hash,
    });
  } catch (err) {
    await Lead.deleteOne({ _id: lead._id });
    if ((err as { code?: number }).code === 11000) return { error: "Someone just booked that time. Please pick another slot." };
    throw err;
  }

  const when = fmtIn(startsAt, d.timezone);
  await sendEmail(
    d.email,
    "Your consultation with Nexovate is confirmed",
    layout(`See you soon, ${d.name}`, [
      `Your ${config.booking.durationMinutes}-minute consultation is booked for ${when} (${d.timezone}).`,
      config.booking.meetingLink ? `Meeting link: ${config.booking.meetingLink}` : "We'll email you the meeting link before the call.",
    ], { label: "Cancel or manage booking", url: `${config.siteUrl}/book-consultation/manage?token=${manage.token}` }),
  );
  await notifyTeam("New consultation booked", [`${d.name} (${d.email}) — ${fmtIn(startsAt, config.booking.slots().timeZone)}`, d.notes ?? ""], `${config.siteUrl}/admin/bookings`);
  revalidatePath("/book-consultation");
  revalidatePath("/admin/bookings");
  return { ok: true, message: `Booked for ${when}. A confirmation email is on its way.` };
}

export async function cancelBookingByTokenAction(fd: FormData) {
  const token = String(fd.get("token") ?? "");
  if (!token) return;
  await connectDB();
  const b = await Booking.findOneAndUpdate(
    { manageTokenHash: hashToken(token), status: "confirmed", startsAt: { $gt: new Date() } },
    { status: "cancelled" },
  );
  if (b) await notifyTeam("Consultation cancelled", [`${b.name} (${b.email}) cancelled ${b.startsAt.toISOString()}`]);
  revalidatePath("/book-consultation/manage");
}

export async function setBookingStatusAction(fd: FormData) {
  const s = await assertPermission("bookings");
  const id = String(fd.get("id"));
  const status = String(fd.get("status"));
  if (!["cancelled", "completed"].includes(status) || !isValidObjectId(id)) return;
  await connectDB();
  await Booking.updateOne({ _id: id }, { status });
  await audit(s.email, `booking_${status}`, "booking", id);
  revalidatePath("/admin/bookings");
}
