import Image from "next/image";
import fs from "node:fs/promises";
import path from "node:path";
import { PageHeader, Card } from "@/components/admin/primitives";
import { Icon } from "@/components/ui/Icon";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteMediaAction } from "./actions";

export const dynamic = "force-dynamic";

const SITE_IMAGES = [
  "hero-gmp-audit.webp",
  "hero-contract-qp.webp",
  "hero-qms.webp",
  "hero-site-readiness.webp",
  "hero-supplier-management.webp",
  "hero-gdp-supply-chain.webp",
  "hero-about.webp",
  "founder-web.webp",
];

async function listUploads(): Promise<string[]> {
  try {
    const files = await fs.readdir(path.join(process.cwd(), "public", "uploads"));
    return files.filter((f) => /\.(webp|png|jpe?g|gif|svg)$/i.test(f)).sort();
  } catch {
    return [];
  }
}

export default async function MediaPage() {
  const uploads = await listUploads();
  return (
    <>
      <PageHeader
        title="Media"
        subtitle="Upload images and manage site media. Uploads are stored on the server."
        action={
          <form action="/admin/media/upload" method="post" encType="multipart/form-data" className="flex items-center gap-2">
            <input
              type="file"
              name="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              required
              className="max-w-[12rem] text-xs text-muted file:mr-2 file:rounded-md file:border-0 file:bg-surface file:px-2.5 file:py-1.5 file:text-xs file:font-semibold file:text-navy hover:file:bg-line/60"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-green px-3.5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            >
              <Icon name="upload" className="size-4" /> Upload
            </button>
          </form>
        }
      />

      <section className="mb-9">
        <h2 className="mb-3 font-display text-lg font-semibold text-navy">Uploads</h2>
        {uploads.length === 0 ? (
          <Card><p className="text-center text-sm text-muted">No uploads yet — use the button above to add an image.</p></Card>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {uploads.map((name) => (
              <Card key={name} pad={false} className="group overflow-hidden">
                <div className="relative aspect-[4/3] bg-surface">
                  <Image src={`/uploads/${name}`} alt={name} fill unoptimized className="object-cover" sizes="200px" />
                </div>
                <div className="flex items-center justify-between gap-2 px-3 py-2">
                  <p className="truncate font-mono text-[0.7rem] text-muted">{name}</p>
                  <DeleteButton action={deleteMediaAction.bind(null, name)} label={`Delete "${name}"?`} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-navy">Built-in site images</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {SITE_IMAGES.map((name) => (
            <Card key={name} pad={false} className="group overflow-hidden">
              <div className="relative aspect-[4/3] bg-surface">
                <Image src={`/${name}`} alt={name} fill unoptimized className="object-cover" sizes="200px" />
              </div>
              <p className="truncate px-3 py-2 font-mono text-[0.7rem] text-muted">{name}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
