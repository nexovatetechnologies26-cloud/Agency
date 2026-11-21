import { connectDB } from "@/server/db/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/health — deployment check. Reports only yes/no flags, never values or secrets.
export async function GET() {
  const uri = (process.env.MONGODB_URI ?? "").trim();
  const secret = process.env.AUTH_SECRET ?? "";
  const checks = {
    MONGODB_URI_set: Boolean(uri) && !uri.includes("<user>"),
    AUTH_SECRET_ok: secret.length >= 32,
    NEXT_PUBLIC_SITE_URL_set: Boolean((process.env.NEXT_PUBLIC_SITE_URL ?? "").trim()),
    database: "not checked" as "connected" | "unreachable" | "not checked",
    database_hint: undefined as string | undefined,
  };

  if (checks.MONGODB_URI_set) {
    try {
      const conn = await connectDB();
      await conn.connection.db?.admin().ping();
      checks.database = "connected";
    } catch (err) {
      checks.database = "unreachable";
      const msg = err instanceof Error ? err.message : String(err);
      // a short, safe classification — no hostnames or credentials
      checks.database_hint = /whitelist|IP|ServerSelection|timed out|ECONNREFUSED|ENOTFOUND/i.test(msg)
        ? "Atlas did not accept the connection — allow 0.0.0.0/0 in Atlas → Network Access, and check the cluster address in MONGODB_URI."
        : /auth|password|credentials/i.test(msg)
          ? "Atlas rejected the username or password in MONGODB_URI."
          : "Could not connect — see the deploy logs for [health] details.";
      console.error("[health] database check failed", err);
    }
  }

  const ok = checks.MONGODB_URI_set && checks.AUTH_SECRET_ok && checks.database === "connected";
  return Response.json({ ok, ...checks }, { status: ok ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
