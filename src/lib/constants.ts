// Shared constants used by both client and server code. No imports — safe everywhere.

/**
 * Non-secret UI hint ("customer" | "staff") set next to the real session cookie.
 * It only decides whether the public header shows "My Account" — it grants no access.
 * This lets public pages be cached/static instead of reading cookies on the server.
 */
export const ACCOUNT_HINT_COOKIE = "nx_account";

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "consultation_scheduled",
  "proposal_sent",
  "negotiation",
  "won",
  "lost",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New Lead",
  contacted: "Contacted",
  qualified: "Qualified",
  consultation_scheduled: "Consultation Scheduled",
  proposal_sent: "Proposal Sent",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
};

export const LEAD_TYPES = ["quote", "contact", "consultation"] as const;
export type LeadType = (typeof LEAD_TYPES)[number];

export const BUDGET_RANGES = [
  "Under $1,000",
  "$1,000 – $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000+",
  "Not sure yet",
] as const;

export const TIMELINES = ["As soon as possible", "Within 1 month", "1 – 3 months", "3+ months", "Flexible"] as const;

export const CONTACT_METHODS = ["email", "phone", "whatsapp"] as const;

// ---- Commerce ----
export const CURRENCIES = ["USD", "GBP", "EUR", "AED", "CAD", "AUD", "SGD", "PKR", "SAR"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const ORDER_STATUSES = [
  "pending",
  "awaiting_requirements",
  "confirmed",
  "in_progress",
  "under_review",
  "revision_requested",
  "completed",
  "on_hold",
  "cancelled",
  "refunded",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  awaiting_requirements: "Awaiting Requirements",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  under_review: "Under Review",
  revision_requested: "Revision Requested",
  completed: "Completed",
  on_hold: "On Hold",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export const PAYMENT_STATUSES = ["pending", "partially_paid", "paid", "failed", "refunded", "partially_refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Pending",
  partially_paid: "Partially Paid",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
  partially_refunded: "Partially Refunded",
};

export const PROPOSAL_STATUSES = ["draft", "sent", "viewed", "accepted", "declined", "expired"] as const;
export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number];

export const MILESTONE_STATUSES = ["pending", "in_progress", "done"] as const;
export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number];

export const TICKET_STATUSES = ["open", "awaiting_customer", "resolved", "closed"] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];
export const TICKET_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export const TICKET_CATEGORIES = ["General", "Billing", "Technical", "Project", "Other"] as const;

export const BILLING_TYPES = ["one_time", "monthly"] as const;
export type BillingType = (typeof BILLING_TYPES)[number];

// ---- Public team profiles ----
export const SENIORITY_LEVELS = ["founder", "director", "lead", "senior", "mid", "associate"] as const;
export type Seniority = (typeof SENIORITY_LEVELS)[number];
export const SENIORITY_LABELS: Record<Seniority, string> = {
  founder: "Founder",
  director: "Director",
  lead: "Lead",
  senior: "Senior",
  mid: "Mid-level",
  associate: "Associate",
};
