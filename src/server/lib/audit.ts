import "server-only";
import { AuditLog } from "@/server/models/content.model";

/** Records who did what. Never store secrets or passwords in `detail`. */
export async function audit(actor: string, action: string, entity?: string, entityId?: string, detail?: string) {
  try {
    await AuditLog.create({ actor, action, entity, entityId, detail });
  } catch (err) {
    console.error("[audit] failed", err);
  }
}
