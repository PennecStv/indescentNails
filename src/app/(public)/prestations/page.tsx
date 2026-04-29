import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { formatPrice, formatDuration } from "@/lib/utils";
import {
  SERVICE_CATEGORY_LABELS,
  SERVICE_CATEGORY_ORDER,
  type ServiceCategory,
} from "@/lib/enums";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export const metadata = {
  title: "Prestations & tarifs",
  description:
    "Découvrez l'ensemble des prestations Indescent Nails — pose, nail art, déposes et suppléments — avec leurs tarifs et durées.",
};

const CATEGORY_DESCRIPTIONS: Record<ServiceCategory, string> = {
  PRESTATION:
    "Le cœur du métier : pose en gel, rééquilibrage, manucure et vernis semi-permanent.",
  NAIL_ART:
    "Pour personnaliser votre pose : french, dégradés, motifs, paillettes, chrome.",
  DEPOSE:
    "Pour libérer l'ongle d'une ancienne pose, en douceur. À ajouter si nécessaire à votre RDV.",
  SUPPLEMENT:
    "Petits ajustements et finitions pour adapter la prestation à vos besoins.",
};

export default async function PrestationsPage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  const grouped = SERVICE_CATEGORY_ORDER.map((category) => ({
    category,
    items: services.filter((s) => s.category === category),
  }));

  return (
    <>
      <section className="container-narrow py-16 text-center">
        <div className="section-subtitle">Prestations & tarifs</div>
        <h1 className="font-serif text-4xl md:text-5xl text-cherry-leaf mb-4">
          Une carte pensée pour vos envies
        </h1>
        <p className="text-foreground/70 max-w-2xl mx-auto">
          Tous les tarifs sont indicatifs. La durée approximative vous aide à
          choisir le bon créneau lors de votre réservation.
        </p>
      </section>

      <section className="container-narrow pb-20 space-y-12">
        {grouped.map(({ category, items }) => (
          <Card key={category} className="bg-white">
            <CardHeader>
              <div className="section-subtitle mb-1">
                {SERVICE_CATEGORY_LABELS[category]}
              </div>
              <CardTitle className="text-3xl">
                {SERVICE_CATEGORY_LABELS[category]}
              </CardTitle>
              <p className="text-sm text-foreground/65 mt-1">
                {CATEGORY_DESCRIPTIONS[category]}
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              {items.length === 0 ? (
                <div className="text-sm text-foreground/50 italic">
                  Aucune prestation pour le moment.
                </div>
              ) : (
                <ul className="divide-y divide-border/50">
                  {items.map((s) => (
                    <li
                      key={s.id}
                      className="py-4 flex items-start justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <div className="font-medium text-foreground">
                          {s.name}
                        </div>
                        {s.description && (
                          <div className="text-sm text-foreground/60 mt-0.5">
                            {s.description}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-foreground/55 mt-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDuration(s.durationMinutes)}
                        </div>
                      </div>
                      <div className="text-cherry-bloom font-serif text-xl whitespace-nowrap">
                        {formatPrice(s.priceCents)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        ))}

        <div className="text-center pt-6">
          <Link href="/reservation" className="btn-primary-cta">
            Prendre rendez-vous
          </Link>
        </div>
      </section>
    </>
  );
}
