import type { NextRequest } from "next/server";
import { z } from "zod";
import { AiUnavailableError, complete } from "@/server/lib/ai";
import { clientIp, rateLimit } from "@/server/lib/rate-limit";
import { fail, ok } from "@/server/lib/http";
import { buildKnowledgeBase } from "@/server/services/knowledge";

export const runtime = "nodejs";

const bodySchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(2000) }))
    .min(1)
    .max(20),
});

// POST /api/ai/chat — website assistant grounded in verified site content only.
export async function POST(req: NextRequest) {
  const limit = rateLimit(`ai:${clientIp(req.headers)}`, 20, 10 * 60_000);
  if (!limit.ok) return fail("RATE_LIMITED", "You're sending messages too quickly. Please wait a moment.", 429);

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("BAD_REQUEST", "Invalid message.", 400);
  if (parsed.data.messages[parsed.data.messages.length - 1].role !== "user") return fail("BAD_REQUEST", "Invalid message.", 400);

  try {
    const system = await buildKnowledgeBase();
    const reply = await complete(system, parsed.data.messages.slice(-10), 500);
    return ok({ reply });
  } catch (err) {
    if (!(err instanceof AiUnavailableError)) console.error("[ai/chat]", err);
    return fail("AI_UNAVAILABLE", "The assistant is unavailable right now. Please use the contact form and our team will help.", 503);
  }
}
