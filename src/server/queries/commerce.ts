import "server-only";
import { connectDB } from "@/server/db/mongodb";
import { Invoice, Order, Package, Proposal } from "@/server/models/commerce.model";
import { plain } from "@/server/lib/plain";
import { isValidObjectId } from "mongoose";

// Read-only data access for pages. Every customer query is scoped to the
// signed-in user's id — customers can never load another customer's records.

type CustomerRef = { _id: string; name: string; email: string; company?: string; country?: string };

// ---------- Packages ----------
export async function listActivePackages() {
  await connectDB();
  return plain(await Package.find({ active: true }).sort({ sort: 1, price: 1 }).lean());
}

export async function getActivePackage(id: string) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  return plain(await Package.findOne({ _id: id, active: true }).lean());
}

export async function listPackagesAdmin() {
  await connectDB();
  return plain(await Package.find().sort({ serviceSlug: 1, sort: 1 }).lean());
}

export async function getPackageAdmin(id: string) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  return plain(await Package.findById(id).lean());
}

// ---------- Orders ----------
export async function listMyOrders(userId: string) {
  await connectDB();
  return plain(await Order.find({ customer: userId }).sort({ createdAt: -1 }).lean());
}

export async function getMyOrder(userId: string, id: string) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  // internalNotes and activity are excluded by default (select: false)
  return plain(await Order.findOne({ _id: id, customer: userId }).lean());
}

export async function listOrders(filter: { status?: string; assignee?: string } = {}) {
  await connectDB();
  const q: Record<string, unknown> = {};
  if (filter.status) q.status = filter.status;
  if (filter.assignee) q.assignee = filter.assignee;
  return plain(
    await Order.find(q).sort({ createdAt: -1 }).limit(200).populate<{ customer: CustomerRef }>("customer", "name email").lean(),
  );
}

export async function getOrderAdmin(id: string) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  return plain(
    await Order.findById(id)
      .select("+internalNotes +activity")
      .populate<{ customer: CustomerRef }>("customer", "name email company country")
      .lean(),
  );
}

// ---------- Invoices ----------
export async function listMyInvoices(userId: string) {
  await connectDB();
  return plain(await Invoice.find({ customer: userId }).sort({ issuedAt: -1 }).lean());
}

export async function getMyInvoice(userId: string, id: string) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  return plain(await Invoice.findOne({ _id: id, customer: userId }).lean());
}

export async function getInvoiceAdmin(id: string) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  return plain(await Invoice.findById(id).lean());
}

export async function listInvoices() {
  await connectDB();
  return plain(await Invoice.find().sort({ issuedAt: -1 }).limit(300).lean());
}

// ---------- Proposals ----------
export async function listMyProposals(email: string) {
  await connectDB();
  return plain(
    await Proposal.find({ clientEmail: email, status: { $ne: "draft" } }).select("+accessToken").sort({ createdAt: -1 }).lean(),
  );
}

export async function listProposals() {
  await connectDB();
  return plain(await Proposal.find().sort({ createdAt: -1 }).limit(200).lean());
}

export async function getProposalAdmin(id: string) {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  return plain(await Proposal.findById(id).select("+accessToken").lean());
}

/** Public proposal page. Marks a sent proposal as viewed and expires old ones. */
export async function getProposalByToken(token: string) {
  if (!token || token.length < 20) return null;
  await connectDB();
  const p = await Proposal.findOne({ accessToken: token, status: { $ne: "draft" } });
  if (!p) return null;
  if (["sent", "viewed"].includes(p.status) && p.validUntil && p.validUntil.getTime() < Date.now()) {
    p.status = "expired";
    await p.save();
  } else if (p.status === "sent") {
    p.status = "viewed";
    p.viewedAt = new Date();
    await p.save();
  }
  return plain(p.toObject());
}
