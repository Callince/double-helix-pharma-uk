import { notFound } from "next/navigation";
import { getCaseStudy } from "@/lib/db/content";
import { CaseStudyForm } from "../CaseStudyForm";

export const dynamic = "force-dynamic";

export default async function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getCaseStudy(id);
  if (!item) notFound();
  return <CaseStudyForm item={item} />;
}
