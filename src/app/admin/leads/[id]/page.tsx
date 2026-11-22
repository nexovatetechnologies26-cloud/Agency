import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe2 } from "lucide-react";
import { requireStaffPage } from "@/server/auth/session";
import { getLeadItem } from "@/server/services/lead.service";
import { LeadPanel } from "@/components/admin/leads-table";
import { config } from "@/server/config";
import { can } from "@/lib/permissions";
import { COUNTRIES } from "@/content/countries";
import { services } from "@/content/services";

export const dynamic = "force-dynamic";

const KIND: Record<string, string> = { contact: "Website message", quote: "Quote request", consultation: "Consultation request" };

export default async function LeadConversation({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaffPage("leads");
  const lead = await getLeadItem((await params).id);
  if (!lead) notFound();
  const country = COUNTRIES.find((c) => c.code === lead.country)?.name ?? lead.country;
  const service = lead.service ? (services.find((s) => s.slug === lead.service)?.title ?? lead.service) : null;

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/inbox" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-brand">
        <ArrowLeft size={15} aria-hidden /> Inbox
      </Link>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span aria-hidden className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-soft text-lg font-bold text-brand">
            {lead.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h1 className="text-[1.6rem] tracking-[-0.03em]">{lead.name}</h1>
            <p className="mt-0.5 text-sm text-muted">
              <a href={`mailto:${lead.email}`} className="hover:text-brand">{lead.email}</a> · {country}
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand">
          <Globe2 size={13} aria-hidden /> {KIND[lead.type] ?? "Website inquiry"}
          {service ? ` · ${service}` : ""}
        </span>
      </header>

      <div className="mt-6">
        <LeadPanel lead={lead} emailReady={config.email.enabled} canAi={config.ai.enabled && can(session.role, "ai")} canPropose={can(session.role, "proposals")} />
      </div>
    </div>
  );
}
