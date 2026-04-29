import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export const runtime = "nodejs";

const patchSchema = z.object({
  read: z.boolean(),
});

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

  const exists = await prisma.contactMessage.findUnique({ where: { id } });
  if (!exists) {
    return NextResponse.json({ error: "Message introuvable" }, { status: 404 });
  }

  const updated = await prisma.contactMessage.update({
    where: { id },
    data: { readAt: parsed.data.read ? new Date() : null },
  });

  return NextResponse.json({ message: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const exists = await prisma.contactMessage.findUnique({ where: { id } });
  if (!exists) {
    return NextResponse.json({ error: "Message introuvable" }, { status: 404 });
  }

  await prisma.contactMessage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
