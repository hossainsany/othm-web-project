import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/supabase/auth";
import type { AuthUser } from "@/lib/supabase/types";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import {
  ArrowUpRight,
  LayoutDashboard,
  Loader2,
  LogOut,
  MessageSquare,
  UtensilsCrossed,
} from "lucide-react";
import { useState, type ReactNode } from "react";

const navItems = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Menu", to: "/dashboard/menu", icon: UtensilsCrossed, exact: false },
  { label: "Messages", to: "/dashboard/contacts", icon: MessageSquare, exact: false },
] as const;

const focusStyles =
  "focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

type DashboardShellProps = {
  user: AuthUser;
  children: ReactNode;
};

export function DashboardShell({ user, children }: DashboardShellProps) {
  const pathname = useLocation().pathname;
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await signOut();
      await router.navigate({ to: "/login" });
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Staff dashboard
            </p>
            <Link to="/" className={`text-lg font-semibold ${focusStyles}`}>
              Local Bakery Co.
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
            <Link
              to="/"
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${focusStyles}`}
            >
              View website
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? (
                <Loader2 aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
              ) : (
                <LogOut aria-hidden="true" />
              )}
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-6">
        <nav aria-label="Dashboard navigation">
          <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
            {navItems.map((item) => {
              const isActive = item.exact ? pathname === item.to : pathname.startsWith(item.to);

              return (
                <li key={item.to} className="shrink-0">
                  <Link
                    to={item.to}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${focusStyles} ${
                      isActive ? "bg-primary text-primary-foreground" : "hover:bg-background"
                    }`}
                  >
                    <item.icon aria-hidden="true" className="size-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
