import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useForm } from "@tanstack/react-form";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function getErrorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return undefined;
}

function FieldError({ id, errors }: { id: string; errors: unknown[] }) {
  const message = getErrorMessage(errors[0]);

  if (!message) return null;

  return (
    <p id={id} role="alert" className="text-sm text-destructive">
      {message}
    </p>
  );
}

export const ContactForm = () => {
  useDocumentTitle("Contact");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    onSubmit: async () => {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSubmitting(false);

      toast.success("Message sent!", {
        description: "Thanks for reaching out. We'll get back to you soon.",
      });

      form.reset();
    },
  });
  return (
    <form
      noValidate
      aria-labelledby="contact-form-heading"
      aria-describedby="contact-form-description contact-form-note"
      aria-busy={isSubmitting}
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => (value.trim() ? undefined : "Please enter your name."),
          }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;

            return (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">
                  Name <span aria-hidden="true">*</span>
                </Label>
                <Input
                  id="name"
                  name={field.name}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  required
                  disabled={isSubmitting}
                  className="h-11"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  aria-describedby={isInvalid ? "name-error" : undefined}
                />
                {isInvalid && <FieldError id="name-error" errors={field.state.meta.errors} />}
              </div>
            );
          }}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              if (!value.trim()) return "Please enter your email address.";
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return "Please enter a valid email address.";
              }
            },
          }}
        >
          {(field) => {
            const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;

            return (
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">
                  Email <span aria-hidden="true">*</span>
                </Label>
                <Input
                  id="email"
                  name={field.name}
                  type="email"
                  placeholder="jane@example.com"
                  autoComplete="email"
                  required
                  disabled={isSubmitting}
                  className="h-11"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  aria-describedby={isInvalid ? "email-error" : undefined}
                />
                {isInvalid && <FieldError id="email-error" errors={field.state.meta.errors} />}
              </div>
            );
          }}
        </form.Field>
      </div>

      <form.Field
        name="message"
        validators={{
          onChange: ({ value }) =>
            value.trim().length >= 10
              ? undefined
              : "Please write a message of at least 10 characters.",
        }}
      >
        {(field) => {
          const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0;

          return (
            <div className="flex flex-col gap-2">
              <Label htmlFor="message">
                Message <span aria-hidden="true">*</span>
              </Label>
              <Textarea
                id="message"
                name={field.name}
                placeholder="Tell us how we can help..."
                rows={5}
                required
                disabled={isSubmitting}
                className="min-h-32 resize-none"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={isInvalid}
                aria-describedby={isInvalid ? "message-error" : undefined}
              />
              {isInvalid && <FieldError id="message-error" errors={field.state.meta.errors} />}
            </div>
          );
        }}
      </form.Field>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="w-full mt-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
            Sending...
          </>
        ) : (
          <>
            Send message
            <Send aria-hidden="true" />
          </>
        )}
      </Button>

      <p role="status" className="sr-only">
        {isSubmitting ? "Sending your message..." : ""}
      </p>

      <p id="contact-form-note" className="text-xs text-muted-foreground text-center">
        This is a demo form — your message won't be sent anywhere.
      </p>
    </form>
  );
};
