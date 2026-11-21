"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";

/**
 * Fade-up 24px over 600ms (ease-out-cubic), triggered once when scrolled into view.
 * Use `index` for the 80ms stagger between siblings. Disabled for reduced motion (globals.css).
 */
export function Reveal({
  as: Tag = "div",
  index = 0,
  className,
  children,
}: {
  as?: "div" | "li" | "section" | "figure" | "p";
  index?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.dataset.shown = "true";
      return;
    }
    // animates every time it enters — scrolling down or back up
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.shown = "true";
        } else {
          el.dataset.shown = "false";
          el.dataset.from = entry.boundingClientRect.top < 0 ? "above" : "below";
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic element
    <Tag ref={ref as any} className={clsx("reveal", className)} style={index ? { transitionDelay: `${index * 80}ms` } : undefined}>
      {children}
    </Tag>
  );
}
