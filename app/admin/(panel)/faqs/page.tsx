import { ResourceList, StatusBadge } from "@/components/admin/primitives";
import { faqs } from "@/lib/admin/data";

export default function FaqsPage() {
  return (
    <ResourceList
      title="FAQs"
      subtitle="Question and answer pairs shown on the FAQ and service pages."
      newLabel="New FAQ"
      columns={[
        { key: "question", label: "Question", render: (r) => <span className="font-medium text-navy">{r.question}</span> },
        { key: "category", label: "Category" },
        { key: "published", label: "Status", render: (r) => <StatusBadge status={r.published ? "published" : "draft"} /> },
      ]}
      rows={faqs}
    />
  );
}
