import { z } from "zod";
import { BUDGET_RANGES, CONTACT_METHODS, LEAD_STATUSES, LEAD_TYPES, TIMELINES } from "@/lib/constants";
import { COUNTRY_CODES } from "@/content/countries";

// Shared by the browser form (instant feedback) and the API (source of truth).

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

export const leadInputSchema = z.object({
  type: z.enum(LEAD_TYPES).default("contact"),
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().toLowerCase().email("Please enter a valid email").max(200),
  country: z
    .string()
    .trim()
    .toUpperCase()
    .refine((c) => COUNTRY_CODES.has(c), "Please select your country"),
  phone: optionalText(30).refine((v) => !v || /^\+?[0-9\s\-()]{6,30}$/.test(v), "Please enter a valid phone number"),
  company: optionalText(150),
  website: optionalText(300),
  service: optionalText(100),
  budget: z.enum(BUDGET_RANGES).optional(),
  timeline: z.enum(TIMELINES).optional(),
  preferredContact: z.enum(CONTACT_METHODS).default("email"),
  message: z.string().trim().min(10, "Please tell us a bit more (at least 10 characters)").max(5000),
  marketingConsent: z.boolean().default(false),
  privacyAccepted: z.literal(true, { errorMap: () => ({ message: "Please accept the privacy policy" }) }),
  // attribution (filled automatically on the client)
  utm: z
    .object({
      source: optionalText(100),
      medium: optionalText(100),
      campaign: optionalText(150),
      term: optionalText(150),
      content: optionalText(150),
    })
    .partial()
    .optional(),
  referrer: optionalText(500),
  landingPage: optionalText(500),
  // honeypot — real users never fill this
  companyFax: z.string().max(0).optional(),
}).superRefine((d, ctx) => {
  if (d.type === "quote" && !d.service) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["service"], message: "Please select a service" });
  }
});

export type LeadInput = z.input<typeof leadInputSchema>;
export type LeadData = z.output<typeof leadInputSchema>;

export const leadStatusUpdateSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  note: z.string().trim().min(1).max(2000).optional(),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});
