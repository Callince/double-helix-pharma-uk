/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * NOTE: counters live in the process, so on serverless / multi-instance hosts
 * each instance keeps its own (limits are effectively per-instance). It still
 * adds meaningful friction against bursty abuse and password brute-forcing.
 * For strict global limits, back this with Turso/Upstash/Redis.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateResult = { ok: boolean; retryAfter: number };

export function rateLimit(key: string, limit: number, windowMs: number): RateResult {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (now >= b.resetAt) buckets.delete(k);
  }
  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  b.count += 1;
  if (b.count > limit) {
    return { ok: false, retryAfter: Math.max(1, Math.ceil((b.resetAt - now) / 1000)) };
  }
  return { ok: true, retryAfter: 0 };
}

/** Best-effort client IP from common proxy headers (Cloudflare / Vercel). */
export function clientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}
