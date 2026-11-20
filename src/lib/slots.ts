// Consultation slot generation, timezone-aware, without external libraries.
// Times are stored in UTC; business hours are defined in the business timezone.
// Pure module.

/** Offset (minutes) of `timeZone` from UTC at the given instant. e.g. Asia/Karachi → 300 */
export function tzOffsetMinutes(instant: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return Math.round((asUtc - instant.getTime()) / 60000);
}

/** Wall-clock time in `timeZone` → UTC Date. */
export function zonedTimeToUtc(y: number, m: number, d: number, h: number, min: number, timeZone: string) {
  const guess = Date.UTC(y, m - 1, d, h, min);
  let offset = tzOffsetMinutes(new Date(guess), timeZone);
  let utc = guess - offset * 60000;
  // re-check once (handles DST boundaries)
  const offset2 = tzOffsetMinutes(new Date(utc), timeZone);
  if (offset2 !== offset) {
    offset = offset2;
    utc = guess - offset * 60000;
  }
  return new Date(utc);
}

/** Calendar date (y, m, d) of an instant as seen in `timeZone`. */
export function zonedDateParts(instant: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" }).formatToParts(instant);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return { y: Number(get("year")), m: Number(get("month")), d: Number(get("day")), weekday: weekdayMap[get("weekday")] };
}

export interface SlotConfig {
  timeZone: string; // business timezone, e.g. "Asia/Karachi"
  startHour: number; // 10
  endHour: number; // 18 (last slot ends at or before this)
  weekdays: number[]; // 0=Sun … 6=Sat
  slotMinutes: number; // 30
  daysAhead: number; // 14
  minNoticeMinutes: number; // 120
}

/** Returns available slot start times (UTC ISO strings). */
export function generateSlots(cfg: SlotConfig, now: Date, taken: Set<string> = new Set()) {
  const out: string[] = [];
  const earliest = now.getTime() + cfg.minNoticeMinutes * 60000;

  for (let i = 0; i <= cfg.daysAhead; i++) {
    const day = new Date(now.getTime() + i * 86400000);
    const { y, m, d, weekday } = zonedDateParts(day, cfg.timeZone);
    if (!cfg.weekdays.includes(weekday)) continue;

    for (let mins = cfg.startHour * 60; mins + cfg.slotMinutes <= cfg.endHour * 60; mins += cfg.slotMinutes) {
      const start = zonedTimeToUtc(y, m, d, Math.floor(mins / 60), mins % 60, cfg.timeZone);
      if (start.getTime() < earliest) continue;
      const iso = start.toISOString();
      if (!taken.has(iso) && !out.includes(iso)) out.push(iso);
    }
  }
  return out;
}

export function parseWeekdays(input: string | undefined, fallback = [1, 2, 3, 4, 5]) {
  if (!input) return fallback;
  const days = input
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isInteger(n) && n >= 0 && n <= 6);
  return days.length ? days : fallback;
}
