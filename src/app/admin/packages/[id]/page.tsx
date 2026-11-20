import { notFound } from "next/navigation";
import { requireStaffPage } from "@/server/auth/session";
import { getPackageAdmin } from "@/server/queries/commerce";
import { minorFactor } from "@/lib/money";
import { PageHeader } from "@/components/layout/app-shell";
import { PackageForm } from "@/components/admin/package-form";

export default async function EditPackage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaffPage("packages");
  const p = await getPackageAdmin((await params).id);
  if (!p) notFound();
  return (
    <>
      <PageHeader title={`Edit: ${p.name}`} description="Price changes apply to new orders only — existing orders keep the price they were placed at." />
      <PackageForm
        v={{
          id: p._id,
          serviceSlug: p.serviceSlug,
          name: p.name,
          description: p.description ?? "",
          price: String(p.price / minorFactor(p.currency)),
          currency: p.currency,
          billing: p.billing ?? "one_time",
          deliverables: p.deliverables.join("\n"),
          exclusions: p.exclusions.join("\n"),
          revisions: p.revisions != null ? String(p.revisions) : "",
          deliveryDays: p.deliveryDays != null ? String(p.deliveryDays) : "",
          terms: p.terms ?? "",
          featured: Boolean(p.featured),
          active: Boolean(p.active),
          sort: String(p.sort ?? 0),
        }}
      />
    </>
  );
}
