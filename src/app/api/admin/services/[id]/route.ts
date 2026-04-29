import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { serviceInputSchema } from "@/lib/validation";

export const runtime = "nodejs";

const patchSchema = serviceInputSchema.partial();

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

  const parsed = patchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const exists = await prisma.service.findUnique({ where: { id } });
  if (!exists) {
    return NextResponse.json(
      { error: "Prestation introuvable" },
      { status: 404 }
    );
  }

  const data = parsed.data;
  const updated = await prisma.service.update({
    where: { id },
    data: {
      ...(data.category !== undefined && { category: data.category }),
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && {
        description: data.description ?? null,
      }),
      ...(data.priceCents !== undefined && { priceCents: data.priceCents }),
      ...(data.durationMinutes !== undefined && {
        durationMinutes: data.durationMinutes,
      }),
      ...(data.active !== undefined && { active: data.active }),
      ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
    },
  });

  return NextResponse.json({ service: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const exists = await prisma.service.findUnique({
    where: { id },
    include: { _count: { select: { bookings: true } } },
  });
  if (!exists) {
    return NextResponse.json(
      { error: "Prestation introuvable" },
      { status: 404 }
    );
  }

  if (exists._count.bookings > 0) {
    const updated = await prisma.service.update({
      where: { id },
      data: { active: false },
    });
    return NextResponse.json({
      service: updated,
      softDeleted: true,
      message:
        "Prestation désactivée (des réservations y sont rattachées). Elle reste visible dans l'historique.",
    });
  }

  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
