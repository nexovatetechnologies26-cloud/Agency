// Display-currency helpers. Pure module, safe on client and server.
// Prices are always STORED and BILLED in the package's own currency;
// conversion is only for showing visitors an approximate local amount.

import { minorFactor } from "@/lib/money";

export const CURRENCY_COOKIE = "nx_currency"; // visitor's manual choice
export const COUNTRY_COOKIE = "nx_country"; // detected country (set by middleware on hosts that provide it)

/** Currencies offered in the switcher. */
export const DISPLAY_CURRENCIES = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "PKR", name: "Pakistani Rupee" },
  { code: "INR", name: "Indian Rupee" },
  { code: "AED", name: "UAE Dirham" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "QAR", name: "Qatari Riyal" },
  { code: "KWD", name: "Kuwaiti Dinar" },
  { code: "BDT", name: "Bangladeshi Taka" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "NZD", name: "New Zealand Dollar" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "MYR", name: "Malaysian Ringgit" },
  { code: "TRY", name: "Turkish Lira" },
  { code: "ZAR", name: "South African Rand" },
  { code: "NGN", name: "Nigerian Naira" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "CHF", name: "Swiss Franc" },
] as const;

const SUPPORTED = new Set<string>(DISPLAY_CURRENCIES.map((c) => c.code));
export const isDisplayCurrency = (c?: string | null): c is string => Boolean(c && SUPPORTED.has(c.toUpperCase()));

const EURO = ["AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK"];

/** ISO country → currency shown by default. Anything else falls back to USD. */
export const COUNTRY_CURRENCY: Record<string, string> = {
  ...Object.fromEntries(EURO.map((c) => [c, "EUR"])),
  US: "USD", PK: "PKR", IN: "INR", GB: "GBP", AE: "AED", SA: "SAR", QA: "QAR", KW: "KWD",
  BD: "BDT", CA: "CAD", AU: "AUD", NZ: "NZD", SG: "SGD", MY: "MYR", TR: "TRY", ZA: "ZAR",
  NG: "NGN", JP: "JPY", CH: "CHF",
};

/** A few time zones that reliably identify a country when no other signal exists. */
const TIMEZONE_COUNTRY: Record<string, string> = {
  "Asia/Karachi": "PK", "Asia/Kolkata": "IN", "Asia/Calcutta": "IN", "Europe/London": "GB", "Asia/Dubai": "AE",
  "Asia/Riyadh": "SA", "Asia/Qatar": "QA", "Asia/Kuwait": "KW", "Asia/Dhaka": "BD", "Asia/Singapore": "SG",
  "Asia/Kuala_Lumpur": "MY", "Europe/Istanbul": "TR", "Africa/Johannesburg": "ZA", "Africa/Lagos": "NG",
  "Asia/Tokyo": "JP", "Europe/Zurich": "CH", "Australia/Sydney": "AU", "Australia/Melbourne": "AU",
  "Pacific/Auckland": "NZ", "America/Toronto": "CA", "America/Vancouver": "CA",
};

export function currencyForCountry(country?: string | null) {
  return (country && COUNTRY_CURRENCY[country.toUpperCase()]) || null;
}

/** Best guess from the browser when the host didn't tell us the country. */
export function guessCountryFromBrowser(): string | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TIMEZONE_COUNTRY[tz]) return TIMEZONE_COUNTRY[tz];
    for (const lang of navigator.languages ?? [navigator.language]) {
      const region = lang?.split("-")[1];
      if (region && region.length === 2) return region.toUpperCase();
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** { code: "USD", amount: "1,499" } in the price's own currency — decimals only when it has cents. */
export function priceParts(minor: number, currency: string) {
  return { code: currency.toUpperCase(), amount: formatAmount(minor / minorFactor(currency), true) };
}

/** Rates are "units of currency per 1 USD". */
export type Rates = Record<string, number>;

/** Converts minor units between currencies; returns MAJOR units (e.g. 4512.4), or null if a rate is missing. */
export function convertToMajor(minor: number, from: string, to: string, rates: Rates | null): number | null {
  const major = minor / minorFactor(from);
  if (from === to) return major;
  const rFrom = from === "USD" ? 1 : rates?.[from];
  const rTo = to === "USD" ? 1 : rates?.[to];
  if (!rFrom || !rTo) return null;
  return (major / rFrom) * rTo;
}

/** Friendly rounding for approximate prices: no decimals, and rounded to a sensible step. */
export function roundForDisplay(value: number) {
  if (value >= 100_000) return Math.round(value / 1000) * 1000;
  if (value >= 10_000) return Math.round(value / 100) * 100;
  if (value >= 1_000) return Math.round(value / 10) * 10;
  return Math.round(value);
}

export function formatAmount(value: number, exact: boolean) {
  const whole = Number.isInteger(value);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: exact && !whole ? 2 : 0,
    maximumFractionDigits: exact && !whole ? 2 : 0,
  }).format(value);
}
