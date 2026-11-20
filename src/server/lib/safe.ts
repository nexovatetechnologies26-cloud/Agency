import "server-only";

/** Runs a read and falls back (logging the error) so public pages never crash on a DB outage. */
export async function safe<T>(fn: () => Promise<T>, fallback: T, label = "query"): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error(`[safe:${label}]`, err);
    return fallback;
  }
}
