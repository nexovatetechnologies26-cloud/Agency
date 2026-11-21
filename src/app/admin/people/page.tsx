import Link from "next/link";
import { requireStaffPage } from "@/server/auth/session";
import { listTeamMembersAdmin } from "@/server/queries/other";
import { seniorityDisplay } from "@/lib/constants";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";

export default async function AdminPeople() {
  await requireStaffPage("content");
  const rows = await listTeamMembersAdmin();
  return (
    <>
      <PageHeader
        title="Team Profiles"
        description="Public profiles shown in the Team section on the website. Separate from login accounts (Team & Roles)."
        actions={<ButtonLink href="/admin/people/new">Add member</ButtonLink>}
      />
      {rows.length ? (
        <ul className="card divide-y divide-line">
          {rows.map((m) => (
            <li key={m._id} className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-paper font-serif text-lg text-ink/60">
                  {m.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin-provided URL
                    <img src={m.photo} alt="" className="h-full w-full object-cover" />
                  ) : (
                    m.name.charAt(0)
                  )}
                </span>
                <div>
                  <Link href={`/admin/people/${m._id}`} className="font-semibold text-brand">{m.name}</Link>
                  <p className="text-xs text-muted">
                    {m.title}{m.seniority ? ` · ${seniorityDisplay(m.seniority)}` : ""}
                    {m.yearsExperience != null ? ` · ${m.yearsExperience} yrs` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted">Order {m.sort ?? 0}</span>
                {m.published ? <Badge tone="green">Published</Badge> : <Badge>Hidden</Badge>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No team profiles yet"
          text="Add the people clients will work with. The Team section appears on the website once at least one profile is published."
          action={{ label: "Add member", href: "/admin/people/new" }}
        />
      )}
    </>
  );
}
