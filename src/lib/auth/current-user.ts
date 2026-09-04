import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getUserFromSession,
  SESSION_COOKIE,
  type SessionUser,
} from "./session";

/**
 * Server-side auth helpers. The authoritative access check runs here (and in
 * Server Actions / route handlers) — the Edge middleware only does a cheap
 * cookie-presence check and must never be treated as the security boundary.
 */

/** The current user, or null. Reads + validates the `__session` cookie. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return getUserFromSession(token);
}

/** Require any authenticated user, else redirect to login. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

/** Require an admin, else bounce back into the app. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin");
  return user;
}
