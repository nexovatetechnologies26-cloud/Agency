// Money is stored as integer minor units (cents) to avoid floating-point errors.
// Pure module — no imports.

export interface LineItem {
  description: string;
  quantity: number;
  unitAmount: number; // minor units
}

// Currencies without minor units
const ZERO_DECIMAL = new Set(["JPY", "KRW", "VND"]);

export function minorFactor(currency: string) {
  return ZERO_DECIMAL.has(currency.toUpperCase()) ? 1 : 100;
}

/** "1,250.50" → 125050 (for 2-decimal currencies). Returns null for invalid input. */
export function parseAmount(input: string | number, currency: string): number | null {
  const raw = typeof input === "number" ? String(input) : input.replace(/[,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(raw)) return null;
  const [whole, frac = ""] = raw.split(".");
  const factor = minorFactor(currency);
  if (factor === 1) return frac && Number(frac) !== 0 ? null : Number(whole);
  return Number(whole) * 100 + Number(frac.padEnd(2, "0"));
}

export function formatMoney(minor: number, currency: string, locale = "en-US") {
  return new Intl.NumberFormat(locale, { style: "currency", currency, currencyDisplay: "code" }).format(
    minor / minorFactor(currency),
  );
}

export function lineTotal(item: LineItem) {
  return item.quantity * item.unitAmount;
}

export function calcTotals(items: LineItem[], discount = 0) {
  for (const i of items) {
    if (!Number.isInteger(i.quantity) || i.quantity < 1) throw new Error("Quantity must be a positive integer");
    if (!Number.isInteger(i.unitAmount) || i.unitAmount < 0) throw new Error("Unit amount must be a non-negative integer");
  }
  const subtotal = items.reduce((sum, i) => sum + lineTotal(i), 0);
  const safeDiscount = Math.min(Math.max(Math.round(discount), 0), subtotal);
  return { subtotal, discount: safeDiscount, total: subtotal - safeDiscount };
}

/** Payment status derived from what has actually been recorded. */
export function derivePaymentStatus(total: number, paid: number, refunded = 0) {
  if (refunded > 0 && refunded >= paid && paid > 0) return "refunded" as const;
  if (refunded > 0) return "partially_refunded" as const;
  if (paid <= 0) return "pending" as const;
  if (paid >= total) return "paid" as const;
  return "partially_paid" as const;
}
