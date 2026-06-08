import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Lightweight access gate for /admin/*.
 * Protection is ON only when ADMIN_GATE_PASSWORD is set (so local dev stays open).
 * The login page sets an httpOnly cookie = SHA-256(password) via /api/admin-gate;
 * this middleware re-derives the expected hash and lets the request through if it matches.
 * This is a perimeter gate, NOT real auth — the backend implements proper auth (spec §7).
 */
export const config = { matcher: ["/admin", "/admin/:path*"] };

async function sha256hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(req: NextRequest) {
  const password = process.env.ADMIN_GATE_PASSWORD;

  // Gate disabled when no password is configured.
  if (!password) return NextResponse.next();

  // The sign-in page must always be reachable.
  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();

  const expected = await sha256hex(password);
  const token = req.cookies.get("dh_gate")?.value;
  if (token === expected) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("from", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}
