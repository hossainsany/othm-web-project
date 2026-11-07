import { getDashboardStats } from "@/lib/supabase/contacts";
import { DashboardError } from "@/components/dashboard/DashboardError";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, MessageSquare, UtensilsCrossed } from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  loader: () => getDashboardStats(),
  errorComponent: DashboardError,
  component: DashboardOverview,
});

function StatCard({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-4xl font-semibold tracking-tight">{value}</p>
      {hint ? <p className="mt-2 text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function DashboardOverview() {
  const stats = Route.useLoaderData();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-2 text-muted-foreground">
          A quick look at what is published on the website and what needs attention.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Menu items"
          value={stats.menuItems}
          hint={`${stats.availableMenuItems} available on the website`}
        />
        <StatCard
          label="Contact messages"
          value={stats.contactMessages}
          hint={`${stats.newContactMessages} new and unread`}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          to="/dashboard/menu"
          className="group flex items-center justify-between rounded-2xl border bg-card p-6 transition-colors hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <div className="flex items-start gap-4">
            <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-primary">
              <UtensilsCrossed aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold">Manage the menu</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Add, edit, hide or remove menu items.
              </p>
            </div>
          </div>
          <ArrowRight
            aria-hidden="true"
            className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </Link>

        <Link
          to="/dashboard/contacts"
          className="group flex items-center justify-between rounded-2xl border bg-card p-6 transition-colors hover:bg-muted/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <div className="flex items-start gap-4">
            <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-primary">
              <MessageSquare aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold">Read contact messages</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Follow up with customers and keep the inbox tidy.
              </p>
            </div>
          </div>
          <ArrowRight
            aria-hidden="true"
            className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </Link>
      </div>
    </div>
  );
}
