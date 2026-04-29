"use client";

import { useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { formatDateTime } from "@/lib/dates";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  readAt: string | null;
};

interface MessagesListProps {
  initialMessages: Message[];
}

export function MessagesList({ initialMessages }: MessagesListProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function toggleRead(m: Message) {
    setPendingId(m.id);
    const newRead = m.readAt === null;
    try {
      const res = await fetch(`/api/admin/messages/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: newRead }),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      setMessages((list) =>
        list.map((x) =>
          x.id === m.id
            ? { ...x, readAt: newRead ? new Date().toISOString() : null }
            : x
        )
      );
    } catch {
      toast.error("Impossible de mettre à jour le message.");
    } finally {
      setPendingId(null);
    }
  }

  async function remove(m: Message) {
    if (!confirm("Supprimer ce message ? Cette action est irréversible.")) return;
    setPendingId(m.id);
    try {
      const res = await fetch(`/api/admin/messages/${m.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur serveur");
      setMessages((list) => list.filter((x) => x.id !== m.id));
      toast.success("Message supprimé.");
    } catch {
      toast.error("Suppression impossible.");
    } finally {
      setPendingId(null);
    }
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-white p-12 text-center text-foreground/55">
        <Mail className="h-10 w-10 mx-auto mb-3 text-cherry-bloom/60" />
        <p className="text-sm">Aucun message pour le moment.</p>
      </div>
    );
  }

  return (
    <ul className="rounded-2xl border border-border/60 bg-white divide-y divide-border/60">
      {messages.map((m) => {
        const unread = m.readAt === null;
        const isPending = pendingId === m.id;
        return (
          <li
            key={m.id}
            className={cn(
              "p-5 transition",
              unread ? "bg-cherry-bloom/5" : "bg-white"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {unread && (
                    <span className="h-2 w-2 rounded-full bg-cherry-bloom shrink-0" />
                  )}
                  <span
                    className={cn(
                      "text-sm truncate",
                      unread
                        ? "font-semibold text-foreground"
                        : "text-foreground/80"
                    )}
                  >
                    {m.name}
                  </span>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-xs text-cherry-leaf hover:underline truncate"
                  >
                    {m.email}
                  </a>
                </div>
                <p className="text-sm text-foreground/75 whitespace-pre-wrap leading-relaxed">
                  {m.message}
                </p>
                <p className="text-xs text-foreground/50 mt-2">
                  {formatDateTime(m.createdAt)}
                </p>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleRead(m)}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-2.5 py-1.5 text-xs text-foreground/70 hover:border-cherry-leaf/40 hover:text-cherry-leaf transition disabled:opacity-50"
                  title={unread ? "Marquer comme lu" : "Marquer comme non lu"}
                >
                  {unread ? (
                    <>
                      <MailOpen className="h-3.5 w-3.5" />
                      Lu
                    </>
                  ) : (
                    <>
                      <Mail className="h-3.5 w-3.5" />
                      Non lu
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => remove(m)}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-2.5 py-1.5 text-xs text-foreground/70 hover:border-destructive/40 hover:text-destructive transition disabled:opacity-50"
                  title="Supprimer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
