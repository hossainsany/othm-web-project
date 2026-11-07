import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CakeSlice, Croissant, Wheat } from "lucide-react";

const favorites = [
  {
    icon: Wheat,
    name: "Country sourdough",
    description:
      "Our signature loaf: a crackly crust, a soft middle and just enough tang. It starts with a starter we've kept going since 2014.",
    price: "$7.00",
  },
  {
    icon: Croissant,
    name: "Butter croissant",
    description:
      "Laminated by hand with cultured butter, then baked until the layers shatter. Best eaten warm, with coffee, before the walk home.",
    price: "$3.50",
  },
  {
    icon: CakeSlice,
    name: "Chocolate cake slice",
    description:
      "Rich cocoa sponge under a silky chocolate frosting. The kind of slice that turns an ordinary Tuesday into a small celebration.",
    price: "$5.50",
  },
];

export const Favorites = () => {
  return (
    <section aria-labelledby="favorites-heading" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-0">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between mb-12">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary mb-3">
              Fresh from the oven
            </p>
            <h2 id="favorites-heading" className="text-4xl md:text-5xl font-bold tracking-tight">
              The ones we're known for
            </h2>
            <p className="text-lg text-muted-foreground mt-4">
              A few favorites that come out of the oven every morning. The full menu changes with
              the seasons and whatever looks best at the market.
            </p>
          </div>
          <Button
            render={<Link to="/menu" />}
            nativeButton={false}
            variant="outline"
            size="lg"
            className="w-full md:w-auto bg-transparent"
          >
            See the full menu
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <li
              key={favorite.name}
              className="flex flex-col rounded-2xl border bg-card p-8 transition-shadow hover:shadow-sm motion-reduce:transition-none"
            >
              <span
                aria-hidden="true"
                className="mb-6 flex size-12 items-center justify-center rounded-full bg-secondary text-primary"
              >
                <favorite.icon className="size-6" />
              </span>
              <h3 className="text-2xl font-medium">{favorite.name}</h3>
              <p className="mt-2 flex-1 text-muted-foreground">{favorite.description}</p>
              <p className="mt-6 font-medium">
                {favorite.price}
                <span className="ml-2 text-sm font-normal text-muted-foreground">baked daily</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
