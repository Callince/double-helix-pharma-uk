/**
 * Create (or update) an admin user in the app's `users` table.
 *
 * Run on YOUR machine with the production DB credentials available. Easiest:
 * create a gitignored `.env.prod.local` in the project root with:
 *     TURSO_DATABASE_URL=libsql://<your-db>.turso.io
 *     TURSO_AUTH_TOKEN=<your-token>
 * (copy both from Vercel → Project → Settings → Environment Variables, or the
 *  Turso dashboard), then run:
 *
 *     node scripts/create-admin.mjs devi@demo.com "Good@1234" "Devi"
 *
 * Args: <email> <password> [full name] [role]   (role defaults to "admin")
 * The password is hashed with scrypt — identical to lib/auth/crypto.ts — so it
 * is NEVER stored or committed in plaintext. If the email already exists, its
 * password/name/role are updated.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import { createClient } from "@libsql/client";

// Pull TURSO_* from .env.prod.local (if present) without overriding real env vars.
try {
  for (const line of fs.readFileSync(".env.prod.local", "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!(k in process.env)) process.env[k] = v;
  }
} catch { /* no .env.prod.local — rely on real env vars */ }

const url = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) {
  console.error("✗ Missing TURSO_DATABASE_URL (or DATABASE_URL). Put it in .env.prod.local or set it in your shell.");
  process.exit(1);
}

const [, , emailArg, passwordArg, nameArg, roleArg] = process.argv;
const email = (emailArg || "").trim().toLowerCase();
const password = passwordArg || "";
const fullName = nameArg || "Admin";
const role = (roleArg || "admin").toLowerCase();
if (!email || !password) {
  console.error('Usage: node scripts/create-admin.mjs <email> <password> [full name] [role]');
  process.exit(1);
}

function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(pw, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const db = createClient(authToken ? { url, authToken } : { url });
await db.execute(`CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'editor',
  created_at TEXT NOT NULL DEFAULT (datetime('now')))`);
await db.execute({
  sql: `INSERT INTO users (id,email,password_hash,full_name,role) VALUES (?,?,?,?,?)
        ON CONFLICT(email) DO UPDATE SET password_hash=excluded.password_hash, full_name=excluded.full_name, role=excluded.role`,
  args: [crypto.randomUUID(), email, hashPassword(password), fullName, role],
});
const { rows } = await db.execute({ sql: "SELECT email, full_name, role, created_at FROM users WHERE email=?", args: [email] });
console.log("✓ Admin ready:", rows[0]);
console.log("→ Sign in at /admin/login");
