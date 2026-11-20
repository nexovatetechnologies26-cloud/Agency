import "server-only";
import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import {
  BILLING_TYPES,
  CURRENCIES,
  MILESTONE_STATUSES,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  PROPOSAL_STATUSES,
} from "@/lib/constants";

// Packages, proposals, orders, invoices and sequential numbering.
// All amounts are integers in minor units (cents). Orders/invoices store a
// snapshot of items and currency so later price changes never alter history.

const lineItem = new Schema(
  {
    description: { type: String, required: true, maxlength: 300 },
    quantity: { type: Number, required: true, min: 1 },
    unitAmount: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

// ---------- Counter (ORD-0001, INV-0001 …) ----------
const counterSchema = new Schema({ _id: String, seq: { type: Number, default: 0 } });
export const Counter: Model<{ _id: string; seq: number }> =
  (models.Counter as Model<{ _id: string; seq: number }>) || model("Counter", counterSchema);

// ---------- Package ----------
const packageSchema = new Schema(
  {
    serviceSlug: { type: String, required: true, index: true },
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String, maxlength: 1000 },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: CURRENCIES, required: true, default: "USD" },
    billing: { type: String, enum: BILLING_TYPES, default: "one_time" },
    deliverables: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    revisions: { type: Number, min: 0 },
    deliveryDays: { type: Number, min: 1 },
    terms: { type: String, maxlength: 3000 },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: false, index: true },
    sort: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type PackageDoc = InferSchemaType<typeof packageSchema>;
export const Package: Model<PackageDoc> = (models.Package as Model<PackageDoc>) || model("Package", packageSchema);

// ---------- Proposal ----------
const proposalSchema = new Schema(
  {
    number: { type: String, required: true, unique: true },
    // Unguessable link token. Viewing needs only the link; accepting also requires
    // the client to be signed in with the proposal's email address.
    accessToken: { type: String, required: true, unique: true, select: false },
    lead: { type: Schema.Types.ObjectId, ref: "Lead" },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true, lowercase: true, index: true },
    clientCompany: String,
    title: { type: String, required: true, maxlength: 200 },
    overview: { type: String, maxlength: 5000 },
    scope: { type: [String], default: [] },
    deliverables: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },
    milestones: { type: [String], default: [] },
    timeline: String,
    revisions: String,
    paymentTerms: String,
    terms: { type: String, maxlength: 5000 },
    items: { type: [lineItem], default: [] },
    currency: { type: String, enum: CURRENCIES, required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    validUntil: Date,
    status: { type: String, enum: PROPOSAL_STATUSES, default: "draft", index: true },
    version: { type: Number, default: 1 },
    sentAt: Date,
    viewedAt: Date,
    respondedAt: Date,
    acceptedByName: String,
    declineReason: String,
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    createdBy: String,
  },
  { timestamps: true },
);
export type ProposalDoc = InferSchemaType<typeof proposalSchema>;
export const Proposal: Model<ProposalDoc> = (models.Proposal as Model<ProposalDoc>) || model("Proposal", proposalSchema);

// ---------- Order (also the project record) ----------
const orderSchema = new Schema(
  {
    number: { type: String, required: true, unique: true },
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    package: { type: Schema.Types.ObjectId, ref: "Package" },
    proposal: { type: Schema.Types.ObjectId, ref: "Proposal" },
    title: { type: String, required: true },
    serviceSlug: String,
    billing: { type: String, enum: BILLING_TYPES, default: "one_time" },
    items: { type: [lineItem], default: [] },
    currency: { type: String, enum: CURRENCIES, required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    amountRefunded: { type: Number, default: 0 },
    status: { type: String, enum: ORDER_STATUSES, default: "pending", index: true },
    paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: "pending", index: true },
    requirements: { type: String, maxlength: 10000 },
    termsAcceptedAt: Date,
    assignee: { type: Schema.Types.ObjectId, ref: "User" },
    startDate: Date,
    dueDate: Date,
    milestones: {
      type: [
        new Schema(
          {
            title: { type: String, required: true, maxlength: 200 },
            dueDate: Date,
            status: { type: String, enum: MILESTONE_STATUSES, default: "pending" },
          },
          { timestamps: true },
        ),
      ],
      default: [],
    },
    // customer-visible progress updates
    updates: {
      type: [new Schema({ body: { type: String, required: true }, author: String }, { timestamps: { createdAt: true, updatedAt: false } })],
      default: [],
    },
    // staff-only notes
    internalNotes: {
      type: [new Schema({ body: { type: String, required: true }, author: String }, { timestamps: { createdAt: true, updatedAt: false } })],
      default: [],
      select: false,
    },
    payments: {
      type: [
        new Schema(
          {
            amount: { type: Number, required: true }, // negative = refund
            method: { type: String, required: true },
            reference: String,
            recordedBy: String,
          },
          { timestamps: { createdAt: true, updatedAt: false } },
        ),
      ],
      default: [],
    },
    activity: {
      type: [new Schema({ action: String, actor: String, detail: String }, { timestamps: { createdAt: true, updatedAt: false } })],
      default: [],
      select: false,
    },
  },
  { timestamps: true },
);
orderSchema.index({ createdAt: -1 });
export type OrderDoc = InferSchemaType<typeof orderSchema>;
export const Order: Model<OrderDoc> = (models.Order as Model<OrderDoc>) || model("Order", orderSchema);

// ---------- Invoice ----------
const invoiceSchema = new Schema(
  {
    number: { type: String, required: true, unique: true },
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    billTo: { name: String, email: String, company: String, country: String },
    items: { type: [lineItem], default: [] },
    currency: { type: String, enum: CURRENCIES, required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    status: { type: String, enum: ["unpaid", "partially_paid", "paid", "void"], default: "unpaid", index: true },
    issuedAt: { type: Date, default: Date.now },
    dueAt: Date,
  },
  { timestamps: true },
);
export type InvoiceDoc = InferSchemaType<typeof invoiceSchema>;
export const Invoice: Model<InvoiceDoc> = (models.Invoice as Model<InvoiceDoc>) || model("Invoice", invoiceSchema);
