import { Button } from "@/components/ui/button";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";
import type { AuthUser } from "@/lib/supabase/types";
import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, LogIn, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Home", link: "/" },
  { label: "Menu", link: "/menu" },
  { label: "About", link: "/about" },
  { label: "Contact", link: "/contact" },
];

const focusStyles =
  "focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

export const Navbar = () => {
  const pathname = useLocation().pathname;
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = getSupabaseClient();
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email ?? "" } : null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const accountLink = user
    ? { to: "/dashboard" as const, label: "Dashboard" }
    : { to: "/login" as const, label: "Staff login" };
  const AccountIcon = user ? LayoutDashboard : LogIn;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <nav aria-label="Main navigation" className="bg-secondary">
      <div className="container mx-auto px-4 lg:px-0 flex items-center justify-between h-14">
        <Link to="/" className={`text-lg font-medium ${focusStyles}`}>
          Local Bakery Co.
        </Link>
        <ul className="hidden md:flex items-center justify-end gap-8">
          {navItems.map((item) => {
            const isCurrentPage = pathname === item.link;

            return (
              <li key={item.label}>
                <Link
                  to={item.link}
                  aria-current={isCurrentPage ? "page" : undefined}
                  className={`transition-colors hover:text-primary font-medium ${focusStyles} ${
                    isCurrentPage && "text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Button
              render={<Link to={accountLink.to} />}
              nativeButton={false}
              variant="outline"
              size="sm"
              className="h-9 px-3"
            >
              <AccountIcon aria-hidden="true" />
              {accountLink.label}
            </Button>
          </li>
        </ul>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="md:hidden inline-flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-background/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none cursor-pointer"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? (
            <X className="size-6" aria-hidden="true" />
          ) : (
            <Menu className="size-6" aria-hidden="true" />
          )}
        </button>
      </div>

      <div
        id="mobile-menu"
        inert={!isOpen}
        aria-hidden={!isOpen}
        className={`md:hidden grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <ul className="container mx-auto px-4 border-t border-border/60 flex flex-col">
            {navItems.map((item) => {
              const isCurrentPage = pathname === item.link;

              return (
                <li key={item.label}>
                  <Link
                    to={item.link}
                    onClick={() => setIsOpen(false)}
                    aria-current={isCurrentPage ? "page" : undefined}
                    className={`block border-b border-border/60 py-4 transition-colors last:border-none hover:text-primary ${focusStyles} ${
                      isCurrentPage ? "font-semibold text-primary" : "font-medium"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="py-4">
              <Button
                render={<Link to={accountLink.to} onClick={() => setIsOpen(false)} />}
                nativeButton={false}
                variant="outline"
                className="w-full"
              >
                <AccountIcon aria-hidden="true" />
                {accountLink.label}
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
