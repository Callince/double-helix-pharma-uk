"use server";

import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";
import { assertAdmin } from "@/lib/admin/guard";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function deleteMediaAction(name: string) {
  await assertAdmin();
  const safe = path.basename(name); // block path traversal
  try {
    await fs.rm(path.join(UPLOAD_DIR, safe), { force: true });
  } catch (err) {
    console.error("[media] delete failed", err);
  }
  revalidatePath("/admin/media");
}
