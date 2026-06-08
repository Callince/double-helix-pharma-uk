import { cookies } from "next/headers";
import crypto from "node:crypto";

/** True when the admin gate is satisfied (or disabled in dev). Mirrors middleware.ts. */
export async function isAdmin(): Promise<boolean> {
  const password = process.env.ADMIN_GATE_PASSWORD;
  if (!password) return true; // gate disabled (local dev)
  const expected = crypto.createHash("sha256").update(password).digest("hex");
  const token = (await cookies()).get("dh_gate")?.value;
  return token === expected;
}

export async function assertAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}
