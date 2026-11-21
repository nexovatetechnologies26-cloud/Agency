"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a figure up from 0 the first time it scrolls into view.
 * Works with admin-entered strings like "50+", "24h", "1.5k", "$2M", "98%":
 * the number animates, the prefix/suffix stay as typed. Non-numeric values
 * (and visitors who prefer reduced motion) simply show the final text.
 */
export function CountUp({ value, duration = 1600 }: { value: string; duration?: number }) {
  // animate plain figures only: "50+", "$2M", "98%" — not "Since 2019" or "24/7"
  const raw = value.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  const match = raw && !/[a-z]/i.test(raw[1]) && !/^\s*\/|\d/.test(raw[3]) ? raw : null;
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!match) return;
    const [, prefix, numText, suffix] = match;
    const target = Number(numText.replace(/,/g, ""));
    const decimals = numText.includes(".") ? numText.split(".")[1].length : 0;
    const useCommas = numText.includes(",");
    const fmt = (n: number) =>
      prefix + (useCommas ? n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : n.toFixed(decimals)) + suffix;

    const el = ref.current;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!el || reduce || !Number.isFinite(target) || typeof IntersectionObserver === "undefined") return;

    setDisplay(fmt(0));
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3); // ease-out-cubic
          setDisplay(fmt(t === 1 ? target : target * eased));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per value
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums" aria-label={value}>
      <span aria-hidden>{display}</span>
    </span>
  );
}
