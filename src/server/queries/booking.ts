import "server-only";
import { connectDB } from "@/server/db/mongodb";
import { Booking } from "@/server/models/support.model";
import { hashToken } from "@/server/auth/tokens";
import { plain } from "@/server/lib/plain";
import { generateSlots } from "@/lib/slots";
import { config } from "@/server/config";

export async function getTakenSlots() {
  await connectDB();
  const rows = await Booking.find({ status: "confirmed", startsAt: { $gte: new Date() } }).select("startsAt").lean();
  return new Set(rows.map((r) => new Date(r.startsAt).toISOString()));
}

/** Only real, currently-open slots are ever shown. */
export async function getAvailableSlots() {
  return generateSlots(config.booking.slots(), new Date(), await getTakenSlots());
}

export async function getBookingByToken(token: string) {
  if (!token) return null;
  await connectDB();
  return plain(await Booking.findOne({ manageTokenHash: hashToken(token) }).lean());
}

export async function listBookings(scope: "upcoming" | "past" = "upcoming") {
  await connectDB();
  const now = new Date();
  return plain(
    await Booking.find(scope === "upcoming" ? { startsAt: { $gte: now } } : { startsAt: { $lt: now } })
      .sort({ startsAt: scope === "upcoming" ? 1 : -1 })
      .limit(200)
      .lean(),
  );
}

export async function listMyBookings(email: string) {
  await connectDB();
  return plain(await Booking.find({ email }).sort({ startsAt: -1 }).limit(50).lean());
}
