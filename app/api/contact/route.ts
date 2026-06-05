import { NextResponse } from "next/server";

/**
 * Contact form handler.
 *
 * Works with no secrets out of the box (logs the enquiry and returns success).
 * To deliver enquiries by email, set RESEND_API_KEY (or your provider of choice)
 * and replace the TODO below. See LAUNCH-CHECKLIST.md.
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

  // Honeypot — silently accept bot submissions.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !email || !message || !email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Missing or invalid fields" }, { status: 400 });
  }

  // TODO: deliver the enquiry (e.g. Resend, SMTP, CRM webhook).
  console.log("[contact] new enquiry", {
    name,
    email,
    company: body.company ?? "",
    service: body.service ?? "",
  });

  return NextResponse.json({ ok: true });
}
