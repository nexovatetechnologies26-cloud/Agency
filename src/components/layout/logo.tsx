import Link from "next/link";
import clsx from "clsx";

/** Serif wordmark. The violet "x" carries over from the official logo. */
export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link href="/" aria-label="Nexovate home" className={clsx("inline-flex items-baseline", className)}>
      <span className={clsx("font-serif text-[28px] leading-none tracking-[-0.01em]", inverted ? "text-bone" : "text-ink")}>
        Ne<span className="text-brand">x</span>ovate
      </span>
    </Link>
  );
}
