import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const minStartAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h de délai mini
  const slots = await prisma.slot.findMany({
    where: {
      status: "AVAILABLE",
      startAt: { gte: minStartAt },
    },
    orderBy: { startAt: "asc" },
    select: { id: true, startAt: true, endAt: true },
    take: 200,
  });
  return NextResponse.json({ slots });
}
