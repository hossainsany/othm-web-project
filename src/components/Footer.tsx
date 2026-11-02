export const Footer = () => {
  return (
    <footer aria-label="Site footer" className="bg-[#D8C9B8] pt-12 pb-8">
      <div className="container mx-auto px-4 lg:px-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-xl font-medium">Local Bakery Co.</h2>
            <address className="not-italic">24 Maple Street, Brookfield, MA 01506</address>
          </div>
          <div className="text-start md:text-end">
            <h3 className="text-base md:font-medium flex items-center  gap-2">
              Tue-Fri 7am-4pm{" "}
              <span
                aria-hidden="true"
                className="inline-block bg-[#6B5B50]/85 h-1 w-1 rounded-full"
              />{" "}
              Sat-Sun 8am-2pm
            </h3>
            <p className="flex items-center md:justify-end gap-2">
              Closed Monday{" "}
              <span
                aria-hidden="true"
                className="inline-block bg-[#6B5B50]/85 h-1 w-1 rounded-full"
              />{" "}
              <a
                href="tel:+15085550142"
                className="transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                (508) 555-0142
              </a>
            </p>
          </div>
        </div>
        <div aria-hidden="true" className="bg-[#6B5B50]/25 h-0.5 my-2" />
        <p className="text-sm">Baked here. Shared here © 2026 Local Bakery Co.</p>
      </div>
    </footer>
  );
};
