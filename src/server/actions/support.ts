"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDB } from "@/server/db/mongodb";
import { Ticket } from "@/server/models/support.model";
import { Order } from "@/server/models/commerce.model";
import { assertPermission, assertUser } from "@/server/auth/session";
import { can } from "@/lib/permissions";
import { layout, notifyTeam, sendEmail } from "@/server/lib/email";
import { fieldErrors, formObject, limitAction } from "@/server/lib/forms";
import { nextNumber } from "@/server/lib/numbering";
import { config } from "@/server/config";
import type { FormState } from "@/lib/form-state";
import { ticketReplySchema, ticketSchema, ticketStatusSchema } from "@/lib/validations/commerce";

export async function createTicketAction(_: FormState, fd: FormData): Promise<FormState> {
  const s = await assertUser();
  const blocked = await limitAction("ticket", 10, 60 * 60_000);
  if (blocked) return blocked;
  const parsed = ticketSchema.safeParse(formObject(fd));
  if (!parsed.success) return fieldErrors(parsed.error);
  const d = parsed.data;

  await connectDB();
  // customers can only link their own orders
  const orderId = d.orderId && (await Order.exists({ _id: d.orderId, customer: s.sub })) ? d.orderId : undefined;
  const t = await Ticket.create({
    number: await nextNumber("TKT"),
    customer: s.sub,
    order: orderId,
    subject: d.subject,
    category: d.category,
    messages: [{ body: d.body, authorName: s.name, fromStaff: false }],
  });
  await notifyTeam(`New ticket ${t.number}: ${d.subject}`, [`From ${s.name} (${s.email})`, d.body.slice(0, 500)], `${config.siteUrl}/admin/support/${t._id}`);
  redirect(`/dashboard/support/${t._id}`);
}

export async function replyTicketAction(_: FormState, fd: FormData): Promise<FormState> {
  const s = await assertUser();
  const parsed = ticketReplySchema.safeParse(formObject(fd));
  if (!parsed.success) return fieldErrors(parsed.error);
  const staff = can(s.role, "support");

  await connectDB();
  // customers: only their own tickets; staff: any ticket
  const filter = staff ? { _id: parsed.data.id } : { _id: parsed.data.id, customer: s.sub };
  const ticket = await Ticket.findOneAndUpdate(
    { ...filter, status: { $ne: "closed" } },
    {
      $push: { messages: { body: parsed.data.body, authorName: staff ? `${s.name} (Nexovate)` : s.name, fromStaff: staff } },
      status: staff ? "awaiting_customer" : "open",
    },
  ).populate<{ customer: { email: string; name: string } }>("customer", "email name");
  if (!ticket) return { error: "This ticket is closed or not available." };

  if (staff) {
    await sendEmail(
      ticket.customer.email,
      `Re: ${ticket.subject} [${ticket.number}]`,
      layout(`Hi ${ticket.customer.name},`, ["Our team replied to your support request:", parsed.data.body], {
        label: "View ticket",
        url: `${config.siteUrl}/dashboard/support/${ticket._id}`,
      }),
    );
    revalidatePath(`/admin/support/${ticket._id}`);
    revalidatePath(`/dashboard/support/${ticket._id}`);
  } else {
    await notifyTeam(`Customer replied: ${ticket.number}`, [parsed.data.body.slice(0, 500)], `${config.siteUrl}/admin/support/${ticket._id}`);
    revalidatePath(`/dashboard/support/${ticket._id}`);
  }
  return { ok: true };
}

export async function setTicketStatusAction(fd: FormData) {
  await assertPermission("support");
  const parsed = ticketStatusSchema.safeParse(formObject(fd));
  if (!parsed.success) return;
  await connectDB();
  await Ticket.updateOne({ _id: parsed.data.id }, { status: parsed.data.status });
  revalidatePath(`/admin/support/${parsed.data.id}`);
  revalidatePath("/admin/support");
  revalidatePath(`/dashboard/support/${parsed.data.id}`);
}
