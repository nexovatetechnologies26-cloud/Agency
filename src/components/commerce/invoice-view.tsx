import { site } from "@/content/site";
import { COUNTRIES } from "@/content/countries";
import { fmtDate } from "@/lib/format";
import { ItemsTable } from "@/components/commerce/items-table";
import { StatusBadge } from "@/components/ui/badge";
import { PrintButton } from "@/components/commerce/print-button";

type InvoiceData = {
  number: string;
  status: string;
  issuedAt: string;
  dueAt?: string | null;
  billTo?: { name?: string | null; email?: string | null; company?: string | null; country?: string | null } | null;
  items: { description: string; quantity: number; unitAmount: number }[];
  currency: string;
  subtotal: number;
  discount?: number | null;
  total: number;
  amountPaid: number;
};

/** Printable invoice (use the browser's "Save as PDF"). */
export function InvoiceView({ inv }: { inv: InvoiceData }) {
  const country = COUNTRIES.find((c) => c.code === inv.billTo?.country)?.name;
  return (
    <div className="card mx-auto max-w-3xl p-8 print:border-0 print:shadow-none md:p-12">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-2xl font-extrabold">Ne<span className="text-brand">x</span>ovate</p>
          <p className="mt-1 text-xs text-muted">{site.domain}{site.contact.email ? ` · ${site.contact.email}` : ""}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-semibold">Invoice {inv.number}</p>
          <div className="mt-1"><StatusBadge status={inv.status} /></div>
        </div>
      </div>
      <div className="mt-10 grid gap-6 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Bill to</p>
          <p className="mt-2 font-semibold">{inv.billTo?.name}</p>
          {inv.billTo?.company && <p>{inv.billTo.company}</p>}
          <p>{inv.billTo?.email}</p>
          {country && <p>{country}</p>}
        </div>
        <div className="sm:text-right">
          <p><span className="text-muted">Issued:</span> {fmtDate(inv.issuedAt)}</p>
          <p><span className="text-muted">Due:</span> {fmtDate(inv.dueAt)}</p>
          <p><span className="text-muted">Currency:</span> {inv.currency}</p>
        </div>
      </div>
      <div className="mt-10">
        <ItemsTable items={inv.items} currency={inv.currency} subtotal={inv.subtotal} discount={inv.discount} total={inv.total} paid={inv.amountPaid} />
      </div>
      <div className="mt-10 print:hidden"><PrintButton /></div>
    </div>
  );
}
