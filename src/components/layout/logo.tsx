import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link href="/" aria-label="Nexovate home" className={clsx("flex items-center gap-2", className)}>
      <Image src="/logo-mark.png" alt="" width={40} height={18} priority className="h-[18px] w-auto" />
      <span className={clsx("text-xl font-extrabold tracking-tight", inverted ? "text-white" : "text-ink")}>
        Ne<span className="text-brand">x</span>ovate
      </span>
    </Link>
  );
}
