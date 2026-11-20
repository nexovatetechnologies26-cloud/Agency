"use client";

import { useFormStatus } from "react-dom";
import clsx from "clsx";

/** Small submit button for plain <form action={serverAction}> forms (admin tables etc.). */
export function PendingButton({
  children,
  className,
  tone = "default",
  confirm,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "primary" | "danger";
  confirm?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      className={clsx(
        "inline-flex h-9 items-center justify-center rounded-full px-4 text-xs font-semibold transition disabled:opacity-50",
        tone === "primary" && "bg-brand text-white hover:bg-brand-deep",
        tone === "danger" && "border border-red-200 text-red-700 hover:bg-red-50",
        tone === "default" && "border border-line bg-white text-ink hover:border-brand hover:text-brand",
        className,
      )}
    >
      {pending ? "…" : children}
    </button>
  );
}
