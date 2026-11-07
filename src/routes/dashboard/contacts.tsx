import { ContactsManager } from "@/components/dashboard/ContactsManager";
import { DashboardError } from "@/components/dashboard/DashboardError";
import { listContactMessages } from "@/lib/supabase/contacts";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/contacts")({
  head: () => ({
    meta: [
      { title: "Contact messages | Local Bakery Co." },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: () => listContactMessages(),
  errorComponent: DashboardError,
  component: DashboardContactsPage,
});

function DashboardContactsPage() {
  const messages = Route.useLoaderData();

  return <ContactsManager messages={messages} />;
}
