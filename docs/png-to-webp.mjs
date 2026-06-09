// Convert PNG(s) to WebP with sharp.
//   node docs/png-to-webp.mjs                 -> converts every .png in ./public
//   node docs/png-to-webp.mjs path/to/file.png [more...]
//   WIDTH=1200 node docs/png-to-webp.mjs ...  -> also resize (max width, keeps ratio)
//   QUALITY=82 (default)   DELETE=1 (remove the .png after converting)
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const targets = args.length ? args : ["public"];
const WIDTH = process.env.WIDTH ? Number(process.env.WIDTH) : null;
const QUALITY = process.env.QUALITY ? Number(process.env.QUALITY) : 82;
const DELETE = process.env.DELETE === "1";

function collect(p) {
  if (!fs.existsSync(p)) return [];
  const st = fs.statSync(p);
  if (st.isDirectory())
    return fs.readdirSync(p).filter((f) => f.toLowerCase().endsWith(".png")).map((f) => path.join(p, f));
  return p.toLowerCase().endsWith(".png") ? [p] : [];
}

const files = [...new Set(targets.flatMap(collect))];
if (!files.length) {
  console.log("No .png files found in:", targets.join(", "));
  process.exit(0);
}

for (const file of files) {
  const out = file.replace(/\.png$/i, ".webp");
  let img = sharp(file);
  if (WIDTH) img = img.resize({ width: WIDTH, withoutEnlargement: true });
  const info = await img.webp({ quality: QUALITY }).toFile(out);
  const before = fs.statSync(file).size;
  console.log(`${path.basename(file)} -> ${path.basename(out)}  (${(before / 1024).toFixed(0)}KB -> ${(info.size / 1024).toFixed(0)}KB)`);
  if (DELETE) fs.unlinkSync(file);
}
console.log(`Done: ${files.length} file(s).`);
