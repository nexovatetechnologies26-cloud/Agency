import Link from "next/link";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "outline-light" | "light";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-btn font-medium transition-colors duration-200 ease-out-cubic disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  // light brand: soft lilac fill with violet text, slightly deeper lilac on hover
  primary: "bg-brand-soft text-brand hover:bg-brand-tint hover:text-brand-deep",
  secondary: "border border-line bg-transparent text-ink hover:border-ink",
  ghost: "text-ink hover:text-brand",
  "outline-light": "border border-white/25 text-white hover:border-white", // for dark backgrounds
  light: "bg-brand-soft text-brand hover:bg-white hover:text-brand-deep", // primary action on dark backgrounds
  // one button shape across the site: 6px radius rectangle, 52px tall at "lg"
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-[52px] px-7 text-[15px]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={clsx(base, variants[variant], sizes[size], className)}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
