// Unit tests for pure business logic. Run: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { calcTotals, derivePaymentStatus, formatMoney, parseAmount } from "../src/lib/money";
import { canTransition } from "../src/lib/order-status";
import { can, isStaff } from "../src/lib/permissions";
import { generateSlots, tzOffsetMinutes, zonedTimeToUtc } from "../src/lib/slots";
import { parseBlocks, slugify } from "../src/lib/text";
import { hashPassword, verifyPassword } from "../src/server/auth/password";

test("parseAmount converts to minor units", () => {
  assert.equal(parseAmount("1,250.5", "USD"), 125050);
  assert.equal(parseAmount("99", "USD"), 9900);
  assert.equal(parseAmount("0.07", "EUR"), 7);
  assert.equal(parseAmount("12.345", "USD"), null);
  assert.equal(parseAmount("-5", "USD"), null);
  assert.equal(parseAmount("abc", "USD"), null);
});

test("calcTotals sums line items and clamps discount", () => {
  const t = calcTotals([
    { description: "A", quantity: 2, unitAmount: 1000 },
    { description: "B", quantity: 1, unitAmount: 550 },
  ], 99999);
  assert.deepEqual(t, { subtotal: 2550, discount: 2550, total: 0 });
  assert.throws(() => calcTotals([{ description: "x", quantity: 0, unitAmount: 1 }]));
  assert.throws(() => calcTotals([{ description: "x", quantity: 1, unitAmount: 1.5 }]));
});

test("derivePaymentStatus follows recorded payments", () => {
  assert.equal(derivePaymentStatus(1000, 0), "pending");
  assert.equal(derivePaymentStatus(1000, 400), "partially_paid");
  assert.equal(derivePaymentStatus(1000, 1000), "paid");
  assert.equal(derivePaymentStatus(1000, 1000, 1000), "refunded");
  assert.equal(derivePaymentStatus(1000, 1000, 200), "partially_refunded");
});

test("formatMoney shows currency code", () => {
  assert.match(formatMoney(125050, "USD"), /USD\s?1,250\.50/);
});

test("order status transitions", () => {
  assert.ok(canTransition("pending", "confirmed"));
  assert.ok(canTransition("in_progress", "under_review"));
  assert.ok(!canTransition("completed", "pending"));
  assert.ok(!canTransition("refunded", "in_progress"));
});

test("permissions", () => {
  assert.ok(can("super_admin", "team"));
  assert.ok(!can("admin", "team"));
  assert.ok(can("sales_rep", "leads"));
  assert.ok(!can("sales_rep", "finance"));
  assert.ok(!can("customer", "dashboard"));
  assert.ok(!isStaff("customer"));
  assert.ok(isStaff("developer"));
});

test("timezone conversion", () => {
  assert.equal(tzOffsetMinutes(new Date("2026-01-15T00:00:00Z"), "Asia/Karachi"), 300);
  assert.equal(zonedTimeToUtc(2026, 1, 15, 10, 0, "Asia/Karachi").toISOString(), "2026-01-15T05:00:00.000Z");
  // New York in summer (DST, UTC-4) and winter (UTC-5)
  assert.equal(zonedTimeToUtc(2026, 7, 1, 9, 0, "America/New_York").toISOString(), "2026-07-01T13:00:00.000Z");
  assert.equal(zonedTimeToUtc(2026, 1, 5, 9, 0, "America/New_York").toISOString(), "2026-01-05T14:00:00.000Z");
});

test("generateSlots respects weekdays, hours, notice and taken slots", () => {
  const cfg = { timeZone: "Asia/Karachi", startHour: 10, endHour: 12, weekdays: [1], slotMinutes: 30, daysAhead: 7, minNoticeMinutes: 60 };
  const now = new Date("2026-01-11T00:00:00Z"); // Sunday
  const slots = generateSlots(cfg, now);
  // Monday 12 Jan, 10:00–12:00 PKT → 4 slots starting 05:00Z
  assert.deepEqual(slots, [
    "2026-01-12T05:00:00.000Z",
    "2026-01-12T05:30:00.000Z",
    "2026-01-12T06:00:00.000Z",
    "2026-01-12T06:30:00.000Z",
  ]);
  const withTaken = generateSlots(cfg, now, new Set(["2026-01-12T05:30:00.000Z"]));
  assert.equal(withTaken.length, 3);
  // notice period hides slots that start too soon
  const late = generateSlots(cfg, new Date("2026-01-12T05:10:00Z"));
  assert.equal(late[0], "2026-01-12T06:30:00.000Z");
});

test("text helpers", () => {
  assert.equal(slugify("  Hello, World! Ünïcode  "), "hello-world-unicode");
  const blocks = parseBlocks("## Title\nline one\nline two\n\n- item\n\n<script>x</script>");
  assert.deepEqual(blocks.map((b) => b.type), ["h2", "p", "li", "p"]);
  assert.equal(blocks[1].text, "line one line two");
  assert.equal(blocks[3].text, "<script>x</script>"); // kept as text, rendered escaped by React
});

test("password hashing", async () => {
  const hash = await hashPassword("correct horse battery");
  assert.ok(await verifyPassword("correct horse battery", hash));
  assert.ok(!(await verifyPassword("wrong", hash)));
  assert.ok(!(await verifyPassword("x", "garbage")));
});

// ---- display currency conversion ----
import { convertToMajor, currencyForCountry, priceParts, roundForDisplay } from "../src/lib/currency";

test("currency conversion via USD rates", () => {
  const rates = { USD: 1, PKR: 280, INR: 84, GBP: 0.8 };
  // PKR 14,000.00 → USD 50 → INR 4,200
  assert.equal(convertToMajor(1_400_000, "PKR", "INR", rates), 4200);
  assert.equal(convertToMajor(5_000, "USD", "GBP", rates), 40);
  assert.equal(convertToMajor(5_000, "USD", "USD", null), 50); // same currency needs no rates
  assert.equal(convertToMajor(5_000, "USD", "XYZ", rates), null); // unknown rate → keep original
  assert.equal(currencyForCountry("pk"), "PKR");
  assert.equal(currencyForCountry("DE"), "EUR");
  assert.equal(currencyForCountry("ZZ"), null);
  assert.equal(roundForDisplay(4217.6), 4220);
  assert.equal(roundForDisplay(48.4), 48);
  assert.deepEqual(priceParts(149_900, "usd"), { code: "USD", amount: "1,499" });
  assert.deepEqual(priceParts(1_050, "USD"), { code: "USD", amount: "10.50" });
});
