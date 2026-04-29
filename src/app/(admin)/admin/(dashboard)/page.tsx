import Link from "next/link";
import {
  CalendarDays,
  ClipboardList,
  Hourglass,
  Mail,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { addDays, endOfDay, endOfWeek, startOfDay, startOfWeek } from "date-fns";

import { prisma } from "@/lib/prisma";
import { BookingStatus, SlotStatus } from "@/lib/enums";
import { formatDateTime, formatTime } from "@/lib/dates";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tableau de bord" };

export default async function AdminDashboardPage() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const next30 = addDays(now, 30);

  const [
    pendingCount,
    confirmedTodayCount,
    weekConfirmedCount,
    unreadMessages,
    availableSlots30d,
    upcomingBookings,
    latestPending,
    latestMessages,
  ] = await Promise.all([
    prisma.booking.count({ where: { status: BookingStatus.PENDING } }),
    prisma.booking.count({
      where: {
        status: BookingStatus.CONFIRMED,
        slot: { startAt: { gte: todayStart, lte: todayEnd } },
      },
    }),
    prisma.booking.count({
      where: {
        status: BookingStatus.CONFIRMED,
        slot: { startAt: { gte: weekStart, lte: weekEnd } },
      },
    }),
    prisma.contactMessage.count({ where: { readAt: null } }),
    prisma.slot.count({
      where: {
        status: SlotStatus.AVAILABLE,
        startAt: { gte: now, lte: next30 },
      },
    }),
    prisma.booking.findMany({
      where: {
        status: BookingStatus.CONFIRMED,
        slot: { startAt: { gte: now } },
      },
      include: { slot: true, service: true },
      orderBy: { slot: { startAt: "asc" } },
      take: 5,
    }),
    prisma.booking.findMany({
      where: { status: BookingStatus.PENDING },
      include: { slot: true, service: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.contactMessage.findMany({
      where: { readAt: null },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  const kpis = [
    {
      label: "À traiter",
      value: pendingCount,
      hint: "Réservations en attente",
      href: "/admin/reservations?status=PENDING",
      icon: Hourglass,
      tone: "amber" as const,
    },
    {
      label: "Aujourd'hui",
      value: confirmedTodayCount,
      hint: "RDV confirmés",
      href: "/admin/calendrier",
      icon: ClipboardList,
      tone: "leaf" as const,
    },
    {
      label: "Cette semaine",
      value: weekConfirmedCount,
      hint: "RDV confirmés",
      href: "/admin/calendrier",
      icon: TrendingUp,
      tone: "bloom" as const,
    },
    {
      label: "Créneaux libres",
      value: availableSlots30d,
      hint: "Sur 30 jours",
      href: "/admin/calendrier",
      icon: CalendarDays,
      tone: "neutral" as const,
    },
  ];

  return (
    <div className="space-y-10">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-cherry-bloom">
          Tableau de bord
        </p>
        <h1 className="font-serif text-3xl text-cherry-leaf">Bonjour 👋</h1>
        <p className="text-sm text-foreground/65">
          Vue d&apos;ensemble de votre activité aujourd&apos;hui.
        </p>
      </header>

      {/* KPIs */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, hint, href, icon: Icon, tone }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-2xl border border-border/60 bg-white p-5 hover:border-cherry-leaf/40 hover:shadow-sm transition"
          >
            <div className="flex items-start justify-between">
              <div
                className={cn(
                  "h-9 w-9 rounded-lg flex items-center justify-center",
                  tone === "amber" && "bg-amber-100 text-amber-700",
                  tone === "leaf" && "bg-cherry-leaf/15 text-cherry-leaf",
                  tone === "bloom" && "bg-cherry-bloom/20 text-cherry-bloom",
                  tone === "neutral" && "bg-cream text-foreground/60"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="font-serif text-3xl text-ink">{value}</div>
              <div className="text-sm font-medium text-foreground/80 mt-1">
                {label}
              </div>
              <div className="text-xs text-foreground/55">{hint}</div>
            </div>
          </Link>
        ))}
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Prochains RDV */}
        <section className="rounded-2xl border border-border/60 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif text-xl text-cherry-leaf">
                Prochains rendez-vous
              </h2>
              <p className="text-xs text-foreground/55">Confirmés à venir</p>
            </div>
            <Link
              href="/admin/calendrier"
              className="text-xs uppercase tracking-wider text-cherry-leaf hover:underline"
            >
              Voir tout
            </Link>
          </div>

          {upcomingBookings.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              text="Aucun rendez-vous à venir."
            />
          ) : (
            <ul className="divide-y divide-border/60">
              {upcomingBookings.map((b) => (
                <li
                  key={b.id}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {b.customerFirstName} {b.customerLastName}
                    </div>
                    <div className="text-xs text-foreground/60 truncate">
                      {b.service.name}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm text-cherry-leaf font-medium">
                      {formatTime(b.slot.startAt)}
                    </div>
                    <div className="text-xs text-foreground/55">
                      {formatDateTime(b.slot.startAt).split(" à ")[0]}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Demandes en attente */}
        <section className="rounded-2xl border border-border/60 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif text-xl text-cherry-leaf">
                Demandes en attente
              </h2>
              <p className="text-xs text-foreground/55">À valider ou refuser</p>
            </div>
            <Link
              href="/admin/reservations?status=PENDING"
              className="text-xs uppercase tracking-wider text-cherry-leaf hover:underline"
            >
              Voir tout
            </Link>
          </div>

          {latestPending.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              text="Aucune demande en attente."
            />
          ) : (
            <ul className="divide-y divide-border/60">
              {latestPending.map((b) => (
                <li
                  key={b.id}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {b.customerFirstName} {b.customerLastName}
                    </div>
                    <div className="text-xs text-foreground/60 truncate">
                      {b.service.name} · {formatDateTime(b.slot.startAt)}
                    </div>
                  </div>
                  <Link
                    href={`/admin/reservations/${b.id}`}
                    className="shrink-0 rounded-full border border-cherry-leaf/40 px-3 py-1 text-xs uppercase tracking-wider text-cherry-leaf hover:bg-cherry-leaf/10 transition"
                  >
                    Traiter
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Messages non lus */}
      <section className="rounded-2xl border border-border/60 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif text-xl text-cherry-leaf">
              Messages récents
            </h2>
            <p className="text-xs text-foreground/55">
              {unreadMessages > 0
                ? `${unreadMessages} non lu${unreadMessages > 1 ? "s" : ""}`
                : "Tout est à jour"}
            </p>
          </div>
          <Link
            href="/admin/messages"
            className="text-xs uppercase tracking-wider text-cherry-leaf hover:underline"
          >
            Voir tout
          </Link>
        </div>

        {latestMessages.length === 0 ? (
          <EmptyState icon={Mail} text="Aucun message non lu." />
        ) : (
          <ul className="divide-y divide-border/60">
            {latestMessages.map((m) => (
              <li key={m.id} className="py-3">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="text-sm font-medium text-foreground truncate">
                    {m.name}
                  </div>
                  <div className="text-xs text-foreground/55 shrink-0">
                    {formatDateTime(m.createdAt)}
                  </div>
                </div>
                <p className="text-sm text-foreground/70 line-clamp-2">
                  {m.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <div className="text-center py-8 text-foreground/55">
      <Icon className="h-8 w-8 mx-auto mb-2 text-cherry-bloom/60" />
      <p className="text-sm">{text}</p>
    </div>
  );
}
