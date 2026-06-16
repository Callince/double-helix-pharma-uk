import crypto from "node:crypto";

const DEV_FALLBACK = "dev-insecure-secret-change-in-production";

/** Resolve the signing secret. Fails closed: refuses the insecure dev default in production. */
function getSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (s && s !== DEV_FALLBACK) return s;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET must be set to a strong, unique value in production.");
  }
  return DEV_FALLBACK;
}

/* ----------------------------------------------------------------- passwords */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(test, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* --------------------------------------------------- signed session cookies */
// token = `${userId}.${expiresAtMs}.${hmacHex}` — verifiable at the edge (HMAC-SHA256).
export function signSession(userId: string, ttlDays = 30): string {
  const exp = Date.now() + ttlDays * 86_400_000;
  const payload = `${userId}.${exp}`;
  const sig = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySession(token?: string | null): { userId: string } | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, exp, sig] = parts;
  const expected = crypto.createHmac("sha256", getSecret()).update(`${userId}.${exp}`).digest("hex");
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  if (Date.now() > Number(exp)) return null;
  return { userId };
}

export const SESSION_COOKIE = "dh_session";
