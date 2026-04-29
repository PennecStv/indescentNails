import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  fullBookingSchema,
  ALLOWED_PHOTO_MIME,
  MAX_PHOTO_BYTES,
} from "@/lib/validation";
import { savePhoto, UploadError } from "@/lib/upload";
import { emailService } from "@/lib/email";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = rateLimit(`bookings:${ip}`, { windowMs: 10 * 60 * 1000, max: 5 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Trop de requêtes, patientez quelques minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
  }

  const rawData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    serviceId: formData.get("serviceId"),
    needsRemoval: formData.get("needsRemoval") === "true",
    slotId: formData.get("slotId"),
    conditionsAccepted: formData.get("conditionsAccepted") === "true",
  };

  const parsed = fullBookingSchema.safeParse(rawData);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const inspirationFile = formData.get("photoInspiration");
  const currentFile = formData.get("photoCurrent");

  if (
    !(inspirationFile instanceof File) ||
    !(currentFile instanceof File) ||
    inspirationFile.size === 0 ||
    currentFile.size === 0
  ) {
    return NextResponse.json(
      {
        error:
          "Les deux photos sont requises (modèle souhaité + ongles actuels).",
      },
      { status: 400 }
    );
  }

  for (const f of [inspirationFile, currentFile]) {
    if (f.size > MAX_PHOTO_BYTES) {
      return NextResponse.json(
        { error: "Une des photos dépasse 5 Mo." },
        { status: 400 }
      );
    }
    if (!ALLOWED_PHOTO_MIME.includes(f.type as (typeof ALLOWED_PHOTO_MIME)[number])) {
      return NextResponse.json(
        { error: "Format photo non supporté (JPEG, PNG, WebP)." },
        { status: 400 }
      );
    }
  }

  // Vérification + verrouillage du slot dans une transaction.
  let bookingId: string;
  try {
    const photoIns = await savePhoto(inspirationFile);
    const photoCur = await savePhoto(currentFile);

    const result = await prisma.$transaction(async (tx) => {
      const slot = await tx.slot.findUnique({
        where: { id: parsed.data.slotId },
        include: { booking: true },
      });
      if (!slot || slot.status !== "AVAILABLE" || slot.booking) {
        throw new Error("SLOT_UNAVAILABLE");
      }
      if (slot.startAt.getTime() < Date.now() + 48 * 60 * 60 * 1000) {
        throw new Error("SLOT_TOO_SOON");
      }

      const service = await tx.service.findUnique({
        where: { id: parsed.data.serviceId },
      });
      if (!service || !service.active) {
        throw new Error("SERVICE_INVALID");
      }

      const booking = await tx.booking.create({
        data: {
          slotId: slot.id,
          serviceId: service.id,
          customerLastName: parsed.data.lastName,
          customerFirstName: parsed.data.firstName,
          customerPhone: parsed.data.phone,
          customerEmail: parsed.data.email,
          needsRemoval: parsed.data.needsRemoval,
          conditionsAcceptedAt: new Date(),
          status: "PENDING",
          photos: {
            create: [
              { type: "INSPIRATION", ...photoIns },
              { type: "CURRENT", ...photoCur },
            ],
          },
        },
        include: { service: true, slot: true },
      });

      await tx.slot.update({
        where: { id: slot.id },
        data: { status: "BOOKED" },
      });

      return booking;
    });

    bookingId = result.id;

    const customerName = `${parsed.data.firstName} ${parsed.data.lastName}`;
    const ctx = {
      bookingId: result.id,
      customerName,
      customerEmail: parsed.data.email,
      serviceName: result.service.name,
      servicePrice: result.service.priceCents,
      serviceDuration: result.service.durationMinutes,
      slotStartAt: result.slot.startAt,
      slotEndAt: result.slot.endAt,
    };
    await emailService.sendBookingReceived(parsed.data.email, ctx);
    const adminTo = process.env.EMAIL_ADMIN_TO ?? "contact@indescent-nails.local";
    await emailService.sendAdminNewRequest(adminTo, ctx);
  } catch (e) {
    if (e instanceof UploadError) {
      return NextResponse.json({ error: e.message }, { status: e.statusCode });
    }
    if (e instanceof Error && e.message === "SLOT_UNAVAILABLE") {
      return NextResponse.json(
        { error: "Ce créneau n'est plus disponible." },
        { status: 409 }
      );
    }
    if (e instanceof Error && e.message === "SLOT_TOO_SOON") {
      return NextResponse.json(
        { error: "Le créneau est trop proche (48h minimum)." },
        { status: 400 }
      );
    }
    if (e instanceof Error && e.message === "SERVICE_INVALID") {
      return NextResponse.json({ error: "Prestation invalide." }, { status: 400 });
    }
    console.error("Booking creation failed", e);
    return NextResponse.json(
      { error: "Erreur serveur, réessayez plus tard." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, id: bookingId }, { status: 201 });
}
