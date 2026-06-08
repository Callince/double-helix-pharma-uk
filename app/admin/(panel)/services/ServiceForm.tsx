import { PageHeader, Card, AdminButton } from "@/components/admin/primitives";
import { Input, Textarea, Checkbox, FormActions } from "@/components/admin/Form";
import { saveService } from "../content-actions";
import type { Service } from "@/lib/db/content";

export function ServiceForm({ service }: { service: Service }) {
  return (
    <>
      <PageHeader title="Edit service" subtitle={`Public page: /${service.slug}`} />
      <Card>
        <form action={saveService} className="space-y-5">
          <input type="hidden" name="id" defaultValue={service.id} />
          <Input label="Title" name="title" defaultValue={service.title} required />
          <Textarea label="Short description" name="short" rows={2} defaultValue={service.short} required hint="Shown on the service cards across the site." />
          <Textarea label="Body" name="body" rows={6} defaultValue={service.body ?? ""} />
          <div className="grid items-end gap-5 sm:grid-cols-2">
            <Input label="Display order" name="order_index" type="number" defaultValue={service.order_index} />
            <div className="pb-2"><Checkbox label="Published" name="published" defaultChecked={service.published === 1} /></div>
          </div>
          <FormActions>
            <AdminButton type="submit" variant="green" icon="check">Save service</AdminButton>
            <AdminButton href="/admin/services" variant="ghost">Cancel</AdminButton>
          </FormActions>
        </form>
      </Card>
    </>
  );
}
