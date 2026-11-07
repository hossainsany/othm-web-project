import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardError } from "@/components/dashboard/DashboardError";
import { getCurrentUser } from "@/lib/supabase/auth";
import type { AuthUser } from "@/lib/supabase/types";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ location }): Promise<{ user: AuthUser }> => {
    const user = await getCurrentUser();

    if (!user) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }

    return { user };
  },
  head: () => ({
    meta: [{ title: "Dashboard | Local Bakery Co." }, { name: "robots", content: "noindex" }],
  }),
  errorComponent: DashboardError,
  component: DashboardLayout,
});

function DashboardLayout() {
  const { user } = Route.useRouteContext();

  return (
    <DashboardShell user={user}>
      <Outlet />
    </DashboardShell>
  );
}
