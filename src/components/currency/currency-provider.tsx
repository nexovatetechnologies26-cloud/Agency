"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  COUNTRY_COOKIE,
  CURRENCY_COOKIE,
  convertToMajor,
  currencyForCountry,
  formatAmount,
  guessCountryFromBrowser,
  isDisplayCurrency,
  priceParts,
  roundForDisplay,
  type Rates,
} from "@/lib/currency";

type Ctx = { currency: string | null; rates: Rates | null; setCurrency: (c: string) => void };
const CurrencyContext = createContext<Ctx>({ currency: null, rates: null, setCurrency: () => {} });

const readCookie = (name: string) => document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1] ?? null;

/**
 * Decides the visitor's display currency:
 *   1. their own choice from the switcher (cookie)
 *   2. the country the host reported (cookie set by middleware)
 *   3. browser time zone / language
 *   4. otherwise prices stay in their original currency
 */
export function CurrencyProvider({ rates, children }: { rates: Rates | null; children: React.ReactNode }) {
  const [currency, setState] = useState<string | null>(null);

  useEffect(() => {
    const chosen = readCookie(CURRENCY_COOKIE);
    if (isDisplayCurrency(chosen)) return setState(chosen);
    const detected = currencyForCountry(readCookie(COUNTRY_COOKIE)) ?? currencyForCountry(guessCountryFromBrowser());
    setState(detected ?? "USD");
  }, []);

  const setCurrency = useCallback((c: string) => {
    setState(c);
    document.cookie = `${CURRENCY_COOKIE}=${c}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  }, []);

  return <CurrencyContext.Provider value={{ currency, rates, setCurrency }}>{children}</CurrencyContext.Provider>;
}

export const useCurrency = () => useContext(CurrencyContext);

/**
 * Price in the visitor's currency. Falls back to the original price when no rate
 * is available or before the visitor's currency is known (no layout shift: same shape).
 */
export function useDisplayPrice(minor: number, from: string) {
  const { currency, rates } = useCurrency();
  const original = priceParts(minor, from);
  if (!currency || currency === from) return { ...original, converted: false, original };
  const value = convertToMajor(minor, from, currency, rates);
  if (value == null) return { ...original, converted: false, original };
  return { code: currency, amount: formatAmount(roundForDisplay(value), false), converted: true, original };
}
