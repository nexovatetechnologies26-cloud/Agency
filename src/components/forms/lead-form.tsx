"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { COUNTRIES } from "@/content/countries";
import { publishedServices } from "@/content/services";
import { BUDGET_RANGES, TIMELINES, type LeadType } from "@/lib/constants";
import { leadInputSchema } from "@/lib/validations/lead";
import { Button } from "@/components/ui/button";

type Errors = Record<string, string>;

export function LeadForm({ type, defaultService }: { type: LeadType; defaultService?: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const attribution = useRef<{ utm: Record<string, string>; referrer?: string; landingPage?: string }>({ utm: {} });
  const isQuote = type === "quote";
  const startedAt = useRef(0);

  // capture campaign source once, on the client
  useEffect(() => {
    startedAt.current = Date.now();
    const sp = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const k of ["source", "medium", "campaign", "term", "content"]) {
      const v = sp.get(`utm_${k}`);
      if (v) utm[k] = v;
    }
    attribution.current = {
      utm,
      referrer: document.referrer || undefined,
      landingPage: window.location.pathname,
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const str = (k: string) => {
      const v = fd.get(k);
      return typeof v === "string" && v.trim() ? v : undefined;
    };

    const payload = {
      type,
      name: str("name") ?? "",
      email: str("email") ?? "",
      country: str("country") ?? "",
      phone: str("phone"),
      company: str("company"),
      website: str("website"),
      service: str("service"),
      budget: str("budget"),
      timeline: str("timeline"),
      preferredContact: str("preferredContact") ?? "email",
      message: str("message") ?? "",
      marketingConsent: fd.get("marketingConsent") === "on",
      privacyAccepted: fd.get("privacyAccepted") === "on",
      // spam checks — decided on the server only, never block a real visitor here
      companyFax: str("nx_hp"),
      elapsedMs: startedAt.current ? Date.now() - startedAt.current : undefined,
      ...attribution.current,
    };

    const form = e.currentTarget;
    const { companyFax: _hp, ...visible } = payload;
    void _hp;
    const parsed = leadInputSchema.safeParse(visible);
    setFormError("");
    if (!parsed.success) {
      const next: Errors = {};
      for (const i of parsed.error.issues) next[i.path.join(".")] ??= i.message;
      setErrors(next);
      // focus the first invalid field the visitor can actually see; otherwise show the message at the bottom
      const target = Object.keys(next)
        .map((k) => form.querySelector<HTMLElement>(`[name="${k}"]`))
        .find((el) => el && el.offsetParent !== null);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.focus({ preventScroll: true });
      } else {
        setFormError(Object.values(next)[0] ?? "Please check the form and try again.");
      }
      return;
    }

    setErrors({});
    setFormError("");
    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        setStatus("success");
        return;
      }
      if (json?.error?.fields) setErrors(json.error.fields);
      setFormError(json?.error?.message ?? "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setFormError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="card flex flex-col items-center p-10 text-center" role="status">
        <CheckCircle2 className="text-brand" size={44} strokeWidth={1.5} />
        <h2 className="mt-5 text-2xl">Thank you — we&apos;ve received your {isQuote ? "project details" : "message"}.</h2>
        <p className="mt-3 max-w-md text-muted">Our team will review it and get back to you by your preferred contact method.</p>
      </div>
    );
  }

  const err = (k: string) =>
    errors[k] ? (
      <p id={`${k}-error`} className="field-error">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: string) => ({ "aria-invalid": Boolean(errors[k]), "aria-describedby": errors[k] ? `${k}-error` : undefined });

  return (
    <form onSubmit={onSubmit} noValidate className="card relative space-y-5 p-6 md:p-9">
      {/* honeypot for bots — not rendered, so browser autofill (Chrome on laptops) never fills it */}
      <div hidden aria-hidden>
        <label>
          Leave this empty <input type="text" name="nx_hp" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="field-label">Full name *</label>
          <input id="name" name="name" autoComplete="name" className="field" {...aria("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="email" className="field-label">Email *</label>
          <input id="email" name="email" type="email" autoComplete="email" className="field" {...aria("email")} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="country" className="field-label">Country *</label>
          <select id="country" name="country" defaultValue="" autoComplete="country" className="field" {...aria("country")}>
            <option value="" disabled>Select your country</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
          {err("country")}
        </div>
        <div>
          <label htmlFor="phone" className="field-label">Phone / WhatsApp <span className="text-muted">(optional)</span></label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+1 555 123 4567" className="field" {...aria("phone")} />
          {err("phone")}
        </div>

        {isQuote && (
          <>
            <div>
              <label htmlFor="company" className="field-label">Company <span className="text-muted">(optional)</span></label>
              <input id="company" name="company" autoComplete="organization" className="field" />
            </div>
            <div>
              <label htmlFor="website" className="field-label">Website <span className="text-muted">(optional)</span></label>
              <input id="website" name="website" type="url" placeholder="https://" className="field" />
            </div>
          </>
        )}

        <div className={isQuote ? "" : "sm:col-span-2"}>
          <label htmlFor="service" className="field-label">Service {isQuote ? "*" : <span className="text-muted">(optional)</span>}</label>
          <select id="service" name="service" defaultValue={defaultService ?? ""} className="field" {...aria("service")}>
            <option value="">{isQuote ? "Select a service" : "General inquiry"}</option>
            {publishedServices.map((s) => (
              <option key={s.slug} value={s.slug}>{s.title}</option>
            ))}
            <option value="other">Something else</option>
          </select>
          {err("service")}
        </div>

        {isQuote && (
          <div>
            <label htmlFor="budget" className="field-label">Budget (USD) <span className="text-muted">(optional)</span></label>
            <select id="budget" name="budget" defaultValue="" className="field">
              <option value="">Select a range</option>
              {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        )}
        {isQuote && (
          <div>
            <label htmlFor="timeline" className="field-label">Timeline <span className="text-muted">(optional)</span></label>
            <select id="timeline" name="timeline" defaultValue="" className="field">
              <option value="">Select a timeline</option>
              {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        )}
        {isQuote && (
          <div>
            <label htmlFor="preferredContact" className="field-label">Preferred contact</label>
            <select id="preferredContact" name="preferredContact" defaultValue="email" className="field">
              <option value="email">Email</option>
              <option value="phone">Phone call</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="message" className="field-label">{isQuote ? "Tell us about your project *" : "Message *"}</label>
        <textarea
          id="message"
          name="message"
          rows={isQuote ? 6 : 5}
          placeholder={isQuote ? "Goals, key features, references, anything that helps us understand the project." : "How can we help?"}
          className="field resize-y"
          {...aria("message")}
        />
        {err("message")}
      </div>

      <div className="space-y-3 text-sm">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" name="privacyAccepted" className="mt-0.5 h-4 w-4 shrink-0 accent-brand" {...aria("privacyAccepted")} />
          <span className="text-muted">
            I agree to the{" "}
            <Link href="/privacy-policy" className="font-medium text-brand underline-offset-2 hover:underline">privacy policy</Link>{" "}
            and to being contacted about this request. *
          </span>
        </label>
        {err("privacyAccepted")}
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" name="marketingConsent" className="mt-0.5 h-4 w-4 shrink-0 accent-brand" />
          <span className="text-muted">Send me occasional news and insights from Nexovate (optional).</span>
        </label>
      </div>

      {formError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{formError}</p>}

      <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
        {status === "submitting" ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Sending…
          </>
        ) : isQuote ? "Request a Quote" : "Send Message"}
      </Button>
    </form>
  );
}
