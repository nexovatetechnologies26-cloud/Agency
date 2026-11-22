import "server-only";
import { connectDB } from "@/server/db/mongodb";
import { Lead } from "@/server/models/lead.model";
import { Invoice, Order, Proposal } from "@/server/models/commerce.model";
import { Booking, Ticket } from "@/server/models/support.model";
import { User } from "@/server/models/user.model";

// All figures come from real records — nothing is estimated or invented.

export async function adminOverview() {
  await connectDB();
  const since30 = new Date(Date.now() - 30 * 86400000);

  const [newLeads, leads30, qualified, activeCustomers, activeOrders, inProgress, completed, pendingProposals, openTickets, upcomingBookings, revenue, outstanding, byCountry, bySource, won, lost, accepted, decided, customers] =
    await Promise.all([
      Lead.countDocuments({ status: "new" }),
      Lead.countDocuments({ createdAt: { $gte: since30 } }),
      Lead.countDocuments({ status: "qualified" }),
      Order.distinct("customer", { status: { $nin: ["cancelled", "refunded", "completed"] } }).then((x) => x.length),
      Order.countDocuments({ status: { $in: ["pending", "awaiting_requirements", "confirmed", "in_progress", "under_review", "revision_requested"] } }),
      Order.countDocuments({ status: "in_progress" }),
      Order.countDocuments({ status: "completed" }),
      Proposal.countDocuments({ status: { $in: ["sent", "viewed"] } }),
      Ticket.countDocuments({ status: "open" }),
      Booking.countDocuments({ status: "confirmed", startsAt: { $gte: new Date() } }),
      // revenue = money actually received, per currency (never mixed or converted)
      Order.aggregate<{ _id: string; amount: number }>([
        { $group: { _id: "$currency", amount: { $sum: { $subtract: ["$amountPaid", { $ifNull: ["$amountRefunded", 0] }] } } } },
        { $match: { amount: { $ne: 0 } } },
      ]),
      Invoice.aggregate<{ _id: string; amount: number }>([
        { $match: { status: { $in: ["unpaid", "partially_paid"] } } },
        { $group: { _id: "$currency", amount: { $sum: { $subtract: ["$total", "$amountPaid"] } } } },
      ]),
      Lead.aggregate<{ _id: string; count: number }>([
        { $match: { createdAt: { $gte: since30 } } },
        { $group: { _id: "$country", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      Lead.aggregate<{ _id: string | null; count: number }>([
        { $match: { createdAt: { $gte: since30 } } },
        { $group: { _id: { $ifNull: ["$source.utmSource", "direct / organic"] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      Lead.countDocuments({ status: "won" }),
      Lead.countDocuments({ status: "lost" }),
      Proposal.countDocuments({ status: "accepted" }),
      Proposal.countDocuments({ status: { $in: ["accepted", "declined"] } }),
      User.countDocuments({ role: "customer" }),
    ]);

  return {
    newLeads,
    leads30,
    qualified,
    activeCustomers,
    activeOrders,
    inProgress,
    completed,
    pendingProposals,
    openTickets,
    upcomingBookings,
    revenue,
    outstanding,
    byCountry,
    bySource,
    winRate: won + lost ? Math.round((won / (won + lost)) * 100) : null,
    proposalAcceptance: decided ? Math.round((accepted / decided) * 100) : null,
    customers,
  };
}

export async function customerOverview(userId: string, email: string) {
  await connectDB();
  const [activeOrders, unpaidInvoices, openTickets, openProposals, awaitingRequirements] = await Promise.all([
    Order.countDocuments({ customer: userId, status: { $nin: ["completed", "cancelled", "refunded"] } }),
    Invoice.countDocuments({ customer: userId, status: { $in: ["unpaid", "partially_paid"] } }),
    Ticket.countDocuments({ customer: userId, status: { $in: ["open", "awaiting_customer"] } }),
    Proposal.countDocuments({ clientEmail: email, status: { $in: ["sent", "viewed"] } }),
    Order.countDocuments({ customer: userId, status: "awaiting_requirements" }),
  ]);
  return { activeOrders, unpaidInvoices, openTickets, openProposals, awaitingRequirements };
}

/** Sidebar badges: website inquiries not yet handled, client messages waiting for the team. */
export async function getInboxCounts() {
  try {
    await connectDB();
    const [inquiries, clientMessages] = await Promise.all([
      Lead.countDocuments({ status: "new" }),
      Ticket.countDocuments({ status: "open" }),
    ]);
    return { inquiries, clientMessages };
  } catch {
    return { inquiries: 0, clientMessages: 0 };
  }
}
