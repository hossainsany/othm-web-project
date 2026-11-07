import { vi } from "vitest";

export type SupabaseQueryResult = {
  data?: unknown;
  error?: { code?: string; message?: string } | null;
  count?: number | null;
};

export type SupabaseQueryBuilder = {
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  then: ReturnType<typeof vi.fn>;
};

/**
 * Minimal stand-in for Supabase's chainable query builder. Every builder
 * method returns itself, and awaiting the builder resolves the supplied
 * result, just like a real PostgREST query.
 */
export function createQueryBuilder(
  result: SupabaseQueryResult = { data: null, error: null },
): SupabaseQueryBuilder {
  const builder = {} as SupabaseQueryBuilder;

  builder.select = vi.fn(() => builder);
  builder.insert = vi.fn(() => builder);
  builder.update = vi.fn(() => builder);
  builder.delete = vi.fn(() => builder);
  builder.eq = vi.fn(() => builder);
  builder.order = vi.fn(() => builder);
  builder.limit = vi.fn(() => builder);
  builder.single = vi.fn(async () => result);
  builder.then = vi.fn(async (onFulfilled, onRejected) =>
    Promise.resolve(result).then(onFulfilled, onRejected),
  );

  return builder;
}

export function createSupabaseMock(
  result: SupabaseQueryResult = { data: null, error: null },
) {
  const builder = createQueryBuilder(result);
  const from = vi.fn(() => builder);

  return {
    supabase: { from },
    from,
    builder,
  };
}
