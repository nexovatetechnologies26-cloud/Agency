import { requireStaffPage } from "@/server/auth/session";
import { PageHeader } from "@/components/layout/app-shell";
import { ProjectForm } from "@/components/admin/project-form";

export default async function NewProject() {
  await requireStaffPage("content");
  return (
    <>
      <PageHeader title="New project" />
      <ProjectForm />
    </>
  );
}
