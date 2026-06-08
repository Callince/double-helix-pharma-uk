import { notFound } from "next/navigation";
import { getService } from "@/lib/db/content";
import { ServiceForm } from "../ServiceForm";

export const dynamic = "force-dynamic";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getService(id);
  if (!service) notFound();
  return <ServiceForm service={service} />;
}
