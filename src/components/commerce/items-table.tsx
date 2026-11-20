import { formatMoney, lineTotal } from "@/lib/money";

type Item = { description: string; quantity: number; unitAmount: number };

export function ItemsTable({
  items,
  currency,
  subtotal,
  discount = 0,
  total,
  paid,
}: {
  items: Item[];
  currency: string;
  subtotal: number;
  discount?: number | null;
  total: number;
  paid?: number;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-sm">
        <thead className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="py-2 font-medium">Description</th>
            <th className="py-2 text-right font-medium">Qty</th>
            <th className="py-2 text-right font-medium">Price</th>
            <th className="py-2 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((i, idx) => (
            <tr key={idx} className="border-b border-line">
              <td className="py-3">{i.description}</td>
              <td className="py-3 text-right">{i.quantity}</td>
              <td className="py-3 text-right">{formatMoney(i.unitAmount, currency)}</td>
              <td className="py-3 text-right">{formatMoney(lineTotal(i), currency)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr><td colSpan={3} className="pt-4 text-right text-muted">Subtotal</td><td className="pt-4 text-right">{formatMoney(subtotal, currency)}</td></tr>
          {discount ? <tr><td colSpan={3} className="pt-1 text-right text-muted">Discount</td><td className="pt-1 text-right">−{formatMoney(discount, currency)}</td></tr> : null}
          <tr><td colSpan={3} className="pt-2 text-right font-semibold">Total</td><td className="pt-2 text-right text-base font-semibold">{formatMoney(total, currency)}</td></tr>
          {paid != null && (
            <>
              <tr><td colSpan={3} className="pt-1 text-right text-muted">Paid</td><td className="pt-1 text-right">{formatMoney(paid, currency)}</td></tr>
              <tr><td colSpan={3} className="pt-1 text-right font-semibold">Balance due</td><td className="pt-1 text-right font-semibold">{formatMoney(Math.max(total - paid, 0), currency)}</td></tr>
            </>
          )}
        </tfoot>
      </table>
    </div>
  );
}
