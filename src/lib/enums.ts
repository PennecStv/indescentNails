// Constantes typées correspondant aux énumérations Prisma.
// Comme SQLite ne supporte pas les enums Prisma, on les modélise ici en TypeScript pour conserver le typage strict.

export const ServiceCategory = {
  PRESTATION: "PRESTATION",
  NAIL_ART: "NAIL_ART",
  DEPOSE: "DEPOSE",
  SUPPLEMENT: "SUPPLEMENT",
} as const;
export type ServiceCategory =
  (typeof ServiceCategory)[keyof typeof ServiceCategory];

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  PRESTATION: "Prestations",
  NAIL_ART: "Nail Art",
  DEPOSE: "Déposes",
  SUPPLEMENT: "Suppléments",
};

export const SERVICE_CATEGORY_ORDER: ServiceCategory[] = [
  "PRESTATION",
  "NAIL_ART",
  "DEPOSE",
  "SUPPLEMENT",
];

export const SlotStatus = {
  AVAILABLE: "AVAILABLE",
  BOOKED: "BOOKED",
  BLOCKED: "BLOCKED",
} as const;
export type SlotStatus = (typeof SlotStatus)[keyof typeof SlotStatus];

export const BookingStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
} as const;
export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export const PhotoType = {
  INSPIRATION: "INSPIRATION",
  CURRENT: "CURRENT",
} as const;
export type PhotoType = (typeof PhotoType)[keyof typeof PhotoType];

export const Role = {
  ADMIN: "ADMIN",
} as const;
export type Role = (typeof Role)[keyof typeof Role];
