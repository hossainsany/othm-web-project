import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

function RootLayout() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-foreground focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-ring"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-center" containerAriaLabel="Notifications" />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  );
}

function NotFound() {
  useDocumentTitle("Page not found");

  return (
    <section
      aria-labelledby="not-found-heading"
      className="flex min-h-[80vh] flex-col items-center justify-center gap-4 p-8 text-center"
    >
      <h1 id="not-found-heading" className="text-4xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="text-muted-foreground">The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Go back home
      </Link>
    </section>
  );
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});
