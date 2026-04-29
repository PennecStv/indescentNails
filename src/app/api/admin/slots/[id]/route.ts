import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { slotPatchSchema } from "@/lib/validation";

export const runtime = "nodejs";

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

  const parsed = slotPatchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const slot = await prisma.slot.findUnique({
    where: { id },
    include: { booking: true },
  });
  if (!slot) {
    return NextResponse.json({ error: "Créneau introuvable" }, { status: 404 });
  }
  if (slot.booking) {
    return NextResponse.json(
      {
        error:
          "Ce créneau est lié à une réservation, modifiez-la directement depuis la page Réservations.",
      },
      { status: 409 }
    );
  }

  const data = parsed.data;
  const newStartAt = data.startAt ? new Date(data.startAt) : slot.startAt;
  const newEndAt = data.endAt ? new Date(data.endAt) : slot.endAt;

  if (data.startAt || data.endAt) {
    if (newEndAt.getTime() <= newStartAt.getTime()) {
      return NextResponse.json(
        { error: "L'heure de fin doit être postérieure à l'heure de début." },
        { status: 400 }
      );
    }
    const overlap = await prisma.slot.findFirst({
      where: {
        id: { not: id },
        startAt: { lt: newEndAt },
        endAt: { gt: newStartAt },
      },
      select: { id: true },
    });
    if (overlap) {
      return NextResponse.json(
        { error: "Un autre créneau chevauche cette plage horaire." },
        { status: 409 }
      );
    }
  }

  const updated = await prisma.slot.update({
    where: { id },
    data: {
      ...(data.startAt && { startAt: newStartAt }),
      ...(data.endAt && { endAt: newEndAt }),
      ...(data.status && { status: data.status }),
      ...(data.note !== undefined && { note: data.note ?? null }),
    },
  });

  return NextResponse.json({ slot: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const slot = await prisma.slot.findUnique({
    where: { id },
    include: { booking: true },
  });
  if (!slot) {
    return NextResponse.json({ error: "Créneau introuvable" }, { status: 404 });
  }
  if (slot.status === "BOOKED" || slot.booking) {
    return NextResponse.json(
      {
        error:
          "Impossible de supprimer un créneau réservé. Annulez d'abord la réservation.",
      },
      { status: 409 }
    );
  }

  await prisma.slot.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
