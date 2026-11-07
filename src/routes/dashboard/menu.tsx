import { MenuManager } from "@/components/dashboard/MenuManager";
import { DashboardError } from "@/components/dashboard/DashboardError";
import { listMenuItems } from "@/lib/supabase/menu";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/menu")({
  head: () => ({
    meta: [{ title: "Menu dashboard | Local Bakery Co." }, { name: "robots", content: "noindex" }],
  }),
  loader: () => listMenuItems(),
  errorComponent: DashboardError,
  component: DashboardMenuPage,
});

function DashboardMenuPage() {
  const items = Route.useLoaderData();

  return <MenuManager items={items} />;
}
