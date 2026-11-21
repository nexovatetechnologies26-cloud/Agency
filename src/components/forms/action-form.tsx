"use client";

import { createContext, useActionState, useCallback, useContext, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import clsx from "clsx";
import { initialFormState, type FormState } from "@/lib/form-state";
import { Button } from "@/components/ui/button";

// One reusable pattern for every form backed by a server action:
// <ActionForm action={someAction}> <Field …/> <SubmitButton/> </ActionForm>
// Field-level errors returned by the action appear under the right input.
//
// When the action returns an error, everything the visitor typed is put back
// (React 19 clears forms after a form action), the first invalid field is
// scrolled into view and focused, and a summary appears at the top.

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
  const ref = useRef<HTMLFormElement>(null);
  const lastSubmitted = useRef<FormData | null>(null);

  // remember exactly what was submitted, so it can be restored on error
  const submit = useCallback(
    (prev: FormState, fd: FormData) => {
      lastSubmitted.current = fd;
      return action(prev, fd);
    },
    [action],
  );
  const [state, formAction] = useActionState(submit, initialFormState);
  const failed = !state.ok && Boolean(state.error || (state.fields && Object.keys(state.fields).length));
  const fieldErrorCount = state.fields ? Object.keys(state.fields).length : 0;

  useEffect(() => {
    const form = ref.current;
    if (!form) return;
    if (state.ok && resetOnSuccess) {
      form.reset();
      return;
    }
    if (!failed) return;
    const data = lastSubmitted.current;
    // React resets the form right after the action settles — restore now and once more on the next frame
    const restore = () => data && refill(form, data);
    restore();
    const raf = requestAnimationFrame(() => {
      restore();
      const firstInvalid = form.querySelector<HTMLElement>('[aria-invalid="true"]');
      const target = firstInvalid ?? form.querySelector<HTMLElement>("[data-form-alert]");
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalid?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(raf);
  }, [state, resetOnSuccess, failed]);

  if (state.ok && success) return <>{success(state.message)}</>;

  return (
    <Ctx.Provider value={state}>
      <form ref={ref} action={formAction} noValidate className={clsx("space-y-5", className)}>
        {failed && (
          <div data-form-alert role="alert" className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
            <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden />
            <p>
              {fieldErrorCount > 0 && (
                <strong className="font-semibold">
                  {fieldErrorCount === 1 ? "1 field needs your attention." : `${fieldErrorCount} fields need your attention.`}{" "}
                </strong>
              )}
              {state.error && state.error !== "Please check the highlighted fields." ? state.error : fieldErrorCount ? "Your other answers are kept — just fix the highlighted fields." : state.error}
            </p>
          </div>
        )}
        {children}
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
          <AlertCircle size={13} className="shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}

/** Puts submitted values back into the form's fields (text, textarea, select, checkbox, radio). */
function refill(form: HTMLFormElement, data: FormData) {
  const seen = new Map<string, number>();
  for (const el of Array.from(form.elements)) {
    if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement)) continue;
    const name = el.name;
    if (!name || el.disabled) continue;
    if (el instanceof HTMLInputElement && (el.type === "file" || el.type === "password" || el.type === "submit")) continue;
    const values = data.getAll(name).map(String);
    if (el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio")) {
      el.checked = values.includes(el.value || "on");
      continue;
    }
    if (el instanceof HTMLSelectElement && el.multiple) {
      for (const o of Array.from(el.options)) o.selected = values.includes(o.value);
      continue;
    }
    const i = seen.get(name) ?? 0;
    seen.set(name, i + 1);
    if (values[i] !== undefined) el.value = values[i];
  }
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
      <label htmlFor={fieldId} className={clsx("flex cursor-pointer items-start gap-3 text-sm", error ? "text-red-600" : "text-muted")}>
        <input id={fieldId} type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5 h-4 w-4 shrink-0 accent-brand" {...aria(fieldId, error)} />
        <span>{children}</span>
      </label>
      {error && (
        <p id={`${fieldId}-error`} className="field-error">
          <AlertCircle size={13} className="shrink-0" aria-hidden />
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
