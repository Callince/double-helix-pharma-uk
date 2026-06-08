import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth gate for /admin/*. Verifies the HMAC-signed session cookie at the edge
 * (Web Crypto) — no DB call needed. The cookie is issued by /api/auth/login
 * after a real email + password check against the users table.
 */
export const config = { matcher: ["/admin", "/admin/:path*"] };

const SECRET = process.env.AUTH_SECRET || "dev-insecure-secret-change-in-production";

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

async function valid(token?: string): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [userId, exp, sig] = parts;
  if (!exp || Date.now() > Number(exp)) return false;
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(SECRET) as BufferSource,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    return await crypto.subtle.verify(
      "HMAC",
      key,
      hexToBytes(sig) as BufferSource,
      enc.encode(`${userId}.${exp}`) as BufferSource,
    );
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();

  if (await valid(req.cookies.get("dh_session")?.value)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("from", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}
