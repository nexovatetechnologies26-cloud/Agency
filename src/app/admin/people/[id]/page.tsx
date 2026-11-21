import { notFound } from "next/navigation";
import { seniorityDisplay } from "@/lib/constants";
import { requireStaffPage } from "@/server/auth/session";
import { getTeamMemberAdmin } from "@/server/queries/other";
import { PageHeader } from "@/components/layout/app-shell";
import { TeamMemberForm } from "@/components/admin/team-member-form";

export default async function EditTeamMember({ params }: { params: Promise<{ id: string }> }) {
  await requireStaffPage("content");
  const m = await getTeamMemberAdmin((await params).id);
  if (!m) notFound();
  return (
    <>
      <PageHeader title={`Edit: ${m.name}`} />
      <TeamMemberForm
        v={{
          id: m._id,
          name: m.name,
          title: m.title,
          seniority: seniorityDisplay(m.seniority) ?? "",
          yearsExperience: m.yearsExperience != null ? String(m.yearsExperience) : "",
          bio: m.bio ?? "",
          quote: m.quote ?? "",
          expertise: (m.expertise ?? []).join(", "),
          responsibilities: (m.responsibilities ?? []).map((r) => (r.description ? `${r.title} | ${r.description}` : r.title)).join("\n"),
          notableWork: (m.notableWork ?? []).join("\n"),
          languages: (m.languages ?? []).join(", "),
          photo: m.photo ?? "",
          linkedin: m.linkedin ?? "",
          links: (m.links ?? []).map((l) => (l.label ? `${l.label} | ${l.url}` : l.url)).join("\n"),
          email: m.email ?? "",
          whatsapp: m.whatsapp ?? "",
          location: m.location ?? "",
          published: Boolean(m.published),
          sort: String(m.sort ?? 0),
        }}
      />
    </>
  );
}
