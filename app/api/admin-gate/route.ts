import { NextResponse } from "next/server";

async function sha256hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(req: Request) {
  const password = process.env.ADMIN_GATE_PASSWORD;

  let body: { password?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }

  // When no gate is configured (local dev) any attempt succeeds.
  const ok = !password || body.password === password;
  if (!ok) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  if (password) {
    const token = await sha256hex(password);
    res.cookies.set("dh_gate", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }
  return res;
}
