"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Cards on every page (site, dashboard, admin) — the shared .card style plus
// components that opt in with data-card.
const CARD = "main .card, main [data-card]";
const STAGGER_MS = 90;
const MAX_STEPS = 6; // a long grid never waits more than ~0.5s for its last card

/** Position of a card within its grid, so cards in a row arrive one after another. */
function gridIndex(el: HTMLElement) {
  const item = el.parentElement?.tagName === "LI" ? el.parentElement : el;
  const siblings = item.parentElement ? Array.from(item.parentElement.children) : [item];
  return Math.max(0, siblings.indexOf(item));
}

/**
 * Scroll reveal, in both directions:
 * - Cards fade up one by one (staggered by their position in the grid), every time
 *   they enter the viewport — scrolling down or back up. On page load, the cards
 *   already on screen also arrive one by one.
 * - Sections without cards fade up as a whole.
 * - Leaving through the top resets an element to come back from above, leaving
 *   through the bottom resets it to come back from below.
 * Elements that animate themselves (.reveal) are left alone, and visitors who
 * prefer reduced motion see everything immediately (globals.css).
 */
export function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const show = (el: HTMLElement) => {
      const step = el.dataset.motion === "card" ? Math.min(gridIndex(el), MAX_STEPS) : 0;
      el.style.transitionDelay = `${step * STAGGER_MS}ms`;
      el.dataset.reveal = "shown";
      // clear the stagger once the card has arrived, so hover effects respond instantly
      window.setTimeout(() => {
        if (el.dataset.reveal === "shown") el.style.transitionDelay = "";
      }, step * STAGGER_MS + 750);
    };
    const hide = (el: HTMLElement, top: number) => {
      el.style.transitionDelay = "0ms";
      el.dataset.reveal = top < 0 ? "above" : "below";
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) show(el);
          else hide(el, e.boundingClientRect.top);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0 },
    );

    const skip = (el: HTMLElement) => el.closest(".reveal") || el.closest("[aria-busy='true']");

    const register = (el: HTMLElement, kind: "card" | "section") => {
      if (skip(el)) {
        el.dataset.reveal = "skip";
        return;
      }
      el.dataset.motion = kind;
      const r = el.getBoundingClientRect();
      const onScreen = r.top < window.innerHeight && r.bottom > 0;
      if (onScreen && kind === "section") {
        el.dataset.reveal = "shown"; // headings and text on screen are never hidden
      } else if (onScreen) {
        // cards on screen at load: start hidden, then arrive one by one
        el.dataset.reveal = "below";
        requestAnimationFrame(() => requestAnimationFrame(() => show(el)));
      } else {
        el.dataset.reveal = r.top < 0 ? "above" : "below";
      }
      io.observe(el);
    };

    const scan = () => {
      document.querySelectorAll<HTMLElement>(`${CARD}`).forEach((el) => {
        if (!el.dataset.reveal) register(el, "card");
      });
      // anything a previous page's observer registered (possible during a client-side
      // navigation) is re-attached here, so it can never stay hidden
      document.querySelectorAll<HTMLElement>("main [data-motion]").forEach((el) => {
        if (el.dataset.reveal !== "skip") io.observe(el);
      });
      document.querySelectorAll<HTMLElement>("main section:not([data-reveal])").forEach((el) => {
        // sections holding cards stay put — their cards animate instead
        if (el.querySelector(".card, [data-card], .reveal")) {
          el.dataset.reveal = "skip";
          return;
        }
        register(el, "section");
      });
    };

    scan();
    // batch DOM changes into at most one scan per frame (count-ups change text every frame)
    let queued = 0;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        scan();
      });
    });
    // observe the body: the <main> element itself can be swapped during a navigation
    mo.observe(document.body, { childList: true, subtree: true });

    const revealOnScreen = () => {
      document.querySelectorAll<HTMLElement>('main [data-reveal="below"], main [data-reveal="above"]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) show(el);
      });
    };
    const safety = window.setTimeout(revealOnScreen, 900);

    return () => {
      io.disconnect();
      mo.disconnect();
      window.clearTimeout(safety);
      if (queued) cancelAnimationFrame(queued);
      // leave nothing hidden behind for the next page's observer
      document.querySelectorAll<HTMLElement>('main [data-reveal="below"], main [data-reveal="above"]').forEach((el) => {
        el.style.transitionDelay = "";
        el.dataset.reveal = "shown";
      });
    };
  }, [pathname]);

  return null;
}
