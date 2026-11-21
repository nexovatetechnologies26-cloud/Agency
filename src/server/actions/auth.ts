"use server";

import { redirect } from "next/navigation";
import { connectDB } from "@/server/db/mongodb";
import { User } from "@/server/models/user.model";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { assertUser, endSession, startSession } from "@/server/auth/session";
import { hashToken, newToken } from "@/server/auth/tokens";
import { layout, sendEmail } from "@/server/lib/email";
import { fieldErrors, formObject, limitAction, safeNext } from "@/server/lib/forms";
import { audit } from "@/server/lib/audit";
import { config } from "@/server/config";
import { isStaff, type Role } from "@/lib/permissions";
import type { FormState } from "@/lib/form-state";
import {
  changePasswordSchema,
  forgotSchema,
  loginSchema,
  profileSchema,
  registerSchema,
  resetSchema,
} from "@/lib/validations/account";

/** Connects to the database; on failure logs the cause and returns a friendly form error. */
const DB_DOWN: FormState = { error: "We can't reach our database right now. Please try again in a minute." };
async function dbReady() {
  try {
    await connectDB();
    return true;
  } catch (err) {
    console.error("[auth] database unavailable", err);
    return false;
  }
}

async function sendVerification(email: string, name: string, token: string) {
  const url = `${config.siteUrl}/verify-email?token=${token}`;
  await sendEmail(
    email,
    "Confirm your email",
    layout(`Welcome to Nexovate, ${name}`, ["Please confirm your email address to secure your account."], { label: "Confirm email", url }),
  );
}

export async function registerAction(_: FormState, fd: FormData): Promise<FormState> {
  const blocked = await limitAction("register", 5, 30 * 60_000);
  if (blocked) return blocked;

  const parsed = registerSchema.safeParse(formObject(fd));
  if (!parsed.success) return fieldErrors(parsed.error);
  const d = parsed.data;

  if (!(await dbReady())) return DB_DOWN;
  if (await User.exists({ email: d.email })) {
    return { fields: { email: "An account with this email already exists. Try signing in." } };
  }

  const verify = newToken();
  const user = await User.create({
    name: d.name,
    email: d.email,
    passwordHash: await hashPassword(d.password),
    role: "customer",
    country: d.country,
    timezone: d.timezone,
    marketingConsent: d.marketing === "on",
    verifyTokenHash: verify.hash,
  });
  await sendVerification(d.email, d.name, verify.token);
  await startSession({ sub: String(user._id), email: user.email, name: user.name, role: "customer" });
  redirect(safeNext(d.next, "/dashboard"));
}

export async function loginAction(_: FormState, fd: FormData): Promise<FormState> {
  const blocked = await limitAction("login", 8, 15 * 60_000);
  if (blocked) return blocked;

  const parsed = loginSchema.safeParse(formObject(fd));
  if (!parsed.success) return fieldErrors(parsed.error);
  const { email, password, next } = parsed.data;

  if (!(await dbReady())) return DB_DOWN;
  let user = await User.findOne({ email }).select("+passwordHash");

  // First-run bootstrap: the very first Super Admin is created from ADMIN_EMAIL / ADMIN_PASSWORD.
  if (!user && (await bootstrapSuperAdmin(email, password))) {
    user = await User.findOne({ email }).select("+passwordHash");
  }

  const okPw = user?.passwordHash ? await verifyPassword(password, user.passwordHash) : false;
  if (!user || !okPw || user.active === false) return { error: "Incorrect email or password." };

  // First-run bootstrap for an ADMIN_EMAIL account that was registered as a customer
  // before any Super Admin existed: promote it once the owner signs in successfully.
  if (user.role === "customer" && email === (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase() && !(await User.exists({ role: "super_admin" }))) {
    user.role = "super_admin";
    user.emailVerifiedAt ??= new Date();
    await audit(email, "bootstrap_super_admin", "user", String(user._id), "promoted existing account");
  }

  user.lastLoginAt = new Date();
  await user.save();
  const role = user.role as Role;
  await startSession({ sub: String(user._id), email: user.email, name: user.name, role });
  if (isStaff(role)) await audit(user.email, "login", "user", String(user._id));
  redirect(safeNext(next, isStaff(role) ? "/admin" : "/dashboard"));
}

async function bootstrapSuperAdmin(email: string, password: string) {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!adminEmail || adminPassword.length < 10 || email !== adminEmail || password !== adminPassword) return false;
  if (await User.exists({ role: "super_admin" })) return false;
  await User.create({
    name: "Administrator",
    email: adminEmail,
    passwordHash: await hashPassword(adminPassword),
    role: "super_admin",
    emailVerifiedAt: new Date(),
  });
  await audit(adminEmail, "bootstrap_super_admin", "user");
  return true;
}

export async function logoutAction() {
  await endSession();
  redirect("/login");
}

export async function forgotPasswordAction(_: FormState, fd: FormData): Promise<FormState> {
  const blocked = await limitAction("forgot", 5, 30 * 60_000);
  if (blocked) return blocked;
  const parsed = forgotSchema.safeParse(formObject(fd));
  if (!parsed.success) return fieldErrors(parsed.error);

  if (!(await dbReady())) return DB_DOWN;
  const user = await User.findOne({ email: parsed.data.email });
  if (user && user.active !== false) {
    const t = newToken();
    await User.updateOne({ _id: user._id }, { resetTokenHash: t.hash, resetTokenExpires: new Date(Date.now() + 60 * 60_000) });
    await sendEmail(
      user.email,
      "Reset your password",
      layout("Reset your password", ["Use the button below to choose a new password. The link expires in 1 hour.", "If you didn't request this, you can ignore this email."], {
        label: "Reset password",
        url: `${config.siteUrl}/reset-password?token=${t.token}`,
      }),
    );
  }
  // Same answer either way, so the form can't be used to discover accounts.
  return { ok: true, message: "If an account exists for that email, we've sent a reset link." };
}

export async function resetPasswordAction(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = resetSchema.safeParse(formObject(fd));
  if (!parsed.success) return fieldErrors(parsed.error);

  if (!(await dbReady())) return DB_DOWN;
  const user = await User.findOne({ resetTokenHash: hashToken(parsed.data.token), resetTokenExpires: { $gt: new Date() } });
  if (!user) return { error: "This reset link is invalid or has expired. Please request a new one." };

  await User.updateOne(
    { _id: user._id },
    { passwordHash: await hashPassword(parsed.data.password), $unset: { resetTokenHash: 1, resetTokenExpires: 1 } },
  );
  redirect("/login?reset=1");
}

// Accepts (and ignores) the useActionState arguments so it can back an <ActionForm>.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function resendVerificationAction(_state?: FormState, _fd?: FormData): Promise<FormState> {
  const s = await assertUser();
  const blocked = await limitAction("resend-verify", 3, 30 * 60_000);
  if (blocked) return blocked;
  await connectDB();
  const t = newToken();
  await User.updateOne({ _id: s.sub, emailVerifiedAt: { $exists: false } }, { verifyTokenHash: t.hash });
  await sendVerification(s.email, s.name, t.token);
  return { ok: true, message: "Verification email sent." };
}

export async function updateProfileAction(_: FormState, fd: FormData): Promise<FormState> {
  const s = await assertUser();
  const parsed = profileSchema.safeParse(formObject(fd));
  if (!parsed.success) return fieldErrors(parsed.error);
  const d = parsed.data;
  await connectDB();
  await User.updateOne(
    { _id: s.sub },
    { name: d.name, phone: d.phone || undefined, company: d.company || undefined, country: d.country, timezone: d.timezone, marketingConsent: d.marketing === "on" },
  );
  await startSession({ ...s, name: d.name });
  return { ok: true, message: "Profile saved." };
}

export async function changePasswordAction(_: FormState, fd: FormData): Promise<FormState> {
  const s = await assertUser();
  const blocked = await limitAction("change-password", 5, 15 * 60_000);
  if (blocked) return blocked;
  const parsed = changePasswordSchema.safeParse(formObject(fd));
  if (!parsed.success) return fieldErrors(parsed.error);

  await connectDB();
  const user = await User.findById(s.sub).select("+passwordHash");
  if (!user?.passwordHash || !(await verifyPassword(parsed.data.current, user.passwordHash))) {
    return { fields: { current: "Current password is incorrect." } };
  }
  user.passwordHash = await hashPassword(parsed.data.password);
  await user.save();
  return { ok: true, message: "Password updated." };
}
