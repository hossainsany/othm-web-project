import { getCurrentUser, signInWithEmail } from "@/lib/supabase/auth";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getSupabaseClient, isSupabaseConfigured } = vi.hoisted(() => ({
  getSupabaseClient: vi.fn(),
  isSupabaseConfigured: vi.fn(),
}));

vi.mock("@/lib/supabase/client", () => ({
  getSupabaseClient,
  isSupabaseConfigured,
}));

describe("signInWithEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("signs in with the provided credentials and returns the user", async () => {
    const signInWithPassword = vi.fn().mockResolvedValue({
      data: { user: { id: "staff-1", email: "staff@bakery.test" } },
      error: null,
    });
    getSupabaseClient.mockReturnValue({ auth: { signInWithPassword } });

    await expect(signInWithEmail("staff@bakery.test", "secret123")).resolves.toEqual({
      id: "staff-1",
      email: "staff@bakery.test",
    });

    expect(signInWithPassword).toHaveBeenCalledWith({
      email: "staff@bakery.test",
      password: "secret123",
    });
  });

  it("throws the error message returned by Supabase", async () => {
    getSupabaseClient.mockReturnValue({
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: "Invalid login credentials" },
        }),
      },
    });

    await expect(signInWithEmail("staff@bakery.test", "wrong-password")).rejects.toThrow(
      "Invalid login credentials",
    );
  });

  it("throws a fallback message when no user is returned", async () => {
    getSupabaseClient.mockReturnValue({
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      },
    });

    await expect(signInWithEmail("staff@bakery.test", "secret123")).rejects.toThrow(
      "Unable to sign in with those credentials.",
    );
  });
});

describe("getCurrentUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null without calling Supabase when it is not configured", async () => {
    isSupabaseConfigured.mockReturnValue(false);

    await expect(getCurrentUser()).resolves.toBeNull();
    expect(getSupabaseClient).not.toHaveBeenCalled();
  });

  it("returns the user from the current session", async () => {
    isSupabaseConfigured.mockReturnValue(true);
    const getUser = vi.fn().mockResolvedValue({
      data: { user: { id: "staff-1", email: "staff@bakery.test" } },
      error: null,
    });
    getSupabaseClient.mockReturnValue({ auth: { getUser } });

    await expect(getCurrentUser()).resolves.toEqual({
      id: "staff-1",
      email: "staff@bakery.test",
    });
    expect(getUser).toHaveBeenCalledOnce();
  });

  it("returns null when the session cannot be read", async () => {
    isSupabaseConfigured.mockReturnValue(true);
    getSupabaseClient.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: "No session" },
        }),
      },
    });

    await expect(getCurrentUser()).resolves.toBeNull();
  });
});
