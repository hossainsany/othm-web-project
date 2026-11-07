const values = [
  {
    title: "Mixed by hand",
    description: "Small batches, long rises and no shortcuts. Good bread takes the time it takes.",
  },
  {
    title: "Ingredients we trust",
    description: "Stone-milled flour, cultured butter and fruit from growers we know by name.",
  },
  {
    title: "Baked for the neighborhood",
    description:
      "Whatever is on the counter is meant to be shared. Pull up a chair and stay a while.",
  },
];

export const Story = () => {
  return (
    <section aria-labelledby="story-heading" className="py-24 bg-secondary">
      <div className="container mx-auto px-4 lg:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="rounded-2xl overflow-hidden h-80 md:h-120">
            <img
              src="/about-2.jpg"
              alt="A baker kneading dough by hand on a flour-dusted table"
              width={640}
              height={427}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 id="story-heading" className="text-4xl md:text-5xl font-bold tracking-tight">
              Slow mornings, small batches, real butter.
            </h2>
            <p className="text-lg text-muted-foreground mt-6">
              We're a small team on Maple Street with one rule: make the food we'd want to share
              around our own table. That means starting before sunrise, shaping every loaf by hand
              and keeping the counter full of things worth coming back for.
            </p>

            <ul className="mt-10 flex flex-col gap-6">
              {values.map((value) => (
                <li key={value.title} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-2 shrink-0 rounded-full bg-primary"
                  />
                  <div>
                    <h3 className="text-lg font-medium">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
