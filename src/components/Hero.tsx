import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Hero = () => {
  return (
    <section aria-labelledby="hero-heading" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-0 flex flex-col lg:flex-row items-center min-h-[60vh]">
        <div className="flex-1 flex flex-col gap-4 order-2 lg:order-1">
          <span className="text-base lg:text-lg capitalize">Baked in Brookfield Since 2014</span>
          <h1 id="hero-heading" className="text-4xl lg:text-7xl font-bold lg:max-w-lg">
            A little flour. A lot of heart.
          </h1>
          <p id="hero-description" className="text-base lg:max-w-lg">
            Slow-made bread, buttery pastries and cakes for the everyday celebrations. Come in, say
            hello and take something lovely home.
          </p>
          <div className="w-full md:w-auto mt-4 lg:mt-0">
            <Button
              render={<Link to="/menu" />}
              nativeButton={false}
              size="lg"
              className="w-full lg:w-auto capitalize"
            >
              See our menu & prices
            </Button>
          </div>
        </div>
        <div className="flex-1 order-1 lg:order-2 mb-8 lg:mb-0">
          <div className="w-full rounded-2xl overflow-hidden">
            <img
              src="/hero.jpg"
              alt="Loaves of bread and pastries on display at Local Bakery Co."
              width={640}
              height={427}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
