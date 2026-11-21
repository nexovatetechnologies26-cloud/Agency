import { requireStaffPage } from "@/server/auth/session";
import { PageHeader } from "@/components/layout/app-shell";
import { TeamMemberForm } from "@/components/admin/team-member-form";

export default async function NewTeamMember() {
  await requireStaffPage("content");
  return (
    <>
      <PageHeader title="Add team member" description="Only add real people, with their permission to appear on the website." />
      <TeamMemberForm />
    </>
  );
}
