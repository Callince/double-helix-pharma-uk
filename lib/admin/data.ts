import type { IconName } from "@/components/ui/Icon";

/* ----------------------------------------------------------------- navigation */
export type AdminNavItem = { label: string; href: string; icon: IconName };

export const adminNav: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "grid" },
  { label: "Enquiries", href: "/admin/enquiries", icon: "inbox" },
  { label: "Blog", href: "/admin/blog", icon: "file-text" },
  { label: "Case Studies", href: "/admin/case-studies", icon: "briefcase" },
  { label: "Services", href: "/admin/services", icon: "layers" },
  { label: "FAQs", href: "/admin/faqs", icon: "help-circle" },
  { label: "Subscribers", href: "/admin/subscribers", icon: "users" },
  { label: "Media", href: "/admin/media", icon: "image" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];

/* ------------------------------------------------------------------- helpers */
export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const m = Math.round((Date.now() - then) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}
