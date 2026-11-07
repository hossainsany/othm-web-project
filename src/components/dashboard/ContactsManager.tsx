import { Button } from "@/components/ui/button";
import { deleteContactMessage, updateContactStatus } from "@/lib/supabase/contacts";
import type { ContactMessage, ContactStatus } from "@/lib/supabase/types";
import { useRouter } from "@tanstack/react-router";
import { Loader2, Mail, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const statuses: ContactStatus[] = ["new", "read", "replied"];

const statusLabels: Record<ContactStatus, string> = {
  new: "New",
  read: "Read",
  replied: "Replied",
};

const statusStyles: Record<ContactStatus, string> = {
  new: "bg-amber-100 text-amber-900",
  read: "bg-muted text-muted-foreground",
  replied: "bg-emerald-100 text-emerald-800",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

type Filter = "all" | ContactStatus;

function formatDate(value: string) {
  return `${dateFormatter.format(new Date(value))} UTC`;
}

function getErrorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return undefined;
}

type ContactsManagerProps = {
  messages: ContactMessage[];
};

export function ContactsManager({ messages }: ContactsManagerProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const counts: Record<Filter, number> = {
    all: messages.length,
    new: messages.filter((message) => message.status === "new").length,
    read: messages.filter((message) => message.status === "read").length,
    replied: messages.filter((message) => message.status === "replied").length,
  };

  const visibleMessages =
    filter === "all" ? messages : messages.filter((message) => message.status === filter);

  async function handleStatusChange(message: ContactMessage, status: ContactStatus) {
    if (status === message.status) return;

    setBusyId(message.id);

    try {
      await updateContactStatus(message.id, status);
      toast.success(`Marked as ${statusLabels[status].toLowerCase()}`);
      await router.invalidate();
    } catch (error) {
      toast.error("Could not update the message", {
        description: getErrorMessage(error) ?? "Please try again.",
      });
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(message: ContactMessage) {
    const confirmed = window.confirm(
      `Delete the message from ${message.name}? This cannot be undone.`,
    );

    if (!confirmed) return;

    setBusyId(message.id);

    try {
      await deleteContactMessage(message.id);
      toast.success("Message deleted");
      await router.invalidate();
    } catch (error) {
      toast.error("Could not delete the message", {
        description: getErrorMessage(error) ?? "Please try again.",
      });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Contact messages</h1>
        <p className="mt-2 text-muted-foreground">
          Read messages from the contact form and keep track of follow-ups.
        </p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter messages by status">
        {(["all", ...statuses] as Filter[]).map((value) => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={filter === value ? "default" : "outline"}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {value === "all" ? "All" : statusLabels[value]}
            <span className="ml-1 opacity-70">{counts[value]}</span>
          </Button>
        ))}
      </div>

      {visibleMessages.length === 0 ? (
        <div className="rounded-2xl border bg-card p-10 text-center">
          <Mail aria-hidden="true" className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-4 font-medium">
            {messages.length === 0 ? "No messages yet" : "Nothing in this category"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {messages.length === 0
              ? "Messages sent through the contact form will appear here."
              : "Try a different filter to see the other messages."}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {visibleMessages.map((message) => {
            const isBusy = busyId === message.id;

            return (
              <li key={message.id} className="rounded-2xl border bg-card p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{message.name}</h2>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[message.status]}`}
                      >
                        {statusLabels[message.status]}
                      </span>
                    </div>
                    <a
                      href={`mailto:${message.email}`}
                      className="mt-1 inline-block text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                    >
                      {message.email}
                    </a>
                  </div>

                  <time
                    dateTime={message.createdAt}
                    className="text-xs text-muted-foreground sm:text-right"
                  >
                    {formatDate(message.createdAt)}
                  </time>
                </div>

                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed">
                  {message.message}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-2 border-t pt-4">
                  <label htmlFor={`status-${message.id}`} className="text-xs font-medium">
                    Status
                  </label>
                  <select
                    id={`status-${message.id}`}
                    value={message.status}
                    onChange={(event) =>
                      handleStatusChange(message, event.target.value as ContactStatus)
                    }
                    disabled={isBusy}
                    className="h-8 rounded-lg border border-input bg-background px-2 text-sm disabled:opacity-50"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="sm:ml-auto"
                    onClick={() => handleDelete(message)}
                    disabled={isBusy}
                    aria-label={`Delete message from ${message.name}`}
                  >
                    {isBusy ? (
                      <Loader2
                        aria-hidden="true"
                        className="animate-spin motion-reduce:animate-none"
                      />
                    ) : (
                      <Trash2 aria-hidden="true" />
                    )}
                    Delete
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
