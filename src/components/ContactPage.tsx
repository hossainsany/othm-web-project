import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { Clock, MapPin, Phone } from "lucide-react";

const contactDetails = [
  {
    icon: MapPin,
    label: "Visit us",
    value: "24 Maple Street, Brookfield, MA 01506",
  },
  {
    icon: Phone,
    label: "Call us",
    value: "(508) 555-0142",
    href: "tel:+15085550142",
  },
];

const openingHours = [
  { day: "Tuesday - Friday", time: "7am - 4pm" },
  { day: "Saturday - Sunday", time: "8am - 2pm" },
  { day: "Monday", time: "Closed" },
];

const linkFocusStyles =
  "focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function ContactPage() {
  return (
    <>
      <PageHeader
        heading="Contact"
        headingId="contact-heading"
        subHeading="Questions, cake orders or a simple hello, we'd love to hear from you."
      />
      <section aria-labelledby="contact-heading" className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="flex flex-col gap-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Come in, call, or write.</h2>
                <p className="text-lg text-muted-foreground">
                  Whether it's a question about an order, a birthday cake or just to say hello,
                  we're all ears.
                </p>
              </div>

              <ul className="flex flex-col gap-6">
                {contactDetails.map((detail) => (
                  <li key={detail.label} className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"
                    >
                      <detail.icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-medium">{detail.label}</h3>
                      {detail.href ? (
                        <a
                          href={detail.href}
                          className={`text-muted-foreground transition-colors hover:text-primary ${linkFocusStyles}`}
                        >
                          {detail.value}
                        </a>
                      ) : detail.label === "Visit us" ? (
                        <address className="text-muted-foreground not-italic">
                          {detail.value}
                        </address>
                      ) : (
                        <p className="text-muted-foreground">{detail.value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <section
                aria-labelledby="contact-hours-heading"
                className="rounded-2xl bg-secondary p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Clock aria-hidden="true" className="size-5 text-primary" />
                  <h3 id="contact-hours-heading" className="text-lg font-medium">
                    Opening hours
                  </h3>
                </div>
                <dl className="flex flex-col gap-2">
                  {openingHours.map((hour) => (
                    <div key={hour.day} className="flex items-center justify-between gap-4">
                      <dt>{hour.day}</dt>
                      <dd
                        className={
                          hour.time === "Closed"
                            ? "text-muted-foreground"
                            : "font-medium text-foreground"
                        }
                      >
                        {hour.time}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>

            <section
              aria-labelledby="contact-form-heading"
              className="rounded-2xl border bg-card p-6 md:p-8 h-fit flex flex-col justify-center"
            >
              <h2 id="contact-form-heading" className="text-2xl font-semibold">
                Send us a message
              </h2>
              <p id="contact-form-description" className="text-muted-foreground mt-1 mb-8">
                Fill in the form and we'll get back to you as soon as we can.
              </p>
              <ContactForm />
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
