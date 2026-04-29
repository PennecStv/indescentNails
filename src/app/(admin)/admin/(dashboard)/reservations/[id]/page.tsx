import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatDateTime, formatTime } from "@/lib/dates";
import { formatDuration, formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { BookingActions } from "@/components/admin/booking-actions";
import { BookingPhoto } from "@/components/admin/booking-photo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    select: { customerFirstName: true, customerLastName: true },
  });
  if (!booking) return { title: "Réservation" };
  return {
    title: `${booking.customerFirstName} ${booking.customerLastName}`,
  };
}

const STATUS_BADGES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-cherry-leaf/15 text-cherry-leaf",
  REJECTED: "bg-foreground/10 text-foreground/65",
  CANCELLED: "bg-foreground/10 text-foreground/65",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  REJECTED: "Refusée",
  CANCELLED: "Annulée",
};

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      slot: true,
      service: true,
      photos: true,
    },
  });
  if (!booking) notFound();

  // Slots libres pour reschedule (≥ 48h, AVAILABLE, non lié à une réservation)
  const minStart = new Date(Date.now() + 48 * 60 * 60 * 1000);
  const availableSlots = await prisma.slot.findMany({
    where: {
      status: "AVAILABLE",
      startAt: { gte: minStart },
      id: { not: booking.slotId },
    },
    orderBy: { startAt: "asc" },
    take: 60,
    select: { id: true, startAt: true, endAt: true },
  });

  const inspirationPhoto = booking.photos.find((p) => p.type === "INSPIRATION");
  const currentPhoto = booking.photos.find((p) => p.type === "CURRENT");

  return (
    <div className="space-y-8">
      <Link
        href="/admin/reservations"
        className="inline-flex items-center gap-1.5 text-sm text-foreground/65 hover:text-cherry-leaf transition"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Retour aux réservations
      </Link>

      <header className="space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-serif text-3xl text-cherry-leaf">
            {booking.customerFirstName} {booking.customerLastName}
          </h1>
          <span
            className={cn(
              "text-xs uppercase tracking-wider px-2.5 py-1 rounded-full",
              STATUS_BADGES[booking.status] ?? "bg-foreground/10"
            )}
          >
            {STATUS_LABELS[booking.status] ?? booking.status}
          </span>
        </div>
        <p className="text-sm text-foreground/55">
          Demande reçue le {formatDateTime(booking.createdAt)}
        </p>
      </header>

      <BookingActions
        bookingId={booking.id}
        currentStatus={booking.status}
        currentSlotId={booking.slotId}
        availableSlots={availableSlots.map((s) => ({
          id: s.id,
          startAt: s.startAt.toISOString(),
          endAt: s.endAt.toISOString(),
        }))}
      />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Coordonnées */}
        <section className="rounded-2xl border border-border/60 bg-white p-6 space-y-4">
          <h2 className="font-serif text-xl text-cherry-leaf">Coordonnées</h2>
          <dl className="space-y-2 text-sm">
            <Field label="E-mail">
              <a
                href={`mailto:${booking.customerEmail}`}
                className="text-cherry-leaf hover:underline"
              >
                {booking.customerEmail}
              </a>
            </Field>
            <Field label="Téléphone">
              <a
                href={`tel:${booking.customerPhone.replace(/\s+/g, "")}`}
                className="text-cherry-leaf hover:underline"
              >
                {booking.customerPhone}
              </a>
            </Field>
          </dl>
        </section>

        {/* Prestation + créneau */}
        <section className="rounded-2xl border border-border/60 bg-white p-6 space-y-4">
          <h2 className="font-serif text-xl text-cherry-leaf">
            Prestation & créneau
          </h2>
          <dl className="space-y-2 text-sm">
            <Field label="Prestation">{booking.service.name}</Field>
            <Field label="Tarif">{formatPrice(booking.service.priceCents)}</Field>
            <Field label="Durée">
              {formatDuration(booking.service.durationMinutes)}
            </Field>
            <Field label="Dépose nécessaire">
              {booking.needsRemoval ? "Oui" : "Non"}
            </Field>
            <Field label="Créneau">
              {formatDateTime(booking.slot.startAt)} — {formatTime(booking.slot.endAt)}
            </Field>
          </dl>
        </section>
      </div>

      {/* Photos */}
      <section className="rounded-2xl border border-border/60 bg-white p-6 space-y-4">
        <h2 className="font-serif text-xl text-cherry-leaf">Photos envoyées</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {inspirationPhoto && (
            <BookingPhoto
              filename={inspirationPhoto.filename}
              label="Modèle souhaité"
            />
          )}
          {currentPhoto && (
            <BookingPhoto
              filename={currentPhoto.filename}
              label="Ongles actuels"
            />
          )}
        </div>
      </section>

      {booking.adminMessage && (
        <section className="rounded-2xl border border-border/60 bg-cream/60 p-6 space-y-2">
          <h2 className="font-serif text-lg text-cherry-leaf">
            Message envoyé au client
          </h2>
          <p className="text-sm text-foreground/75 whitespace-pre-wrap">
            {booking.adminMessage}
          </p>
        </section>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3">
      <dt className="text-foreground/55 uppercase text-[11px] tracking-wider pt-0.5">
        {label}
      </dt>
      <dd className="text-foreground">{children}</dd>
    </div>
  );
}
