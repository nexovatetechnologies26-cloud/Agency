import Link from "next/link";
import clsx from "clsx";
import { ArrowUpRight, ExternalLink, LogOut } from "lucide-react";
import { logoutAction } from "@/server/actions/auth";
import { Logo } from "@/components/layout/logo";
import { NavLink } from "@/components/layout/nav-link";
import { SiteMotion } from "@/components/ui/site-motion";

export type ShellNavItem = { label: string; href: string; exact?: boolean; group?: string };

/** Shared frame for the customer dashboard and the admin panel. */
export function AppShell({
  nav,
  badge,
  user,
  children,
}: {
  nav: ShellNavItem[];
  badge: string;
  user: { name: string; email: string };
  children: React.ReactNode;
}) {
  const initial = (user.name || user.email).trim().charAt(0).toUpperCase();
  // keep order, bucket consecutive items by group label
  const groups: { label?: string; items: ShellNavItem[] }[] = [];
  for (const n of nav) {
    const last = groups[groups.length - 1];
    if (last && last.label === n.group) last.items.push(n);
    else groups.push({ label: n.group, items: [n] });
  }

  return (
    <div className="min-h-screen bg-paper print:bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-line bg-white/85 backdrop-blur-xl print:hidden">
        <div className="flex h-16 items-center justify-between gap-4 px-5 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Logo />
            <span className="truncate rounded-full border border-brand/20 bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-brand">{badge}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="hidden items-center gap-1.5 text-muted transition hover:text-brand sm:inline-flex">
              View website <ExternalLink size={13} aria-hidden />
            </Link>
            <span className="hidden h-6 w-px bg-line md:block" aria-hidden />
            <div className="hidden items-center gap-2.5 md:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-deep text-xs font-bold text-white" aria-hidden>
                {initial}
              </span>
              <span className="leading-tight">
                <span className="block max-w-[200px] truncate font-semibold text-ink">{user.name || user.email}</span>
                <span className="block max-w-[200px] truncate text-xs text-muted" title={user.email}>{user.email}</span>
              </span>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-medium text-ink/80 transition hover:border-brand hover:text-brand"
              >
                <LogOut size={15} aria-hidden /> Sign out
              </button>
            </form>
          </div>
        </div>
        {/* mobile nav */}
        <nav aria-label="Section" className="flex gap-1 overflow-x-auto border-t border-line px-3 py-2 lg:hidden">
          {nav.map((n) => (
            <NavLink key={n.href} href={n.href} exact={n.exact} variant="pill">{n.label}</NavLink>
          ))}
        </nav>
      </header>
      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col overflow-y-auto border-r border-line bg-white px-4 py-5 lg:flex print:hidden">
          <nav aria-label="Section" className="flex-1 space-y-6">
            {groups.map((g, gi) => (
              <div key={g.label ?? `g${gi}`}>
                {g.label && <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted/80">{g.label}</p>}
                <div className="flex flex-col gap-0.5">
                  {g.items.map((n) => (
                    <NavLink key={n.href} href={n.href} exact={n.exact}>{n.label}</NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          {badge === "Client" && <Link
            href="/book-consultation"
            className="mt-6 block rounded-2xl bg-ink p-4 text-white transition-colors hover:bg-brand-deep"
          >
            <p className="text-sm font-semibold">Need a hand?</p>
            <p className="mt-1 text-xs leading-relaxed text-white/60">Book a call with the Nexovate team.</p>
          </Link>}
        </aside>
        <SiteMotion />
        <main id="main" className="min-w-0 flex-1 px-5 py-8 lg:px-10 lg:py-10 print:p-0">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end print:hidden">
      <div className="min-w-0">
        <h1 className="text-[1.75rem] tracking-[-0.03em] md:text-[2rem]">{title}</h1>
        {description && <p className="mt-1 break-words text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Stat({ label, value, href, tone = "default" }: { label: string; value: React.ReactNode; href?: string; tone?: "default" | "brand" | "dark" }) {
  const dark = tone === "dark";
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className={clsx("text-[13px] font-medium", dark ? "text-white/60" : "text-muted")}>{label}</p>
        {href && <ArrowUpRight size={15} aria-hidden className={clsx("shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5", dark ? "text-white/40" : "text-ink/30 group-hover:text-brand")} />}
      </div>
      <p className={clsx("mt-3 font-display text-[1.9rem] font-semibold leading-none tracking-[-0.03em]", dark ? "text-white" : tone === "brand" ? "text-brand" : "text-ink")}>{value}</p>
    </>
  );
  const cls = clsx("group block p-5", dark ? "rounded-tile border border-ink bg-ink" : "card");
  return href ? (
    <Link href={href} className={cls}>{inner}</Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}
