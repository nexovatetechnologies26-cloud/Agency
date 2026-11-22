import "server-only";
import { Schema, type InferSchemaType, type Model } from "mongoose";
import { defineModel } from "@/server/db/model";
import { CONTACT_METHODS, LEAD_STATUSES, LEAD_TYPES } from "@/lib/constants";

const noteSchema = new Schema(
  {
    body: { type: String, required: true, maxlength: 2000 },
    author: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const activitySchema = new Schema(
  {
    action: { type: String, required: true },
    actor: { type: String, required: true },
    detail: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// a reply the team sent to the person (by email from the admin panel)
const replySchema = new Schema(
  {
    subject: { type: String, required: true, maxlength: 200 },
    body: { type: String, required: true, maxlength: 10000 },
    author: { type: String, required: true }, // staff email
    channel: { type: String, enum: ["email"], default: "email" },
    delivered: { type: Boolean, default: false }, // false when email sending is not configured
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const leadSchema = new Schema(
  {
    type: { type: String, enum: LEAD_TYPES, required: true, default: "contact" },
    status: { type: String, enum: LEAD_STATUSES, required: true, default: "new", index: true },

    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200, index: true },
    country: { type: String, required: true, uppercase: true, minlength: 2, maxlength: 2, index: true },
    phone: { type: String, maxlength: 30 },
    company: { type: String, maxlength: 150 },
    website: { type: String, maxlength: 300 },

    service: { type: String, maxlength: 100, index: true },
    budget: { type: String },
    timeline: { type: String },
    preferredContact: { type: String, enum: CONTACT_METHODS, default: "email" },
    message: { type: String, required: true, maxlength: 5000 },

    consent: {
      marketing: { type: Boolean, default: false },
      privacyAcceptedAt: { type: Date, required: true },
    },

    source: {
      utmSource: String,
      utmMedium: String,
      utmCampaign: String,
      utmTerm: String,
      utmContent: String,
      referrer: String,
      landingPage: String,
    },

    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    assignedTo: { type: String }, // staff email
    estimatedValue: { type: Number }, // minor units, USD
    aiSummary: { type: String, maxlength: 4000 },
    followUpAt: { type: Date },
    notes: { type: [noteSchema], default: [] },
    replies: { type: [replySchema], default: [] },
    activity: { type: [activitySchema], default: [] },
  },
  { timestamps: true },
);

leadSchema.index({ createdAt: -1 });
leadSchema.index({ status: 1, createdAt: -1 });

export type LeadDoc = InferSchemaType<typeof leadSchema> & { _id: string };

export const Lead: Model<InferSchemaType<typeof leadSchema>> = defineModel<InferSchemaType<typeof leadSchema>>("Lead", leadSchema);
