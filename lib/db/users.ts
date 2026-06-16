import { getDb } from "./client";
import { hashPassword } from "@/lib/auth/crypto";

export type User = {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "editor" | "viewer";
  created_at: string;
};
type UserWithHash = User & { password_hash: string };

const DEFAULT_EMAIL = process.env.ADMIN_EMAIL || "admin@doublehelixpharma.co.uk";
const DEFAULT_NAME = "B. Subramanian";

let schemaReady: Promise<void> | null = null;
function ensureSchema() {
  if (!schemaReady) schemaReady = init();
  return schemaReady;
}

async function init() {
  const db = getDb();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      email         TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name     TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'editor',
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  const { rows } = await db.execute("SELECT COUNT(*) AS c FROM users");
  if (Number(rows[0].c) === 0) {
    const password = process.env.ADMIN_PASSWORD;
    // Never auto-create a known-password admin in production.
    if (!password && process.env.NODE_ENV === "production") {
      console.warn(
        "[users] No admin seeded — set ADMIN_PASSWORD or run `node scripts/create-admin.mjs <email> <password>`.",
      );
      return;
    }
    if (!password) {
      console.warn("[users] Seeding a DEV-only admin with a fallback password; set ADMIN_PASSWORD for real use.");
    }
    await db.execute({
      sql: "INSERT INTO users (id,email,password_hash,full_name,role) VALUES (?,?,?,?,?)",
      args: [crypto.randomUUID(), DEFAULT_EMAIL.toLowerCase(), hashPassword(password || "dev-admin-change-me"), DEFAULT_NAME, "admin"],
    });
  }
}

export async function getUserByEmail(email: string): Promise<UserWithHash | null> {
  await ensureSchema();
  const { rows } = await getDb().execute({
    sql: "SELECT * FROM users WHERE email = ?",
    args: [email.trim().toLowerCase()],
  });
  return (rows[0] as unknown as UserWithHash) ?? null;
}

export async function getUserById(id: string): Promise<User | null> {
  await ensureSchema();
  const { rows } = await getDb().execute({
    sql: "SELECT id,email,full_name,role,created_at FROM users WHERE id = ?",
    args: [id],
  });
  return (rows[0] as unknown as User) ?? null;
}

export async function listUsers(): Promise<User[]> {
  await ensureSchema();
  const { rows } = await getDb().execute("SELECT id,email,full_name,role,created_at FROM users ORDER BY created_at");
  return rows as unknown as User[];
}
