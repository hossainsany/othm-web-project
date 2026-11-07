import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const openingHour = [
  { day: "Tuesday - Friday", time: "7am - 4pm" },
  { day: "Saturday - Sunday", time: "8am - 2pm" },
  { day: "Monday", time: "Closed" },
];

export const Hours = () => {
  return (
    <section aria-labelledby="opening-hours-heading" className="md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-12 grid grid-cols-1 md:grid-cols-2 bg-secondary rounded-lg md:border py-24 md:p-12 gap-12 md:gap-0">
        <div>
          <h2 id="opening-hours-heading" className="text-xl lg:text-2xl font-bold mb-2">
            Opening hours
          </h2>

          <dl>
            {openingHour.map((item) => (
              <div className="grid grid-cols-2 gap-y-8 mt-3" key={item.day}>
                <dt className="text-base md:text-lg">{item.day}</dt>
                <dd className="text-base lg:text-lg font-medium text-end md:text-start">
                  {item.time}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold mb-4">Your corner of Maple Street</h2>
            <address className="text-base not-italic mb-2">
              24 Maple Street, Brookfield, MA 01506
            </address>
            <p className="text-base mb-4">
              Follow the smell of warm bread, we're right by the village green.
            </p>
          </div>

          <Link
            to="/contact"
            className="text-lg font-medium underline text-primary flex items-center gap-1 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Find us & get in touch <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};
