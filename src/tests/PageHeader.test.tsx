import { PageHeader } from "@/components/PageHeader";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("PageHeader", () => {
  it("renders a single top-level heading and its supporting text", () => {
    render(
      <PageHeader
        heading="Our Menu"
        headingId="menu-heading"
        subHeading="Bread, pastries and cakes made in small batches."
      />,
    );

    const heading = screen.getByRole("heading", { level: 1, name: "Our Menu" });

    expect(heading).toHaveAttribute("id", "menu-heading");
    expect(
      screen.getByText("Bread, pastries and cakes made in small batches."),
    ).toBeInTheDocument();
  });
});
