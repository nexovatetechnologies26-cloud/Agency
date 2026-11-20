// Promotes an existing account to Super Admin.
// Usage: npm run make-admin                 (uses ADMIN_EMAIL from .env.local)
//        npm run make-admin -- someone@x.com
// The account keeps its current password.
import nextEnv from "@next/env";
import mongoose from "mongoose";

nextEnv.loadEnvConfig(process.cwd(), false, { info() {}, error: console.error });

const email = (process.argv[2] || process.env.ADMIN_EMAIL || "").trim().toLowerCase();
const uri = (process.env.MONGODB_URI ?? "").trim();

if (!email) {
  console.error("✖ No email given. Set ADMIN_EMAIL in .env.local or run: npm run make-admin -- you@example.com");
  process.exit(1);
}
if (!uri || uri.includes("<user>")) {
  console.error("✖ MONGODB_URI is not set in .env.local.");
  process.exit(1);
}

await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || "nexovate", serverSelectionTimeoutMS: 15_000 });
const users = mongoose.connection.db.collection("users");
const user = await users.findOne({ email });

if (!user) {
  console.error(`✖ No account found for ${email}. Register it on the website first, or just sign in at /login with ADMIN_EMAIL / ADMIN_PASSWORD.`);
  await mongoose.disconnect();
  process.exit(1);
}

await users.updateOne(
  { _id: user._id },
  { $set: { role: "super_admin", active: true, emailVerifiedAt: user.emailVerifiedAt ?? new Date(), updatedAt: new Date() } },
);
await mongoose.connection.db.collection("auditlogs").insertOne({
  actor: "cli:make-admin",
  action: "role_changed",
  entity: "user",
  entityId: String(user._id),
  detail: `${user.role} → super_admin`,
  createdAt: new Date(),
});

console.log(`✔ ${email} is now Super Admin (was: ${user.role}).`);
console.log("  Sign out and sign in again at /login — you'll land on the Admin Dashboard.");
await mongoose.disconnect();
