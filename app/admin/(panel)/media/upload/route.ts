import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { getSessionUser } from "@/lib/admin/guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED = new Set(["image/webp", "image/png", "image/jpeg", "image/gif", "image/svg+xml"]);
const MAX = 5 * 1024 * 1024; // 5 MB

function back(req: Request, q: string) {
  return NextResponse.redirect(new URL(`/admin/media?${q}`, req.url), { status: 303 });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let file: FormDataEntryValue | null = null;
  try {
    file = (await req.formData()).get("file");
  } catch {
    return back(req, "error=upload");
  }
  if (!(file instanceof File) || file.size === 0) return back(req, "error=nofile");
  if (!ALLOWED.has(file.type)) return back(req, "error=type");
  if (file.size > MAX) return back(req, "error=size");

  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5);
  const base =
    file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40) || "image";
  const name = `${base}-${Date.now().toString(36)}.${ext}`;

  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  } catch (err) {
    console.error("[media] upload failed", err);
    return back(req, "error=write");
  }
  return back(req, "ok=1");
}
