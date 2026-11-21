import "server-only";
import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { SENIORITY_LEVELS } from "@/lib/constants";

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
export const Post: Model<PostDoc> = (models.Post as Model<PostDoc>) || model("Post", postSchema);

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
  (models.PortfolioProject as Model<ProjectDoc>) || model("PortfolioProject", projectSchema);

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
  (models.Testimonial as Model<TestimonialDoc>) || model("Testimonial", testimonialSchema);

// ---------- Public team profile (shown on the website, separate from login accounts) ----------
const teamMemberSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 100 },
    title: { type: String, required: true, maxlength: 120 }, // e.g. "Lead Full-Stack Engineer"
    seniority: { type: String, enum: SENIORITY_LEVELS, default: "senior" },
    yearsExperience: { type: Number, min: 0, max: 60 },
    bio: { type: String, maxlength: 600 },
    expertise: { type: [String], default: [] },
    photo: String, // full image URL
    linkedin: String,
    location: { type: String, maxlength: 80 },
    published: { type: Boolean, default: false, index: true },
    sort: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export type TeamMemberDoc = InferSchemaType<typeof teamMemberSchema>;
export const TeamMember: Model<TeamMemberDoc> =
  (models.TeamMember as Model<TeamMemberDoc>) || model("TeamMember", teamMemberSchema);

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
  (models.Subscriber as Model<InferSchemaType<typeof subscriberSchema>>) || model("Subscriber", subscriberSchema);

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
  (models.AuditLog as Model<InferSchemaType<typeof auditSchema>>) || model("AuditLog", auditSchema);
