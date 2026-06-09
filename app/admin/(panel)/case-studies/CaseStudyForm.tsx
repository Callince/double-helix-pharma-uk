import { PageHeader, Card, AdminButton } from "@/components/admin/primitives";
import { Input, Textarea, Select, FormActions } from "@/components/admin/Form";
import { saveCaseStudy } from "../content-actions";
import type { CaseStudy } from "@/lib/db/content";

export function CaseStudyForm({ item }: { item?: CaseStudy }) {
  return (
    <>
      <PageHeader
        title={item ? "Edit case study" : "New case study"}
        subtitle="Published case studies appear on the public /case-studies section."
      />
      <Card>
        <form action={saveCaseStudy} className="space-y-5">
          {item && <input type="hidden" name="id" defaultValue={item.id} />}
          <Input label="Title" name="title" defaultValue={item?.title} required />
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Slug" name="slug" defaultValue={item?.slug} hint="Leave blank to auto-generate from the title." />
            <Input label="Sector" name="sector" defaultValue={item?.sector ?? ""} placeholder="e.g. Biotech, Generics, CMO" />
          </div>
          <Select
            label="Status"
            name="status"
            defaultValue={item?.status ?? "draft"}
            options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }]}
          />
          <Textarea label="Summary" name="summary" rows={2} defaultValue={item?.summary ?? ""} hint="Short teaser shown in listings & the meta description." />
          <Textarea label="Challenge" name="challenge" rows={4} defaultValue={item?.challenge ?? ""} hint="The client's problem or starting position." />
          <Textarea label="Approach" name="approach" rows={4} defaultValue={item?.approach ?? ""} hint="What Double Helix Pharma did." />
          <Textarea label="Outcome" name="outcome" rows={4} defaultValue={item?.outcome ?? ""} hint="The result delivered." />
          <FormActions>
            <AdminButton type="submit" variant="green" icon="check">Save case study</AdminButton>
            <AdminButton href="/admin/case-studies" variant="ghost">Cancel</AdminButton>
          </FormActions>
        </form>
      </Card>
    </>
  );
}
