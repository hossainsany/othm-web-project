import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { getCurrentUser, signInWithEmail } from "@/lib/supabase/auth";
import { loginSearchSchema } from "@/lib/validation";
import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { KeyRound, Loader2, LogIn } from "lucide-react";
import { useState, type FormEvent } from "react";

type LoginSearch = {
  redirect?: string;
};

function validateLoginSearch(search: Record<string, unknown>): LoginSearch {
  const result = loginSearchSchema.safeParse(search);

  return result.success ? result.data : {};
}

export const Route = createFileRoute("/login")({
  validateSearch: validateLoginSearch,
  beforeLoad: async () => {
    const user = await getCurrentUser();

    if (user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({
    meta: [
      { title: "Staff sign in | Local Bakery Co." },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content: "Sign in to manage the Local Bakery Co. menu and contact messages.",
      },
    ],
  }),
  component: LoginPage,
});

function getErrorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return undefined;
}

function LoginPage() {
  useDocumentTitle("Staff sign in");
  const router = useRouter();
  const { redirect: redirectTo } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await signInWithEmail(email, password);

      if (redirectTo) {
        await router.history.push(redirectTo);
      } else {
        await router.navigate({ to: "/dashboard" });
      }
    } catch (caughtError) {
      setError(getErrorMessage(caughtError) ?? "Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-secondary/40 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span
            aria-hidden="true"
            className="mb-4 flex size-12 items-center justify-center rounded-full bg-secondary text-primary"
          >
            <KeyRound className="size-6" />
          </span>
          <h1 className="text-3xl font-semibold tracking-tight">Staff sign in</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to manage the menu and contact messages.
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="staff@localbakery.example"
              required
              className="h-11"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
              minLength={6}
              className="h-11"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="mt-2 w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn aria-hidden="true" />
                Sign in
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/" className="underline underline-offset-4 hover:text-primary">
            Back to the website
          </Link>
        </p>
      </div>
    </section>
  );
}
