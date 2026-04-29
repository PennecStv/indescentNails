import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { BookingStatus } from "@/lib/enums";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = new Set(Object.values(BookingStatus));

export async function GET(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.trim().toLowerCase();

  const where: {
    status?: string;
    OR?: Array<Record<string, unknown>>;
  } = {};
  if (status && ALLOWED_STATUSES.has(status as BookingStatus)) {
    where.status = status;
  }
  if (q) {
    where.OR = [
      { customerFirstName: { contains: q } },
      { customerLastName: { contains: q } },
      { customerEmail: { contains: q } },
    ];
  }

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
    take: 200,
    include: {
      slot: { select: { startAt: true, endAt: true } },
      service: { select: { name: true, priceCents: true } },
    },
  });

  return NextResponse.json({ bookings });
}
