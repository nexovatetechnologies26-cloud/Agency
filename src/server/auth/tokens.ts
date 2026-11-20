import "server-only";
import { createHash, randomBytes } from "crypto";

// One-time tokens (email verification, password reset, proposal links).
// Only the SHA-256 hash is stored in the database.

export function newToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashToken(token) };
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
