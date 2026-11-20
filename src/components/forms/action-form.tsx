"use client";

import { createContext, useActionState, useContext, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import clsx from "clsx";
import { initialFormState, type FormState } from "@/lib/form-state";
import { Button } from "@/components/ui/button";

// One reusable pattern for every form backed by a server action:
// <ActionForm action={someAction}> <Field …/> <SubmitButton/> </ActionForm>
// Field-level errors returned by the action appear under the right input.

const Ctx = createContext<FormState>(initialFormState);

export function ActionForm({
  action,
  children,
  className,
  resetOnSuccess = false,
  success,
}: {
  action: (state: FormState, fd: FormData) => Promise<FormState>;
  children: React.ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
  /** Rendered instead of the form once the action succeeds. */
  success?: (message?: string) => React.ReactNode;
}) {
  const [state, formAction] = useActionState(action, initialFormState);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);

  if (state.ok && success) return <>{success(state.message)}</>;

  return (
    <Ctx.Provider value={state}>
      <form ref={ref} action={formAction} noValidate className={clsx("space-y-5", className)}>
        {children}
        {state.error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {state.error}
          </p>
        )}
        {state.ok && state.message && (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
            {state.message}
          </p>
        )}
      </form>
    </Ctx.Provider>
  );
}

function useFieldError(name: string) {
  return useContext(Ctx).fields?.[name];
}

type Common = { label: string; name: string; id?: string; hint?: string; className?: string; optional?: boolean };

function Wrap({ label, name, id, hint, className, optional, children }: Common & { children: React.ReactNode }) {
  const error = useFieldError(name);
  const fieldId = id ?? name;
  return (
    <div className={className}>
      <label htmlFor={fieldId} className="field-label">
        {label} {optional && <span className="font-normal text-muted">(optional)</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
      {error && (
        <p id={`${fieldId}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

const aria = (fieldId: string, error?: string) => ({
  "aria-invalid": Boolean(error),
  "aria-describedby": error ? `${fieldId}-error` : undefined,
});

export function Field(props: Common & React.InputHTMLAttributes<HTMLInputElement>) {
  const { label, name, id, hint, className, optional, ...rest } = props;
  const error = useFieldError(name);
  const fieldId = id ?? name;
  return (
    <Wrap {...{ label, name, id, hint, className, optional }}>
      <input id={fieldId} name={name} className="field" {...aria(fieldId, error)} {...rest} />
    </Wrap>
  );
}

export function TextArea(props: Common & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { label, name, id, hint, className, optional, ...rest } = props;
  const error = useFieldError(name);
  const fieldId = id ?? name;
  return (
    <Wrap {...{ label, name, id, hint, className, optional }}>
      <textarea id={fieldId} name={name} rows={4} className="field resize-y" {...aria(fieldId, error)} {...rest} />
    </Wrap>
  );
}

export function Select(
  props: Common & React.SelectHTMLAttributes<HTMLSelectElement> & { options: ReadonlyArray<{ value: string; label: string }>; placeholder?: string },
) {
  const { label, name, id, hint, className, optional, options, placeholder, ...rest } = props;
  const error = useFieldError(name);
  const fieldId = id ?? name;
  return (
    <Wrap {...{ label, name, id, hint, className, optional }}>
      <select id={fieldId} name={name} className="field" {...aria(fieldId, error)} {...rest}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Wrap>
  );
}

export function Checkbox({ name, id, children, defaultChecked }: { name: string; id?: string; children: React.ReactNode; defaultChecked?: boolean }) {
  const error = useFieldError(name);
  const fieldId = id ?? `cb-${name}`;
  return (
    <div>
      <label htmlFor={fieldId} className="flex cursor-pointer items-start gap-3 text-sm text-muted">
        <input id={fieldId} type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5 h-4 w-4 shrink-0 accent-brand" {...aria(fieldId, error)} />
        <span>{children}</span>
      </label>
      {error && (
        <p id={`${fieldId}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({ children, className, variant }: { children: React.ReactNode; className?: string; variant?: "primary" | "secondary" }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className={className} variant={variant}>
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" aria-hidden /> <span>Please wait…</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}
