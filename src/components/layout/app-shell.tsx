import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { logoutAction } from "@/server/actions/auth";
import { Logo } from "@/components/layout/logo";
import { NavLink } from "@/components/layout/nav-link";
import { SiteMotion } from "@/components/ui/site-motion";

export type ShellNavItem = { label: string; href: string; exact?: boolean };

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

  return (
    <div className="min-h-screen bg-paper print:bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur print:hidden">
        <div className="flex h-16 items-center justify-between gap-4 px-5 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Logo />
            <span className="truncate rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand">{badge}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="hidden items-center gap-1.5 text-muted transition hover:text-brand sm:inline-flex">
              View website <ExternalLink size={13} aria-hidden />
            </Link>
            <span className="hidden h-6 w-px bg-line md:block" aria-hidden />
            <div className="hidden items-center gap-2.5 md:flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white" aria-hidden>
                {initial}
              </span>
              <span className="max-w-[200px] truncate text-muted" title={user.email}>{user.email}</span>
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
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-line bg-white p-4 lg:block print:hidden">
          <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Menu</p>
          <nav aria-label="Section" className="flex flex-col gap-0.5">
            {nav.map((n) => (
              <NavLink key={n.href} href={n.href} exact={n.exact}>{n.label}</NavLink>
            ))}
          </nav>
        </aside>
        <SiteMotion />
        <main id="main" className="min-w-0 flex-1 px-5 py-8 lg:px-10 print:p-0">
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
        <h1 className="text-2xl md:text-[1.75rem]">{title}</h1>
        {description && <p className="mt-1 break-words text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Stat({ label, value, href }: { label: string; value: React.ReactNode; href?: string }) {
  const inner = (
    <>
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </>
  );
  return href ? (
    <Link href={href} className="card block p-5 transition hover:-translate-y-0.5 hover:border-brand/40">{inner}</Link>
  ) : (
    <div className="card p-5">{inner}</div>
  );
}
