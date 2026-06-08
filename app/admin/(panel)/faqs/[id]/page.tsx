import { notFound } from "next/navigation";
import { getFaq } from "@/lib/db/content";
import { FaqForm } from "../FaqForm";

export const dynamic = "force-dynamic";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const faq = await getFaq(id);
  if (!faq) notFound();
  return <FaqForm faq={faq} />;
}
