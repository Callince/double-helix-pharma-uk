// Cloudflare Turnstile server-side verification.
// In dev/preview we fall back to Cloudflare's "always passes" TEST secret so the
// form works without setup. In PRODUCTION a real TURNSTILE_SECRET_KEY is required
// (+ NEXT_PUBLIC_TURNSTILE_SITE_KEY); without it, verification fails closed.
const TEST_SECRET = "1x0000000000000000000000000000000AA";

function resolveSecret(): string | null {
  const s = process.env.TURNSTILE_SECRET_KEY;
  if (s) return s;
  if (process.env.NODE_ENV !== "production") return TEST_SECRET;
  return null; // production must configure a real key
}

export async function verifyTurnstile(token: string, remoteip?: string): Promise<boolean> {
  if (!token) return false;
  const secret = resolveSecret();
  if (!secret) {
    console.error("[turnstile] TURNSTILE_SECRET_KEY is not set — rejecting submission.");
    return false;
  }
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    // Fail CLOSED on a network/Turnstile outage so the check can't be bypassed by
    // inducing an error. (Rate limiting on the route bounds the impact either way.)
    console.error("[turnstile] verification request failed", err);
    return false;
  }
}
