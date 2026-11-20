import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaffPage } from "@/server/auth/session";
import { getInvoiceAdmin } from "@/server/queries/commerce";
import { InvoiceView } from "@/components/commerce/invoice-view";

export default async function AdminInvoice({ params }: { params: Promise<{ id: string }> }) {
  await requireStaffPage("finance");
  const inv = await getInvoiceAdmin((await params).id);
  if (!inv) notFound();
  return (
    <>
      <Link href={`/admin/orders/${inv.order}`} className="mb-4 inline-block text-sm font-semibold text-brand print:hidden">← Open order</Link>
      <InvoiceView inv={inv} />
    </>
  );
}
