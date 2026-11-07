import { createFileRoute } from "@tanstack/react-router";
import { Favorites } from "@/components/Favorites";
import { Hero } from "@/components/Hero";
import { Hours } from "@/components/Hours";
import { Story } from "@/components/Story";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  useDocumentTitle("Home");

  return (
    <>
      <Hero />
      <Story />
      <Favorites />
      <Hours />
    </>
  );
}
