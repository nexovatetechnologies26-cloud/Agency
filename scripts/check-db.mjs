// Checks that .env.local is filled in and MongoDB Atlas is reachable.
// Run: npm run db:check
import nextEnv from "@next/env";
import mongoose from "mongoose";

nextEnv.loadEnvConfig(process.cwd(), false, { info() {}, error: console.error });

const uri = (process.env.MONGODB_URI ?? "").trim();
const secret = process.env.AUTH_SECRET ?? "";

if (!uri || uri.includes("<user>") || uri.includes("<password>") || uri.includes("<cluster>")) {
  console.error("✖ MONGODB_URI is not set. Paste your Atlas connection string into .env.local.");
  process.exit(1);
}
if (secret.length < 32) {
  console.error("✖ AUTH_SECRET must be at least 32 characters.");
  process.exit(1);
}

try {
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || "nexovate", serverSelectionTimeoutMS: 10_000 });
  await mongoose.connection.db.admin().ping();
  const hello = await mongoose.connection.db.admin().command({ hello: 1 });
  console.log(`✔ Connected to MongoDB (database "${mongoose.connection.name}").`);
  console.log(hello.setName ? "✔ Replica set detected — orders, proposals and payments (transactions) will work." : "⚠ Not a replica set — checkout and proposals need transactions. Use MongoDB Atlas.");
  console.log(`\nNext: npm run dev, then sign in at http://localhost:3000/login with ADMIN_EMAIL / ADMIN_PASSWORD from .env.local.`);
  await mongoose.disconnect();
} catch (err) {
  console.error("✖ Could not connect:", err.message);
  console.error("  Check the username/password in the URI, and in Atlas → Network Access allow your IP (or 0.0.0.0/0).");
  process.exit(1);
}
