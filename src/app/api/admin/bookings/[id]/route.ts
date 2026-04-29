import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { bookingActionSchema } from "@/lib/validation";
import { emailService, type EmailContext } from "@/lib/email";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      slot: true,
      service: true,
      photos: true,
    },
  });
  if (!booking) {
    return NextResponse.json(
      { error: "Réservation introuvable" },
      { status: 404 }
    );
  }

  return NextResponse.json({ booking });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
  }

  const parsed = bookingActionSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Action invalide", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { slot: true, service: true },
  });
  if (!booking) {
    return NextResponse.json(
      { error: "Réservation introuvable" },
      { status: 404 }
    );
  }

  const baseCtx: EmailContext = {
    bookingId: booking.id,
    customerName: `${booking.customerFirstName} ${booking.customerLastName}`,
    customerEmail: booking.customerEmail,
    serviceName: booking.service.name,
    servicePrice: booking.service.priceCents,
    serviceDuration: booking.service.durationMinutes,
    slotStartAt: booking.slot.startAt,
    slotEndAt: booking.slot.endAt,
  };

  const action = parsed.data.action;

  if (action === "confirm") {
    if (booking.status === "CONFIRMED") {
      return NextResponse.json({
        booking,
        message: "Déjà confirmée.",
      });
    }
    const updated = await prisma.booking.update({
      where: { id },
      data: { status: "CONFIRMED", processedAt: new Date() },
      include: { slot: true, service: true },
    });
    await emailService.sendBookingConfirmed(booking.customerEmail, baseCtx);
    return NextResponse.json({ booking: updated });
  }

  if (action === "reject") {
    const message = parsed.data.message?.trim();
    const updated = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id },
        data: {
          status: "REJECTED",
          processedAt: new Date(),
          adminMessage: message ?? null,
        },
      });
      await tx.slot.update({
        where: { id: booking.slotId },
        data: { status: "AVAILABLE" },
      });
      return b;
    });
    await emailService.sendBookingRejected(booking.customerEmail, {
      ...baseCtx,
      adminMessage: message,
    });
    return NextResponse.json({ booking: updated });
  }

  if (action === "reschedule") {
    const newSlotId = parsed.data.newSlotId;
    if (newSlotId === booking.slotId) {
      return NextResponse.json(
        { error: "Le nouveau créneau est identique à l'actuel." },
        { status: 400 }
      );
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        const newSlot = await tx.slot.findUnique({
          where: { id: newSlotId },
          include: { booking: true },
        });
        if (!newSlot) throw new Error("NEW_SLOT_NOT_FOUND");
        if (newSlot.status !== "AVAILABLE" || newSlot.booking) {
          throw new Error("NEW_SLOT_UNAVAILABLE");
        }

        await tx.slot.update({
          where: { id: booking.slotId },
          data: { status: "AVAILABLE" },
        });
        await tx.slot.update({
          where: { id: newSlotId },
          data: { status: "BOOKED" },
        });
        const b = await tx.booking.update({
          where: { id },
          data: {
            slotId: newSlotId,
            status: "CONFIRMED",
            processedAt: new Date(),
          },
          include: { slot: true, service: true },
        });
        return b;
      });

      await emailService.sendSlotChanged(booking.customerEmail, {
        ...baseCtx,
        slotStartAt: result.slot.startAt,
        slotEndAt: result.slot.endAt,
      });
      return NextResponse.json({ booking: result });
    } catch (e) {
      if (e instanceof Error) {
        if (e.message === "NEW_SLOT_NOT_FOUND") {
          return NextResponse.json(
            { error: "Nouveau créneau introuvable." },
            { status: 404 }
          );
        }
        if (e.message === "NEW_SLOT_UNAVAILABLE") {
          return NextResponse.json(
            { error: "Le créneau choisi n'est plus disponible." },
            { status: 409 }
          );
        }
      }
      console.error("Reschedule failed", e);
      return NextResponse.json(
        { error: "Erreur serveur." },
        { status: 500 }
      );
    }
  }

  if (action === "delete") {
    await prisma.$transaction(async (tx) => {
      await tx.booking.delete({ where: { id } });
      // Si le slot existe encore (cascade ne le supprime pas), on le libère.
      await tx.slot
        .update({
          where: { id: booking.slotId },
          data: { status: "AVAILABLE" },
        })
        .catch(() => undefined);
    });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
}
