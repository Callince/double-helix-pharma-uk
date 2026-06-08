import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/crypto";
import { getUserById, type User } from "@/lib/db/users";

/** Resolve the currently signed-in admin user (or null). */
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

/** For server actions / protected reads — throws if not authenticated. */
export async function assertAdmin(): Promise<User> {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}
