import { Clock, ArrowRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { formatPrice, formatDuration } from "@/lib/utils";
import {
  SERVICE_CATEGORY_LABELS,
  SERVICE_CATEGORY_ORDER,
  type ServiceCategory,
} from "@/lib/enums";
import { CherryBranchDecoration } from "@/components/public/cherry-icons";
import {
  Reveal,
  Stagger,
  StaggerItem,
  WordsReveal,
} from "@/components/public/motion/reveal";
import { FillButton } from "@/components/public/motion/fill-button";
import { ParallaxBranch } from "@/components/public/motion/parallax-branch";
import { CherryBlossom } from "@/components/public/motion/cherry-blossom";
import { BloomReveal } from "@/components/public/motion/bloom-reveal";

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
      <section className="relative cherry-branch-bg overflow-hidden">
        <CherryBranchDecoration className="absolute -top-10 -right-10 w-[520px] opacity-50 pointer-events-none hidden md:block" />
        <div className="pointer-events-none absolute -top-10 right-20 hidden md:block opacity-90 animate-sway">
          <CherryBlossom size={200} delay={0.4} />
        </div>
        <div className="pointer-events-none absolute bottom-10 -left-12 hidden md:block opacity-50">
          <CherryBlossom size={140} delay={1.2} withStem={false} />
        </div>
        {/* Numéro section éditorial */}
        <div className="hidden lg:block absolute -left-4 bottom-12 text-[8rem] font-serif italic text-cherry-bloom/15 leading-none select-none pointer-events-none">
          nº02
        </div>

        <div className="container-narrow relative py-24 md:py-32 max-w-4xl">
          <Reveal>
            <div className="eyebrow-tag mb-8">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cherry-bloom" />
              La carte
            </div>
          </Reveal>
          <h1 className="text-display text-cherry-leaf mb-8">
            <WordsReveal text="Une carte pensée" staggerChildren={0.07} />
            <br />
            <span className="italic text-cherry-deep">
              <WordsReveal
                text="pour vos envies."
                delay={0.4}
                staggerChildren={0.07}
              />
            </span>
          </h1>
          <Reveal delay={0.9} y={20}>
            <p className="text-lg text-foreground/75 max-w-2xl leading-relaxed border-l-2 border-cherry-bloom/40 pl-5">
              Tous les tarifs sont indicatifs. La durée approximative vous aide
              à choisir le bon créneau lors de votre réservation.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Sommaire */}
      <section className="border-y border-border/40 bg-rose-gold/30 sticky top-14 z-30 backdrop-blur-md">
        <div className="container-narrow py-4 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          <span className="marker">Sommaire</span>
          {grouped.map(({ category }, i) => (
            <a
              key={category}
              href={`#cat-${category}`}
              className="link-editorial flex items-center gap-2 text-cherry-leaf font-medium"
            >
              <span className="font-serif italic text-cherry-bloom">
                0{i + 1}
              </span>
              {SERVICE_CATEGORY_LABELS[category]}
            </a>
          ))}
        </div>
      </section>

      <section className="relative container-narrow py-20 space-y-28 max-w-5xl">
        <ParallaxBranch
          className="-top-20 -left-20 w-[300px] hidden md:block opacity-30"
          intensity={120}
        />
        {grouped.map(({ category, items }, idx) => (
          <article
            key={category}
            id={`cat-${category}`}
            className="scroll-mt-32 grid md:grid-cols-12 gap-x-10 gap-y-8 relative"
          >
            <Reveal className="md:col-span-4 md:sticky md:top-32 md:self-start space-y-5">
              <div className="relative">
                {/* Petite fleur signature à côté du numéro */}
                <div className="absolute -top-6 -left-8 hidden md:block opacity-80 pointer-events-none">
                  <CherryBlossom
                    size={70}
                    trigger="inView"
                    withStem={false}
                  />
                </div>
                <div className="flex items-baseline gap-3 mb-4 relative">
                  <span className="section-numeral">0{idx + 1}</span>
                  <span className="marker">
                    {SERVICE_CATEGORY_LABELS[category]}
                  </span>
                </div>
              </div>
              <h2 className="text-display-sm !text-3xl md:!text-4xl text-cherry-leaf">
                {SERVICE_CATEGORY_LABELS[category]}
              </h2>
              <p className="text-sm text-foreground/65 leading-relaxed">
                {CATEGORY_DESCRIPTIONS[category]}
              </p>
              <div className="text-[11px] uppercase tracking-[0.25em] text-cherry-bloom inline-flex items-center gap-2">
                <span className="h-px w-8 bg-cherry-bloom" />
                {items.length} prestation{items.length > 1 ? "s" : ""}
              </div>
            </Reveal>

            <div className="md:col-span-8">
              {items.length === 0 ? (
                <div className="text-sm text-foreground/50 italic py-6 border-y border-dashed border-border/60">
                  Aucune prestation pour le moment.
                </div>
              ) : (
                <Stagger
                  staggerChildren={0.06}
                  amount={0.1}
                  className="divide-y divide-border/50 border-y border-border/50"
                >
                  {items.map((s) => (
                    <StaggerItem key={s.id}>
                      <div className="group relative py-6 flex items-start justify-between gap-6 transition-colors hover:bg-rose-gold/15 -mx-3 px-3 rounded">
                        <div className="min-w-0 relative">
                          <div className="font-serif text-xl text-cherry-leaf group-hover:text-cherry-bloom transition-colors">
                            {s.name}
                          </div>
                          {s.description && (
                            <div className="text-sm text-foreground/60 mt-1 max-w-md leading-relaxed">
                              {s.description}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-foreground/55 mt-3">
                            <Clock className="h-3 w-3" />
                            {formatDuration(s.durationMinutes)}
                          </div>
                        </div>
                        <div className="text-right shrink-0 relative">
                          <div className="text-cherry-bloom font-serif text-2xl whitespace-nowrap transition-transform duration-500 group-hover:scale-110 origin-right">
                            {formatPrice(s.priceCents)}
                          </div>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </Stagger>
              )}
            </div>
          </article>
        ))}

        <BloomReveal bloomPosition="top" bloomSize={70} className="text-center pt-10">
          <p className="text-foreground/70 mb-6 max-w-md mx-auto">
            Une envie précise ? Précisez-le dans votre demande de réservation —
            on construit ensemble votre rendez-vous.
          </p>
          <FillButton
            href="/reservation"
            variant="primary"
            size="lg"
            iconRight={<ArrowRight className="h-4 w-4" />}
          >
            Prendre rendez-vous
          </FillButton>
        </BloomReveal>
      </section>
    </>
  );
}
