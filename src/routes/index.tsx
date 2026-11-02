import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { Hours } from "@/components/Hours";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  useDocumentTitle("Home");

  return (
    <>
      <Hero />
      <Hours />
    </>
  );
}
