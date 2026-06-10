"""Generate the 100 Double Helix blog COVERS using the local `blogimg` tool.

Runs blogimg's real Pollinations backend + compose_banner, driven by the cover
briefs already prepared in docs/blog-cover-image-plan.json (slug, category,
headline, subheading, flux_prompt). One polished 1500x900 banner per post,
written straight to the site at public/blog/covers/<slug>.webp.

RUN ON YOUR OWN MACHINE (Pollinations works on your home IP, not Claude's
shared cloud IP):

    python docs/make-covers-blogimg.py

Needs the blogimg deps (already installed for blogimg): pip install Pillow requests
Resumable: finished slugs are tracked in docs/_dh-covers-done.json — re-run to
retry any that failed.
"""
import os, sys, io, json, hashlib

# Locate the blogimg package (override with BLOGIMG_DIR if it lives elsewhere).
BLOGIMG_DIR = os.environ.get("BLOGIMG_DIR", r"D:\blogImg")
sys.path.insert(0, BLOGIMG_DIR)

from PIL import Image
from blogimg.config import Config
from blogimg import pollinations_client, compose
from blogimg.enhancer import enhance_prompt, enhance_negative
from blogimg.styles import DEFAULT_STYLE

HERE = os.path.dirname(os.path.abspath(__file__))
PLAN = os.path.join(HERE, "blog-cover-image-plan.json")
OUT = os.path.abspath(os.path.join(HERE, "..", "public", "blog", "covers"))
DONE = os.path.join(HERE, "_dh-covers-done.json")

# Double Helix brand: deep navy primary + teal accent (spine, highlight bars, tag).
PRIMARY = compose.hex_to_rgb("#06295C")
ACCENT = compose.hex_to_rgb("#0AA6E2")

os.makedirs(OUT, exist_ok=True)
cfg = Config.from_env()  # auto-loads D:\blogImg\.env (Pollinations token)
posts = json.load(open(PLAN, encoding="utf-8"))["posts"]
done = set(json.load(open(DONE, encoding="utf-8"))) if os.path.exists(DONE) else set()


def seed_of(slug: str) -> int:
    return int(hashlib.md5(slug.encode()).hexdigest()[:8], 16) % (2**31 - 1)


ok, fail = len(done), 0
print(f"blogimg -> {len(posts)} Double Helix covers  (token: {'yes' if cfg.pollinations_token else 'NONE'})")
for p in posts:
    slug = p["slug"]
    if slug in done:
        continue
    try:
        prompt = enhance_prompt(p["flux_prompt"], style=DEFAULT_STYLE)
        neg = enhance_negative(DEFAULT_STYLE)
        raw = pollinations_client.generate(cfg, prompt, seed_of(slug), negative=neg)
        bg = Image.open(io.BytesIO(raw)).convert("RGB")
        img = compose.compose_banner(bg, p["headline"], p["subheading"],
                                     PRIMARY, ACCENT, kicker=p.get("category", ""))
        img.save(os.path.join(OUT, slug + ".webp"), "WEBP", quality=88, method=6)
        done.add(slug); ok += 1
        json.dump(sorted(done), open(DONE, "w", encoding="utf-8"))
        print(f"  [{ok}/{len(posts)}] {slug}")
    except Exception as exc:
        fail += 1
        print(f"  X {slug}: {exc}")

print(f"\nDone. covers: {ok}/{len(posts)}, failures: {fail}."
      + (" Re-run to retry the failures." if fail else "")
      + "  Then tell Claude to deploy.")
