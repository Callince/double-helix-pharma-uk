import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/admin/guard";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  return (
    <AdminShell user={{ full_name: user.full_name, email: user.email, role: user.role }}>
      {children}
    </AdminShell>
  );
}
