import "server-only";
import { parseWeekdays, type SlotConfig } from "@/lib/slots";

// Reads server configuration from environment variables in one place.
// Features without configuration stay switched off instead of pretending to work.

const env = (k: string) => (process.env[k] ?? "").trim();

export const config = {
  siteUrl: (env("NEXT_PUBLIC_SITE_URL") || "http://localhost:3000").replace(/\/+$/, ""),

  email: {
    resendKey: env("RESEND_API_KEY"),
    from: env("EMAIL_FROM") || "Nexovate <no-reply@nexovate.solutions>",
    notify: env("ADMIN_NOTIFY_EMAIL"),
    get enabled() {
      return Boolean(this.resendKey);
    },
  },

  ai: {
    provider: (env("AI_PROVIDER") || "anthropic") as "anthropic" | "openai",
    apiKey: env("AI_API_KEY"),
    model: env("AI_MODEL"),
    get enabled() {
      return Boolean(this.apiKey && this.model);
    },
  },

  // Manual bank transfer instructions shown to customers after checkout.
  // Leave empty until you have a verified account — no payment option is shown then.
  payment: {
    manualInstructions: env("PAYMENT_MANUAL_INSTRUCTIONS").replace(/\\n/g, "\n"),
  },

  booking: {
    durationMinutes: Number(env("BOOKING_SLOT_MINUTES")) || 30,
    meetingLink: env("BOOKING_MEETING_LINK"),
    slots(): SlotConfig {
      return {
        timeZone: env("BOOKING_TIMEZONE") || "Asia/Karachi",
        startHour: Number(env("BOOKING_START_HOUR")) || 10,
        endHour: Number(env("BOOKING_END_HOUR")) || 18,
        weekdays: parseWeekdays(env("BOOKING_WEEKDAYS")),
        slotMinutes: Number(env("BOOKING_SLOT_MINUTES")) || 30,
        daysAhead: Number(env("BOOKING_DAYS_AHEAD")) || 14,
        minNoticeMinutes: Number(env("BOOKING_MIN_NOTICE_MINUTES")) || 240,
      };
    },
  },
};
