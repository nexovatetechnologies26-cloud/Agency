import "server-only";
import { config } from "@/server/config";

// Provider-agnostic AI call (Anthropic or OpenAI), server-side only.
// API keys never reach the browser.

export type ChatMessage = { role: "user" | "assistant"; content: string };

export class AiUnavailableError extends Error {}

export async function complete(system: string, messages: ChatMessage[], maxTokens = 600): Promise<string> {
  if (!config.ai.enabled) throw new AiUnavailableError("AI is not configured");
  const { provider, apiKey, model } = config.ai;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);

  try {
    if (provider === "openai") {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        signal: controller.signal,
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: "system", content: system }, ...messages] }),
      });
      if (!res.ok) throw new AiUnavailableError(`OpenAI error ${res.status}`);
      const json = await res.json();
      return String(json.choices?.[0]?.message?.content ?? "").trim();
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "Content-Type": "application/json" },
      body: JSON.stringify({ model, max_tokens: maxTokens, system, messages }),
    });
    if (!res.ok) throw new AiUnavailableError(`Anthropic error ${res.status}`);
    const json = await res.json();
    return (json.content ?? [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("")
      .trim();
  } finally {
    clearTimeout(timer);
  }
}
