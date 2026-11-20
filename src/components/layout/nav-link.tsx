"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export function NavLink({ href, exact, variant = "side", children }: { href: string; exact?: boolean; variant?: "side" | "pill"; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={clsx(
        "text-sm font-medium transition",
        variant === "side" && "rounded-xl px-3 py-2",
        variant === "pill" && "shrink-0 rounded-full px-3 py-1.5",
        active ? "bg-brand-soft text-brand" : "text-ink/75 hover:bg-paper hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
