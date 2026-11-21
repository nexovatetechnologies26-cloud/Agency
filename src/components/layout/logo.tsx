import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

/** Brand mark (ribbon N) + wordmark. The violet "x" carries over from the official logo. */
export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link href="/" aria-label="Nexovate home" className={clsx("group inline-flex items-center gap-2.5", className)}>
      <Image src="/logo-mark.png" alt="" width={315} height={145} priority className="h-[22px] w-auto transition-transform duration-300 group-hover:scale-105" />
      <span className={clsx("font-display text-[22px] font-bold leading-none tracking-[-0.04em]", inverted ? "text-white" : "text-ink")}>
        Ne<span className="text-brand">x</span>ovate
      </span>
    </Link>
  );
}
