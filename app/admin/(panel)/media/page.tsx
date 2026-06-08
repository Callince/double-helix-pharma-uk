import Image from "next/image";
import { PageHeader, Card, AdminButton } from "@/components/admin/primitives";

const media = [
  "hero-gmp-audit.webp",
  "hero-contract-qp.webp",
  "hero-qms.webp",
  "hero-site-readiness.webp",
  "hero-supplier-management.webp",
  "hero-gdp-supply-chain.webp",
  "hero-about.webp",
  "founder-web.webp",
];

export default function MediaPage() {
  return (
    <>
      <PageHeader
        title="Media"
        subtitle="Images used across the website."
        action={<AdminButton icon="plus" variant="green">Upload</AdminButton>}
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {media.map((name) => (
          <Card key={name} pad={false} className="group overflow-hidden">
            <div className="relative aspect-[4/3] bg-surface">
              <Image src={`/${name}`} alt={name} fill unoptimized className="object-cover" sizes="200px" />
            </div>
            <p className="truncate px-3 py-2 font-mono text-[0.7rem] text-muted">{name}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
