import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get("unreadOnly") === "true";

  const messages = await prisma.contactMessage.findMany({
    where: unreadOnly ? { readAt: null } : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ messages });
}
