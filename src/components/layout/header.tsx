"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { UserRound } from "lucide-react";
import { mainNav } from "@/content/site";
import { ACCOUNT_HINT_COOKIE } from "@/lib/constants";
import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";
import { CurrencySwitcher } from "@/components/currency/price";

/** Reads the non-secret "signed in" hint so public pages can stay static. */
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

  useEffect(() => {
    setOpen(false);
    setAccount(readAccountHint());
  }, [pathname]);

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

  const isActive = (href: string) => pathname.startsWith(href);
  const solid = scrolled || open;

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 border-b transition-colors duration-300 ease-out-cubic",
        solid ? "border-line bg-paper" : "border-transparent bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-8 md:h-[68px]">
        <Logo />

        <div className="ml-auto hidden items-center gap-7 lg:flex xl:gap-9">
        <nav aria-label="Main" className="flex items-center gap-6 xl:gap-7">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={clsx("link-underline !text-[14px]", isActive(item.href) && "text-brand")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <span aria-hidden className="h-4 w-px bg-line" />
          <CurrencySwitcher className="!text-[14px]" />
          <Link
            href={account ? account.href : "/login"}
            aria-label={account ? "My account" : "Log in"}
            title={account ? "My account" : "Log in"}
            className={clsx(
              "relative flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-200",
              account ? "border-brand/30 bg-brand-soft text-brand hover:border-brand" : "border-line text-ink/70 hover:border-ink hover:text-ink",
            )}
          >
            <UserRound size={17} strokeWidth={1.75} aria-hidden />
            {account && <span aria-hidden className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-paper bg-brand" />}
          </Link>
          <ButtonLink href="/get-a-quote" size="md" className="h-9 px-4 !text-[13px]">
            Start a Project
          </ButtonLink>
        </div>
        </div>

        <button
          type="button"
          className="text-[15px] font-medium text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-paper lg:hidden">
          <ul className="container py-6">
            {mainNav.map((item) => (
              <li key={item.href} className="border-b border-line">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={clsx("block py-4 font-serif text-3xl", isActive(item.href) ? "text-brand" : "text-ink")}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="border-b border-line">
              <Link href={account ? account.href : "/login"} className="block py-4 font-serif text-3xl text-ink">
                {account ? "My Account" : "Log in"}
              </Link>
            </li>
            <li className="flex items-center justify-between border-b border-line py-4">
              <span className="text-[15px] text-muted">Currency</span>
              <CurrencySwitcher />
            </li>
            <li className="pt-8">
              <ButtonLink href="/get-a-quote" size="lg" className="w-full">
                Start a Project
              </ButtonLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
