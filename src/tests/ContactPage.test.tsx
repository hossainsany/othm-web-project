import { Toaster } from "@/components/ui/sonner";
import { ContactPage } from "@/components/ContactPage";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

describe("ContactPage", () => {
  it("renders a labelled contact form with required fields", () => {
    render(<ContactPage />);

    expect(document.title).toBe("Contact | Local Bakery Co.");
    expect(screen.getByRole("heading", { level: 1, name: "Contact" })).toBeInTheDocument();

    const form = screen.getByRole("form", { name: "Send us a message" });
    expect(form).toHaveAttribute("aria-busy", "false");
    expect(form).toHaveAttribute("aria-describedby", "contact-form-description contact-form-note");

    expect(screen.getByLabelText(/^name/i)).toBeRequired();
    expect(screen.getByLabelText(/^email/i)).toBeRequired();
    expect(screen.getByLabelText(/^message/i)).toBeRequired();
  });

  it("shows accessible errors when the form is submitted empty", async () => {
    const user = userEvent.setup();
    render(<ContactPage />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText("Please enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Please enter your email address.")).toBeInTheDocument();
    expect(
      screen.getByText("Please write a message of at least 10 characters."),
    ).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/^name/i);
    expect(nameInput).toHaveAttribute("aria-invalid", "true");
    expect(nameInput).toHaveAttribute("aria-describedby", "name-error");
    expect(screen.getAllByRole("alert")).toHaveLength(3);
  });

  it("validates the email format after the field is blurred", async () => {
    const user = userEvent.setup();
    render(<ContactPage />);

    const emailInput = screen.getByLabelText(/^email/i);
    await user.type(emailInput, "not-an-email");
    await user.tab();

    expect(await screen.findByText("Please enter a valid email address.")).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("aria-invalid", "true");
  });

  it("shows a success toast after the simulated submission", async () => {
    const user = userEvent.setup();
    render(
      <>
        <ContactPage />
        <Toaster />
      </>,
    );

    const nameInput = screen.getByLabelText(/^name/i);
    const emailInput = screen.getByLabelText(/^email/i);
    const messageInput = screen.getByLabelText(/^message/i);

    await user.type(nameInput, "Jane Doe");
    await user.type(emailInput, "jane@example.com");
    await user.type(messageInput, "I would like to order a birthday cake.");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(screen.getByRole("button", { name: /sending/i })).toBeDisabled();
    expect(await screen.findByText("Message sent!", {}, { timeout: 3500 })).toBeInTheDocument();

    expect(nameInput).toHaveValue("");
    expect(emailInput).toHaveValue("");
    expect(messageInput).toHaveValue("");
  });
});
