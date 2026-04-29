import { prisma } from "@/lib/prisma";
import { MessagesList } from "@/components/admin/messages-list";

export const dynamic = "force-dynamic";
export const metadata = { title: "Messages" };

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const unreadCount = messages.filter((m) => m.readAt === null).length;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-cherry-bloom">
          Messages
        </p>
        <h1 className="font-serif text-3xl text-cherry-leaf">
          Boîte de réception
        </h1>
        <p className="text-sm text-foreground/65 mt-1">
          {unreadCount > 0
            ? `${unreadCount} message${unreadCount > 1 ? "s" : ""} non lu${unreadCount > 1 ? "s" : ""}`
            : "Aucun message non lu."}
        </p>
      </header>

      <MessagesList
        initialMessages={messages.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          message: m.message,
          createdAt: m.createdAt.toISOString(),
          readAt: m.readAt ? m.readAt.toISOString() : null,
        }))}
      />
    </div>
  );
}
