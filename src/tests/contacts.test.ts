import {
  deleteContactMessage,
  submitContactMessage,
  updateContactStatus,
} from "@/lib/supabase/contacts";
import { createSupabaseMock } from "./helpers/supabase";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getSupabaseClient } = vi.hoisted(() => ({
  getSupabaseClient: vi.fn(),
}));

vi.mock("@/lib/supabase/client", () => ({
  getSupabaseClient,
  isSupabaseConfigured: vi.fn(() => true),
}));

const messageInput = {
  name: "Jane Doe",
  email: "jane@example.com",
  message: "Do you make birthday cakes?",
};

describe("submitContactMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("inserts the submitted form values", async () => {
    const { supabase, from, builder } = createSupabaseMock({ error: null });
    getSupabaseClient.mockReturnValue(supabase);

    await submitContactMessage(messageInput);

    expect(from).toHaveBeenCalledWith("contact_messages");
    expect(builder.insert).toHaveBeenCalledWith(messageInput);
  });

  it("throws the database error message when the insert fails", async () => {
    const { supabase } = createSupabaseMock({
      error: { message: "new row violates row-level security policy" },
    });
    getSupabaseClient.mockReturnValue(supabase);

    await expect(submitContactMessage(messageInput)).rejects.toThrow(
      "new row violates row-level security policy",
    );
  });
});

describe("updateContactStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates the message status and timestamp", async () => {
    const { supabase, from, builder } = createSupabaseMock({ error: null });
    getSupabaseClient.mockReturnValue(supabase);

    await updateContactStatus("message-1", "read");

    expect(from).toHaveBeenCalledWith("contact_messages");
    expect(builder.update).toHaveBeenCalledWith({
      status: "read",
      updated_at: expect.any(String),
    });
    expect(builder.eq).toHaveBeenCalledWith("id", "message-1");
  });

  it("throws the database error message when the update fails", async () => {
    const { supabase } = createSupabaseMock({ error: { message: "permission denied" } });
    getSupabaseClient.mockReturnValue(supabase);

    await expect(updateContactStatus("message-1", "replied")).rejects.toThrow("permission denied");
  });
});

describe("deleteContactMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes the message by id", async () => {
    const { supabase, from, builder } = createSupabaseMock({ error: null });
    getSupabaseClient.mockReturnValue(supabase);

    await deleteContactMessage("message-1");

    expect(from).toHaveBeenCalledWith("contact_messages");
    expect(builder.delete).toHaveBeenCalledOnce();
    expect(builder.eq).toHaveBeenCalledWith("id", "message-1");
  });

  it("throws the database error message when the delete fails", async () => {
    const { supabase } = createSupabaseMock({ error: { message: "permission denied" } });
    getSupabaseClient.mockReturnValue(supabase);

    await expect(deleteContactMessage("message-1")).rejects.toThrow("permission denied");
  });
});
