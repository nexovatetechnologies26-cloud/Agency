import { z } from "zod";
import { BILLING_TYPES, CURRENCIES, MILESTONE_STATUSES, ORDER_STATUSES, TICKET_CATEGORIES, TICKET_STATUSES } from "@/lib/constants";
import { parseAmount, type LineItem } from "@/lib/money";

const objectId = z.string().regex(/^[a-f0-9]{24}$/i, "Invalid id");

/**
 * Line items entered in a textarea, one per line:  Description | quantity | unit price
 * e.g. "Website design | 1 | 1500"
 */
export function parseLineItems(input: string, currency: string): { items: LineItem[]; error?: string } {
  const items: LineItem[] = [];
  const rows = input.split("\n").map((r) => r.trim()).filter(Boolean);
  for (const [i, row] of rows.entries()) {
    const [description, qty, price] = row.split("|").map((s) => s?.trim());
    const quantity = Number(qty);
    const unitAmount = price ? parseAmount(price, currency) : null;
    if (!description || !Number.isInteger(quantity) || quantity < 1 || unitAmount === null) {
      return { items: [], error: `Line ${i + 1}: use "Description | quantity | price"` };
    }
    items.push({ description: description.slice(0, 300), quantity, unitAmount });
  }
  if (!items.length) return { items, error: "Add at least one line item" };
  return { items };
}

export const packageSchema = z.object({
  id: objectId.optional().or(z.literal("")),
  serviceSlug: z.string().min(1, "Choose a service"),
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(1000).optional(),
  price: z.string().min(1, "Enter a price"),
  currency: z.enum(CURRENCIES),
  billing: z.enum(BILLING_TYPES),
  deliverables: z.string().optional(),
  exclusions: z.string().optional(),
  revisions: z.string().optional(),
  deliveryDays: z.string().optional(),
  terms: z.string().max(3000).optional(),
  featured: z.string().optional(),
  active: z.string().optional(),
  sort: z.string().optional(),
});

export const proposalSchema = z.object({
  id: objectId.optional().or(z.literal("")),
  leadId: objectId.optional().or(z.literal("")),
  clientName: z.string().trim().min(2).max(100),
  clientEmail: z.string().trim().toLowerCase().email(),
  clientCompany: z.string().trim().max(150).optional(),
  title: z.string().trim().min(3).max(200),
  overview: z.string().trim().max(5000).optional(),
  scope: z.string().optional(),
  deliverables: z.string().optional(),
  exclusions: z.string().optional(),
  milestones: z.string().optional(),
  timeline: z.string().max(300).optional(),
  revisions: z.string().max(300).optional(),
  paymentTerms: z.string().max(1000).optional(),
  terms: z.string().max(5000).optional(),
  currency: z.enum(CURRENCIES),
  items: z.string().min(1, "Add at least one line item"),
  discount: z.string().optional(),
  validUntil: z.string().optional(),
});

export const checkoutSchema = z.object({
  packageId: objectId,
  requirements: z.string().trim().max(10000).optional(),
  terms: z.literal("on", { errorMap: () => ({ message: "Please accept the terms to continue" }) }),
});

export const orderStatusSchema = z.object({ id: objectId, status: z.enum(ORDER_STATUSES) });
export const milestoneSchema = z.object({
  id: objectId,
  title: z.string().trim().min(2).max(200),
  dueDate: z.string().optional(),
});
export const milestoneStatusSchema = z.object({ id: objectId, milestoneId: objectId, status: z.enum(MILESTONE_STATUSES) });
export const orderNoteSchema = z.object({ id: objectId, body: z.string().trim().min(1).max(5000) });
export const paymentSchema = z.object({
  id: objectId,
  amount: z.string().min(1),
  kind: z.enum(["payment", "refund"]),
  method: z.string().trim().min(2).max(60),
  reference: z.string().trim().max(120).optional(),
});

export const ticketSchema = z.object({
  subject: z.string().trim().min(3, "Please add a subject").max(200),
  category: z.enum(TICKET_CATEGORIES),
  orderId: objectId.optional().or(z.literal("")),
  body: z.string().trim().min(5, "Please describe the issue").max(10000),
});
export const ticketReplySchema = z.object({ id: objectId, body: z.string().trim().min(1).max(10000) });
export const ticketStatusSchema = z.object({ id: objectId, status: z.enum(TICKET_STATUSES) });
