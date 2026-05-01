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
import { Flower3D } from "@/components/public/motion/flower-3d";
import { Tilt3D } from "@/components/public/motion/tilt-3d";

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
        <CherryBranchDecoration className="absolute -top-10 -right-10 w-[520px] opacity-30 pointer-events-none hidden md:block" />
        {/* Numéro section éditorial */}
        <div className="hidden lg:block absolute -left-4 bottom-12 text-[8rem] font-serif italic text-cherry-bloom/15 leading-none select-none pointer-events-none">
          nº02
        </div>

        <div className="container-narrow relative py-24 md:py-32 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 space-y-8">
            <Reveal>
              <div className="eyebrow-tag">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-cherry-bloom animate-pulse" />
                La carte · Tarifs indicatifs
              </div>
            </Reveal>
            <h1 className="text-display text-cherry-leaf">
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
              <p className="text-lg text-foreground/75 max-w-xl leading-relaxed border-l-2 border-cherry-bloom/40 pl-5">
                Tous les tarifs sont indicatifs. La durée approximative vous
                aide à choisir le bon créneau lors de votre réservation.
              </p>
            </Reveal>

            <Reveal delay={1.1} y={16}>
              <div className="flex flex-wrap gap-x-10 gap-y-4 pt-6 border-t border-dashed border-border/60">
                <Stat number={`${services.length}`} label="Prestations" />
                <Stat number={`${grouped.length}`} label="Catégories" />
                <Stat number="∞" label="Sur mesure" />
              </div>
            </Reveal>
          </div>

          <Reveal
            delay={0.5}
            y={40}
            className="md:col-span-5 hidden md:block"
            duration={1}
          >
            <Tilt3D intensity={4} depth={10}>
              <div className="relative aspect-square rounded-full overflow-hidden bg-gradient-to-br from-rose-gold via-cherry-bloom/40 to-cherry-leaf/30 shadow-xl flex items-center justify-center">
                <Flower3D
                  size={260}
                  petalColor="#FBF7F4"
                  autoRotate
                  followMouse
                />
              </div>
            </Tilt3D>
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

        <Reveal y={32}>
          <div className="rounded-2xl bg-cherry-leaf text-white p-10 md:p-14 text-center relative overflow-hidden mt-10">
            <CherryBranchDecoration className="absolute top-0 right-0 w-[300px] opacity-15 pointer-events-none" />
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-50 pointer-events-none">
              <Flower3D
                size={140}
                petalColor="#EDE0E1"
                autoRotate
              />
            </div>
            <div className="relative pt-16">
              <div className="marker !text-white/70 mb-4">Construisons ensemble</div>
              <h3 className="font-serif text-2xl md:text-3xl mb-4">
                Une envie précise ?
              </h3>
              <p className="opacity-85 mb-8 max-w-md mx-auto leading-relaxed">
                Précisez-le dans votre demande de réservation — on construit
                ensemble votre rendez-vous.
              </p>
              <FillButton
                href="/reservation"
                variant="white"
                size="lg"
                iconRight={<ArrowRight className="h-4 w-4" />}
              >
                Prendre rendez-vous
              </FillButton>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="font-serif italic text-3xl text-cherry-deep leading-none">
        {number}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-foreground/55">
        {label}
      </div>
    </div>
  );
}
