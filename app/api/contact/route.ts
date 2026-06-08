import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/lib/site";
import { createEnquiry } from "@/lib/db/enquiries";
import { verifyTurnstile } from "@/lib/turnstile";

/**
 * Contact form handler.
 *  1. Persists the enquiry to SQLite (primary capture).
 *  2. Sends an email notification via Resend (best-effort — RESEND_API_KEY set).
 * Succeeds as long as the enquiry is captured somewhere, so a transient email
 * failure never loses (or appears to reject) a lead.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const company = String(body.company ?? "").trim();
  const service = String(body.service ?? "").trim();

  // Honeypot — silently accept bot submissions.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !email || !message || !email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Missing or invalid fields" }, { status: 400 });
  }

  // Anti-bot — verify the Cloudflare Turnstile token.
  const turnstileToken = String(body["cf-turnstile-response"] ?? "");
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    undefined;
  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return NextResponse.json({ ok: false, error: "Verification failed. Please try again." }, { status: 400 });
  }

  // 1) Persist to SQLite (primary capture).
  let persisted = false;
  try {
    await createEnquiry({ name, email, company, service, message, pagePath: "/contact" });
    persisted = true;
  } catch (err) {
    console.error("[contact] persist failed", err);
  }

  // 2) Email notification (best-effort).
  const apiKey = process.env.RESEND_API_KEY;
  let emailed = false;
  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      const to = process.env.CONTACT_TO || site.contact.email;
      const from = process.env.CONTACT_FROM || "Double Helix Pharma <onboarding@resend.dev>";
      const { error } = await resend.emails.send({
        from,
        to,
        replyTo: email,
        subject: `Website enquiry — ${service || "General"} — ${name}`,
        text: [
          "New enquiry from the Double Helix Pharma website",
          "",
          `Name:    ${name}`,
          `Company: ${company || "—"}`,
          `Email:   ${email}`,
          `Service: ${service || "—"}`,
          "",
          "Message:",
          message,
        ].join("\n"),
      });
      if (error) console.error("[contact] Resend error", error);
      else emailed = true;
    } catch (err) {
      console.error("[contact] send failed", err);
    }
  } else {
    console.log("[contact] enquiry stored (no RESEND_API_KEY set)", { name, email, company, service });
  }

  // Success if captured anywhere (DB or email), or in dev with no email configured.
  if (persisted || emailed || !apiKey) {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false, error: "Could not record your enquiry" }, { status: 502 });
}
