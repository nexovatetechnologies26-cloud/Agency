import { notFound } from "next/navigation";
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
          seniority: m.seniority ?? "senior",
          yearsExperience: m.yearsExperience != null ? String(m.yearsExperience) : "",
          bio: m.bio ?? "",
          expertise: (m.expertise ?? []).join(", "),
          photo: m.photo ?? "",
          linkedin: m.linkedin ?? "",
          location: m.location ?? "",
          published: Boolean(m.published),
          sort: String(m.sort ?? 0),
        }}
      />
    </>
  );
}
