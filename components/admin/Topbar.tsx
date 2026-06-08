"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { adminNav } from "@/lib/admin/data";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname() || "";
  const current =
    [...adminNav].reverse().find((n) => (n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href)));

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur sm:px-6">
      <button
        onClick={onMenu}
        className="grid size-9 place-items-center rounded-lg text-navy hover:bg-surface lg:hidden"
        aria-label="Open menu"
      >
        <Icon name="menu" className="size-5" />
      </button>

      <h2 className="font-display text-base font-semibold text-navy">{current?.label ?? "Admin"}</h2>

      <div className="ml-auto flex items-center gap-2">
        <label className="hidden items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-sm text-muted md:flex">
          <Icon name="search" className="size-4" />
          <input
            placeholder="Search…"
            className="w-36 bg-transparent text-ink outline-none placeholder:text-muted/70"
          />
        </label>
        <button
          className="relative grid size-9 place-items-center rounded-lg text-navy hover:bg-surface"
          aria-label="Notifications"
        >
          <Icon name="bell" className="size-5" />
          <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-green ring-2 ring-white" />
        </button>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-navy hover:bg-surface sm:flex"
        >
          View site <Icon name="external-link" className="size-3.5" />
        </a>
      </div>
    </header>
  );
}
