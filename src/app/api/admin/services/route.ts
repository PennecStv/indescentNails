import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { serviceInputSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const services = await prisma.service.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });

  return NextResponse.json({ services });
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

  const parsed = serviceInputSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const created = await prisma.service.create({
    data: {
      category: parsed.data.category,
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      priceCents: parsed.data.priceCents,
      durationMinutes: parsed.data.durationMinutes,
      active: parsed.data.active,
      sortOrder: parsed.data.sortOrder,
    },
  });

  return NextResponse.json({ service: created }, { status: 201 });
}
