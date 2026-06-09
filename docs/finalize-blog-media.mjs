// Rasterise infographics to WebP, re-embed in CKEditor-native <figure class="image">,
// set the cover image, and re-seed all posts. Needs .env.prod.local (Turso creds).
//   node docs/build_blog_covers.mjs   (run first to make the cover WebPs)
//   node docs/finalize-blog-media.mjs
import { createClient } from "@libsql/client";
import fs from "node:fs";
import crypto from "node:crypto";
import sharp from "sharp";

const env = Object.fromEntries(
  fs.readFileSync(".env.prod.local", "utf8").split(/\r?\n/).filter((l) => l && l.includes("=")).map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }),
);
const db = createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });

const dir = "docs/generated-blogs";
const igDir = "public/blog/infographics";
const metas = fs.readdirSync(dir).filter((f) => f.endsWith(".meta.json"));
const stmts = [];
let ig = 0, cov = 0;

for (const mf of metas) {
  const meta = JSON.parse(fs.readFileSync(dir + "/" + mf, "utf8"));
  const slug = meta.slug;

  // 1) infographic SVG -> crisp WebP (reliable in CKEditor + everywhere)
  const svg = igDir + "/" + slug + ".svg";
  if (fs.existsSync(svg)) {
    await sharp(fs.readFileSync(svg), { density: 220 }).resize({ width: 1240 }).webp({ quality: 88 }).toFile(igDir + "/" + slug + ".webp");
    ig++;
  }

  // 2) rewrite the embedded infographic to WebP + CKEditor-native figure
  let body = fs.readFileSync(dir + "/" + slug + ".html", "utf8");
  body = body.split("/blog/infographics/" + slug + ".svg").join("/blog/infographics/" + slug + ".webp");
  body = body.replace('<figure><img src="/blog/infographics/' + slug + '.webp"', '<figure class="image"><img src="/blog/infographics/' + slug + '.webp"');
  fs.writeFileSync(dir + "/" + slug + ".html", body);

  // 3) cover image
  const cover = fs.existsSync("public/blog/covers/" + slug + ".webp") ? "/blog/covers/" + slug + ".webp" : (meta.cover_image || null);
  if (cover) cov++;

  const faqs = Array.isArray(meta.faqs) && meta.faqs.length ? JSON.stringify(meta.faqs) : null;
  stmts.push({
    sql: `INSERT INTO posts (id,slug,title,excerpt,body,cover_image,faqs,category,status,author,reading_minutes) VALUES (?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(slug) DO UPDATE SET body=excluded.body, cover_image=excluded.cover_image, faqs=excluded.faqs, status=excluded.status, updated_at=datetime('now')`,
    args: [crypto.randomUUID(), slug, meta.title, meta.excerpt || null, body, cover, faqs, meta.category || null, meta.status || "draft", meta.author || "B. Subramanian", meta.reading_minutes || 6],
  });
}

await db.batch(stmts, "write");
console.log("infographics->webp:", ig, "| covers set:", cov, "| reseeded:", stmts.length);
console.log(
  "drafts:", Number((await db.execute("SELECT COUNT(*) c FROM posts WHERE status='draft'")).rows[0].c),
  "| with cover:", Number((await db.execute("SELECT COUNT(*) c FROM posts WHERE cover_image LIKE '/blog/covers/%'")).rows[0].c),
  "| infographic webp in body:", Number((await db.execute("SELECT COUNT(*) c FROM posts WHERE body LIKE '%/blog/infographics/%.webp%'")).rows[0].c),
);
