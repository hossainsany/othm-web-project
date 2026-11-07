import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const CustomOrders = () => {
  return (
    <section aria-labelledby="custom-orders-heading" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-0">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16 items-center rounded-2xl bg-primary px-6 py-12 md:px-12 md:py-16 text-primary-foreground">
          <div>
            <h2
              id="custom-orders-heading"
              className="text-4xl md:text-4xl font-bold tracking-tight capitalize"
            >
              Need Something special? We'll bake it.
            </h2>
            <p className="text-base text-primary-foreground/90 mt-4 max-w-xl">
              Birthdays, weddings, new neighbors, or a Tuesday that needs a little more joy. Tell us
              the date and the idea, and we'll work with you on a cake or a table full of pastries.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:items-end md:text-end">
            <Button
              render={<Link to="/contact" />}
              nativeButton={false}
              variant="secondary"
              size="lg"
              className="w-full md:w-auto mt-2"
            >
              Plan a cake order
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
