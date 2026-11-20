// Single source of truth for company details shown on the website.
// Only fill in verified information. Empty values are hidden automatically.

export const site = {
  name: "Nexovate",
  domain: "nexovate.solutions",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://nexovate.solutions").trim().replace(/\/+$/, ""),
  tagline: "Build • Automate • Market • Grow",
  positioning: "Your Global Digital & Technology Partner",
  description:
    "Nexovate is a full-service digital and technology agency helping businesses worldwide with custom software, web development, AI automation and digital growth.",
  contact: {
    email: (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "").trim(),
    whatsapp: (process.env.NEXT_PUBLIC_CONTACT_WHATSAPP ?? "").trim(), // international format, e.g. +923001234567
  },
  // Add verified profile URLs only, e.g. linkedin: "https://www.linkedin.com/company/nexovate"
  social: {
    linkedin: (process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? "").trim(),
    instagram: (process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? "").trim(),
    facebook: (process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? "").trim(),
    x: (process.env.NEXT_PUBLIC_SOCIAL_X ?? "").trim(),
  },
} as const;

export const mainNav = [
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
