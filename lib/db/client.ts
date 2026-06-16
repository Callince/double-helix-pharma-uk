import { createClient, type Client } from "@libsql/client";
import fs from "node:fs";
import path from "node:path";

/**
 * SQLite via libSQL.
 *  - Local dev:  a gitignored file at ./.data/dh.db
 *  - Vercel:     ./tmp (writable but EPHEMERAL — resets on cold start / not shared
 *                across instances). Fine for a demo; for durable storage set
 *                DATABASE_URL/TURSO_DATABASE_URL (+ TURSO_AUTH_TOKEN) to a Turso DB.
 *  - Explicit:   DATABASE_URL or TURSO_DATABASE_URL always wins.
 */
function resolve(): { url: string; authToken?: string } {
  const explicit = process.env.DATABASE_URL || process.env.TURSO_DATABASE_URL;
  if (explicit) return { url: explicit, authToken: process.env.TURSO_AUTH_TOKEN };
  // Fail closed in production: an ephemeral /tmp DB silently loses data AND
  // re-seeds the default admin on every cold start. Require a durable DB (Turso).
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    throw new Error(
      "No database configured. Set DATABASE_URL or TURSO_DATABASE_URL (+ TURSO_AUTH_TOKEN) in production.",
    );
  }
  const dir = path.join(process.cwd(), ".data");
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch {
    /* ignore */
  }
  return { url: "file:.data/dh.db" };
}

let client: Client | null = null;

export function getDb(): Client {
  if (!client) {
    const { url, authToken } = resolve();
    client = createClient(authToken ? { url, authToken } : { url });
  }
  return client;
}
