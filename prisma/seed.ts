import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { addDays, setHours, setMinutes, setSeconds, setMilliseconds, startOfDay } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@indescent-nails.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const adminName = process.env.ADMIN_NAME ?? "Indescent Nails";

  console.log(`→ Seed admin (${adminEmail})…`);
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: adminName, role: "ADMIN" },
    create: { email: adminEmail, passwordHash, name: adminName, role: "ADMIN" },
  });

  console.log("→ Seed prestations…");
  const services = [
    // Prestations
    { category: "PRESTATION", name: "Pose en gel — naturel", priceCents: 4500, durationMinutes: 120, sortOrder: 10, description: "Pose complète en gel, finition naturelle." },
    { category: "PRESTATION", name: "Pose en gel — couleur", priceCents: 5000, durationMinutes: 135, sortOrder: 20, description: "Pose en gel teintée, finition brillante." },
    { category: "PRESTATION", name: "Rééquilibrage gel", priceCents: 4000, durationMinutes: 105, sortOrder: 30, description: "Remplissage et entretien d'une pose existante." },
    { category: "PRESTATION", name: "Manucure russe", priceCents: 3500, durationMinutes: 75, sortOrder: 40, description: "Manucure complète sans pose." },
    { category: "PRESTATION", name: "Vernis semi-permanent", priceCents: 3000, durationMinutes: 60, sortOrder: 50 },
    // Nail Art
    { category: "NAIL_ART", name: "Dégradé / french", priceCents: 800, durationMinutes: 15, sortOrder: 10, description: "Effet ombré ou french moderne." },
    { category: "NAIL_ART", name: "Motif simple (par ongle)", priceCents: 300, durationMinutes: 8, sortOrder: 20 },
    { category: "NAIL_ART", name: "Motif complexe (par ongle)", priceCents: 500, durationMinutes: 15, sortOrder: 30 },
    { category: "NAIL_ART", name: "Paillettes / glitter", priceCents: 500, durationMinutes: 10, sortOrder: 40 },
    { category: "NAIL_ART", name: "Effet chrome / miroir", priceCents: 1000, durationMinutes: 20, sortOrder: 50 },
    // Déposes
    { category: "DEPOSE", name: "Dépose gel", priceCents: 1500, durationMinutes: 30, sortOrder: 10 },
    { category: "DEPOSE", name: "Dépose résine / acrygel", priceCents: 2000, durationMinutes: 45, sortOrder: 20 },
    { category: "DEPOSE", name: "Dépose vernis semi-permanent", priceCents: 1000, durationMinutes: 20, sortOrder: 30 },
    // Suppléments
    { category: "SUPPLEMENT", name: "Allongement (par ongle)", priceCents: 200, durationMinutes: 5, sortOrder: 10 },
    { category: "SUPPLEMENT", name: "Réparation d'ongle cassé", priceCents: 500, durationMinutes: 10, sortOrder: 20 },
    { category: "SUPPLEMENT", name: "Top coat brillance prolongée", priceCents: 500, durationMinutes: 5, sortOrder: 30 },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { id: `seed-${s.category}-${s.name}`.replace(/\s+/g, "-").toLowerCase() },
      update: { ...s },
      create: { id: `seed-${s.category}-${s.name}`.replace(/\s+/g, "-").toLowerCase(), ...s },
    });
  }

  console.log("→ Seed créneaux disponibles (4 prochaines semaines)…");
  // Crée des créneaux mardi/mercredi/jeudi/samedi à 10h, 13h, 16h pendant 4 semaines.
  const now = startOfDay(new Date());
  const targetWeekdays = [2, 3, 4, 6]; // mardi, mercredi, jeudi, samedi
  const hours = [10, 13, 16];
  const slotDurationMinutes = 120;

  // Nettoie les créneaux à venir issus d'un seed précédent (idempotent)
  await prisma.slot.deleteMany({
    where: {
      startAt: { gte: now },
      booking: null,
      recurrenceGroupId: { startsWith: "seed-" },
    },
  });

  const recurrenceGroupId = `seed-${now.toISOString().slice(0, 10)}`;
  let slotCount = 0;
  for (let dayOffset = 1; dayOffset <= 28; dayOffset++) {
    const day = addDays(now, dayOffset);
    if (!targetWeekdays.includes(day.getDay())) continue;
    for (const h of hours) {
      const startAt = setMilliseconds(setSeconds(setMinutes(setHours(day, h), 0), 0), 0);
      const endAt = new Date(startAt.getTime() + slotDurationMinutes * 60 * 1000);
      await prisma.slot.create({
        data: { startAt, endAt, status: "AVAILABLE", recurrenceGroupId },
      });
      slotCount++;
    }
  }
  console.log(`  ${slotCount} créneaux créés.`);

  console.log("✓ Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
