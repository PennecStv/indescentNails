// Stub EmailService pour le MVP : log structuré + persistance fichier dans ./tmp/emails.
// Phase 4 : remplacer par une implémentation Resend / Nodemailer en gardant la même interface.

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

import { formatDateTime } from "./dates";
import { formatPrice, formatDuration } from "./utils";

const TMP_EMAILS_DIR = join(process.cwd(), "tmp", "emails");

export type EmailContext = {
  bookingId?: string;
  customerName?: string;
  customerEmail?: string;
  serviceName?: string;
  servicePrice?: number;
  serviceDuration?: number;
  slotStartAt?: Date | string;
  slotEndAt?: Date | string;
  adminMessage?: string;
};

type SendResult = { id: string; ok: true };

async function persistEmail(payload: object, slug: string): Promise<string> {
  if (!existsSync(TMP_EMAILS_DIR)) {
    await mkdir(TMP_EMAILS_DIR, { recursive: true });
  }
  const id = `${Date.now()}-${slug}-${randomUUID().slice(0, 6)}`;
  const filepath = join(TMP_EMAILS_DIR, `${id}.json`);
  await writeFile(filepath, JSON.stringify(payload, null, 2), "utf8");
  return id;
}

function logEmail(label: string, to: string, subject: string, body: string) {
  console.log(
    `\n📧 [${label}] → ${to}\n   Sujet : ${subject}\n   ${body
      .split("\n")
      .map((l) => `   ${l}`)
      .join("\n")}\n`
  );
}

function bookingSummaryLines(ctx: EmailContext): string[] {
  const lines: string[] = [];
  if (ctx.serviceName) lines.push(`• Prestation : ${ctx.serviceName}`);
  if (typeof ctx.servicePrice === "number")
    lines.push(`• Tarif : ${formatPrice(ctx.servicePrice)}`);
  if (typeof ctx.serviceDuration === "number")
    lines.push(`• Durée : ${formatDuration(ctx.serviceDuration)}`);
  if (ctx.slotStartAt)
    lines.push(`• Créneau : ${formatDateTime(ctx.slotStartAt)}`);
  return lines;
}

export const emailService = {
  async sendBookingReceived(
    to: string,
    ctx: EmailContext
  ): Promise<SendResult> {
    const subject = "Nous avons bien reçu votre demande de rendez-vous";
    const body = `Bonjour ${ctx.customerName ?? ""},

Merci pour votre demande de rendez-vous chez Indescent Nails.

${bookingSummaryLines(ctx).join("\n")}

Votre demande est en cours de validation. Vous recevrez un nouvel e-mail dès qu'elle sera confirmée par notre équipe.

À très vite,
Indescent Nails 🌸`;
    logEmail("BOOKING_RECEIVED", to, subject, body);
    const id = await persistEmail(
      { type: "BOOKING_RECEIVED", to, subject, body, ctx },
      "booking-received"
    );
    return { id, ok: true };
  },

  async sendAdminNewRequest(
    to: string,
    ctx: EmailContext
  ): Promise<SendResult> {
    const subject = "🌸 Nouvelle demande de rendez-vous";
    const body = `Une nouvelle demande vient d'être déposée par ${ctx.customerName ?? "un client"}.

${bookingSummaryLines(ctx).join("\n")}

Connectez-vous au tableau de bord pour la traiter :
http://localhost:3000/admin/reservations${ctx.bookingId ? `/${ctx.bookingId}` : ""}`;
    logEmail("ADMIN_NEW_REQUEST", to, subject, body);
    const id = await persistEmail(
      { type: "ADMIN_NEW_REQUEST", to, subject, body, ctx },
      "admin-new"
    );
    return { id, ok: true };
  },

  async sendBookingConfirmed(
    to: string,
    ctx: EmailContext
  ): Promise<SendResult> {
    const subject = "✓ Votre rendez-vous est confirmé";
    const body = `Bonjour ${ctx.customerName ?? ""},

Bonne nouvelle, votre rendez-vous est confirmé !

${bookingSummaryLines(ctx).join("\n")}

Pensez à venir avec les ongles propres et à respecter l'horaire convenu.

À très vite,
Indescent Nails 🌸`;
    logEmail("BOOKING_CONFIRMED", to, subject, body);
    const id = await persistEmail(
      { type: "BOOKING_CONFIRMED", to, subject, body, ctx },
      "booking-confirmed"
    );
    return { id, ok: true };
  },

  async sendBookingRejected(
    to: string,
    ctx: EmailContext
  ): Promise<SendResult> {
    const subject = "Votre demande de rendez-vous";
    const body = `Bonjour ${ctx.customerName ?? ""},

Nous sommes désolés, votre demande de rendez-vous ne peut pas être confirmée.

${ctx.adminMessage ? `Note : ${ctx.adminMessage}\n\n` : ""}N'hésitez pas à nous recontacter via Instagram pour trouver un autre créneau.

Indescent Nails`;
    logEmail("BOOKING_REJECTED", to, subject, body);
    const id = await persistEmail(
      { type: "BOOKING_REJECTED", to, subject, body, ctx },
      "booking-rejected"
    );
    return { id, ok: true };
  },

  async sendSlotChanged(to: string, ctx: EmailContext): Promise<SendResult> {
    const subject = "Modification de votre rendez-vous";
    const body = `Bonjour ${ctx.customerName ?? ""},

Votre rendez-vous a été modifié.

Nouveau créneau :
${bookingSummaryLines(ctx).join("\n")}

Merci de nous confirmer la nouvelle date par retour d'e-mail ou via Instagram.

Indescent Nails`;
    logEmail("SLOT_CHANGED", to, subject, body);
    const id = await persistEmail(
      { type: "SLOT_CHANGED", to, subject, body, ctx },
      "slot-changed"
    );
    return { id, ok: true };
  },

  async sendContactMessage(
    to: string,
    payload: { name: string; email: string; message: string }
  ): Promise<SendResult> {
    const subject = `📬 Message de ${payload.name}`;
    const body = `De : ${payload.name} <${payload.email}>

${payload.message}`;
    logEmail("CONTACT_MESSAGE", to, subject, body);
    const id = await persistEmail(
      { type: "CONTACT_MESSAGE", to, subject, body, payload },
      "contact"
    );
    return { id, ok: true };
  },

  async sendPasswordReset(to: string, resetUrl: string): Promise<SendResult> {
    const subject = "Réinitialisation de votre mot de passe";
    const body = `Pour réinitialiser votre mot de passe, cliquez ici :\n${resetUrl}`;
    logEmail("PASSWORD_RESET", to, subject, body);
    const id = await persistEmail(
      { type: "PASSWORD_RESET", to, subject, body },
      "password-reset"
    );
    return { id, ok: true };
  },
};

export type EmailService = typeof emailService;
