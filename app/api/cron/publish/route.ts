import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { publishDuePosts } from "@/lib/db/content";
import { pingIndexNow } from "@/lib/indexnow";

/**
 * Daily cron target (configured in vercel.json) that drip-publishes any scheduled
 * post whose publish_at has arrived. Vercel sends `Authorization: Bearer $CRON_SECRET`
 * when the CRON_SECRET env var is set — we verify it when present.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // Fail closed in production: an unauthenticated trigger must not be possible.
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    // dev only: allow unauthenticated runs for local testing.
  } else if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const slugs = await publishDuePosts();
    if (slugs.length > 0) {
      revalidatePath("/blog");
      revalidatePath("/admin/blog");
      await pingIndexNow([...slugs.map((s) => `/blog/${s}`), "/blog"]);
    }
    return NextResponse.json({ ok: true, published: slugs.length });
  } catch (err) {
    console.error("[cron/publish] failed", err);
    return NextResponse.json({ ok: false, error: "publish failed" }, { status: 500 });
  }
}
