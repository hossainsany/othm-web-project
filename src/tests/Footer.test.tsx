import { Footer } from "@/components/Footer";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Footer", () => {
  it("exposes the bakery address and a callable phone link", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo", { name: "Site footer" });

    expect(
      within(footer).getByRole("heading", { level: 2, name: "Local Bakery Co." }),
    ).toBeInTheDocument();

    const address = within(footer).getByText("24 Maple Street, Brookfield, MA 01506");
    expect(address.tagName).toBe("ADDRESS");

    const phoneLink = within(footer).getByRole("link", { name: "(508) 555-0142" });
    expect(phoneLink).toHaveAttribute("href", "tel:+15085550142");
  });
});
