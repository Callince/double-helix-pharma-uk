import { PageHeader, Card, AdminButton } from "@/components/admin/primitives";
import { Input, Textarea, Checkbox, FormActions } from "@/components/admin/Form";
import { saveFaq } from "../content-actions";
import type { Faq } from "@/lib/db/content";

export function FaqForm({ faq }: { faq?: Faq }) {
  return (
    <>
      <PageHeader title={faq ? "Edit FAQ" : "New FAQ"} subtitle="Shown on the public FAQ page and grouped by category." />
      <Card>
        <form action={saveFaq} className="space-y-5">
          {faq && <input type="hidden" name="id" defaultValue={faq.id} />}
          <Input label="Question" name="question" defaultValue={faq?.question} required />
          <Textarea label="Answer" name="answer" rows={5} defaultValue={faq?.answer} required />
          <Input label="Category" name="category" defaultValue={faq?.category ?? ""} placeholder="e.g. General, Audits" />
          <Checkbox label="Published" name="published" defaultChecked={faq ? faq.published === 1 : true} />
          <FormActions>
            <AdminButton type="submit" variant="green" icon="check">Save FAQ</AdminButton>
            <AdminButton href="/admin/faqs" variant="ghost">Cancel</AdminButton>
          </FormActions>
        </form>
      </Card>
    </>
  );
}
