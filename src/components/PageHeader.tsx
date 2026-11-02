interface Props {
  heading: string;
  subHeading: string;
  headingId?: string;
}

export const PageHeader = ({ heading, subHeading, headingId }: Props) => {
  return (
    <header className="py-24 bg-secondary border-t-2">
      <div className="max-w-sm md:max-w-lg text-center mx-auto">
        <h1 id={headingId} className="text-5xl font-bold mb-2">
          {heading}
        </h1>
        <p className="text-muted-foreground">{subHeading}</p>
      </div>
    </header>
  );
};
