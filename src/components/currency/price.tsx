"use client";

import clsx from "clsx";
import { DISPLAY_CURRENCIES } from "@/lib/currency";
import { useCurrency, useDisplayPrice } from "@/components/currency/currency-provider";

/** Large price for pricing cards, in the visitor's currency, with the billed amount underneath. */
export function PriceFigure({ minor, currency, monthly, featured }: { minor: number; currency: string; monthly?: boolean; featured?: boolean }) {
  const p = useDisplayPrice(minor, currency);
  return (
    <>
      <p className="mt-2 flex items-baseline gap-1.5 whitespace-nowrap">
        <span className="text-sm font-semibold text-muted">{p.code}</span>
        <span className={clsx("font-serif text-[3.25rem] leading-none tracking-[-0.02em]", featured ? "text-brand" : "text-ink")}>
          {p.converted && <span className="mr-0.5 align-top text-[1.6rem] text-muted">≈</span>}
          {p.amount}
        </span>
        {monthly && <span className="text-sm font-medium text-muted">/mo</span>}
      </p>
      {p.converted && (
        <p className="mt-2 text-xs text-muted">
          Billed in {p.original.code} {p.original.amount}
          {monthly ? "/mo" : ""} · approx. at today&apos;s rate
        </p>
      )}
    </>
  );
}

/** Compact price for "Starting from" lines. */
export function PriceInline({ minor, currency, monthly }: { minor: number; currency: string; monthly?: boolean }) {
  const p = useDisplayPrice(minor, currency);
  return (
    <span className="whitespace-nowrap" title={p.converted ? `Billed in ${p.original.code} ${p.original.amount}` : undefined}>
      <span className="text-xs font-semibold text-muted">{p.code}</span>{" "}
      <span className="font-serif text-[1.9rem] text-ink">
        {p.converted && <span className="text-[1.2rem] text-muted">≈</span>}
        {p.amount}
      </span>
      {monthly && <span className="ml-1 text-xs font-medium text-muted">/mo</span>}
    </span>
  );
}

/**
 * Header currency switcher — shows just the code ("USD ▾") like a nav link.
 * A native <select> sits invisibly on top, so it stays fully keyboard and screen-reader accessible.
 */
export function CurrencySwitcher({ className }: { className?: string }) {
  const { currency, rates, setCurrency } = useCurrency();
  if (!rates) return null; // no live rates → nothing to switch
  const code = currency ?? "USD";
  return (
    <label className={clsx("group/cur relative inline-flex cursor-pointer items-center gap-1 text-[15px] font-medium text-ink/70 transition-colors hover:text-ink", className)}>
      <span aria-hidden>{code}</span>
      <svg aria-hidden viewBox="0 0 10 6" className="h-1.5 w-2.5 text-muted transition-colors group-hover/cur:text-ink" fill="none" stroke="currentColor" strokeWidth={1.4}>
        <path d="m1 1 4 4 4-4" />
      </svg>
      <select
        aria-label="Display currency"
        value={code}
        onChange={(e) => setCurrency(e.target.value)}
        className="absolute inset-0 cursor-pointer appearance-none opacity-0"
      >
        {DISPLAY_CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code} — {c.name}
          </option>
        ))}
      </select>
    </label>
  );
}
