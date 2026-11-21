"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { mainNav } from "@/content/site";
import { ACCOUNT_HINT_COOKIE } from "@/lib/constants";
import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";

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
      <div className="container flex h-[72px] items-center justify-between md:h-20">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-10 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={clsx("link-underline !text-[15px]", isActive(item.href) && "text-brand")}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href="/get-a-quote" size="lg">
            Start a Project
          </ButtonLink>
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
                {account ? "My account" : "Client login"}
              </Link>
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
