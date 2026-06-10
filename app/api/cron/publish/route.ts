import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { publishDuePosts } from "@/lib/db/content";

/**
 * Daily cron target (configured in vercel.json) that drip-publishes any scheduled
 * post whose publish_at has arrived. Vercel sends `Authorization: Bearer $CRON_SECRET`
 * when the CRON_SECRET env var is set — we verify it when present.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const published = await publishDuePosts();
    if (published > 0) {
      revalidatePath("/blog");
      revalidatePath("/admin/blog");
    }
    return NextResponse.json({ ok: true, published });
  } catch (err) {
    console.error("[cron/publish] failed", err);
    return NextResponse.json({ ok: false, error: "publish failed" }, { status: 500 });
  }
}
