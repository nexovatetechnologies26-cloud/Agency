import Link from "next/link";
import { requireStaffPage } from "@/server/auth/session";
import { listPackagesAdmin } from "@/server/queries/commerce";
import { services } from "@/content/services";
import { formatMoney } from "@/lib/money";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";

export default async function AdminPackages() {
  await requireStaffPage("packages");
  const rows = await listPackagesAdmin();
  return (
    <>
      <PageHeader title="Packages" description="Fixed-price packages shown on the Pricing page. Only active packages are visible to customers." actions={<ButtonLink href="/admin/packages/new">New package</ButtonLink>} />
      {rows.length ? (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
              <tr><th className="px-5 py-3">Package</th><th className="px-5 py-3">Service</th><th className="px-5 py-3">Price</th><th className="px-5 py-3">Status</th></tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p._id} className="border-b border-line last:border-0">
                  <td className="px-5 py-4"><Link href={`/admin/packages/${p._id}`} className="font-semibold text-brand">{p.name}</Link></td>
                  <td className="px-5 py-4">{services.find((s) => s.slug === p.serviceSlug)?.title ?? p.serviceSlug}</td>
                  <td className="px-5 py-4">{formatMoney(p.price, p.currency)}{p.billing === "monthly" ? " / mo" : ""}</td>
                  <td className="px-5 py-4">{p.active ? <Badge tone="green">Active</Badge> : <Badge>Hidden</Badge>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No packages yet" text="Add packages with prices you have confirmed. Until then, the Pricing page points visitors to custom quotes." action={{ label: "New package", href: "/admin/packages/new" }} />
      )}
    </>
  );
}
