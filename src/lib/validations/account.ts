import { z } from "zod";
import { COUNTRY_CODES } from "@/content/countries";

const password = z.string().min(8, "Use at least 8 characters").max(200);
const country = z
  .string()
  .trim()
  .toUpperCase()
  .refine((c) => COUNTRY_CODES.has(c), "Please select your country");
const timezone = z
  .string()
  .trim()
  .max(60)
  .refine((tz) => {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: tz });
      return true;
    } catch {
      return false;
    }
  }, "Please select a valid timezone");

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),
  password,
  country,
  timezone,
  privacy: z.literal("on", { errorMap: () => ({ message: "Please accept the privacy policy and terms" }) }),
  marketing: z.string().optional(),
  next: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),
  password: z.string().min(1, "Please enter your password").max(200),
  next: z.string().optional(),
});

export const forgotSchema = z.object({ email: z.string().trim().toLowerCase().email("Please enter a valid email") });

export const resetSchema = z
  .object({ token: z.string().min(10), password, confirm: z.string() })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords do not match" });

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().max(30).optional(),
  company: z.string().trim().max(150).optional(),
  country,
  timezone,
  marketing: z.string().optional(),
});

export const changePasswordSchema = z
  .object({ current: z.string().min(1, "Enter your current password"), password, confirm: z.string() })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords do not match" });
