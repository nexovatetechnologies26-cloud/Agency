import Link from "next/link";
import clsx from "clsx";

type Variant = "primary" | "dark" | "secondary" | "ghost" | "outline-light" | "light";
type Size = "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-2 rounded-btn font-semibold tracking-[-0.005em] transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out-cubic disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  // solid violet — the one primary action per view
  primary: "bg-brand text-white shadow-glow hover:bg-brand-deep hover:shadow-none",
  dark: "bg-ink text-white hover:bg-brand",
  secondary: "border border-ink/15 bg-white text-ink hover:border-ink",
  ghost: "text-ink hover:text-brand",
  "outline-light": "border border-white/20 bg-white/5 text-white backdrop-blur hover:border-white/60 hover:bg-white/10", // for dark backgrounds
  light: "bg-white text-ink hover:bg-brand-soft hover:text-brand-deep", // primary action on dark backgrounds
  // one button shape across the site: pill, 52px tall at "lg"
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
