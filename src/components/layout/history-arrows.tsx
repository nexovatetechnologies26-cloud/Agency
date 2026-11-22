"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

type NavigationApi = EventTarget & { canGoBack?: boolean; canGoForward?: boolean };

/**
 * Back / forward buttons for the dashboard and admin top bar.
 * Uses the browser history, so it behaves exactly like the browser's own arrows.
 * Where the Navigation API exists (Chrome, Edge) the buttons dim when there is
 * nowhere to go; elsewhere they stay enabled.
 */
export function HistoryArrows({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [can, setCan] = useState({ back: true, forward: true });

  useEffect(() => {
    const nav = (window as unknown as { navigation?: NavigationApi }).navigation;
    const update = () => {
      if (nav && typeof nav.canGoBack === "boolean") {
        setCan({ back: nav.canGoBack, forward: Boolean(nav.canGoForward) });
      } else {
        setCan({ back: window.history.length > 1, forward: true });
      }
    };
    update();
    nav?.addEventListener("currententrychange", update);
    return () => nav?.removeEventListener("currententrychange", update);
  }, [pathname]);

  const btn =
    tone === "dark"
      ? "flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:border-lilac hover:bg-lilac hover:text-plum disabled:pointer-events-none disabled:opacity-30"
      : "flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink/70 transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand disabled:pointer-events-none disabled:opacity-35";

  return (
    <div className={`flex items-center gap-1.5 print:hidden ${className ?? ""}`}>
      <button type="button" onClick={() => router.back()} disabled={!can.back} aria-label="Go back" title="Back" className={btn}>
        <ArrowLeft size={tone === "dark" ? 15 : 16} strokeWidth={2} aria-hidden />
      </button>
      <button type="button" onClick={() => router.forward()} disabled={!can.forward} aria-label="Go forward" title="Forward" className={btn}>
        <ArrowRight size={tone === "dark" ? 15 : 16} strokeWidth={2} aria-hidden />
      </button>
    </div>
  );
}
