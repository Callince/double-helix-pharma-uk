import { listEnquiries, type EnquiryRow } from "@/lib/db/enquiries";
import { EnquiriesClient } from "./EnquiriesClient";

// Always render fresh (reads the database on every request).
export const dynamic = "force-dynamic";

export default async function EnquiriesPage() {
  let enquiries: EnquiryRow[] = [];
  try {
    enquiries = await listEnquiries();
  } catch (err) {
    console.error("[admin] failed to read enquiries", err);
  }
  return <EnquiriesClient enquiries={enquiries} />;
}
