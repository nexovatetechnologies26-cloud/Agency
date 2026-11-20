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

  const [newLeads, leads30, qualified, activeCustomers, activeOrders, inProgress, completed, pendingProposals, openTickets, upcomingBookings, revenue, outstanding, byCountry, bySource] =
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
    ]);

  const won = await Lead.countDocuments({ status: "won" });
  const lost = await Lead.countDocuments({ status: "lost" });
  const [accepted, decided] = await Promise.all([
    Proposal.countDocuments({ status: "accepted" }),
    Proposal.countDocuments({ status: { $in: ["accepted", "declined"] } }),
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
    customers: await User.countDocuments({ role: "customer" }),
  };
}

export async function customerOverview(userId: string, email: string) {
  await connectDB();
  const [activeOrders, unpaidInvoices, openTickets, openProposals] = await Promise.all([
    Order.countDocuments({ customer: userId, status: { $nin: ["completed", "cancelled", "refunded"] } }),
    Invoice.countDocuments({ customer: userId, status: { $in: ["unpaid", "partially_paid"] } }),
    Ticket.countDocuments({ customer: userId, status: { $in: ["open", "awaiting_customer"] } }),
    Proposal.countDocuments({ clientEmail: email, status: { $in: ["sent", "viewed"] } }),
  ]);
  const awaitingRequirements = await Order.countDocuments({ customer: userId, status: "awaiting_requirements" });
  return { activeOrders, unpaidInvoices, openTickets, openProposals, awaitingRequirements };
}
