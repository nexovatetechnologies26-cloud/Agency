import clsx from "clsx";

const tones = {
  brand: "bg-brand-soft text-brand",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-800",
  red: "bg-red-50 text-red-700",
  gray: "bg-gray-100 text-gray-600",
  blue: "bg-blue-50 text-blue-700",
} as const;

export type BadgeTone = keyof typeof tones;

export function Badge({ tone = "gray", children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return <span className={clsx("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone])}>{children}</span>;
}

const STATUS_TONES: Record<string, BadgeTone> = {
  // orders
  pending: "amber",
  awaiting_requirements: "amber",
  confirmed: "blue",
  in_progress: "brand",
  under_review: "blue",
  revision_requested: "amber",
  completed: "green",
  on_hold: "gray",
  cancelled: "gray",
  refunded: "gray",
  // payments / invoices
  paid: "green",
  partially_paid: "amber",
  unpaid: "red",
  failed: "red",
  partially_refunded: "gray",
  void: "gray",
  // proposals
  draft: "gray",
  sent: "blue",
  viewed: "brand",
  accepted: "green",
  declined: "red",
  expired: "gray",
  // tickets / bookings
  open: "brand",
  awaiting_customer: "amber",
  resolved: "green",
  closed: "gray",
  done: "green",
  published: "green",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={STATUS_TONES[status] ?? "gray"}>{status.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())}</Badge>;
}
