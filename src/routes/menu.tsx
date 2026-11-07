import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getPublicMenu } from "@/lib/supabase/menu";
import { createFileRoute, Link, useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { RefreshCw, UtensilsCrossed } from "lucide-react";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const Route = createFileRoute("/menu")({
  loader: () => getPublicMenu(),
  component: MenuPage,
  pendingComponent: MenuPending,
  errorComponent: MenuError,
});

function getCategoryId(category: string) {
  return `menu-category-${category.toLowerCase().replace(/\s+/g, "-")}`;
}

function MenuPage() {
  useDocumentTitle("Menu");
  const categories = Route.useLoaderData();

  return (
    <>
      <PageHeader
        heading="Our Menu"
        headingId="menu-heading"
        subHeading="Good ingredients. Honest prices. Everything is made here in small batches, until sold out."
      />
      <section aria-labelledby="menu-heading" className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-0">
          {categories.length === 0 ? (
            <div className="mx-auto mt-24 max-w-xl rounded-2xl border bg-card p-10 text-center">
              <UtensilsCrossed
                aria-hidden="true"
                className="mx-auto size-9 text-muted-foreground"
              />
              <h2 className="mt-4 text-2xl font-semibold">The menu is being updated</h2>
              <p className="mt-2 text-muted-foreground">
                Nothing is listed right now. Check back soon, or get in touch and we'll tell you
                what is coming out of the oven.
              </p>
              <Button
                render={<Link to="/contact" />}
                nativeButton={false}
                variant="outline"
                className="mt-6"
              >
                Get in touch
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-8 mt-24">
              {categories.map(({ category, items }) => {
                const categoryId = getCategoryId(category);

                return (
                  <section
                    key={category}
                    aria-labelledby={categoryId}
                    className="grid grid-cols-1 md:grid-cols-3 bg-secondary p-8 rounded-lg"
                  >
                    <h2
                      id={categoryId}
                      className="text-2xl md:text-xl capitalize font-medium mb-4 md:mb-0"
                    >
                      {category}
                    </h2>

                    <ul className="col-span-2">
                      {items.map((item, index) => (
                        <li
                          key={item.id}
                          className={`flex justify-between items-start gap-6 py-4 md:py-2 ${
                            items.length === index + 1 ? "pb-0" : "border-b-2"
                          }`}
                        >
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            {item.description ? <p>{item.description}</p> : null}
                          </div>
                          <p className="shrink-0 whitespace-nowrap">
                            <span className="sr-only">Price: </span>
                            {priceFormatter.format(item.price)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function MenuPending() {
  useDocumentTitle("Menu");

  return (
    <>
      <PageHeader
        heading="Our Menu"
        headingId="menu-heading"
        subHeading="Good ingredients. Honest prices. Everything is made here in small batches, until sold out."
      />
      <section aria-busy="true" aria-labelledby="menu-heading" className="py-24 bg-background">
        <p role="status" className="sr-only">
          Loading the menu...
        </p>
        <div className="container mx-auto px-4 lg:px-0">
          <div className="mt-24 flex flex-col gap-8">
            {[0, 1, 2].map((section) => (
              <div
                key={section}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-lg bg-secondary p-8"
              >
                <div className="h-7 w-32 rounded bg-background/70" />
                <div className="col-span-2 flex flex-col gap-4">
                  {[0, 1, 2].map((row) => (
                    <div key={row} className="h-14 rounded bg-background/60" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function MenuError({ error, reset }: ErrorComponentProps) {
  useDocumentTitle("Menu");
  const router = useRouter();
  const message = error instanceof Error ? error.message : "The menu request failed.";

  function handleRetry() {
    reset();
    void router.invalidate();
  }

  return (
    <>
      <PageHeader
        heading="Our Menu"
        headingId="menu-heading"
        subHeading="Good ingredients. Honest prices. Everything is made here in small batches, until sold out."
      />
      <section aria-labelledby="menu-heading" className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-0">
          <div className="mx-auto mt-24 max-w-xl rounded-2xl border bg-card p-8 text-center">
            <h2 className="text-2xl font-semibold">We couldn't load the menu</h2>
            <p className="mt-2 text-muted-foreground">
              The menu is temporarily unavailable. Please try again in a moment.
            </p>
            <p role="alert" className="mt-4 text-sm text-destructive">
              {message}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button type="button" onClick={handleRetry}>
                <RefreshCw aria-hidden="true" />
                Try again
              </Button>
              <Button render={<Link to="/contact" />} nativeButton={false} variant="outline">
                Contact us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
