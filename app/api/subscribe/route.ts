import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/db/content";
import { rateLimit, clientIp } from "@/lib/rate-limit";

/**
 * Public newsletter signup. Stores the email in the `subscribers` table
 * (status 'pending'); duplicates are ignored. Bots are caught by a honeypot.
 * View subscribers at /admin/subscribers.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  // Abuse throttle: 5 signups / 10 min per IP (no Turnstile on this form).
  const rl = rateLimit(`subscribe:${clientIp(request)}`, 5, 10 * 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // Honeypot — silently accept bot submissions.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    await addSubscriber(email);
  } catch (err) {
    console.error("[subscribe] failed", err);
    return NextResponse.json({ ok: false, error: "Couldn't subscribe right now — please try again." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
