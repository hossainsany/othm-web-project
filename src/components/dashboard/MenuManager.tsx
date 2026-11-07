import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createMenuItem, deleteMenuItem, updateMenuItem } from "@/lib/supabase/menu";
import type { MenuItem } from "@/lib/supabase/types";
import { menuItemFormSchema } from "@/lib/validation";
import { useRouter } from "@tanstack/react-router";
import { Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const emptyForm = {
  category: "Bread",
  name: "",
  description: "",
  price: "",
  available: true,
  sortOrder: "0",
};

type MenuFormState = typeof emptyForm;

function getErrorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return undefined;
}

type MenuManagerProps = {
  items: MenuItem[];
};

export function MenuManager({ items }: MenuManagerProps) {
  const router = useRouter();
  const [form, setForm] = useState<MenuFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function updateField<K extends keyof MenuFormState>(field: K, value: MenuFormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError(null);
  }

  function startEdit(item: MenuItem) {
    setEditingId(item.id);
    setForm({
      category: item.category,
      name: item.name,
      description: item.description ?? "",
      price: item.price.toFixed(2),
      available: item.available,
      sortOrder: String(item.sortOrder),
    });
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = menuItemFormSchema.safeParse(form);

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the item details.");
      return;
    }

    const input = parsed.data;

    setIsSaving(true);

    try {
      if (editingId) {
        await updateMenuItem(editingId, input);
        toast.success("Menu item updated");
      } else {
        await createMenuItem(input);
        toast.success("Menu item added");
      }

      resetForm();
      await router.invalidate();
    } catch (caughtError) {
      setError(getErrorMessage(caughtError) ?? "Unable to save the menu item.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(item: MenuItem) {
    const confirmed = window.confirm(`Delete “${item.name}”? This cannot be undone.`);

    if (!confirmed) return;

    setDeletingId(item.id);

    try {
      await deleteMenuItem(item.id);

      if (editingId === item.id) {
        resetForm();
      }

      toast.success("Menu item deleted");
      await router.invalidate();
    } catch (caughtError) {
      toast.error("Could not delete the item", {
        description: getErrorMessage(caughtError) ?? "Please try again.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Menu</h1>
        <p className="mt-2 text-muted-foreground">
          Add dishes, update prices and hide items that are sold out.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section aria-labelledby="menu-items-heading" className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 id="menu-items-heading" className="text-xl font-semibold">
              Items ({items.length})
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border bg-card">
            {items.length === 0 ? (
              <div className="p-8 text-center">
                <p className="font-medium">No menu items yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use the form to add the first item to the website menu.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b bg-muted/50 text-xs tracking-wide text-muted-foreground uppercase">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-medium">
                        Item
                      </th>
                      <th scope="col" className="px-4 py-3 font-medium">
                        Category
                      </th>
                      <th scope="col" className="px-4 py-3 font-medium">
                        Price
                      </th>
                      <th scope="col" className="px-4 py-3 font-medium">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-right font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {items.map((item) => (
                      <tr key={item.id} className="align-top">
                        <td className="max-w-xs px-4 py-4">
                          <p className="font-medium">{item.name}</p>
                          {item.description ? (
                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-4 py-4 capitalize">{item.category}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {priceFormatter.format(item.price)}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              item.available
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {item.available ? "Available" : "Hidden"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => startEdit(item)}
                              aria-label={`Edit ${item.name}`}
                            >
                              <Pencil aria-hidden="true" />
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(item)}
                              disabled={deletingId === item.id}
                              aria-label={`Delete ${item.name}`}
                            >
                              {deletingId === item.id ? (
                                <Loader2
                                  aria-hidden="true"
                                  className="animate-spin motion-reduce:animate-none"
                                />
                              ) : (
                                <Trash2 aria-hidden="true" />
                              )}
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section
          aria-labelledby="menu-form-heading"
          className="h-fit rounded-2xl border bg-card p-6 xl:sticky xl:top-6"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 id="menu-form-heading" className="text-xl font-semibold">
                {editingId ? "Edit item" : "Add an item"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {editingId
                  ? "Update the details and save your changes."
                  : "New items appear on the public menu immediately."}
              </p>
            </div>
            {editingId ? (
              <Button type="button" variant="ghost" size="icon-sm" onClick={resetForm}>
                <X aria-hidden="true" />
                <span className="sr-only">Cancel editing</span>
              </Button>
            ) : null}
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="menu-category">Category</Label>
              <Input
                id="menu-category"
                name="category"
                list="menu-categories"
                required
                maxLength={60}
                value={form.category}
                onChange={(event) => updateField("category", event.target.value)}
                disabled={isSaving}
              />
              <datalist id="menu-categories">
                <option value="Bread" />
                <option value="Pastries" />
                <option value="Cakes" />
              </datalist>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="menu-name">Name</Label>
              <Input
                id="menu-name"
                name="name"
                required
                maxLength={120}
                placeholder="Country sourdough"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="menu-price">Price (USD)</Label>
                <Input
                  id="menu-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="7.00"
                  value={form.price}
                  onChange={(event) => updateField("price", event.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="menu-sort-order">Sort order</Label>
                <Input
                  id="menu-sort-order"
                  name="sortOrder"
                  type="number"
                  min="0"
                  step="1"
                  value={form.sortOrder}
                  onChange={(event) => updateField("sortOrder", event.target.value)}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="menu-description">Description</Label>
              <Textarea
                id="menu-description"
                name="description"
                rows={3}
                maxLength={500}
                placeholder="A short description for the menu."
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                disabled={isSaving}
              />
            </div>

            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={form.available}
                onChange={(event) => updateField("available", event.target.checked)}
                disabled={isSaving}
              />
              Show on the public menu
            </label>

            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <div className="flex gap-2">
              <Button type="submit" disabled={isSaving} className="flex-1">
                {isSaving ? (
                  <>
                    <Loader2
                      aria-hidden="true"
                      className="animate-spin motion-reduce:animate-none"
                    />
                    Saving...
                  </>
                ) : editingId ? (
                  <>
                    <Save aria-hidden="true" />
                    Save changes
                  </>
                ) : (
                  <>
                    <Plus aria-hidden="true" />
                    Add item
                  </>
                )}
              </Button>

              {editingId ? (
                <Button type="button" variant="outline" onClick={resetForm} disabled={isSaving}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
