import { ButtonLink } from "@/components/ui/button";

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: { label: string; href: string } }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <p className="font-semibold">{title}</p>
      {text && <p className="mt-1.5 max-w-sm text-sm text-muted">{text}</p>}
      {action && (
        <ButtonLink href={action.href} className="mt-5">
          {action.label}
        </ButtonLink>
      )}
    </div>
  );
}
