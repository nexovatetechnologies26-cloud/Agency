"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

/** Friendly fallback used by the route error boundaries. */
export function ErrorView({
  error,
  reset,
  homeHref = "/",
  homeLabel = "Back to home",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  homeHref?: string;
  homeLabel?: string;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center px-5 py-20 text-center md:py-28" role="alert">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertTriangle size={26} strokeWidth={1.75} aria-hidden />
      </span>
      <h1 className="mt-6 text-3xl">Something went wrong</h1>
      <p className="mt-3 max-w-md text-muted">
        We couldn&apos;t load this page right now. Please try again — if it keeps happening, contact us and we&apos;ll look into it.
      </p>
      {error.digest && <p className="mt-2 text-xs text-muted">Reference: {error.digest}</p>}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-deep"
        >
          <RotateCcw size={16} aria-hidden /> Try again
        </button>
        <Link
          href={homeHref}
          className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-surface px-5 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
        >
          {homeLabel}
        </Link>
      </div>
    </div>
  );
}
