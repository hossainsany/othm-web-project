import type { z } from "zod";
import type { menuItemInputSchema } from "@/lib/validation";
import { getSupabaseClient } from "./client";
import type { MenuItem, PublicMenuCategory, PublicMenuItem } from "./types";

type MenuItemInput = z.output<typeof menuItemInputSchema>;

type PublicMenuRow = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  price: number | string;
};

type MenuItemRow = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  price: number | string;
  available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

function mapMenuItem(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    category: row.category,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    available: row.available,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toMenuError(error: { code?: string; message?: string } | null) {
  if (error?.code === "23505") {
    return new Error("An item with that name already exists in this category.");
  }

  return new Error(error?.message ?? "The database request failed.");
}

export async function getPublicMenu(): Promise<PublicMenuCategory[]> {
  const { data, error } = await getSupabaseClient()
    .from("menu_items")
    .select("id, category, name, description, price")
    .eq("available", true)
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw toMenuError(error);

  const categories = new Map<string, PublicMenuItem[]>();

  for (const row of (data ?? []) as PublicMenuRow[]) {
    const item: PublicMenuItem = {
      id: row.id,
      category: row.category,
      name: row.name,
      description: row.description,
      price: Number(row.price),
    };
    const items = categories.get(item.category) ?? [];
    items.push(item);
    categories.set(item.category, items);
  }

  return Array.from(categories, ([category, items]) => ({ category, items }));
}

export async function listMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await getSupabaseClient()
    .from("menu_items")
    .select("*")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw toMenuError(error);

  return ((data ?? []) as MenuItemRow[]).map(mapMenuItem);
}

export async function createMenuItem(input: MenuItemInput): Promise<MenuItem> {
  const { data, error } = await getSupabaseClient()
    .from("menu_items")
    .insert({
      category: input.category,
      name: input.name,
      description: input.description || null,
      price: input.price,
      available: input.available,
      sort_order: input.sortOrder,
    })
    .select()
    .single();

  if (error || !data) {
    throw toMenuError(error);
  }

  return mapMenuItem(data as MenuItemRow);
}

export async function updateMenuItem(id: string, input: MenuItemInput): Promise<MenuItem> {
  const { data, error } = await getSupabaseClient()
    .from("menu_items")
    .update({
      category: input.category,
      name: input.name,
      description: input.description || null,
      price: input.price,
      available: input.available,
      sort_order: input.sortOrder,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    throw toMenuError(error);
  }

  return mapMenuItem(data as MenuItemRow);
}

export async function deleteMenuItem(id: string) {
  const { error } = await getSupabaseClient().from("menu_items").delete().eq("id", id);

  if (error) throw toMenuError(error);
}
