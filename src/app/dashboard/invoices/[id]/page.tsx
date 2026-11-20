import { notFound } from "next/navigation";
import { requireUser } from "@/server/auth/session";
import { getMyInvoice } from "@/server/queries/commerce";
import { InvoiceView } from "@/components/commerce/invoice-view";

export default async function MyInvoice({ params }: { params: Promise<{ id: string }> }) {
  const s = await requireUser();
  const inv = await getMyInvoice(s.sub, (await params).id);
  if (!inv) notFound();
  return <InvoiceView inv={inv} />;
}
