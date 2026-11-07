import {
  contactMessageInputSchema,
  loginSearchSchema,
  menuItemFormSchema,
  menuItemInputSchema,
  signInInputSchema,
} from "@/lib/validation";
import { describe, expect, it } from "vitest";

describe("validation schemas", () => {
  it("normalizes contact messages", () => {
    const result = contactMessageInputSchema.parse({
      name: "  Jane Doe  ",
      email: "  JANE@Example.com ",
      message: "  I would like to order a birthday cake.  ",
    });

    expect(result).toEqual({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "I would like to order a birthday cake.",
    });
  });

  it("rejects contact messages that are too short", () => {
    const result = contactMessageInputSchema.safeParse({
      name: "Jane",
      email: "jane@example.com",
      message: "Hi",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Please write a message of at least 10 characters.",
      );
    }
  });

  it("normalizes and rounds menu item input", () => {
    const result = menuItemInputSchema.parse({
      category: " Bread ",
      name: " Sourdough ",
      description: " Crusty and tangy. ",
      price: "7.005",
      available: true,
      sortOrder: "2",
    });

    expect(result).toEqual({
      category: "Bread",
      name: "Sourdough",
      description: "Crusty and tangy.",
      price: 7.01,
      available: true,
      sortOrder: 2,
    });
  });

  it("rejects an empty price in the dashboard form", () => {
    const result = menuItemFormSchema.safeParse({
      category: "Bread",
      name: "Sourdough",
      description: "",
      price: "",
      available: true,
      sortOrder: "0",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid sign-in input", () => {
    expect(signInInputSchema.safeParse({ email: "not-an-email", password: "123456" }).success).toBe(
      false,
    );
    expect(
      signInInputSchema.safeParse({ email: "staff@example.com", password: "123" }).success,
    ).toBe(false);
  });

  it("only accepts local redirect paths", () => {
    expect(loginSearchSchema.parse({ redirect: "/dashboard/menu" })).toEqual({
      redirect: "/dashboard/menu",
    });
    expect(loginSearchSchema.safeParse({ redirect: "https://example.com" }).success).toBe(false);
    expect(loginSearchSchema.safeParse({ redirect: "//example.com" }).success).toBe(false);
  });
});
