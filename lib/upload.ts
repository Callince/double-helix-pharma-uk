/**
 * Safe image-upload helpers. Never trust the client-sent Content-Type or filename
 * extension — both are attacker-controlled. We detect the real type from magic
 * bytes and derive the stored extension from that. SVG is intentionally excluded:
 * SVGs can carry executable script and would run from our own origin.
 */
export const ALLOWED_IMAGE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
} as const;

export type AllowedImageType = keyof typeof ALLOWED_IMAGE;

/** Detect image type from magic bytes; returns null if not an allowed raster image. */
export function sniffImage(buf: Uint8Array): AllowedImageType | null {
  if (buf.length < 12) return null;
  // PNG: 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "image/png";
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  // GIF: 47 49 46
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return "image/gif";
  // WEBP: "RIFF"...."WEBP"
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) return "image/webp";
  return null;
}

/** Sanitise the original filename into a short slug used as the stored name's base. */
export function safeBaseName(name: string): string {
  return (
    name
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40) || "image"
  );
}
