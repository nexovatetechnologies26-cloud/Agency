import "server-only";
import { Schema, type InferSchemaType, type Model } from "mongoose";
import { defineModel } from "@/server/db/model";

// ---------- Blog post ----------
const postSchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, maxlength: 400 },
    content: { type: String, default: "" },
    coverImage: String,
    category: { type: String, maxlength: 60, index: true },
    tags: { type: [String], default: [] },
    author: String,
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    publishedAt: Date,
    seoTitle: { type: String, maxlength: 70 },
    seoDescription: { type: String, maxlength: 170 },
  },
  { timestamps: true },
);
postSchema.index({ status: 1, publishedAt: -1 });
export type PostDoc = InferSchemaType<typeof postSchema>;
export const Post: Model<PostDoc> = defineModel<PostDoc>("Post", postSchema);

// ---------- Portfolio project / case study ----------
// Only publish client names and results you have permission for and can verify.
const projectSchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true },
    clientName: String,
    industry: String,
    serviceSlug: String,
    summary: { type: String, maxlength: 400 },
    challenge: String,
    solution: String,
    results: String,
    technologies: { type: [String], default: [] },
    images: { type: [String], default: [] },
    liveUrl: String,
    isCaseStudy: { type: Boolean, default: false },
    published: { type: Boolean, default: false, index: true },
    sort: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type ProjectDoc = InferSchemaType<typeof projectSchema>;
export const PortfolioProject: Model<ProjectDoc> =
  defineModel<ProjectDoc>("PortfolioProject", projectSchema);

// ---------- Testimonial (verified customers only) ----------
const testimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    role: String,
    company: String,
    quote: { type: String, required: true, maxlength: 600 },
    verified: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);
export type TestimonialDoc = InferSchemaType<typeof testimonialSchema>;
export const Testimonial: Model<TestimonialDoc> =
  defineModel<TestimonialDoc>("Testimonial", testimonialSchema);

// ---------- Public team profile (shown on the website, separate from login accounts) ----------
const teamMemberSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 100 },
    slug: { type: String, unique: true, sparse: true }, // public URL: /team/<slug>
    title: { type: String, required: true, maxlength: 120 }, // e.g. "Lead Full-Stack Engineer"
    seniority: { type: String, maxlength: 40 }, // free text, e.g. "Founder", "CEO", "Lead"
    yearsExperience: { type: Number, min: 0, max: 60 },
    bio: { type: String, maxlength: 2000 },
    quote: { type: String, maxlength: 300 }, // personal statement shown large on the profile
    expertise: { type: [String], default: [] },
    responsibilities: {
      type: [new Schema({ title: { type: String, required: true, maxlength: 80 }, description: { type: String, maxlength: 300 } }, { _id: false })],
      default: [],
    },
    notableWork: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    photo: String, // full image URL
    linkedin: String,
    links: {
      type: [new Schema({ label: { type: String, maxlength: 40 }, url: { type: String, required: true, maxlength: 500 } }, { _id: false })],
      default: [],
    },
    email: { type: String, lowercase: true, trim: true, maxlength: 200 }, // shown as an Email button on the profile
    whatsapp: { type: String, maxlength: 20 }, // international format, e.g. +923001234567
    location: { type: String, maxlength: 80 },
    published: { type: Boolean, default: false, index: true },
    sort: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type TeamMemberDoc = InferSchemaType<typeof teamMemberSchema>;
export const TeamMember: Model<TeamMemberDoc> =
  defineModel<TeamMemberDoc>("TeamMember", teamMemberSchema);

// ---------- Homepage figures ("60+ projects delivered") — managed in Admin → Numbers ----------
const statSchema = new Schema(
  {
    value: { type: String, required: true, maxlength: 12 }, // e.g. "60+", "24h", "6"
    label: { type: String, required: true, maxlength: 60 }, // e.g. "Projects delivered"
    note: { type: String, maxlength: 80 }, // optional small line, e.g. "since 2021"
    published: { type: Boolean, default: false, index: true },
    sort: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type StatDoc = InferSchemaType<typeof statSchema>;
export const Stat: Model<StatDoc> = defineModel<StatDoc>("Stat", statSchema);

// ---------- Client logos ("Trusted by" strip) — managed in Admin → Clients ----------
// Only add clients who have agreed to be listed.
const clientLogoSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 80 },
    logo: { type: String, required: true, maxlength: 500 }, // full image URL (SVG/PNG with transparent background works best)
    url: { type: String, maxlength: 500 },
    published: { type: Boolean, default: false, index: true },
    sort: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type ClientLogoDoc = InferSchemaType<typeof clientLogoSchema>;
export const ClientLogo: Model<ClientLogoDoc> = defineModel<ClientLogoDoc>("ClientLogo", clientLogoSchema);

// ---------- Newsletter subscriber ----------
const subscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    consentAt: { type: Date, required: true },
    source: String,
    unsubscribedAt: Date,
  },
  { timestamps: true },
);
export const Subscriber: Model<InferSchemaType<typeof subscriberSchema>> =
  defineModel<InferSchemaType<typeof subscriberSchema>>("Subscriber", subscriberSchema);

// ---------- Audit log ----------
const auditSchema = new Schema(
  {
    actor: { type: String, required: true },
    action: { type: String, required: true, index: true },
    entity: String,
    entityId: String,
    detail: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
auditSchema.index({ createdAt: -1 });
export const AuditLog: Model<InferSchemaType<typeof auditSchema>> =
  defineModel<InferSchemaType<typeof auditSchema>>("AuditLog", auditSchema);
