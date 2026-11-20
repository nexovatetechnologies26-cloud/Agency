import "server-only";
import { Counter } from "@/server/models/commerce.model";

/** Atomic sequential numbers: ORD-00001, INV-00001, PRO-00001, TKT-00001 */
export async function nextNumber(prefix: "ORD" | "INV" | "PRO" | "TKT") {
  const c = await Counter.findOneAndUpdate({ _id: prefix }, { $inc: { seq: 1 } }, { upsert: true, new: true });
  return `${prefix}-${String(c.seq).padStart(5, "0")}`;
}
