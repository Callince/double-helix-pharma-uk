import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/crypto";
import { getUserById, type User } from "@/lib/db/users";

export type Role = User["role"]; // "admin" | "editor" | "viewer"

/** Resolve the currently signed-in user (or null). */
export async function getSessionUser(): Promise<User | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = verifySession(token);
  if (!session) return null;
  try {
    return await getUserById(session.userId);
  } catch {
    return null;
  }
}

/** For server actions / protected mutations — throws unless the user holds one of `allowed`. */
export async function assertRole(...allowed: Role[]): Promise<User> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");
  if (!allowed.includes(user.role)) throw new Error("Forbidden");
  return user;
}

/** Admin-only (settings, subscriber PII, destructive account actions). */
export function assertAdmin(): Promise<User> {
  return assertRole("admin");
}

/** Content authors — admin or editor (posts, FAQs, services, case studies, media). */
export function assertEditor(): Promise<User> {
  return assertRole("admin", "editor");
}
