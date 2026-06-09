import { getDb } from "./client";
import { services as siteServices, faqsHome, faqsGmp, faqsContractQp, faqsQms, faqsSiteReadiness, faqsSupplier, faqsGdp, site } from "@/lib/site";

/* ===================================================================== types */
export type Post = {
  id: string; slug: string; title: string; excerpt: string | null; body: string;
  cover_image: string | null; faqs: string | null; category: string | null; status: string; author: string | null;
  reading_minutes: number; views: number; created_at: string; updated_at: string;
};
export type Faq = { id: string; question: string; answer: string; category: string | null; order_index: number; published: number; };
export type Service = { id: string; slug: string; title: string; short: string; body: string | null; icon: string | null; order_index: number; published: number; };
export type CaseStudy = { id: string; slug: string; title: string; sector: string | null; summary: string | null; challenge: string | null; approach: string | null; outcome: string | null; status: string; updated_at: string; };
export type Subscriber = { id: string; email: string; status: string; created_at: string; };

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);
}
const uid = () => crypto.randomUUID();

/* ================================================================== schema */
let ready: Promise<void> | null = null;
function ensure() {
  if (!ready) ready = init();
  return ready;
}
async function init() {
  const db = getDb();
  await db.batch([
    `CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL,
      excerpt TEXT, body TEXT NOT NULL, category TEXT, status TEXT NOT NULL DEFAULT 'draft',
      author TEXT, reading_minutes INTEGER DEFAULT 3, views INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS faqs (id TEXT PRIMARY KEY, question TEXT NOT NULL, answer TEXT NOT NULL,
      category TEXT, order_index INTEGER DEFAULT 0, published INTEGER DEFAULT 1)`,
    `CREATE TABLE IF NOT EXISTS services (id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL,
      short TEXT NOT NULL, body TEXT, icon TEXT, order_index INTEGER DEFAULT 0, published INTEGER DEFAULT 1)`,
    `CREATE TABLE IF NOT EXISTS case_studies (id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL,
      sector TEXT, summary TEXT, challenge TEXT, approach TEXT, outcome TEXT, status TEXT NOT NULL DEFAULT 'draft',
      updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS subscribers (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
  ], "write");
  // Migrations: add columns when upgrading an existing database.
  try { await db.execute("ALTER TABLE posts ADD COLUMN cover_image TEXT"); } catch { /* column already exists */ }
  try { await db.execute("ALTER TABLE posts ADD COLUMN faqs TEXT"); } catch { /* column already exists */ }
  await seed(db);
}

async function seed(db: ReturnType<typeof getDb>) {
  const empty = async (t: string) => Number((await db.execute(`SELECT COUNT(*) c FROM ${t}`)).rows[0].c) === 0;

  if (await empty("faqs")) {
    const groups: [string, { q: string; a: string }[]][] = [
      ["General", faqsHome], ["GMP & GDP Audits", faqsGmp], ["Contract QP, RP & RPi", faqsContractQp],
      ["QMS & PQS", faqsQms], ["Site Readiness", faqsSiteReadiness], ["Supplier & Vendor", faqsSupplier],
      ["GDP Supply Chain", faqsGdp],
    ];
    let i = 0;
    for (const [cat, list] of groups)
      for (const f of list)
        await db.execute({ sql: `INSERT INTO faqs (id,question,answer,category,order_index,published) VALUES (?,?,?,?,?,1)`,
          args: [uid(), f.q, f.a, cat, i++] });
  }
  if (await empty("services")) {
    let i = 0;
    for (const s of siteServices)
      await db.execute({ sql: `INSERT INTO services (id,slug,title,short,body,icon,order_index,published) VALUES (?,?,?,?,?,?,?,1)`,
        args: [uid(), s.slug, s.title, s.short, s.metaDescription, s.icon, i++] });
  }
  if (await empty("settings")) {
    const set = (k: string, v: unknown) => db.execute({ sql: `INSERT INTO settings (key,value) VALUES (?,?)`, args: [k, JSON.stringify(v)] });
    await set("contact", { email: site.contact.email, phone: site.contact.phoneDisplay, locality: site.contact.locality, region: site.contact.region });
    await set("social", { linkedin: site.social.linkedin });
    await set("seo", { metaTitle: `${site.name} — ${site.tagline}`, metaDescription: site.description });
  }
}

/* ================================================================== posts */
export async function listPosts(): Promise<Post[]> {
  await ensure();
  return (await getDb().execute("SELECT * FROM posts ORDER BY updated_at DESC")).rows as unknown as Post[];
}
export async function listPublishedPosts(): Promise<Post[]> {
  await ensure();
  return (await getDb().execute("SELECT * FROM posts WHERE status='published' ORDER BY created_at DESC")).rows as unknown as Post[];
}
export async function getPost(id: string): Promise<Post | null> {
  await ensure();
  return ((await getDb().execute({ sql: "SELECT * FROM posts WHERE id=?", args: [id] })).rows[0] as unknown as Post) ?? null;
}
export async function getPostBySlug(slug: string): Promise<Post | null> {
  await ensure();
  return ((await getDb().execute({ sql: "SELECT * FROM posts WHERE slug=?", args: [slug] })).rows[0] as unknown as Post) ?? null;
}
export async function upsertPost(p: { id?: string; title: string; slug?: string; excerpt?: string; body: string; cover_image?: string; faqs?: string; category?: string; status: string; author?: string }) {
  await ensure();
  const slug = p.slug?.trim() || slugify(p.title);
  if (p.id) {
    await getDb().execute({
      sql: `UPDATE posts SET title=?, slug=?, excerpt=?, body=?, cover_image=?, faqs=?, category=?, status=?, updated_at=datetime('now') WHERE id=?`,
      args: [p.title, slug, p.excerpt || null, p.body, p.cover_image || null, p.faqs || null, p.category || null, p.status, p.id],
    });
    return p.id;
  }
  const id = uid();
  await getDb().execute({
    sql: `INSERT INTO posts (id,slug,title,excerpt,body,cover_image,faqs,category,status,author) VALUES (?,?,?,?,?,?,?,?,?,?)`,
    args: [id, slug, p.title, p.excerpt || null, p.body, p.cover_image || null, p.faqs || null, p.category || null, p.status, p.author || "B. Subramanian"],
  });
  return id;
}
export async function deletePost(id: string) {
  await ensure();
  await getDb().execute({ sql: "DELETE FROM posts WHERE id=?", args: [id] });
}

/* ================================================================== faqs */
export async function listFaqs(): Promise<Faq[]> {
  await ensure();
  return (await getDb().execute("SELECT * FROM faqs ORDER BY order_index")).rows as unknown as Faq[];
}
export async function listPublishedFaqs(): Promise<Faq[]> {
  await ensure();
  return (await getDb().execute("SELECT * FROM faqs WHERE published=1 ORDER BY order_index")).rows as unknown as Faq[];
}
export async function getFaq(id: string): Promise<Faq | null> {
  await ensure();
  return ((await getDb().execute({ sql: "SELECT * FROM faqs WHERE id=?", args: [id] })).rows[0] as unknown as Faq) ?? null;
}
export async function upsertFaq(f: { id?: string; question: string; answer: string; category?: string; published: boolean }) {
  await ensure();
  if (f.id) {
    await getDb().execute({ sql: `UPDATE faqs SET question=?, answer=?, category=?, published=? WHERE id=?`,
      args: [f.question, f.answer, f.category || null, f.published ? 1 : 0, f.id] });
    return f.id;
  }
  const id = uid();
  await getDb().execute({ sql: `INSERT INTO faqs (id,question,answer,category,published) VALUES (?,?,?,?,?)`,
    args: [id, f.question, f.answer, f.category || null, f.published ? 1 : 0] });
  return id;
}
export async function deleteFaq(id: string) {
  await ensure();
  await getDb().execute({ sql: "DELETE FROM faqs WHERE id=?", args: [id] });
}

/* ============================================================== services */
export async function listServices(): Promise<Service[]> {
  await ensure();
  return (await getDb().execute("SELECT * FROM services ORDER BY order_index")).rows as unknown as Service[];
}
export async function getService(id: string): Promise<Service | null> {
  await ensure();
  return ((await getDb().execute({ sql: "SELECT * FROM services WHERE id=?", args: [id] })).rows[0] as unknown as Service) ?? null;
}
export async function updateService(s: { id: string; title: string; short: string; body?: string; order_index: number; published: boolean }) {
  await ensure();
  await getDb().execute({ sql: `UPDATE services SET title=?, short=?, body=?, order_index=?, published=? WHERE id=?`,
    args: [s.title, s.short, s.body || null, s.order_index, s.published ? 1 : 0, s.id] });
}

/* =========================================================== case studies */
export async function listCaseStudies(): Promise<CaseStudy[]> {
  await ensure();
  return (await getDb().execute("SELECT * FROM case_studies ORDER BY updated_at DESC")).rows as unknown as CaseStudy[];
}
export async function listPublishedCaseStudies(): Promise<CaseStudy[]> {
  await ensure();
  return (await getDb().execute("SELECT * FROM case_studies WHERE status='published' ORDER BY updated_at DESC")).rows as unknown as CaseStudy[];
}
export async function getCaseStudy(id: string): Promise<CaseStudy | null> {
  await ensure();
  return ((await getDb().execute({ sql: "SELECT * FROM case_studies WHERE id=?", args: [id] })).rows[0] as unknown as CaseStudy) ?? null;
}
export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  await ensure();
  return ((await getDb().execute({ sql: "SELECT * FROM case_studies WHERE slug=?", args: [slug] })).rows[0] as unknown as CaseStudy) ?? null;
}
export async function upsertCaseStudy(c: { id?: string; title: string; slug?: string; sector?: string; summary?: string; challenge?: string; approach?: string; outcome?: string; status: string }) {
  await ensure();
  const slug = c.slug?.trim() || slugify(c.title);
  if (c.id) {
    await getDb().execute({
      sql: `UPDATE case_studies SET title=?, slug=?, sector=?, summary=?, challenge=?, approach=?, outcome=?, status=?, updated_at=datetime('now') WHERE id=?`,
      args: [c.title, slug, c.sector || null, c.summary || null, c.challenge || null, c.approach || null, c.outcome || null, c.status, c.id],
    });
    return c.id;
  }
  const id = uid();
  await getDb().execute({
    sql: `INSERT INTO case_studies (id,slug,title,sector,summary,challenge,approach,outcome,status) VALUES (?,?,?,?,?,?,?,?,?)`,
    args: [id, slug, c.title, c.sector || null, c.summary || null, c.challenge || null, c.approach || null, c.outcome || null, c.status],
  });
  return id;
}
export async function deleteCaseStudy(id: string) {
  await ensure();
  await getDb().execute({ sql: "DELETE FROM case_studies WHERE id=?", args: [id] });
}

/* ============================================================ subscribers */
export async function listSubscribers(): Promise<Subscriber[]> {
  await ensure();
  return (await getDb().execute("SELECT * FROM subscribers ORDER BY created_at DESC")).rows as unknown as Subscriber[];
}
export async function addSubscriber(email: string) {
  await ensure();
  await getDb().execute({ sql: `INSERT OR IGNORE INTO subscribers (id,email,status) VALUES (?,?, 'pending')`, args: [uid(), email.toLowerCase()] });
}

/* =============================================================== settings */
export async function getSettings(): Promise<Record<string, Record<string, string>>> {
  await ensure();
  const { rows } = await getDb().execute("SELECT key,value FROM settings");
  const out: Record<string, Record<string, string>> = {};
  for (const r of rows) out[String(r.key)] = JSON.parse(String(r.value));
  return out;
}
export async function saveSetting(key: string, value: Record<string, string>) {
  await ensure();
  await getDb().execute({
    sql: `INSERT INTO settings (key,value,updated_at) VALUES (?,?,datetime('now'))
          ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=datetime('now')`,
    args: [key, JSON.stringify(value)],
  });
}
