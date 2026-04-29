import { z } from "zod";
import { ServiceCategory } from "./enums";

// Téléphone FR souple : accepte 06 12 34 56 78, +33 6 12 34 56 78, 0612345678, etc.
export const phoneFrRegex = /^(?:(?:\+|00)33[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}$/;

export const personalInfoSchema = z.object({
  firstName: z.string().trim().min(1, "Prénom requis").max(60),
  lastName: z.string().trim().min(1, "Nom requis").max(60),
  phone: z
    .string()
    .trim()
    .regex(phoneFrRegex, "Numéro français invalide (ex. 06 12 34 56 78)"),
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide"),
});

export const serviceChoiceSchema = z.object({
  serviceId: z.string().min(1, "Choisissez une prestation"),
  needsRemoval: z.boolean(),
});

export const slotChoiceSchema = z.object({
  slotId: z.string().min(1, "Sélectionnez un créneau"),
});

export const conditionsSchema = z.object({
  conditionsAccepted: z
    .boolean()
    .refine((v) => v === true, "Vous devez accepter les conditions"),
});

export const fullBookingSchema = personalInfoSchema
  .merge(serviceChoiceSchema)
  .merge(slotChoiceSchema)
  .merge(conditionsSchema);

export type FullBookingInput = z.infer<typeof fullBookingSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Nom requis").max(80),
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide"),
  message: z.string().trim().min(10, "Message trop court").max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

// Admin : création de service
export const serviceInputSchema = z.object({
  category: z.enum([
    ServiceCategory.PRESTATION,
    ServiceCategory.NAIL_ART,
    ServiceCategory.DEPOSE,
    ServiceCategory.SUPPLEMENT,
  ]),
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional().nullable(),
  priceCents: z.coerce.number().int().min(0),
  durationMinutes: z.coerce.number().int().min(1).max(600),
  active: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

// Admin : création de créneau (avec récurrence optionnelle)
export const slotInputSchema = z.object({
  date: z.string(), // YYYY-MM-DD
  startTime: z.string().regex(/^\d{2}:\d{2}$/), // HH:MM
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  recurrenceFrequency: z.enum(["NONE", "WEEKLY", "MONTHLY"]).default("NONE"),
  occurrences: z.coerce.number().int().min(1).max(52).default(1),
  note: z.string().trim().max(200).optional().nullable(),
});

export const slotPatchSchema = z.object({
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
  status: z.enum(["AVAILABLE", "BLOCKED"]).optional(),
  note: z.string().trim().max(200).optional().nullable(),
});

// Admin : actions sur une demande
export const bookingActionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("confirm") }),
  z.object({
    action: z.literal("reject"),
    message: z.string().trim().max(1000).optional(),
  }),
  z.object({ action: z.literal("reschedule"), newSlotId: z.string().min(1) }),
  z.object({ action: z.literal("delete") }),
]);

// Validation upload photo
export const ALLOWED_PHOTO_MIME = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 Mo
