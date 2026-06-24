import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { getSessionUser } from "@/lib/admin/guard";
import { ALLOWED_IMAGE, sniffImage, safeBaseName } from "@/lib/upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX = 5 * 1024 * 1024; // 5 MB

function back(req: Request, q: string) {
  return NextResponse.redirect(new URL(`/admin/media?${q}`, req.url), { status: 303 });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "admin" && user.role !== "editor")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let file: FormDataEntryValue | null = null;
  try {
    file = (await req.formData()).get("file");
  } catch {
    return back(req, "error=upload");
  }
  if (!(file instanceof File) || file.size === 0) return back(req, "error=nofile");
  if (file.size > MAX) return back(req, "error=size");

  // Detect the real type from magic bytes — never trust file.type or the filename.
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniffImage(bytes);
  if (!type) return back(req, "error=type");

  const name = `${safeBaseName(file.name)}-${Date.now().toString(36)}.${ALLOWED_IMAGE[type]}`;
  const contentType = `image/${ALLOWED_IMAGE[type]}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await put(`media/${name}`, Buffer.from(bytes), { access: "public", contentType, addRandomSuffix: false });
      return back(req, "ok=1");
    } catch (e) {
      console.error("[media] blob put failed", e);
      return back(req, "error=write");
    }
  }
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(bytes));
  } catch (err) {
    console.error("[media] upload failed", err);
    return back(req, "error=write");
  }
  return back(req, "ok=1");
}
