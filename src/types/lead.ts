// Shapes shared between server (services) and client (admin UI).
import type { LeadStatus } from "@/lib/constants";

export interface LeadListItem {
  id: string;
  type: string;
  status: LeadStatus;
  name: string;
  email: string;
  country: string;
  phone?: string;
  company?: string;
  website?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  preferredContact?: string;
  message: string;
  marketingConsent: boolean;
  source?: string;
  aiSummary?: string;
  assignedTo?: string;
  notes: { body: string; author: string; createdAt: string }[];
  createdAt: string;
}
