import { getDb } from "./client";

export type EnquiryRow = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  service: string | null;
  message: string;
  status: string;
  source: string | null;
  page_path: string | null;
  created_at: string;
};

let schemaReady: Promise<void> | null = null;
function ensureSchema() {
  if (!schemaReady) schemaReady = init();
  return schemaReady;
}

async function init() {
  const db = getDb();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      company    TEXT,
      phone      TEXT,
      service    TEXT,
      message    TEXT NOT NULL,
      status     TEXT NOT NULL DEFAULT 'new',
      source     TEXT DEFAULT 'contact_form',
      page_path  TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries(created_at)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status)`);
}

function newId() {
  return "ENQ-" + crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
}

export async function createEnquiry(input: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  message: string;
  pagePath?: string;
  source?: string;
}): Promise<string> {
  await ensureSchema();
  const id = newId();
  await getDb().execute({
    sql: `INSERT INTO enquiries (id,name,email,company,phone,service,message,source,page_path)
          VALUES (?,?,?,?,?,?,?,?,?)`,
    args: [
      id, input.name, input.email, input.company || null, input.phone || null,
      input.service || null, input.message, input.source || "contact_form", input.pagePath || null,
    ],
  });
  return id;
}

export async function listEnquiries(): Promise<EnquiryRow[]> {
  await ensureSchema();
  const { rows } = await getDb().execute("SELECT * FROM enquiries ORDER BY created_at DESC");
  return rows as unknown as EnquiryRow[];
}

export async function updateEnquiryStatus(id: string, status: string): Promise<void> {
  await ensureSchema();
  await getDb().execute({ sql: "UPDATE enquiries SET status = ? WHERE id = ?", args: [status, id] });
}

export async function enquiryStats(): Promise<{ total: number; newCount: number }> {
  await ensureSchema();
  const { rows } = await getDb().execute(
    "SELECT COUNT(*) AS total, SUM(CASE WHEN status='new' THEN 1 ELSE 0 END) AS n FROM enquiries"
  );
  return { total: Number(rows[0].total ?? 0), newCount: Number(rows[0].n ?? 0) };
}
