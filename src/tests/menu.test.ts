import { createMenuItem, updateMenuItem } from "@/lib/supabase/menu";
import type { MenuItem } from "@/lib/supabase/types";
import { createSupabaseMock } from "./helpers/supabase";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getSupabaseClient } = vi.hoisted(() => ({
  getSupabaseClient: vi.fn(),
}));

vi.mock("@/lib/supabase/client", () => ({
  getSupabaseClient,
  isSupabaseConfigured: vi.fn(() => true),
}));

const menuRow = {
  id: "item-1",
  category: "Bread",
  name: "Country sourdough",
  description: "A crusty country loaf",
  price: "7.50",
  available: true,
  sort_order: 2,
  created_at: "2026-01-01T08:00:00.000Z",
  updated_at: "2026-01-02T09:30:00.000Z",
};

const expectedItem: MenuItem = {
  id: "item-1",
  category: "Bread",
  name: "Country sourdough",
  description: "A crusty country loaf",
  price: 7.5,
  available: true,
  sortOrder: 2,
  createdAt: "2026-01-01T08:00:00.000Z",
  updatedAt: "2026-01-02T09:30:00.000Z",
};

const menuInput = {
  category: "Bread",
  name: "Country sourdough",
  description: "A crusty country loaf",
  price: 7.5,
  available: true,
  sortOrder: 2,
};

describe("createMenuItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("inserts a new item and returns the mapped row", async () => {
    const { supabase, from, builder } = createSupabaseMock({ data: menuRow, error: null });
    getSupabaseClient.mockReturnValue(supabase);

    await expect(createMenuItem(menuInput)).resolves.toEqual(expectedItem);

    expect(from).toHaveBeenCalledWith("menu_items");
    expect(builder.insert).toHaveBeenCalledWith({
      category: "Bread",
      name: "Country sourdough",
      description: "A crusty country loaf",
      price: 7.5,
      available: true,
      sort_order: 2,
    });
    expect(builder.select).toHaveBeenCalledOnce();
    expect(builder.single).toHaveBeenCalledOnce();
  });

  it("stores an empty description as null", async () => {
    const { supabase, builder } = createSupabaseMock({
      data: { ...menuRow, description: null },
      error: null,
    });
    getSupabaseClient.mockReturnValue(supabase);

    await createMenuItem({ ...menuInput, description: "" });

    expect(builder.insert).toHaveBeenCalledWith(
      expect.objectContaining({ description: null }),
    );
  });

  it("reports duplicate item names with a friendly message", async () => {
    const { supabase } = createSupabaseMock({
      data: null,
      error: { code: "23505", message: "duplicate key value violates unique constraint" },
    });
    getSupabaseClient.mockReturnValue(supabase);

    await expect(createMenuItem(menuInput)).rejects.toThrow(
      "An item with that name already exists in this category.",
    );
  });
});

describe("updateMenuItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates the item by id and returns the mapped row", async () => {
    const { supabase, from, builder } = createSupabaseMock({ data: menuRow, error: null });
    getSupabaseClient.mockReturnValue(supabase);

    await expect(updateMenuItem("item-1", menuInput)).resolves.toEqual(expectedItem);

    expect(from).toHaveBeenCalledWith("menu_items");
    expect(builder.update).toHaveBeenCalledWith({
      category: "Bread",
      name: "Country sourdough",
      description: "A crusty country loaf",
      price: 7.5,
      available: true,
      sort_order: 2,
      updated_at: expect.any(String),
    });
    expect(builder.eq).toHaveBeenCalledWith("id", "item-1");
    expect(builder.select).toHaveBeenCalledOnce();
    expect(builder.single).toHaveBeenCalledOnce();
  });

  it("throws the database error message when the update fails", async () => {
    const { supabase } = createSupabaseMock({
      data: null,
      error: { message: "permission denied for table menu_items" },
    });
    getSupabaseClient.mockReturnValue(supabase);

    await expect(updateMenuItem("item-1", menuInput)).rejects.toThrow(
      "permission denied for table menu_items",
    );
  });
});
