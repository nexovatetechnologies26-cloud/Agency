import "server-only";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/server/db/mongodb";
import { User } from "@/server/models/user.model";
import { Ticket } from "@/server/models/support.model";
import { PortfolioProject, Post, Testimonial } from "@/server/models/content.model";
import { hashToken } from "@/server/auth/tokens";
import { plain } from "@/server/lib/plain";

// ---------- Account ----------
export async function getCurrentUser(userId: string) {
  await connectDB();
  return plain(await User.findById(userId).lean());
}

/** Confirms an email address. Returns true on success. */
export async function verifyEmailToken(token: string) {
  if (!token) return false;
  await connectDB();
  const res = await User.updateOne(
    { verifyTokenHash: hashToken(token) },
    { emailVerifiedAt: new Date(), $unset: { verifyTokenHash: 1 } },
  );
  return res.modifiedCount === 1;
}

export async function listStaff() {
  await connectDB();
  return plain(await User.find({ role: { $ne: "customer" } }).sort({ createdAt: 1 }).lean());
}

export async function listCustomers(q?: string) {
  await connectDB();
  const filter: Record<string, unknown> = { role: "customer" };
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").slice(0, 100), "i");
    filter.$or = [{ name: rx }, { email: rx }, { company: rx }];
  }
  return plain(await User.find(filter).sort({ createdAt: -1 }).limit(300).lean());
}

// ---------- Support ----------
export async function listMyTickets(userId: string) {
  await connectDB();
  return plain(await Ticket.find({ customer: userId }).sort({ updatedAt: -1 }).lean());
}

export async function getMyTicket(userId: string, id: string) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  return plain(await Ticket.findOne({ _id: id, customer: userId }).lean());
}

export async function listTickets(status?: string) {
  await connectDB();
  return plain(
    await Ticket.find(status ? { status } : { status: { $in: ["open", "awaiting_customer"] } })
      .sort({ updatedAt: -1 })
      .limit(200)
      .populate<{ customer: { name: string; email: string } }>("customer", "name email")
      .lean(),
  );
}

export async function getTicketAdmin(id: string) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  return plain(await Ticket.findById(id).populate<{ customer: { name: string; email: string } }>("customer", "name email").lean());
}

// ---------- Content ----------
export async function listPublishedPosts(category?: string) {
  await connectDB();
  return plain(
    await Post.find({ status: "published", publishedAt: { $lte: new Date() }, ...(category ? { category } : {}) })
      .select("-content")
      .sort({ publishedAt: -1 })
      .limit(100)
      .lean(),
  );
}

export async function getPublishedPost(slug: string) {
  await connectDB();
  return plain(await Post.findOne({ slug, status: "published", publishedAt: { $lte: new Date() } }).lean());
}

export async function listPostsAdmin() {
  await connectDB();
  return plain(await Post.find().select("-content").sort({ updatedAt: -1 }).lean());
}

export async function getPostAdmin(id: string) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  return plain(await Post.findById(id).lean());
}

export async function listProjects(opts: { caseStudiesOnly?: boolean } = {}) {
  await connectDB();
  return plain(
    await PortfolioProject.find({ published: true, ...(opts.caseStudiesOnly ? { isCaseStudy: true } : {}) })
      .sort({ sort: 1, createdAt: -1 })
      .lean(),
  );
}

export async function getProject(slug: string) {
  await connectDB();
  return plain(await PortfolioProject.findOne({ slug, published: true }).lean());
}

export async function listProjectsAdmin() {
  await connectDB();
  return plain(await PortfolioProject.find().sort({ sort: 1, createdAt: -1 }).lean());
}

export async function getProjectAdmin(id: string) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  return plain(await PortfolioProject.findById(id).lean());
}

export async function listTestimonials() {
  await connectDB();
  return plain(await Testimonial.find({ published: true, verified: true }).sort({ createdAt: -1 }).limit(6).lean());
}
