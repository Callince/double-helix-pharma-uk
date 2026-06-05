import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/lib/site";

/**
 * Contact form handler.
 *
 * - No env vars set    → logs the enquiry and returns success (safe for dev/preview).
 * - RESEND_API_KEY set → emails the enquiry via Resend (free tier: 3k/month).
 *     Optional: CONTACT_TO   (recipient; defaults to site.contact.email)
 *               CONTACT_FROM (verified sender; defaults to Resend's test sender)
 * See LAUNCH-CHECKLIST.md.
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

  const apiKey = process.env.RESEND_API_KEY;

  // No key configured → log and accept (keeps dev/preview working without secrets).
  if (!apiKey) {
    console.log("[contact] enquiry (no RESEND_API_KEY set)", { name, email, company, service });
    return NextResponse.json({ ok: true });
  }

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

    if (error) {
      console.error("[contact] Resend error", error);
      return NextResponse.json({ ok: false, error: "Email delivery failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] send failed", err);
    return NextResponse.json({ ok: false, error: "Email delivery failed" }, { status: 502 });
  }
}
