"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ArrowRight, ChevronDown, Menu, UserRound, X } from "lucide-react";
import { mainNav } from "@/content/site";
import { publishedServices } from "@/content/services";
import { ACCOUNT_HINT_COOKIE } from "@/lib/constants";
import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";
import { ServiceIcon } from "@/components/ui/service-icon";
import { CurrencySwitcher } from "@/components/currency/price";

/** Reads the non-secret "signed in" hint so public pages can stay static. */
function readAccountHint(): { href: string } | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${ACCOUNT_HINT_COOKIE}=([^;]*)`));
  if (!m) return null;
  return { href: m[1] === "staff" ? "/admin" : "/dashboard" };
}

/** Services mega-menu: every published service with its icon and one-line summary. */
function ServicesMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={clsx(
        "absolute left-1/2 top-full w-[min(920px,calc(100vw-2rem))] -translate-x-1/2 pt-3 transition duration-200 ease-out-cubic",
        open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
      )}
    >
      <div className="grid overflow-hidden rounded-3xl border border-line bg-white shadow-lift lg:grid-cols-[1fr_260px]">
        <ul className="grid gap-1 p-4 sm:grid-cols-2">
          {publishedServices.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} onClick={onClose} className="group flex gap-3.5 rounded-2xl p-3 transition-colors hover:bg-paper">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                  <ServiceIcon name={s.icon} className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-semibold text-ink">{s.title}</span>
                  <span className="mt-0.5 line-clamp-1 block text-[13px] text-muted">{s.summary}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="relative hidden flex-col justify-between overflow-hidden bg-ink p-6 text-white lg:flex">
          <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/50 blur-3xl" />
          <div className="relative">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50">Not sure where to start?</p>
            <p className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight">Tell us the goal. We&apos;ll recommend the right mix.</p>
          </div>
          <div className="relative space-y-3">
            <Link href="/book-consultation" onClick={onClose} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-brand-soft">
              Book a free call <ArrowRight size={16} aria-hidden />
            </Link>
            <Link href="/services" onClick={onClose} className="flex items-center justify-between rounded-xl border border-white/15 px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:border-white/40">
              All services <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [account, setAccount] = useState<{ href: string } | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setOpen(false);
    setMenu(false);
    setAccount(readAccountHint());
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMenu(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname.startsWith(href);
  const openMenu = () => {
    window.clearTimeout(closeTimer.current);
    setMenu(true);
  };
  const closeMenu = () => {
    closeTimer.current = window.setTimeout(() => setMenu(false), 120);
  };

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ease-out-cubic",
        scrolled || open ? "border-line bg-white/80 shadow-[0_1px_0_rgba(23,21,31,0.02)] backdrop-blur-xl" : "border-transparent bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-6 md:h-[72px]">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) =>
            item.href === "/services" ? (
              <div key={item.href} className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
                <button
                  type="button"
                  aria-expanded={menu}
                  aria-haspopup="true"
                  onClick={() => setMenu((v) => !v)}
                  onFocus={openMenu}
                  className={clsx(
                    "inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors hover:bg-ink/[0.04]",
                    isActive(item.href) ? "text-brand" : "text-ink/80 hover:text-ink",
                  )}
                >
                  {item.label}
                  <ChevronDown size={14} aria-hidden className={clsx("transition-transform duration-200", menu && "rotate-180")} />
                </button>
                <ServicesMenu open={menu} onClose={() => setMenu(false)} />
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={clsx(
                  "rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors hover:bg-ink/[0.04]",
                  isActive(item.href) ? "text-brand" : "text-ink/80 hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <CurrencySwitcher className="!text-[13px]" />
          <Link
            href={account ? account.href : "/login"}
            aria-label={account ? "My account" : "Log in"}
            title={account ? "My account" : "Log in"}
            className={clsx(
              "relative flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-200",
              account ? "border-brand/30 bg-brand-soft text-brand hover:border-brand" : "border-line bg-white text-ink/70 hover:border-ink hover:text-ink",
            )}
          >
            <UserRound size={17} strokeWidth={1.75} aria-hidden />
            {account && <span aria-hidden className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand" />}
          </Link>
          <ButtonLink href="/get-a-quote" variant="dark" className="h-10 px-5 !text-[13px]">
            Start a project <ArrowRight size={15} aria-hidden className="transition-transform group-hover/btn:translate-x-0.5" />
          </ButtonLink>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-white lg:hidden">
          <ul className="container py-4">
            {mainNav.map((item) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={clsx("flex items-center justify-between py-4 font-display text-2xl font-semibold tracking-tight", isActive(item.href) ? "text-brand" : "text-ink")}
                >
                  {item.label}
                  <ArrowRight size={18} aria-hidden className="text-muted" />
                </Link>
              </li>
            ))}
            <li className="border-b border-line">
              <Link href={account ? account.href : "/login"} className="flex items-center justify-between py-4 font-display text-2xl font-semibold tracking-tight text-ink">
                {account ? "My account" : "Client login"}
                <UserRound size={18} aria-hidden className="text-muted" />
              </Link>
            </li>
            <li className="flex items-center justify-between border-b border-line py-4">
              <span className="text-[15px] text-muted">Currency</span>
              <CurrencySwitcher />
            </li>
            <li className="grid gap-3 pt-6">
              <ButtonLink href="/get-a-quote" size="lg" className="w-full">
                Start a project
              </ButtonLink>
              <ButtonLink href="/book-consultation" size="lg" variant="secondary" className="w-full">
                Book a free call
              </ButtonLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
