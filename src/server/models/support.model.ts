import "server-only";
import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { TICKET_CATEGORIES, TICKET_PRIORITIES, TICKET_STATUSES } from "@/lib/constants";

// ---------- Support ticket (also the customer ↔ team messaging channel) ----------
const ticketSchema = new Schema(
  {
    number: { type: String, required: true, unique: true },
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    subject: { type: String, required: true, maxlength: 200 },
    category: { type: String, enum: TICKET_CATEGORIES, default: "General" },
    priority: { type: String, enum: TICKET_PRIORITIES, default: "normal" },
    status: { type: String, enum: TICKET_STATUSES, default: "open", index: true },
    assignee: { type: Schema.Types.ObjectId, ref: "User" },
    messages: {
      type: [
        new Schema(
          {
            body: { type: String, required: true, maxlength: 10000 },
            authorName: String,
            fromStaff: { type: Boolean, default: false },
          },
          { timestamps: { createdAt: true, updatedAt: false } },
        ),
      ],
      default: [],
    },
  },
  { timestamps: true },
);
ticketSchema.index({ updatedAt: -1 });
export type TicketDoc = InferSchemaType<typeof ticketSchema>;
export const Ticket: Model<TicketDoc> = (models.Ticket as Model<TicketDoc>) || model("Ticket", ticketSchema);

// ---------- Consultation booking ----------
const bookingSchema = new Schema(
  {
    startsAt: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, maxlength: 200 },
    country: { type: String, maxlength: 2 },
    timezone: { type: String, required: true, maxlength: 60 },
    topic: { type: String, maxlength: 100 },
    notes: { type: String, maxlength: 2000 },
    meetingLink: String,
    status: { type: String, enum: ["confirmed", "cancelled", "completed"], default: "confirmed", index: true },
    customer: { type: Schema.Types.ObjectId, ref: "User" },
    lead: { type: Schema.Types.ObjectId, ref: "Lead" },
    manageTokenHash: { type: String, select: false, index: true },
  },
  { timestamps: true },
);
// one confirmed booking per slot — enforced by the database, not just the UI
bookingSchema.index({ startsAt: 1 }, { unique: true, partialFilterExpression: { status: "confirmed" } });
// for listing upcoming / past bookings and availability lookups
bookingSchema.index({ status: 1, startsAt: 1 });
export type BookingDoc = InferSchemaType<typeof bookingSchema>;
export const Booking: Model<BookingDoc> = (models.Booking as Model<BookingDoc>) || model("Booking", bookingSchema);
