import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db/users";
import { verifyPassword, signSession, SESSION_COOKIE } from "@/lib/auth/crypto";

export async function POST(req: Request) {
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
