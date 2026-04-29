import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { slotInputSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(request.url);
  const fromStr = searchParams.get("from");
  const toStr = searchParams.get("to");

  if (!fromStr || !toStr) {
    return NextResponse.json(
      { error: "Paramètres `from` et `to` requis (ISO date)." },
      { status: 400 }
    );
  }

  const from = new Date(fromStr);
  const to = new Date(toStr);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return NextResponse.json({ error: "Dates invalides." }, { status: 400 });
  }

  const slots = await prisma.slot.findMany({
    where: { startAt: { gte: from, lt: to } },
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

  return NextResponse.json({ slots });
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
  }

  const parsed = slotInputSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { date, startTime, endTime, note } = parsed.data;
  const startAt = new Date(`${date}T${startTime}:00`);
  const endAt = new Date(`${date}T${endTime}:00`);

  if (Number.isNaN(startAt.getTime()) || Number.isNaN(endAt.getTime())) {
    return NextResponse.json(
      { error: "Date ou heure invalide." },
      { status: 400 }
    );
  }
  if (endAt.getTime() <= startAt.getTime()) {
    return NextResponse.json(
      { error: "L'heure de fin doit être postérieure à l'heure de début." },
      { status: 400 }
    );
  }

  const overlap = await prisma.slot.findFirst({
    where: {
      startAt: { lt: endAt },
      endAt: { gt: startAt },
    },
    select: { id: true, startAt: true, endAt: true },
  });
  if (overlap) {
    return NextResponse.json(
      { error: "Un autre créneau chevauche cette plage horaire." },
      { status: 409 }
    );
  }

  const slot = await prisma.slot.create({
    data: {
      startAt,
      endAt,
      status: "AVAILABLE",
      note: note ?? null,
    },
  });

  return NextResponse.json({ slot }, { status: 201 });
}
