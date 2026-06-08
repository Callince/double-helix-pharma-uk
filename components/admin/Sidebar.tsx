"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { adminNav } from "@/lib/admin/data";
import type { AdminUser } from "@/components/admin/AdminShell";

const ROLE_LABEL: Record<string, string> = { admin: "Administrator", editor: "Editor", viewer: "Viewer" };

export function Sidebar({ user, onNavigate }: { user: AdminUser; onNavigate?: () => void }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  const initials = user.full_name.split(" ").map((s) => s[0]).join("").slice(0, 2);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex h-full flex-col bg-navy-deep">
      <div className="flex h-16 shrink-0 items-center px-4">
        <Link href="/admin" onClick={onNavigate} aria-label="Admin home">
          <Logo tone="light" />
        </Link>
      </div>
      <div className="px-5 pb-3">
        <span className="label-mono text-[0.58rem] text-cyan/70">Admin console</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-1">
        {adminNav.map((item) => {
          const on = active(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                on ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon name={item.icon} className={`size-[18px] ${on ? "text-cyan" : "text-white/55"}`} />
              {item.label}
              {on && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-gradient text-xs font-bold text-white">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{user.full_name}</p>
            <p className="truncate text-xs text-white/45">{ROLE_LABEL[user.role] ?? user.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/55 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Icon name="log-out" className="size-[18px]" /> Sign out
        </button>
      </div>
    </div>
  );
}
