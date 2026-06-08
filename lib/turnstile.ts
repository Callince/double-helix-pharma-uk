// Cloudflare Turnstile server-side verification.
// Defaults to Cloudflare's "always passes" TEST secret so the form works in dev/
// preview without setup. Set TURNSTILE_SECRET_KEY (+ NEXT_PUBLIC_TURNSTILE_SITE_KEY)
// to your real keys for genuine bot protection in production.
const SECRET = process.env.TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA";

export async function verifyTurnstile(token: string, remoteip?: string): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: SECRET, response: token, remoteip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    // Fail-open on a network/Turnstile outage so we never silently lose a real enquiry.
    console.error("[turnstile] verification request failed", err);
    return true;
  }
}
