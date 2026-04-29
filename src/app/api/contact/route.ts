import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";
import { emailService } from "@/lib/email";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = rateLimit(`contact:${ip}`, { windowMs: 10 * 60 * 1000, max: 5 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Trop de requêtes, réessayez plus tard." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const message = await prisma.contactMessage.create({
    data: parsed.data,
  });

  const adminTo = process.env.EMAIL_ADMIN_TO ?? "contact@indescent-nails.local";
  await emailService.sendContactMessage(adminTo, parsed.data);

  return NextResponse.json({ ok: true, id: message.id }, { status: 201 });
}
