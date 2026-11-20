import Link from "next/link";
import { requireStaffPage } from "@/server/auth/session";
import { listPostsAdmin } from "@/server/queries/other";
import { fmtDate } from "@/lib/format";
import { PageHeader } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";

export default async function AdminBlog() {
  await requireStaffPage("content");
  const rows = await listPostsAdmin();
  return (
    <>
      <PageHeader title="Blog" actions={<ButtonLink href="/admin/blog/new">New post</ButtonLink>} />
      {rows.length ? (
        <ul className="card divide-y divide-line">
          {rows.map((p) => (
            <li key={p._id} className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <Link href={`/admin/blog/${p._id}`} className="font-semibold text-brand">{p.title}</Link>
                <p className="text-xs text-muted">/blog/{p.slug} · updated {fmtDate(p.updatedAt)}</p>
              </div>
              <StatusBadge status={p.status} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No posts yet" action={{ label: "Write the first post", href: "/admin/blog/new" }} />
      )}
    </>
  );
}
