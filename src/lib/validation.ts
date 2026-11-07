import { z } from "zod";

const emailSchema = z
  .string({ error: "Email is required." })
  .trim()
  .toLowerCase()
  .pipe(z.email("Please enter a valid email address."));

const passwordSchema = z
  .string({ error: "Password must be at least 6 characters." })
  .min(6, "Password must be at least 6 characters.");

export const signInInputSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const contactNameSchema = z
  .string({ error: "Please enter your name." })
  .trim()
  .min(1, "Please enter your name.")
  .max(100, "Name must be 100 characters or fewer.");

export const contactEmailSchema = z
  .string({ error: "Please enter your email address." })
  .trim()
  .toLowerCase()
  .min(1, "Please enter your email address.")
  .pipe(z.email("Please enter a valid email address."));

export const contactMessageBodySchema = z
  .string({ error: "Please write a message of at least 10 characters." })
  .trim()
  .min(10, "Please write a message of at least 10 characters.")
  .max(2000, "Message must be 2,000 characters or fewer.");

export const contactMessageInputSchema = z.object({
  name: contactNameSchema,
  email: contactEmailSchema,
  message: contactMessageBodySchema,
});

export const contactStatusSchema = z.enum(["new", "read", "replied"], {
  error: "Unknown message status.",
});

function requiredIdSchema(message: string) {
  return z.string({ error: message }).trim().min(1, message);
}

export const contactMessageIdSchema = requiredIdSchema("A valid message id is required.");
export const menuItemIdSchema = requiredIdSchema("A valid item id is required.");

export const updateContactStatusInputSchema = z.object({
  id: contactMessageIdSchema,
  status: contactStatusSchema,
});

export const contactMessageIdInputSchema = z.object({
  id: contactMessageIdSchema,
});

const priceSchema = z.coerce
  .number({ error: "Price must be a positive number." })
  .min(0, "Price must be a positive number.")
  .max(100000, "Price must be 100,000 or less.")
  .transform((value) => Math.round(value * 100) / 100);

const sortOrderSchema = z.coerce
  .number({ error: "Sort order must be a whole number of 0 or more." })
  .int("Sort order must be a whole number of 0 or more.")
  .min(0, "Sort order must be a whole number of 0 or more.");

const menuCategorySchema = z
  .string({ error: "Category is required." })
  .trim()
  .min(1, "Category is required.")
  .max(60, "Category must be 60 characters or fewer.");

const menuNameSchema = z
  .string({ error: "Name is required." })
  .trim()
  .min(1, "Name is required.")
  .max(120, "Name must be 120 characters or fewer.");

const menuDescriptionSchema = z
  .string({ error: "Description must be 500 characters or fewer." })
  .trim()
  .max(500, "Description must be 500 characters or fewer.")
  .default("");

export const menuItemInputSchema = z.object({
  category: menuCategorySchema,
  name: menuNameSchema,
  description: menuDescriptionSchema,
  price: priceSchema,
  available: z.boolean({ error: "Availability must be true or false." }),
  sortOrder: sortOrderSchema,
});

export const menuItemUpdateInputSchema = menuItemInputSchema.extend({
  id: menuItemIdSchema,
});

export const menuItemIdInputSchema = z.object({
  id: menuItemIdSchema,
});

const formPriceSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  priceSchema,
);

const formSortOrderSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  sortOrderSchema,
);

/** The dashboard form keeps every field as a string until it is submitted. */
export const menuItemFormSchema = z.object({
  category: menuCategorySchema,
  name: menuNameSchema,
  description: menuDescriptionSchema,
  price: formPriceSchema,
  available: z.boolean(),
  sortOrder: formSortOrderSchema,
});

export const loginSearchSchema = z.object({
  redirect: z
    .string()
    .refine(
      (value) => value.startsWith("/") && !value.startsWith("//") && !value.includes("\\"),
      "Redirect must be a local path.",
    )
    .optional(),
});

/**
 * Parse untrusted input and surface the first validation message as a plain
 * error. Server function errors are serialized to the client, and a raw
 * ZodError message is not user-friendly.
 */
export function parseInput<T extends z.ZodType>(schema: T, value: unknown): z.output<T> {
  const result = schema.safeParse(value);

  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Invalid input.");
  }

  return result.data;
}

/** Return the first validation message, or undefined when the value is valid. */
export function validationError<T extends z.ZodType>(
  schema: T,
  value: unknown,
): string | undefined {
  const result = schema.safeParse(value);

  if (result.success) return undefined;

  return result.error.issues[0]?.message ?? "Invalid input.";
}
