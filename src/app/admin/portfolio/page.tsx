import Link from "next/link";
import { requireStaffPage } from "@/server/auth/session";
import { listProjectsAdmin } from "@/server/queries/other";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";

export default async function AdminPortfolio() {
  await requireStaffPage("content");
  const rows = await listProjectsAdmin();
  return (
    <>
      <PageHeader title="Portfolio & Case Studies" description="Publish only real projects, with client permission for names and verified results." actions={<ButtonLink href="/admin/portfolio/new">New project</ButtonLink>} />
      {rows.length ? (
        <ul className="card divide-y divide-line">
          {rows.map((p) => (
            <li key={p._id} className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <Link href={`/admin/portfolio/${p._id}`} className="font-semibold text-brand">{p.title}</Link>
                <p className="text-xs text-muted">/portfolio/{p.slug}</p>
              </div>
              <div className="flex gap-2">
                {p.isCaseStudy && <Badge tone="blue">Case study</Badge>}
                {p.published ? <Badge tone="green">Published</Badge> : <Badge>Hidden</Badge>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No projects yet" action={{ label: "Add a project", href: "/admin/portfolio/new" }} />
      )}
    </>
  );
}
