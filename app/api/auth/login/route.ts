import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db/users";
import { verifyPassword, signSession, SESSION_COOKIE } from "@/lib/auth/crypto";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Brute-force throttle: 10 attempts / 10 min per IP.
  const rl = rateLimit(`login:ip:${clientIp(req)}`, 10, 10 * 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let body: { email?: string; password?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }
  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  // Per-account throttle to slow targeted guessing even across IPs.
  const rlAcct = rateLimit(`login:acct:${email.toLowerCase()}`, 10, 10 * 60_000);
  if (!rlAcct.ok) {
    return NextResponse.json(
      { error: "Too many attempts for this account. Please wait a few minutes." },
      { status: 429, headers: { "Retry-After": String(rlAcct.retryAfter) } },
    );
  }

  let user;
  try {
    user = await getUserByEmail(email);
  } catch (err) {
    console.error("[auth] login lookup failed", err);
    return NextResponse.json({ error: "Sign-in is temporarily unavailable." }, { status: 503 });
  }

  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, user: { name: user.full_name, role: user.role } });
  res.cookies.set(SESSION_COOKIE, signSession(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
