import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  useDocumentTitle("About Us");

  return (
    <>
      <PageHeader
        heading="About Us"
        headingId="about-heading"
        subHeading="A small shop, a familiar face and something good in the oven."
      />
      <section aria-labelledby="about-heading" className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="rounded-2xl overflow-hidden h-80 md:h-100">
              <img
                src="/about-1.jpg"
                alt="Bread and pastries displayed in the bakery's glass counter"
                width={640}
                height={427}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-4xl font-medium mb-4">It started with a loaf and a hello.</h2>
              <p className="text-lg text-muted-foreground">
                We opened Maple Street Bakery in 2014 with one oven, a well-loved sourdough starter
                and a hope: to make a place where neighbors could feel at home.
              </p>
              <p className="text-lg text-muted-foreground">
                Today, we still mix, shape and bake right here in Brookfield. We take our time with
                the dough, use ingredients we trust and make the kind of food we'd share around our
                own table.
              </p>
              <p className="text-lg text-muted-foreground">
                Whether you're a regular or just passing through, there's always a warm welcome.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden h-80 md:h-100">
              <img
                src="/about-2.jpg"
                alt="A baker kneading a large piece of dough on a floured table"
                width={640}
                height={427}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden h-80 md:h-100">
              <img
                src="/about-3.jpg"
                alt="Fresh loaves and pastries arranged in the bakery display"
                width={640}
                height={510}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <section aria-labelledby="about-cta-heading" className="pb-24">
        <div className="container mx-auto px-4 lg:px-0">
          <div className="bg-secondary rounded-2xl px-6 py-12 md:px-12 text-center">
            <h2
              id="about-cta-heading"
              className="text-4xl md:text-5xl font-bold tracking-tight max-w-2xl mx-auto mt-4"
            >
              There's always something warm waiting for you.
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mt-4">
              Stop by for a loaf, stay for a coffee, or ask us about a cake for your next
              celebration. We'd love to meet you.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                render={<Link to="/contact" />}
                nativeButton={false}
                size="lg"
                className="w-full sm:w-auto"
              >
                Get in touch
                <ArrowRight aria-hidden="true" />
              </Button>
              <Button
                render={<Link to="/menu" />}
                nativeButton={false}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-transparent"
              >
                Browse the menu
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
