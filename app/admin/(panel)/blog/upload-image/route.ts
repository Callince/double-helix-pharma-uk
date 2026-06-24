import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { getSessionUser } from "@/lib/admin/guard";
import { ALLOWED_IMAGE, sniffImage, safeBaseName } from "@/lib/upload";

// CKEditor SimpleUploadAdapter target. Sends the file as form field "upload";
// expects { url } on success or { error: { message } } on failure.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX = 5 * 1024 * 1024;

function err(message: string, status: number) {
  return NextResponse.json({ error: { message } }, { status });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return err("Not authorised.", 401);
  if (user.role !== "admin" && user.role !== "editor") return err("Not authorised.", 403);

  let file: FormDataEntryValue | null = null;
  try {
    file = (await req.formData()).get("upload");
  } catch {
    return err("Upload failed.", 400);
  }
  if (!(file instanceof File) || file.size === 0) return err("No image received.", 400);
  if (file.size > MAX) return err("Image exceeds the 5 MB limit.", 400);

  // Detect the real type from magic bytes — never trust file.type or the filename.
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniffImage(bytes);
  if (!type) return err("Unsupported image type (PNG, JPEG, WEBP or GIF only).", 400);

  const name = `${safeBaseName(file.name)}-${Date.now().toString(36)}.${ALLOWED_IMAGE[type]}`;
  const contentType = `image/${ALLOWED_IMAGE[type]}`;

  // Production (Vercel): persist to Vercel Blob — the serverless filesystem is read-only.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(`blog/${name}`, Buffer.from(bytes), {
        access: "public",
        contentType,
        addRandomSuffix: false,
      });
      return NextResponse.json({ url: blob.url });
    } catch (e) {
      console.error("[blog upload-image] blob put failed", e);
      return err("Could not save the image to Vercel Blob — check the store is connected.", 500);
    }
  }

  // Local dev fallback: write to public/uploads (only works on a writable filesystem).
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(bytes));
  } catch (e) {
    console.error("[blog upload-image] write failed", e);
    return err("Could not save the image. Connect a Vercel Blob store (Storage > Create > Blob) and redeploy.", 500);
  }
  return NextResponse.json({ url: `/uploads/${name}` });
}
