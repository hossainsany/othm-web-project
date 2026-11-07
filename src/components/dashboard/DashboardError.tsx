import { Button, buttonVariants } from "@/components/ui/button";
import { Link, type ErrorComponentProps } from "@tanstack/react-router";
import { AlertTriangle, RefreshCw } from "lucide-react";

function getMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function DashboardError({ error, reset }: ErrorComponentProps) {
  const message = getMessage(error);
  const isMissingSchema =
    message.includes("schema cache") ||
    message.includes("does not exist") ||
    message.includes("Could not find the table");

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl rounded-2xl border bg-card p-8">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive"
          >
            <AlertTriangle className="size-5" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold">Could not load the dashboard</h1>
            <p className="mt-2 text-muted-foreground">
              {isMissingSchema
                ? "Supabase is connected, but the database tables have not been created yet. Run the project schema in the Supabase SQL Editor, then try again."
                : "Something went wrong while loading data from Supabase."}
            </p>
          </div>
        </div>

        {isMissingSchema ? (
          <div className="mt-6 rounded-lg bg-secondary p-4 text-sm">
            <p className="font-medium">Run this file in Supabase:</p>
            <p className="mt-1 font-mono text-xs">supabase/schema.sql</p>
            <p className="mt-2 text-muted-foreground">
              SQL Editor → New query → paste the file → Run. The script is safe to run more than
              once and seeds the starter menu.
            </p>
          </div>
        ) : null}

        <details className="mt-6">
          <summary className="cursor-pointer text-sm font-medium">Technical details</summary>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-3 text-xs whitespace-pre-wrap">
            {message}
          </pre>
        </details>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button type="button" onClick={reset}>
            <RefreshCw aria-hidden="true" />
            Try again
          </Button>
          <Link to="/" className={buttonVariants({ variant: "outline" })}>
            Back to the website
          </Link>
        </div>
      </div>
    </section>
  );
}
