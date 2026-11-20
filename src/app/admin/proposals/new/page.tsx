import { isValidObjectId } from "mongoose";
import { requireStaffPage } from "@/server/auth/session";
import { connectDB } from "@/server/db/mongodb";
import { Lead } from "@/server/models/lead.model";
import { services } from "@/content/services";
import { PageHeader } from "@/components/layout/app-shell";
import { ProposalForm } from "@/components/admin/proposal-form";

export default async function NewProposal({ searchParams }: { searchParams: Promise<{ lead?: string }> }) {
  await requireStaffPage("proposals");
  const { lead: leadId } = await searchParams;

  let prefill = {};
  if (leadId && isValidObjectId(leadId)) {
    await connectDB();
    const lead = await Lead.findById(leadId).lean();
    if (lead) {
      const service = services.find((s) => s.slug === lead.service)?.title;
      prefill = {
        leadId,
        clientName: lead.name,
        clientEmail: lead.email,
        clientCompany: lead.company ?? "",
        title: service ? `${service} — ${lead.company || lead.name}` : "",
        overview: lead.message,
      };
    }
  }

  return (
    <>
      <PageHeader title="New proposal" description="Saved as a draft. You can review it before sending." />
      <ProposalForm v={prefill} />
    </>
  );
}
