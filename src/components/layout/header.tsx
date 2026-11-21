"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { mainNav } from "@/content/site";
import { ACCOUNT_HINT_COOKIE } from "@/lib/constants";
import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";

function readAccountHint(): { href: string } | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${ACCOUNT_HINT_COOKIE}=([^;]*)`));
  if (!m) return null;
  return { href: m[1] === "staff" ? "/admin" : "/dashboard" };
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [account, setAccount] = useState<{ href: string } | null>(null);

  // re-check on every navigation so sign-in / sign-out is reflected immediately
  useEffect(() => setAccount(readAccountHint()), [pathname]);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 border-b bg-white/85 backdrop-blur-md transition-[border-color,box-shadow]",
        scrolled || open ? "border-line shadow-[0_6px_24px_-18px_rgba(23,21,31,0.35)]" : "border-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between md:h-[72px]">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={clsx(
                "text-sm font-medium transition-colors hover:text-brand",
                isActive(item.href) ? "text-brand" : "text-ink/80",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <Link href={account ? account.href : "/login"} className="text-sm font-medium text-ink/80 hover:text-brand">
            {account ? "My Account" : "Log in"}
          </Link>
          <ButtonLink href="/get-a-quote">Get a Quote</ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-white lg:hidden">
          <div className="container flex flex-col py-4">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={clsx("border-b border-line/60 py-3 text-base font-medium", isActive(item.href) ? "text-brand" : "text-ink")}
              >
                {item.label}
              </Link>
            ))}
            <Link href={account ? account.href : "/login"} className="py-3 text-base font-medium text-ink">
              {account ? "My Account" : "Log in"}
            </Link>
            <ButtonLink href="/get-a-quote" className="mt-3">
              Get a Quote
            </ButtonLink>
          </div>
        </nav>
      )}
    </header>
  );
}
