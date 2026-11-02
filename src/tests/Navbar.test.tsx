import { Navbar } from "@/components/Navbar";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

function renderNavbar(initialEntry = "/") {
  const rootRoute = createRootRoute({ component: Navbar });
  const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/" });
  const menuRoute = createRoute({ getParentRoute: () => rootRoute, path: "/menu" });
  const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: "/about" });
  const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: "/contact" });
  const routeTree = rootRoute.addChildren([indexRoute, menuRoute, aboutRoute, contactRoute]);
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialEntry] }),
  });

  render(<RouterProvider router={router} />);
  return router;
}

describe("Navbar", () => {
  it("labels the navigation landmark and marks the current page", async () => {
    renderNavbar("/contact");

    const navigation = await screen.findByRole("navigation", { name: "Main navigation" });
    const contactLink = within(navigation).getByRole("link", { name: "Contact" });

    expect(contactLink).toHaveAttribute("aria-current", "page");
    expect(within(navigation).getByRole("link", { name: "Home" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("toggles the mobile menu and exposes its expanded state", async () => {
    const user = userEvent.setup();
    renderNavbar("/contact");

    const openButton = await screen.findByRole("button", { name: "Open navigation menu" });
    const mobileMenu = document.getElementById("mobile-menu");

    expect(openButton).toHaveAttribute("aria-expanded", "false");
    expect(openButton).toHaveAttribute("aria-controls", "mobile-menu");
    expect(mobileMenu).toHaveAttribute("aria-hidden", "true");

    await user.click(openButton);

    const closeButton = screen.getByRole("button", { name: "Close navigation menu" });
    expect(closeButton).toHaveAttribute("aria-expanded", "true");
    expect(mobileMenu).toHaveAttribute("aria-hidden", "false");

    const mobileContactLink = within(mobileMenu as HTMLElement).getByRole("link", {
      name: "Contact",
    });
    expect(mobileContactLink).toHaveAttribute("aria-current", "page");

    await user.click(mobileContactLink);

    expect(await screen.findByRole("button", { name: "Open navigation menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});
