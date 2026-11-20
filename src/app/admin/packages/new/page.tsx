import { requireStaffPage } from "@/server/auth/session";
import { PageHeader } from "@/components/layout/app-shell";
import { PackageForm } from "@/components/admin/package-form";

export default async function NewPackage() {
  await requireStaffPage("packages");
  return (
    <>
      <PageHeader title="New package" />
      <PackageForm />
    </>
  );
}
