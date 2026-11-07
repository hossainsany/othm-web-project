import { getSupabaseClient, isSupabaseConfigured } from "./client";
import type { AuthUser } from "./types";

function toAuthUser(user: { id: string; email?: string | null }): AuthUser {
  return {
    id: user.id,
    email: user.email ?? "",
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured()) return null;

  const { data, error } = await getSupabaseClient().auth.getUser();

  if (error || !data.user) return null;

  return toAuthUser(data.user);
}

export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    throw new Error(error?.message ?? "Unable to sign in with those credentials.");
  }

  return toAuthUser(data.user);
}

export async function signOut() {
  await getSupabaseClient().auth.signOut();
}
