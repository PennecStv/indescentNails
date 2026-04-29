import { prisma } from "@/lib/prisma";
import { BookingWizard } from "@/components/booking/booking-wizard";

export const metadata = {
  title: "Prendre rendez-vous",
  description: "Réservez votre prestation chez Indescent Nails en quelques clics.",
};

export const dynamic = "force-dynamic";

export default async function ReservationPage() {
  const minStartAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
  const [services, slots] = await Promise.all([
    prisma.service.findMany({
      where: { active: true },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
      select: {
        id: true,
        category: true,
        name: true,
        priceCents: true,
        durationMinutes: true,
      },
    }),
    prisma.slot.findMany({
      where: { status: "AVAILABLE", startAt: { gte: minStartAt } },
      orderBy: { startAt: "asc" },
      take: 200,
      select: { id: true, startAt: true, endAt: true },
    }),
  ]);

  const slotsSerialized = slots.map((s) => ({
    id: s.id,
    startAt: s.startAt.toISOString(),
    endAt: s.endAt.toISOString(),
  }));

  return (
    <section className="container-narrow py-12 max-w-3xl">
      <div className="text-center mb-8">
        <div className="section-subtitle">Réservation</div>
        <h1 className="font-serif text-4xl text-cherry-leaf mb-2">
          Prendre rendez-vous
        </h1>
        <p className="text-sm text-foreground/65">
          Cinq petites étapes, et votre demande est envoyée. Vous recevrez un
          e-mail de confirmation après validation.
        </p>
      </div>
      <BookingWizard initialServices={services} initialSlots={slotsSerialized} />
    </section>
  );
}
