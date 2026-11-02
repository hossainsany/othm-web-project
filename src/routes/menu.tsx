import { PageHeader } from "@/components/PageHeader";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import menu from "@/data/menu.json";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/menu")({
  component: RouteComponent,
});

function RouteComponent() {
  useDocumentTitle("Menu");

  return (
    <>
      <PageHeader
        heading="Our Menu"
        headingId="menu-heading"
        subHeading="Good ingredients. Honest prices. Everything is made here in small batches, until sold out."
      />
      <section aria-labelledby="menu-heading" className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-0">
          <div className="flex flex-col gap-8 mt-24">
            {Object.entries(menu).map(([category, items]) => {
              const categoryId = `menu-category-${category.toLowerCase().replace(/\s+/g, "-")}`;

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
                    {items.map((item, i) => (
                      <li
                        key={item.name}
                        className={`flex justify-between items-center py-4 md:py-2 ${items.length === i + 1 ? "pb-0" : "border-b-2"}`}
                      >
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p>{item.description}</p>
                        </div>
                        <p>
                          <span className="sr-only">Price: </span>
                          {item.price}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
