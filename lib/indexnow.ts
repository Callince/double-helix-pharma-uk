import { site } from "./site";

// Public IndexNow key (Bing Webmaster) — also hosted at /<key>.txt for ownership verification.
const KEY = "e92a46dbc34a4e9597a2dc32956acad6";

/**
 * Notify Bing / IndexNow that URLs were added or updated so they're recrawled quickly.
 * Only fires on the live production deploy, and NEVER throws — a failed ping must never
 * break a content save. Call with site-relative paths (e.g. "/blog/my-post") or full URLs.
 */
export async function pingIndexNow(paths: string[]): Promise<void> {
  if (process.env.VERCEL_ENV !== "production") return; // skip local dev + preview deploys
  const urlList = [...new Set(paths)].map((p) => (p.startsWith("http") ? p : `${site.url}${p}`));
  if (!urlList.length) return;
  try {
    await fetch("https://www.bing.com/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(site.url).host,
        key: KEY,
        keyLocation: `${site.url}/${KEY}.txt`,
        urlList,
      }),
    });
  } catch (err) {
    console.error("[indexnow] ping failed", err);
  }
}
