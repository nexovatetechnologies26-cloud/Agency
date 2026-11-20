import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { requireUser } from "@/server/auth/session";
import { getActivePackage } from "@/server/queries/commerce";
import { checkoutAction } from "@/server/actions/commerce";
import { services } from "@/content/services";
import { formatMoney } from "@/lib/money";
import { ActionForm, Checkbox, SubmitButton, TextArea } from "@/components/forms/action-form";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage({ params }: { params: Promise<{ packageId: string }> }) {
  const { packageId } = await params;
  await requireUser(`/checkout/${packageId}`);
  const pkg = await getActivePackage(packageId);
  if (!pkg) notFound();
  const service = services.find((s) => s.slug === pkg.serviceSlug);

  return (
    <section className="section">
      <div className="container grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h1 className="text-3xl">Checkout</h1>
          <p className="mt-2 text-muted">Tell us what you need, review the details and place your order.</p>
          <ActionForm action={checkoutAction} className="card mt-8 p-7">
            <input type="hidden" name="packageId" value={pkg._id} />
            <TextArea
              label="Project requirements"
              name="requirements"
              rows={7}
              optional
              hint="Goals, references, links, brand details — you can also add this later from your dashboard."
            />
            <Checkbox name="terms">
              I have read the package details and agree to the <Link href="/terms" className="text-brand">terms</Link> and{" "}
              <Link href="/refund-policy" className="text-brand">refund policy</Link>.
            </Checkbox>
            <SubmitButton>Place order</SubmitButton>
            <p className="text-xs text-muted">
              Placing an order creates an invoice. You&apos;ll see the available payment options on the next screen — no payment is taken on this page.
            </p>
          </ActionForm>
        </div>

        <aside className="card h-fit p-7">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{service?.title}</p>
          <h2 className="mt-2 text-xl">{pkg.name}</h2>
          {pkg.description && <p className="mt-2 text-sm text-muted">{pkg.description}</p>}
          <ul className="mt-5 space-y-2 text-sm">
            {pkg.deliverables.map((d) => (
              <li key={d} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-brand" aria-hidden /> {d}</li>
            ))}
          </ul>
          {pkg.exclusions.length > 0 && (
            <>
              <p className="mt-5 text-sm font-semibold">Not included</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                {pkg.exclusions.map((x) => <li key={x}>{x}</li>)}
              </ul>
            </>
          )}
          <dl className="mt-5 space-y-1 text-sm text-muted">
            {pkg.deliveryDays ? <div>Estimated delivery: {pkg.deliveryDays} days</div> : null}
            {pkg.revisions != null ? <div>Revisions included: {pkg.revisions}</div> : null}
          </dl>
          {pkg.terms && <p className="mt-5 whitespace-pre-wrap rounded-xl bg-paper p-4 text-xs text-muted">{pkg.terms}</p>}
          <div className="mt-6 flex items-baseline justify-between border-t border-line pt-5">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-semibold">
              {formatMoney(pkg.price, pkg.currency)}
              {pkg.billing === "monthly" && <span className="text-sm text-muted"> / month</span>}
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}
