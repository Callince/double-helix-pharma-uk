import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/admin/guard";
import { listSubscribers } from "@/lib/db/content";

export const dynamic = "force-dynamic";

function cell(v: unknown): string {
  let s = String(v ?? "");
  // Neutralise spreadsheet formula injection (=, +, -, @, tab, CR triggers).
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  // Subscriber emails are PII — admin only (middleware also gates /admin/*).
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rows = await listSubscribers().catch(() => []);
  const lines = ["email,status,subscribed_at", ...rows.map((r) => [r.email, r.status, r.created_at].map(cell).join(","))];
  const csv = lines.join("\r\n") + "\r\n";
  const today = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
