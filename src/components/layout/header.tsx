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

const navItem =
  "group/nav relative inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[14px] font-medium text-white/85 transition-colors duration-200 hover:bg-white/10 hover:text-white";

/** Thin violet line that grows under a nav item on hover and stays under the current page. */
function NavUnderline() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-3.5 bottom-[3px] h-[2px] origin-left scale-x-0 rounded-full bg-lilac transition-transform duration-300 ease-out-cubic group-hover/nav:scale-x-100 group-[.is-active]/nav:scale-x-100"
    />
  );
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
      <div className="grid overflow-hidden rounded-3xl border border-brand/25 bg-surface shadow-lift lg:grid-cols-[1fr_260px]">
        <ul className="grid gap-1 p-4 sm:grid-cols-2">
          {publishedServices.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} onClick={onClose} className="group flex gap-3.5 rounded-2xl border border-transparent p-3 transition-colors hover:border-brand/25 hover:bg-brand-soft/60">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition-colors group-hover:bg-brand-deep">
                  <ServiceIcon name={s.icon} className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-semibold text-ink transition-colors group-hover:text-brand">{s.title}</span>
                  <span className="mt-0.5 line-clamp-1 block text-[13px] text-muted">{s.summary}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="relative hidden flex-col justify-between overflow-hidden border-l border-brand/20 bg-brand-soft/70 p-6 lg:flex">
          <span aria-hidden className="absolute left-0 top-0 h-[3px] w-16 bg-brand" />
          <div className="relative">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">Not sure where to start?</p>
            <p className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight text-ink">Tell us the goal. We&apos;ll recommend the right mix.</p>
          </div>
          <div className="relative space-y-3">
            <Link href="/book-consultation" onClick={onClose} className="flex items-center justify-between rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-deep">
              Book a free call <ArrowRight size={16} aria-hidden />
            </Link>
            <Link href="/services" onClick={onClose} className="flex items-center justify-between rounded-xl border border-brand/30 bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand">
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
        "sticky top-0 z-50 border-b border-white/10 bg-plum transition-shadow duration-300 ease-out-cubic",
        (scrolled || open) && "shadow-[0_10px_30px_-12px_rgba(42,27,61,0.45)]",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-6 md:h-[72px]">
        <Logo inverted />

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
                  className={clsx(navItem, (isActive(item.href) || menu) && "!bg-white/10 !text-lilac", isActive(item.href) && "is-active")}
                >
                  <NavUnderline />
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
                className={clsx(navItem, isActive(item.href) && "is-active !text-lilac")}
              >
                <NavUnderline />
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <CurrencySwitcher className="!text-[13px] !text-white/80 hover:!text-white [&_svg]:!text-white/60" />
          <Link
            href={account ? account.href : "/login"}
            className={clsx(
              "group/acc relative inline-flex h-10 items-center gap-2 rounded-full border pl-1.5 pr-4 text-[13px] font-semibold transition-colors duration-200",
              account ? "border-lilac/50 bg-white/10 text-lilac hover:border-lilac" : "border-white/20 bg-white/5 text-white/90 hover:border-lilac hover:bg-lilac hover:text-plum",
            )}
          >
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-colors group-hover/acc:bg-plum/10">
              <UserRound size={15} strokeWidth={1.9} aria-hidden />
              {account && <span aria-hidden className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-plum bg-lilac" />}
            </span>
            {account ? "My account" : "Login"}
          </Link>
          <ButtonLink href="/get-a-quote" variant="lilac" className="h-10 px-5 !text-[13px]">
            Start a project <ArrowRight size={15} aria-hidden className="transition-transform group-hover/btn:translate-x-0.5" />
          </ButtonLink>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-surface lg:hidden">
          <ul className="container py-4">
            {mainNav.map((item) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={clsx("group flex items-center justify-between py-4 font-display text-2xl font-semibold tracking-tight", isActive(item.href) ? "text-brand" : "text-ink hover:text-brand")}
                >
                  {item.label}
                  <ArrowRight size={18} aria-hidden className={clsx("transition-transform group-hover:translate-x-1", isActive(item.href) ? "text-brand" : "text-muted")} />
                </Link>
              </li>
            ))}
            <li className="border-b border-line">
              <Link href={account ? account.href : "/login"} className="flex items-center justify-between py-4 font-display text-2xl font-semibold tracking-tight text-ink">
                {account ? "My account" : "Login"}
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
