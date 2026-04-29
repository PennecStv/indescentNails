import { addDays, parseISO, startOfWeek } from "date-fns";

import { prisma } from "@/lib/prisma";
import { CalendarWeek } from "@/components/admin/calendar-week";

export const dynamic = "force-dynamic";
export const metadata = { title: "Calendrier" };

export default async function AdminCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const { week } = await searchParams;
  const referenceDate = week
    ? safeParseISO(week) ?? new Date()
    : new Date();
  const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 7);

  const slots = await prisma.slot.findMany({
    where: { startAt: { gte: weekStart, lt: weekEnd } },
    orderBy: { startAt: "asc" },
    include: {
      booking: {
        select: {
          id: true,
          status: true,
          customerFirstName: true,
          customerLastName: true,
          service: { select: { name: true } },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-cherry-bloom">
          Planning
        </p>
        <h1 className="font-serif text-3xl text-cherry-leaf">Calendrier</h1>
        <p className="text-sm text-foreground/65 mt-1">
          Cliquez sur une plage vide pour créer un créneau, ou sur un créneau
          existant pour le gérer.
        </p>
      </header>

      <CalendarWeek
        weekStartIso={weekStart.toISOString()}
        initialSlots={slots.map((s) => ({
          id: s.id,
          startAt: s.startAt.toISOString(),
          endAt: s.endAt.toISOString(),
          status: s.status,
          note: s.note,
          booking: s.booking
            ? {
                id: s.booking.id,
                status: s.booking.status,
                customerName: `${s.booking.customerFirstName} ${s.booking.customerLastName}`,
                serviceName: s.booking.service.name,
              }
            : null,
        }))}
      />
    </div>
  );
}

function safeParseISO(s: string): Date | null {
  try {
    const d = parseISO(s);
    return Number.isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}
