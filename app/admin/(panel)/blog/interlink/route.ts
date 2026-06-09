import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/admin/guard";
import {
  aiConfigured,
  htmlToText,
  suggestInterlinks,
  applyInterlinks,
  stripAutoLinks,
  getLinkTargets,
} from "@/lib/ai/interlink";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!aiConfigured()) {
    return NextResponse.json({ error: "AI is not configured — add OPENROUTER_API_KEY." }, { status: 400 });
  }

  let html = "";
  let slug = "";
  try {
    const j = await req.json();
    html = String(j.html ?? "");
    slug = String(j.slug ?? "");
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!html.trim()) {
    return NextResponse.json({ error: "Write some content first." }, { status: 400 });
  }

  const clean = stripAutoLinks(html);
  const targets = await getLinkTargets(slug || undefined);
  const suggestions = await suggestInterlinks(htmlToText(clean), targets, 6);
  const linked = applyInterlinks(clean, suggestions);
  const added = (linked.match(/data-ai-link="1"/g) || []).length;

  return NextResponse.json({ html: linked, added });
}
