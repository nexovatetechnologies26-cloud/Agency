"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/server/db/mongodb";
import { User } from "@/server/models/user.model";
import { assertPermission } from "@/server/auth/session";
import { hashPassword } from "@/server/auth/password";
import { fieldErrors, formObject } from "@/server/lib/forms";
import { audit } from "@/server/lib/audit";
import { ROLES } from "@/lib/permissions";
import type { FormState } from "@/lib/form-state";

const staffRoles = ROLES.filter((r) => r !== "customer" && r !== "super_admin") as [string, ...string[]];

export async function createStaffAction(_: FormState, fd: FormData): Promise<FormState> {
  const s = await assertPermission("team");
  const parsed = z
    .object({
      name: z.string().trim().min(2).max(100),
      email: z.string().trim().toLowerCase().email(),
      role: z.enum(staffRoles),
      password: z.string().min(10, "Temporary password must be at least 10 characters"),
    })
    .safeParse(formObject(fd));
  if (!parsed.success) return fieldErrors(parsed.error);
  const d = parsed.data;

  await connectDB();
  if (await User.exists({ email: d.email })) return { fields: { email: "A user with this email already exists" } };
  const u = await User.create({ name: d.name, email: d.email, role: d.role, passwordHash: await hashPassword(d.password), emailVerifiedAt: new Date() });
  await audit(s.email, "staff_created", "user", String(u._id), d.role);
  revalidatePath("/admin/team");
  return { ok: true, message: `${d.name} added. Share the temporary password securely and ask them to change it.` };
}

export async function updateUserRoleAction(fd: FormData) {
  const s = await assertPermission("team");
  const { id, role } = formObject(fd);
  if (!(ROLES as readonly string[]).includes(role) || role === "super_admin") return;
  if (id === s.sub || !isValidObjectId(id)) return; // can't change your own role
  await connectDB();
  const target = await User.findById(id);
  if (!target || target.role === "super_admin") return;
  const from = target.role;
  target.role = role as typeof target.role;
  await target.save();
  await audit(s.email, "role_changed", "user", id, `${from} → ${role}`);
  revalidatePath("/admin/team");
}

export async function toggleUserActiveAction(fd: FormData) {
  const s = await assertPermission("team");
  const id = String(fd.get("id") ?? "");
  if (id === s.sub || !isValidObjectId(id)) return;
  await connectDB();
  const target = await User.findById(id);
  if (!target || target.role === "super_admin") return;
  target.active = !target.active;
  await target.save();
  await audit(s.email, target.active ? "user_activated" : "user_deactivated", "user", id);
  revalidatePath("/admin/team");
  revalidatePath("/admin/customers");
}
