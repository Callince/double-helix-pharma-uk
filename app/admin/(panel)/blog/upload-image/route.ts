import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { getSessionUser } from "@/lib/admin/guard";

// CKEditor SimpleUploadAdapter target. Sends the file as form field "upload";
// expects { url } on success or { error: { message } } on failure.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED = new Set(["image/webp", "image/png", "image/jpeg", "image/gif", "image/svg+xml"]);
const MAX = 5 * 1024 * 1024;

function err(message: string, status: number) {
  return NextResponse.json({ error: { message } }, { status });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return err("Not authorised.", 401);

  let file: FormDataEntryValue | null = null;
  try {
    file = (await req.formData()).get("upload");
  } catch {
    return err("Upload failed.", 400);
  }
  if (!(file instanceof File) || file.size === 0) return err("No image received.", 400);
  if (!ALLOWED.has(file.type)) return err("Unsupported image type.", 400);
  if (file.size > MAX) return err("Image exceeds the 5 MB limit.", 400);

  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5);
  const base =
    file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40) || "image";
  const name = `${base}-${Date.now().toString(36)}.${ext}`;

  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  } catch (e) {
    console.error("[blog upload-image] write failed", e);
    return err("Could not save the image on this host (use insert-by-URL, or upload after the server move).", 500);
  }
  return NextResponse.json({ url: `/uploads/${name}` });
}
