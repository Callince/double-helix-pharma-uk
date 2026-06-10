/**
 * Generate FLUX cover images via your LOCAL ComfyUI, then composite the
 * headline + subheading over them. RUN THIS IN YOUR OWN TERMINAL (where
 * http://127.0.0.1:8188 is reachable and a FLUX model is installed):
 *
 *     node docs/generate-covers-comfyui.mjs
 *
 * Requirements: ComfyUI running with a FLUX model (e.g. flux1-schnell or
 * flux1-dev) plus its DualCLIP (t5xxl + clip_l) and VAE (ae.safetensors).
 *
 * Optional overrides (if auto-detect picks the wrong files):
 *   UNET_NAME=flux1-schnell.safetensors T5_NAME=t5xxl_fp16.safetensors \
 *   CLIPL_NAME=clip_l.safetensors VAE_NAME=ae.safetensors STEPS=4 \
 *   node docs/generate-covers-comfyui.mjs
 *
 * Output: public/blog/covers/<slug>.webp  (overwrites the designed banners).
 * Resumable: completed slugs are tracked in docs/_comfy-covers-done.json.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const COMFY = (process.env.COMFYUI_URL || readEnv("COMFYUI_URL") || "http://127.0.0.1:8188").replace(/\/+$/, "");
const OUT = "public/blog/covers";
const DONE_FILE = "docs/_comfy-covers-done.json";
const WIDTH = 1536, HEIGHT = 896; // FLUX-friendly (÷16); fitted to 1500x900 on composite
fs.mkdirSync(OUT, { recursive: true });

function readEnv(k) {
  try {
    const f = fs.readFileSync(".env.flux.local", "utf8");
    const m = f.split(/\r?\n/).find((l) => l.startsWith(k + "="));
    return m ? m.slice(k.length + 1).trim() : null;
  } catch { return null; }
}
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function wrap(s, max) {
  const words = String(s ?? "").trim().split(/\s+/); const lines = []; let line = "";
  for (const w of words) { if ((line + " " + w).trim().length > max) { if (line) lines.push(line); line = w; } else line = (line + " " + w).trim(); }
  if (line) lines.push(line); return lines;
}
function pick(list, ...res) { for (const re of res) { const m = (list || []).find((x) => re.test(x)); if (m) return m; } return (list || [])[0]; }

async function detectModels() {
  const info = await (await fetch(`${COMFY}/object_info`)).json();
  const unetList = info?.UNETLoader?.input?.required?.unet_name?.[0] || [];
  const clipList = info?.DualCLIPLoader?.input?.required?.clip_name1?.[0] || [];
  const vaeList = info?.VAELoader?.input?.required?.vae_name?.[0] || [];
  const unet = process.env.UNET_NAME || pick(unetList, /flux.*schnell|schnell.*flux/i, /flux/i);
  const t5 = process.env.T5_NAME || pick(clipList, /t5xxl|t5-xxl|t5/i);
  const clipl = process.env.CLIPL_NAME || pick(clipList, /clip_l|clip-l/i);
  const vae = process.env.VAE_NAME || pick(vaeList, /ae\.|flux.*vae|^ae/i, /vae/i);
  if (!unet || !t5 || !clipl || !vae) {
    console.error("Could not auto-detect FLUX models. Found:\n  UNET:", unetList, "\n  CLIP:", clipList, "\n  VAE:", vaeList,
      "\nSet UNET_NAME / T5_NAME / CLIPL_NAME / VAE_NAME env vars and re-run.");
    process.exit(1);
  }
  const steps = Number(process.env.STEPS) || (/schnell/i.test(unet) ? 4 : 20);
  console.log(`Using → unet:${unet} t5:${t5} clip_l:${clipl} vae:${vae} steps:${steps}`);
  return { unet, t5, clipl, vae, steps };
}

function seedFrom(slug) { let h = 0; for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h % 2147483647; }

function workflow(m, prompt, slug) {
  return {
    "10": { class_type: "VAELoader", inputs: { vae_name: m.vae } },
    "11": { class_type: "DualCLIPLoader", inputs: { clip_name1: m.t5, clip_name2: m.clipl, type: "flux" } },
    "12": { class_type: "UNETLoader", inputs: { unet_name: m.unet, weight_dtype: "default" } },
    "6": { class_type: "CLIPTextEncode", inputs: { text: prompt, clip: ["11", 0] } },
    "33": { class_type: "CLIPTextEncode", inputs: { text: "", clip: ["11", 0] } },
    "60": { class_type: "FluxGuidance", inputs: { guidance: 3.5, conditioning: ["6", 0] } },
    "27": { class_type: "EmptySD3LatentImage", inputs: { width: WIDTH, height: HEIGHT, batch_size: 1 } },
    "31": { class_type: "KSampler", inputs: { seed: seedFrom(slug), steps: m.steps, cfg: 1, sampler_name: "euler", scheduler: "simple", denoise: 1, model: ["12", 0], positive: ["60", 0], negative: ["33", 0], latent_image: ["27", 0] } },
    "8": { class_type: "VAEDecode", inputs: { samples: ["31", 0], vae: ["10", 0] } },
    "9": { class_type: "SaveImage", inputs: { filename_prefix: "dhcover/" + slug, images: ["8", 0] } },
  };
}

async function generate(m, prompt, slug) {
  const r = await fetch(`${COMFY}/prompt`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: workflow(m, prompt, slug), client_id: "dh-covers" }) });
  if (!r.ok) throw new Error("queue failed: " + r.status + " " + (await r.text()).slice(0, 200));
  const { prompt_id } = await r.json();
  for (let i = 0; i < 240; i++) {
    await new Promise((res) => setTimeout(res, 1500));
    const hist = await (await fetch(`${COMFY}/history/${prompt_id}`)).json();
    const entry = hist?.[prompt_id];
    if (entry?.outputs) {
      const img = Object.values(entry.outputs).flatMap((o) => o.images || [])[0];
      if (!img) throw new Error("no image in outputs");
      const v = new URL(`${COMFY}/view`);
      v.searchParams.set("filename", img.filename); v.searchParams.set("subfolder", img.subfolder || ""); v.searchParams.set("type", img.type || "output");
      return Buffer.from(await (await fetch(v)).arrayBuffer());
    }
    if (entry?.status?.status_str === "error") throw new Error("comfy execution error");
  }
  throw new Error("timed out waiting for image");
}

function overlay(p) {
  const head = wrap(p.headline.toUpperCase(), 20).slice(0, 3);
  const sub = wrap(p.subheading, 46).slice(0, 3);
  const hSize = head.length >= 3 ? 60 : 70;
  const blockH = head.length * (hSize + 8) + 26 + sub.length * 38;
  let y = Math.max(300, (900 - blockH) / 2 + hSize);
  let t = "";
  t += `<text x="100" y="${y - hSize - 26}" font-size="22" font-weight="700" letter-spacing="6" fill="#7fe0ff">${esc(p.category.toUpperCase())}</text>`;
  for (const ln of head) { t += `<text x="100" y="${y}" font-size="${hSize}" font-weight="800" fill="#ffffff">${esc(ln)}</text>`; y += hSize + 8; }
  y += 18;
  for (const ln of sub) { t += `<text x="100" y="${y}" font-size="30" fill="#e8f1f8">${esc(ln)}</text>`; y += 38; }
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="900">
<defs>
  <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#021634" stop-opacity="0.92"/><stop offset="0.55" stop-color="#042a63" stop-opacity="0.55"/><stop offset="1" stop-color="#042a63" stop-opacity="0"/></linearGradient>
  <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8ace3a"/><stop offset="0.5" stop-color="#0aa6e2"/><stop offset="1" stop-color="#042a63"/></linearGradient>
</defs>
<rect width="1500" height="900" fill="url(#scrim)"/>
<rect x="0" y="0" width="12" height="900" fill="url(#bar)"/>
${t}
<text x="100" y="822" font-size="24" font-weight="700" letter-spacing="2" fill="#ffffff" font-family="'Segoe UI',Helvetica,Arial,sans-serif">DOUBLE HELIX PHARMA UK</text>
<text x="100" y="850" font-size="18" fill="#bcd4e8" font-family="'Segoe UI',Helvetica,Arial,sans-serif">Pharmaceutical Quality &amp; Compliance</text>
</svg>`);
}

// ---- run ----
const posts = JSON.parse(fs.readFileSync("docs/blog-cover-image-plan.json", "utf8")).posts;
const done = new Set(fs.existsSync(DONE_FILE) ? JSON.parse(fs.readFileSync(DONE_FILE, "utf8")) : []);
console.log(`Connecting to ComfyUI at ${COMFY} …`);
const m = await detectModels();
let ok = done.size, fail = 0;
for (const p of posts) {
  if (done.has(p.slug)) continue;
  try {
    const bg = await generate(m, p.flux_prompt, p.slug);
    const base = await sharp(bg).resize(1500, 900, { fit: "cover", position: "centre" }).toBuffer();
    await sharp(base).composite([{ input: overlay(p), top: 0, left: 0 }]).webp({ quality: 86 }).toFile(path.join(OUT, p.slug + ".webp"));
    done.add(p.slug); ok++;
    fs.writeFileSync(DONE_FILE, JSON.stringify([...done]));
    console.log(`  [${ok}/${posts.length}] ${p.slug}`);
  } catch (e) {
    fail++; console.error(`  ✗ ${p.slug}: ${e.message}`);
  }
}
console.log(`Done. covers: ${ok}/${posts.length}, failures: ${fail}. Tell Claude to deploy.`);
