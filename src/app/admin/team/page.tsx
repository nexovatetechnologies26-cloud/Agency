import { requireStaffPage } from "@/server/auth/session";
import { listStaff } from "@/server/queries/other";
import { createStaffAction, toggleUserActiveAction, updateUserRoleAction } from "@/server/actions/team";
import { ROLES, ROLE_LABELS } from "@/lib/permissions";
import { fmtDate } from "@/lib/format";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { PendingButton } from "@/components/forms/pending-button";
import { ActionForm, Field, Select, SubmitButton } from "@/components/forms/action-form";

const assignable = ROLES.filter((r) => r !== "customer" && r !== "super_admin");

export default async function TeamPage() {
  const s = await requireStaffPage("team");
  const staff = await listStaff();

  return (
    <>
      <PageHeader title="Team & Roles" description="Each role only sees the admin sections it needs. Permissions are enforced on the server." />
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
              <tr><th className="px-5 py-3">Member</th><th className="px-5 py-3">Role</th><th className="px-5 py-3">Last login</th><th className="px-5 py-3" /></tr>
            </thead>
            <tbody>
              {staff.map((u) => {
                const locked = u.role === "super_admin" || u._id === s.sub;
                return (
                  <tr key={u._id} className="border-b border-line last:border-0">
                    <td className="px-5 py-4"><p className="font-semibold">{u.name}</p><p className="text-xs text-muted">{u.email}</p></td>
                    <td className="px-5 py-4">
                      {locked ? (
                        <Badge tone="brand">{ROLE_LABELS[u.role]}</Badge>
                      ) : (
                        <form action={updateUserRoleAction} className="flex gap-2">
                          <input type="hidden" name="id" value={u._id} />
                          <select name="role" defaultValue={u.role} className="field h-9 py-1.5 text-xs" aria-label={`Role for ${u.name}`}>
                            {assignable.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                          </select>
                          <PendingButton>Save</PendingButton>
                        </form>
                      )}
                    </td>
                    <td className="px-5 py-4 text-muted">{fmtDate(u.lastLoginAt)}</td>
                    <td className="px-5 py-4 text-right">
                      {!locked && (
                        <form action={toggleUserActiveAction}>
                          <input type="hidden" name="id" value={u._id} />
                          <PendingButton tone={u.active === false ? "default" : "danger"}>{u.active === false ? "Enable" : "Disable"}</PendingButton>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <ActionForm action={createStaffAction} resetOnSuccess className="card h-fit p-7">
          <h2 className="text-lg">Add team member</h2>
          <Field label="Full name" name="name" />
          <Field label="Email" name="email" type="email" />
          <Select label="Role" name="role" defaultValue="sales_rep" options={assignable.map((r) => ({ value: r, label: ROLE_LABELS[r] }))} />
          <Field label="Temporary password" name="password" type="text" autoComplete="off" hint="At least 10 characters. They can change it in their profile." />
          <SubmitButton>Add member</SubmitButton>
        </ActionForm>
      </div>
    </>
  );
}
