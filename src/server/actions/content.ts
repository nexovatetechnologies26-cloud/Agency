"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/server/db/mongodb";
import { PortfolioProject, Post, Subscriber, TeamMember, Testimonial } from "@/server/models/content.model";
import { SENIORITY_LEVELS } from "@/lib/constants";
import { assertPermission } from "@/server/auth/session";
import { fieldErrors, formObject, limitAction } from "@/server/lib/forms";
import { audit } from "@/server/lib/audit";
import { lines, slugify } from "@/lib/text";
import type { FormState } from "@/lib/form-state";

const url = z.string().trim().url("Enter a full URL starting with https://").max(500);
const optionalId = z
  .string()
  .optional()
  .refine((v) => !v || isValidObjectId(v), "Invalid id");

const postSchema = z.object({
  id: optionalId,
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().max(80).optional(),
  excerpt: z.string().trim().max(400).optional(),
  content: z.string().max(100_000).optional(),
  coverImage: url.optional().or(z.literal("")),
  category: z.string().trim().max(60).optional(),
  tags: z.string().optional(),
  seoTitle: z.string().trim().max(70).optional(),
  seoDescription: z.string().trim().max(170).optional(),
  status: z.enum(["draft", "published"]),
});

export async function savePostAction(_: FormState, fd: FormData): Promise<FormState> {
  const s = await assertPermission("content");
  const parsed = postSchema.safeParse(formObject(fd));
  if (!parsed.success) return fieldErrors(parsed.error);
  const d = parsed.data;
  const slug = slugify(d.slug || d.title);
  if (!slug) return { fields: { slug: "Enter a valid slug" } };

  await connectDB();
  const clash = await Post.findOne({ slug, ...(d.id ? { _id: { $ne: d.id } } : {}) }).lean();
  if (clash) return { fields: { slug: "Another post already uses this URL" } };

  const existing = d.id ? await Post.findById(d.id) : null;
  if (d.id && !existing) return { error: "This post no longer exists." };
  const doc = {
    title: d.title,
    slug,
    excerpt: d.excerpt,
    content: d.content ?? "",
    coverImage: d.coverImage || undefined,
    category: d.category,
    tags: (d.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
    seoTitle: d.seoTitle,
    seoDescription: d.seoDescription,
    status: d.status,
    author: existing?.author ?? s.name,
    publishedAt: d.status === "published" ? (existing?.publishedAt ?? new Date()) : existing?.publishedAt,
  };
  if (existing) await Post.updateOne({ _id: existing._id }, doc);
  else await Post.create(doc);
  await audit(s.email, "post_saved", "post", d.id, slug);
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/admin/blog");
}

export async function deletePostAction(fd: FormData) {
  const s = await assertPermission("content");
  const id = String(fd.get("id") ?? "");
  if (!isValidObjectId(id)) redirect("/admin/blog");
  await connectDB();
  await Post.deleteOne({ _id: id });
  await audit(s.email, "post_deleted", "post", id);
  revalidatePath("/blog");
  redirect("/admin/blog");
}

const projectSchema = z.object({
  id: optionalId,
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().max(80).optional(),
  clientName: z.string().trim().max(150).optional(),
  industry: z.string().trim().max(100).optional(),
  serviceSlug: z.string().optional(),
  summary: z.string().trim().max(400).optional(),
  challenge: z.string().max(10_000).optional(),
  solution: z.string().max(10_000).optional(),
  results: z.string().max(5_000).optional(),
  technologies: z.string().optional(),
  images: z.string().optional(),
  liveUrl: url.optional().or(z.literal("")),
  isCaseStudy: z.string().optional(),
  published: z.string().optional(),
  sort: z.string().optional(),
});

export async function saveProjectAction(_: FormState, fd: FormData): Promise<FormState> {
  const s = await assertPermission("content");
  const parsed = projectSchema.safeParse(formObject(fd));
  if (!parsed.success) return fieldErrors(parsed.error);
  const d = parsed.data;
  const slug = slugify(d.slug || d.title);
  if (!slug) return { fields: { slug: "Enter a URL slug using letters or numbers" } };
  const images = lines(d.images);
  if (images.some((i) => !/^https?:\/\//.test(i))) return { fields: { images: "Each image must be a full URL" } };

  await connectDB();
  const clash = await PortfolioProject.findOne({ slug, ...(d.id ? { _id: { $ne: d.id } } : {}) }).lean();
  if (clash) return { fields: { slug: "Another project already uses this URL" } };

  const doc = {
    title: d.title,
    slug,
    clientName: d.clientName,
    industry: d.industry,
    serviceSlug: d.serviceSlug || undefined,
    summary: d.summary,
    challenge: d.challenge,
    solution: d.solution,
    results: d.results,
    technologies: (d.technologies ?? "").split(",").map((t) => t.trim()).filter(Boolean),
    images,
    liveUrl: d.liveUrl || undefined,
    isCaseStudy: d.isCaseStudy === "on",
    published: d.published === "on",
    sort: Number(d.sort) || 0,
  };
  if (d.id) await PortfolioProject.updateOne({ _id: d.id }, doc);
  else await PortfolioProject.create(doc);
  await audit(s.email, "project_saved", "portfolio", d.id, slug);
  revalidatePath("/portfolio");
  revalidatePath(`/portfolio/${slug}`);
  revalidatePath("/case-studies");
  revalidatePath("/");
  redirect("/admin/portfolio");
}

export async function deleteProjectAction(fd: FormData) {
  const s = await assertPermission("content");
  const id = String(fd.get("id") ?? "");
  if (!isValidObjectId(id)) redirect("/admin/portfolio");
  await connectDB();
  await PortfolioProject.deleteOne({ _id: id });
  await audit(s.email, "project_deleted", "portfolio", id);
  revalidatePath("/portfolio");
  revalidatePath("/case-studies");
  revalidatePath("/");
  redirect("/admin/portfolio");
}

const testimonialSchema = z.object({
  name: z.string().trim().min(2).max(100),
  role: z.string().trim().max(100).optional(),
  company: z.string().trim().max(150).optional(),
  quote: z.string().trim().min(10).max(600),
  verified: z.literal("on", { errorMap: () => ({ message: "Only add testimonials from real, verified customers" }) }),
});

export async function createTestimonialAction(_: FormState, fd: FormData): Promise<FormState> {
  const s = await assertPermission("content");
  const parsed = testimonialSchema.safeParse(formObject(fd));
  if (!parsed.success) return fieldErrors(parsed.error);
  await connectDB();
  const t = await Testimonial.create({ ...parsed.data, verified: true, published: false });
  await audit(s.email, "testimonial_created", "testimonial", String(t._id));
  revalidatePath("/admin/testimonials");
  return { ok: true, message: "Saved as hidden. Publish it when ready." };
}

export async function toggleTestimonialAction(fd: FormData) {
  await assertPermission("content");
  const id = String(fd.get("id") ?? "");
  if (!isValidObjectId(id)) return;
  await connectDB();
  const t = await Testimonial.findById(id);
  if (!t) return;
  if (fd.get("delete") === "1") await t.deleteOne();
  else {
    t.published = !t.published;
    await t.save();
  }
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function subscribeAction(_: FormState, fd: FormData): Promise<FormState> {
  const blocked = await limitAction("subscribe", 5, 60 * 60_000);
  if (blocked) return blocked;
  const parsed = z
    .object({ email: z.string().trim().toLowerCase().email("Enter a valid email"), consent: z.literal("on", { errorMap: () => ({ message: "Please tick the consent box" }) }) })
    .safeParse(formObject(fd));
  if (!parsed.success) return fieldErrors(parsed.error);
  await connectDB();
  await Subscriber.updateOne(
    { email: parsed.data.email },
    { $set: { consentAt: new Date(), source: "footer" }, $unset: { unsubscribedAt: 1 } },
    { upsert: true },
  );
  return { ok: true, message: "Thanks for subscribing!" };
}

// ======================= Public team profiles =======================

const teamMemberSchema = z.object({
  id: optionalId,
  name: z.string().trim().min(2, "Enter a name").max(100),
  title: z.string().trim().min(2, "Enter a job title").max(120),
  seniority: z.enum(SENIORITY_LEVELS),
  yearsExperience: z
    .string()
    .optional()
    .refine((v) => !v || (/^\d{1,2}$/.test(v) && Number(v) <= 60), "Enter years as a whole number"),
  bio: z.string().trim().max(600).optional(),
  expertise: z.string().max(500).optional(),
  photo: url.optional().or(z.literal("")),
  linkedin: url.optional().or(z.literal("")),
  location: z.string().trim().max(80).optional(),
  published: z.string().optional(),
  sort: z.string().optional(),
});

function revalidateTeam() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/people");
}

export async function saveTeamMemberAction(_: FormState, fd: FormData): Promise<FormState> {
  const s = await assertPermission("content");
  const parsed = teamMemberSchema.safeParse(formObject(fd));
  if (!parsed.success) return fieldErrors(parsed.error);
  const d = parsed.data;

  const doc = {
    name: d.name,
    title: d.title,
    seniority: d.seniority,
    yearsExperience: d.yearsExperience ? Number(d.yearsExperience) : undefined,
    bio: d.bio || undefined,
    expertise: (d.expertise ?? "").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 8),
    photo: d.photo || undefined,
    linkedin: d.linkedin || undefined,
    location: d.location || undefined,
    published: d.published === "on",
    sort: Number(d.sort) || 0,
  };

  await connectDB();
  if (d.id) {
    const res = await TeamMember.updateOne({ _id: d.id }, { $set: doc, ...(doc.yearsExperience === undefined ? { $unset: { yearsExperience: 1 } } : {}) });
    if (!res.matchedCount) return { error: "This profile no longer exists." };
  } else {
    await TeamMember.create(doc);
  }
  await audit(s.email, "team_profile_saved", "team_member", d.id, d.name);
  revalidateTeam();
  redirect("/admin/people");
}

export async function deleteTeamMemberAction(fd: FormData) {
  const s = await assertPermission("content");
  const id = String(fd.get("id") ?? "");
  if (!isValidObjectId(id)) redirect("/admin/people");
  await connectDB();
  await TeamMember.deleteOne({ _id: id });
  await audit(s.email, "team_profile_deleted", "team_member", id);
  revalidateTeam();
  redirect("/admin/people");
}
