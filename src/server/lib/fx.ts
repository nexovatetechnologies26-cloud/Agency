import "server-only";
import type { Rates } from "@/lib/currency";

// Daily exchange rates for showing approximate local prices.
// Source: ExchangeRate-API open access (no key; attribution required — shown on the pricing page).
// Cached by Next.js for 12 hours, so visitors never trigger an API call.

export type FxData = { rates: Rates; updated: string | null };

export async function getRates(): Promise<FxData | null> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", { next: { revalidate: 43_200 } });
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: string; rates?: Rates; time_last_update_utc?: string };
    if (json.result !== "success" || !json.rates) return null;
    return { rates: json.rates, updated: json.time_last_update_utc ?? null };
  } catch (err) {
    console.error("[fx] rates unavailable — showing original currencies", err);
    return null;
  }
}
