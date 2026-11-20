// Display helpers shared by server and client components. Pure module.

export function fmtDate(iso: string | Date | null | undefined, timeZone?: string) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone }).format(new Date(iso));
}

export function fmtDateTime(iso: string | Date | null | undefined, timeZone?: string) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone }).format(new Date(iso));
}

export function humanize(value: string) {
  return value.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}
