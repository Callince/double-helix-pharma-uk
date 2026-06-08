"use client";

import { useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";

export type AdminUser = { full_name: string; email: string; role: string };

export function AdminShell({ user, children }: { user: AdminUser; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <Sidebar user={user} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-deep/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 shadow-2xl">
            <Sidebar user={user} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
