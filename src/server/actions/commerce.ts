"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDB, withTransaction } from "@/server/db/mongodb";
import { Invoice, Order, Package, Proposal } from "@/server/models/commerce.model";
import { Lead } from "@/server/models/lead.model";
import { User } from "@/server/models/user.model";
import { assertPermission, assertUser } from "@/server/auth/session";
import { nextNumber } from "@/server/lib/numbering";
import { audit } from "@/server/lib/audit";
import { layout, notifyTeam, sendEmail } from "@/server/lib/email";
import { fieldErrors, formObject } from "@/server/lib/forms";
import { config } from "@/server/config";
import { calcTotals, derivePaymentStatus, formatMoney, parseAmount, type LineItem } from "@/lib/money";
import { canTransition } from "@/lib/order-status";
import { lines } from "@/lib/text";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/constants";
import type { FormState } from "@/lib/form-state";
import {
  checkoutSchema,
  milestoneSchema,
  milestoneStatusSchema,
  orderNoteSchema,
  orderStatusSchema,
  packageSchema,
  parseLineItems,
  paymentSchema,
  proposalSchema,
} from "@/lib/validations/commerce";
import { isValidObjectId, type ClientSession } from "mongoose";

// ======================= Packages (admin) =======================

export async function savePackageAction(_: FormState, fd: FormData): Promise<FormState> {
  const s = await assertPermission("packages");
  const parsed = packageSchema.safeParse(formObject(fd));
  if (!parsed.success) return fieldErrors(parsed.error);
  const d = parsed.data;

  const price = parseAmount(d.price, d.currency);
  if (price === null) return { fields: { price: "Enter a valid amount, e.g. 499 or 499.99" } };

  const doc = {
    serviceSlug: d.serviceSlug,
    name: d.name,
    description: d.description,
    price,
    currency: d.currency,
    billing: d.billing,
    deliverables: lines(d.deliverables),
    exclusions: lines(d.exclusions),
    revisions: d.revisions ? Number(d.revisions) : undefined,
    deliveryDays: d.deliveryDays ? Number(d.deliveryDays) : undefined,
    terms: d.terms,
    featured: d.featured === "on",
    active: d.active === "on",
    sort: Number(d.sort) || 0,
  };

  await connectDB();
  if (d.id) {
    const before = await Package.findById(d.id).lean();
    if (!before) return { error: "This package no longer exists." };
    await Package.updateOne({ _id: d.id }, doc);
    if (before && before.price !== price) {
      await audit(s.email, "package_price_changed", "package", d.id, `${before.price} → ${price} ${d.currency}`);
    }
  } else {
    const created = await Package.create(doc);
    await audit(s.email, "package_created", "package", String(created._id));
  }
  revalidatePath("/pricing");
  revalidatePath("/services");
  revalidatePath("/");
  redirect("/admin/packages");
}

// ======================= Checkout (customer) =======================

export async function checkoutAction(_: FormState, fd: FormData): Promise<FormState> {
  const s = await assertUser();
  const parsed = checkoutSchema.safeParse(formObject(fd));
  if (!parsed.success) return fieldErrors(parsed.error);

  await connectDB();
  const pkg = await Package.findOne({ _id: parsed.data.packageId, active: true }).lean();
  if (!pkg) return { error: "This package is no longer available." };
  const customer = await User.findById(s.sub).lean();
  if (!customer) return { error: "Account not found." };

  const items: LineItem[] = [{ description: pkg.name, quantity: 1, unitAmount: pkg.price }];
  const totals = calcTotals(items);
  const requirements = parsed.data.requirements;

  const order = await withTransaction(async (session) => {
    const [o] = await Order.create(
      [
        {
          number: await nextNumber("ORD"),
          customer: customer._id,
          package: pkg._id,
          title: pkg.name,
          serviceSlug: pkg.serviceSlug,
          billing: pkg.billing,
          items,
          currency: pkg.currency,
          ...totals,
          status: requirements ? "pending" : "awaiting_requirements",
          requirements,
          termsAcceptedAt: new Date(),
          activity: [{ action: "created", actor: s.email, detail: "checkout" }],
        },
      ],
      { session },
    );
    await createInvoice(o, customer, session);
    return o;
  });

  await sendEmail(
    s.email,
    `Order ${order.number} received`,
    layout(`Thanks for your order, ${customer.name}`, [
      `We've received your order ${order.number} for "${order.title}" (${formatMoney(order.total, order.currency)}).`,
      requirements ? "Our team will review your requirements and confirm the next steps." : "Please add your project requirements in your dashboard so we can get started.",
    ], { label: "View order", url: `${config.siteUrl}/dashboard/orders/${order._id}` }),
  );
  await notifyTeam(`New order ${order.number}`, [`${customer.name} (${customer.email}) ordered "${order.title}".`], `${config.siteUrl}/admin/orders/${order._id}`);
  redirect(`/dashboard/orders/${order._id}?new=1`);
}

async function createInvoice(
  order: { _id: unknown; items: LineItem[]; currency: string; subtotal: number; discount?: number | null; total: number },
  customer: { _id: unknown; name: string; email: string; company?: string | null; country?: string | null },
  session: ClientSession,
) {
  await Invoice.create(
    [
      {
        number: await nextNumber("INV"),
        order: order._id,
        customer: customer._id,
        billTo: { name: customer.name, email: customer.email, company: customer.company, country: customer.country },
        items: order.items,
        currency: order.currency,
        subtotal: order.subtotal,
        discount: order.discount ?? 0,
        total: order.total,
        dueAt: new Date(Date.now() + 7 * 86400000),
      },
    ],
    { session },
  );
}

export async function submitRequirementsAction(_: FormState, fd: FormData): Promise<FormState> {
  const s = await assertUser();
  const { id, requirements } = formObject(fd);
  if (!isValidObjectId(id)) return { error: "Order not found." };
  if (!requirements || requirements.length < 10) return { fields: { requirements: "Please describe your requirements (at least 10 characters)." } };
  await connectDB();
  const res = await Order.updateOne(
    { _id: id, customer: s.sub, status: { $in: ["pending", "awaiting_requirements"] } },
    { requirements: requirements.slice(0, 10000), status: "pending", $push: { activity: { action: "requirements_submitted", actor: s.email } } },
  );
  if (!res.matchedCount) return { error: "Requirements can no longer be changed for this order." };
  await notifyTeam("Requirements submitted", [`${s.email} added requirements to an order.`], `${config.siteUrl}/admin/orders/${id}`);
  revalidatePath(`/dashboard/orders/${id}`);
  return { ok: true, message: "Thanks — requirements saved." };
}

// ======================= Proposals =======================

export async function saveProposalAction(_: FormState, fd: FormData): Promise<FormState> {
  const s = await assertPermission("proposals");
  const parsed = proposalSchema.safeParse(formObject(fd));
  if (!parsed.success) return fieldErrors(parsed.error);
  const d = parsed.data;

  const { items, error } = parseLineItems(d.items, d.currency);
  if (error) return { fields: { items: error } };
  const discount = d.discount ? parseAmount(d.discount, d.currency) : 0;
  if (discount === null) return { fields: { discount: "Enter a valid amount" } };
  const totals = calcTotals(items, discount);

  const doc = {
    lead: d.leadId || undefined,
    clientName: d.clientName,
    clientEmail: d.clientEmail,
    clientCompany: d.clientCompany,
    title: d.title,
    overview: d.overview,
    scope: lines(d.scope),
    deliverables: lines(d.deliverables),
    exclusions: lines(d.exclusions),
    milestones: lines(d.milestones),
    timeline: d.timeline,
    revisions: d.revisions,
    paymentTerms: d.paymentTerms,
    terms: d.terms,
    currency: d.currency,
    items,
    ...totals,
    validUntil: d.validUntil ? new Date(d.validUntil) : undefined,
  };

  await connectDB();
  let id = d.id;
  if (id) {
    const existing = await Proposal.findById(id);
    if (!existing) return { error: "Proposal not found." };
    if (["accepted", "declined"].includes(existing.status)) return { error: "Accepted or declined proposals can't be edited." };
    const wasShared = existing.status !== "draft";
    existing.set({ ...doc, version: wasShared ? existing.version + 1 : existing.version, status: wasShared ? "sent" : "draft" });
    await existing.save();
  } else {
    const created = await Proposal.create({
      ...doc,
      number: await nextNumber("PRO"),
      accessToken: randomBytes(24).toString("base64url"),
      createdBy: s.email,
    });
    id = String(created._id);
  }
  await audit(s.email, d.id ? "proposal_updated" : "proposal_created", "proposal", id);
  redirect(`/admin/proposals/${id}`);
}

export async function sendProposalAction(fd: FormData) {
  const s = await assertPermission("proposals");
  const id = String(fd.get("id") ?? "");
  if (!isValidObjectId(id)) return;
  await connectDB();
  const p = await Proposal.findById(id).select("+accessToken");
  if (!p || ["accepted", "declined"].includes(p.status)) return;

  p.status = "sent";
  p.sentAt = new Date();
  await p.save();
  if (p.lead) await Lead.updateOne({ _id: p.lead }, { status: "proposal_sent", $push: { activity: { action: "proposal_sent", actor: s.email, detail: p.number } } });

  await sendEmail(
    p.clientEmail,
    `Your proposal from Nexovate: ${p.title}`,
    layout(`Hi ${p.clientName},`, [
      `Your proposal "${p.title}" (${p.number}) is ready for review.`,
      `Total: ${formatMoney(p.total, p.currency)}${p.validUntil ? ` · valid until ${p.validUntil.toDateString()}` : ""}.`,
    ], { label: "Review proposal", url: `${config.siteUrl}/proposals/${p.accessToken}` }),
  );
  await audit(s.email, "proposal_sent", "proposal", id);
  revalidatePath(`/admin/proposals/${id}`);
}

export async function acceptProposalAction(_: FormState, fd: FormData): Promise<FormState> {
  const s = await assertUser();
  const { token, name, agree } = formObject(fd);
  if (!token) return { error: "Proposal not found." };
  if (!name || name.length < 2) return { fields: { name: "Type your full name to sign" } };
  if (agree !== "on") return { fields: { agree: "Please confirm you accept the proposal and terms" } };

  await connectDB();
  const p = await Proposal.findOne({ accessToken: token });
  if (!p) return { error: "Proposal not found." };
  if (p.clientEmail !== s.email) return { error: `Please sign in with ${p.clientEmail} to accept this proposal.` };
  if (!["sent", "viewed"].includes(p.status)) return { error: "This proposal can no longer be accepted." };
  if (p.validUntil && p.validUntil.getTime() < Date.now()) return { error: "This proposal has expired. Please contact us for an updated one." };

  const customer = await User.findById(s.sub).lean();
  if (!customer) return { error: "Account not found." };

  const order = await withTransaction(async (session) => {
    const [o] = await Order.create(
      [
        {
          number: await nextNumber("ORD"),
          customer: customer._id,
          proposal: p._id,
          title: p.title,
          items: p.items,
          currency: p.currency,
          subtotal: p.subtotal,
          discount: p.discount ?? 0,
          total: p.total,
          status: "confirmed",
          requirements: [p.overview, ...p.scope.map((x) => `- ${x}`)].filter(Boolean).join("\n"),
          termsAcceptedAt: new Date(),
          milestones: p.milestones.map((title) => ({ title })),
          activity: [{ action: "created", actor: s.email, detail: `proposal ${p.number} v${p.version}` }],
        },
      ],
      { session },
    );
    await createInvoice(o, customer, session);
    p.status = "accepted";
    p.respondedAt = new Date();
    p.acceptedByName = name.slice(0, 100);
    p.order = o._id;
    await p.save({ session });
    if (p.lead) await Lead.updateOne({ _id: p.lead }, { status: "won" }, { session });
    return o;
  });

  await notifyTeam(`Proposal ${p.number} accepted`, [`${name} accepted "${p.title}" (${formatMoney(p.total, p.currency)}).`], `${config.siteUrl}/admin/orders/${order._id}`);
  redirect(`/dashboard/orders/${order._id}?new=1`);
}

export async function declineProposalAction(fd: FormData) {
  const { token, reason } = formObject(fd);
  if (!token) return;
  await connectDB();
  const p = await Proposal.findOne({ accessToken: token });
  if (!p || !["sent", "viewed"].includes(p.status)) return;
  p.status = "declined";
  p.respondedAt = new Date();
  p.declineReason = reason?.slice(0, 1000);
  await p.save();
  if (p.lead) await Lead.updateOne({ _id: p.lead }, { status: "negotiation" });
  await notifyTeam(`Proposal ${p.number} declined`, [`Reason: ${reason || "not given"}`], `${config.siteUrl}/admin/proposals/${p._id}`);
  revalidatePath(`/proposals/${token}`);
}

// ======================= Orders / projects (staff) =======================

export async function updateOrderStatusAction(fd: FormData) {
  const s = await assertPermission("orders");
  const parsed = orderStatusSchema.safeParse(formObject(fd));
  if (!parsed.success) return;
  await connectDB();
  const order = await Order.findById(parsed.data.id).populate<{ customer: { email: string; name: string } }>("customer", "email name");
  if (!order) return;
  const from = order.status as OrderStatus;
  const to = parsed.data.status;
  if (!canTransition(from, to)) return;
  if (to === "refunded" && !(await canFinance())) return;

  await Order.updateOne(
    { _id: order._id },
    { status: to, ...(to === "in_progress" && !order.startDate ? { startDate: new Date() } : {}), $push: { activity: { action: "status_changed", actor: s.email, detail: `${from} → ${to}` } } },
  );
  await audit(s.email, "order_status", "order", String(order._id), `${from} → ${to}`);
  if (from !== to) {
    await sendEmail(
      order.customer.email,
      `Order ${order.number}: ${ORDER_STATUS_LABELS[to]}`,
      layout(`Hi ${order.customer.name},`, [`Your order "${order.title}" is now: ${ORDER_STATUS_LABELS[to]}.`], {
        label: "View order",
        url: `${config.siteUrl}/dashboard/orders/${order._id}`,
      }),
    );
  }
  revalidatePath(`/admin/orders/${order._id}`);
}

async function canFinance() {
  try {
    await assertPermission("finance");
    return true;
  } catch {
    return false;
  }
}

export async function addMilestoneAction(fd: FormData) {
  const s = await assertPermission("orders");
  const parsed = milestoneSchema.safeParse(formObject(fd));
  if (!parsed.success) return;
  await connectDB();
  await Order.updateOne(
    { _id: parsed.data.id },
    { $push: { milestones: { title: parsed.data.title, dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined }, activity: { action: "milestone_added", actor: s.email, detail: parsed.data.title } } },
  );
  revalidatePath(`/admin/orders/${parsed.data.id}`);
}

export async function setMilestoneStatusAction(fd: FormData) {
  const s = await assertPermission("orders");
  const parsed = milestoneStatusSchema.safeParse(formObject(fd));
  if (!parsed.success) return;
  await connectDB();
  await Order.updateOne(
    { _id: parsed.data.id, "milestones._id": parsed.data.milestoneId },
    { $set: { "milestones.$.status": parsed.data.status }, $push: { activity: { action: "milestone_status", actor: s.email, detail: parsed.data.status } } },
  );
  revalidatePath(`/admin/orders/${parsed.data.id}`);
}

export async function addOrderUpdateAction(fd: FormData) {
  const s = await assertPermission("orders");
  const parsed = orderNoteSchema.safeParse(formObject(fd));
  if (!parsed.success) return;
  await connectDB();
  const order = await Order.findByIdAndUpdate(parsed.data.id, { $push: { updates: { body: parsed.data.body, author: s.name || "Nexovate team" } } })
    .populate<{ customer: { email: string; name: string } }>("customer", "email name");
  if (order) {
    await sendEmail(
      order.customer.email,
      `Project update: ${order.title}`,
      layout(`Hi ${order.customer.name},`, ["There's a new update on your project:", parsed.data.body], {
        label: "View project",
        url: `${config.siteUrl}/dashboard/orders/${order._id}`,
      }),
    );
  }
  revalidatePath(`/admin/orders/${parsed.data.id}`);
}

export async function addInternalNoteAction(fd: FormData) {
  const s = await assertPermission("orders");
  const parsed = orderNoteSchema.safeParse(formObject(fd));
  if (!parsed.success) return;
  await connectDB();
  await Order.updateOne({ _id: parsed.data.id }, { $push: { internalNotes: { body: parsed.data.body, author: s.email } } });
  revalidatePath(`/admin/orders/${parsed.data.id}`);
}

export async function recordPaymentAction(_: FormState, fd: FormData): Promise<FormState> {
  const s = await assertPermission("finance");
  const parsed = paymentSchema.safeParse(formObject(fd));
  if (!parsed.success) return fieldErrors(parsed.error);
  const d = parsed.data;

  await connectDB();
  const order = await Order.findById(d.id);
  if (!order) return { error: "Order not found." };
  const amount = parseAmount(d.amount, order.currency);
  if (!amount) return { fields: { amount: "Enter a valid amount greater than zero" } };

  const paid = order.amountPaid + (d.kind === "payment" ? amount : 0);
  const refunded = (order.amountRefunded ?? 0) + (d.kind === "refund" ? amount : 0);
  if (d.kind === "payment" && paid > order.total) return { fields: { amount: `More than the outstanding balance (${formatMoney(order.total - order.amountPaid, order.currency)})` } };
  if (d.kind === "refund" && refunded > order.amountPaid) return { fields: { amount: "Refund can't exceed the amount paid" } };

  const paymentStatus = derivePaymentStatus(order.total, paid, refunded);
  await withTransaction(async (session) => {
    order.amountPaid = paid;
    order.amountRefunded = refunded;
    order.paymentStatus = paymentStatus;
    order.payments.push({ amount: d.kind === "refund" ? -amount : amount, method: d.method, reference: d.reference, recordedBy: s.email });
    await order.save({ session });
    const net = paid - refunded;
    await Invoice.updateMany(
      { order: order._id, status: { $ne: "void" } },
      { amountPaid: net, status: net >= order.total ? "paid" : net > 0 ? "partially_paid" : "unpaid" },
      { session },
    );
  });
  await audit(s.email, d.kind === "refund" ? "refund_recorded" : "payment_recorded", "order", d.id, `${formatMoney(amount, order.currency)} via ${d.method} ${d.reference ?? ""}`);
  revalidatePath(`/admin/orders/${d.id}`);
  return { ok: true, message: d.kind === "refund" ? "Refund recorded." : "Payment recorded." };
}

export async function assignOrderAction(fd: FormData) {
  const s = await assertPermission("orders");
  const { id, assignee } = formObject(fd);
  if (!isValidObjectId(id) || (assignee && !isValidObjectId(assignee))) return;
  await connectDB();
  await Order.updateOne({ _id: id }, assignee ? { assignee } : { $unset: { assignee: 1 } });
  await audit(s.email, "order_assigned", "order", id, assignee);
  revalidatePath(`/admin/orders/${id}`);
}
