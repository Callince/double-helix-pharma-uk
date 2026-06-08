import type { IconName } from "@/components/ui/Icon";

/* ----------------------------------------------------------------- navigation */
export type AdminNavItem = { label: string; href: string; icon: IconName };

export const adminNav: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "grid" },
  { label: "Enquiries", href: "/admin/enquiries", icon: "inbox" },
  { label: "Insights", href: "/admin/posts", icon: "file-text" },
  { label: "Case Studies", href: "/admin/case-studies", icon: "briefcase" },
  { label: "Services", href: "/admin/services", icon: "layers" },
  { label: "FAQs", href: "/admin/faqs", icon: "help-circle" },
  { label: "Subscribers", href: "/admin/subscribers", icon: "users" },
  { label: "Media", href: "/admin/media", icon: "image" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];

export const adminUser = { name: "B. Subramanian", email: "admin@doublehelixpharma.co.uk", role: "Administrator" };

/* ------------------------------------------------------------------ mock data */
/* NOTE: placeholder data for the UI only. Replace with API calls (see the
   Backend & Database Design spec, docs/) once the backend is implemented. */

export type EnquiryStatus = "new" | "in_review" | "contacted" | "qualified" | "won" | "lost" | "spam";

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  company: string;
  service: string;
  status: EnquiryStatus;
  message: string;
  createdAt: string; // ISO
};

export const enquiries: Enquiry[] = [
  { id: "ENQ-1042", name: "Dr. Helen Marsh", email: "h.marsh@acmebiotech.com", company: "Acme Biotech", service: "GMP & GDP Audits", status: "new", createdAt: "2026-06-06T08:42:00Z", message: "We need an independent supplier audit ahead of an MHRA inspection in Q3. Sterile injectables site near Cambridge." },
  { id: "ENQ-1041", name: "James Okoro", email: "james@novapharma.co.uk", company: "Nova Pharma", service: "Contract QP, RP & RPi", status: "new", createdAt: "2026-06-05T16:10:00Z", message: "Looking for interim QP cover for batch release during a 3-month recruitment gap." },
  { id: "ENQ-1040", name: "Priya Nair", email: "priya.nair@cleartrials.com", company: "ClearTrials CRO", service: "QMS & PQS Implementation", status: "in_review", createdAt: "2026-06-05T11:05:00Z", message: "First MIA application — need help building the PQS and preparing for pre-licensing inspection." },
  { id: "ENQ-1039", name: "Marco Bellini", email: "m.bellini@coldchainlogix.eu", company: "ColdChain Logix", service: "GDP Transport & Supply Chain", status: "contacted", createdAt: "2026-06-04T09:30:00Z", message: "Temperature excursion investigation + transport validation across three EU lanes." },
  { id: "ENQ-1038", name: "Sarah Whitfield", email: "sarah@meridianapi.com", company: "Meridian API", service: "Supplier & Vendor Management", status: "qualified", createdAt: "2026-06-03T14:20:00Z", message: "Need a risk-based supplier qualification programme and QTAs for 6 new API suppliers." },
  { id: "ENQ-1037", name: "Tom Hayes", email: "tom.hayes@virturx.io", company: "VirtuRx", service: "Site Readiness (MIA / WDA)", status: "won", createdAt: "2026-06-02T10:00:00Z", message: "Virtual pharma — WDA(H) application and RPi nomination." },
  { id: "ENQ-1036", name: "Anon", email: "noreply@spam.example", company: "—", service: "General enquiry", status: "spam", createdAt: "2026-06-01T03:14:00Z", message: "Cheap SEO services!!!" },
  { id: "ENQ-1035", name: "Rebecca Lyle", email: "r.lyle@helixgen.com", company: "HelixGen", service: "GMP & GDP Audits", status: "lost", createdAt: "2026-05-30T13:45:00Z", message: "Mock inspection — went with another provider this round." },
];

export const stats = [
  { label: "Total enquiries", value: "128", delta: "+9 this week", icon: "inbox" as IconName, tone: "teal" as const },
  { label: "New (untriaged)", value: "9", delta: "needs attention", icon: "bell" as IconName, tone: "green" as const },
  { label: "Published insights", value: "14", delta: "+2 this month", icon: "file-text" as IconName, tone: "navy" as const },
  { label: "Subscribers", value: "342", delta: "+18 this month", icon: "users" as IconName, tone: "plum" as const },
];

export type Post = { id: string; title: string; category: string; status: "draft" | "scheduled" | "published"; author: string; updatedAt: string; views: number };
export const posts: Post[] = [
  { id: "p1", title: "How to prepare for an MHRA pre-licensing inspection", category: "Inspections", status: "published", author: "B. Subramanian", updatedAt: "2026-06-04", views: 1240 },
  { id: "p2", title: "EU GMP Annex 1: what the sterile changes mean for you", category: "GMP", status: "published", author: "B. Subramanian", updatedAt: "2026-05-28", views: 980 },
  { id: "p3", title: "What does a Qualified Person actually do?", category: "QP/RP", status: "published", author: "B. Subramanian", updatedAt: "2026-05-19", views: 2110 },
  { id: "p4", title: "A practical CAPA framework that survives inspection", category: "QMS", status: "scheduled", author: "B. Subramanian", updatedAt: "2026-06-10", views: 0 },
  { id: "p5", title: "GDP vs GMP: where the responsibilities split", category: "GDP", status: "draft", author: "B. Subramanian", updatedAt: "2026-06-06", views: 0 },
];

export type CaseStudy = { id: string; title: string; sector: string; status: "draft" | "published"; updatedAt: string };
export const caseStudies: CaseStudy[] = [
  { id: "c1", title: "Recovering a stalled MIA application", sector: "Sterile manufacturing", status: "published", updatedAt: "2026-05-22" },
  { id: "c2", title: "Closing 12 critical findings before re-inspection", sector: "Biologics", status: "published", updatedAt: "2026-05-09" },
  { id: "c3", title: "Cold-chain validation across 5 EU lanes", sector: "Distribution", status: "draft", updatedAt: "2026-06-03" },
];

export type ServiceRow = { id: string; title: string; slug: string; order: number; published: boolean };
export const services: ServiceRow[] = [
  { id: "s1", title: "GMP & GDP Audits", slug: "gmp-audit", order: 1, published: true },
  { id: "s2", title: "Contract QP, RP & RPi", slug: "contract-qp", order: 2, published: true },
  { id: "s3", title: "QMS & PQS Implementation", slug: "qms-implementation", order: 3, published: true },
  { id: "s4", title: "Site Readiness (MIA / WDA)", slug: "site-readiness", order: 4, published: true },
  { id: "s5", title: "Supplier & Vendor Management", slug: "supplier-management", order: 5, published: true },
  { id: "s6", title: "GDP Transport & Supply Chain", slug: "gdp-supply-chain", order: 6, published: true },
];

export type FaqRow = { id: string; question: string; category: string; published: boolean };
export const faqs: FaqRow[] = [
  { id: "f1", question: "What types of GMP audit do you carry out?", category: "Audits", published: true },
  { id: "f2", question: "Can you provide interim or ongoing QP/RP cover?", category: "Contract QP", published: true },
  { id: "f3", question: "We are preparing for our first MHRA inspection — can you help?", category: "QMS", published: true },
  { id: "f4", question: "What does 'site readiness' actually involve?", category: "Site Readiness", published: true },
  { id: "f5", question: "How do you qualify and risk-rate suppliers?", category: "Supplier", published: false },
];

export type Subscriber = { id: string; email: string; status: "pending" | "confirmed" | "unsubscribed"; createdAt: string };
export const subscribers: Subscriber[] = [
  { id: "u1", email: "qa.lead@spheripharma.com", status: "confirmed", createdAt: "2026-06-05" },
  { id: "u2", email: "rp@coldchainlogix.eu", status: "confirmed", createdAt: "2026-06-04" },
  { id: "u3", email: "newstarter@novapharma.co.uk", status: "pending", createdAt: "2026-06-04" },
  { id: "u4", email: "compliance@meridianapi.com", status: "confirmed", createdAt: "2026-06-01" },
  { id: "u5", email: "old.contact@example.com", status: "unsubscribed", createdAt: "2026-05-12" },
];

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const m = Math.round((now - then) / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}
