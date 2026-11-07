import type { z } from "zod";
import type { contactMessageInputSchema } from "@/lib/validation";
import { getSupabaseClient } from "./client";
import type { ContactMessage, ContactStatus, DashboardStats } from "./types";

type ContactMessageInput = z.output<typeof contactMessageInputSchema>;

type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: ContactStatus;
  created_at: string;
};

function mapContactMessage(row: ContactMessageRow): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

function toContactError(error: { message?: string } | null) {
  return new Error(error?.message ?? "The database request failed.");
}

export async function submitContactMessage(input: ContactMessageInput) {
  const { error } = await getSupabaseClient().from("contact_messages").insert({
    name: input.name,
    email: input.email,
    message: input.message,
  });

  if (error) throw toContactError(error);
}

export async function listContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await getSupabaseClient()
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) throw toContactError(error);

  return ((data ?? []) as ContactMessageRow[]).map(mapContactMessage);
}

export async function updateContactStatus(id: string, status: ContactStatus) {
  const { error } = await getSupabaseClient()
    .from("contact_messages")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw toContactError(error);
}

export async function deleteContactMessage(id: string) {
  const { error } = await getSupabaseClient().from("contact_messages").delete().eq("id", id);

  if (error) throw toContactError(error);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = getSupabaseClient();

  const [menuItems, availableMenuItems, contactMessages, newContactMessages] = await Promise.all([
    supabase.from("menu_items").select("*", { count: "exact", head: true }),
    supabase.from("menu_items").select("*", { count: "exact", head: true }).eq("available", true),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
  ]);

  const error =
    menuItems.error ??
    availableMenuItems.error ??
    contactMessages.error ??
    newContactMessages.error;

  if (error) throw toContactError(error);

  return {
    menuItems: menuItems.count ?? 0,
    availableMenuItems: availableMenuItems.count ?? 0,
    contactMessages: contactMessages.count ?? 0,
    newContactMessages: newContactMessages.count ?? 0,
  };
}
