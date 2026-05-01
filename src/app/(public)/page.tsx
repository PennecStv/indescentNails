import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight, Instagram } from "lucide-react";

import { CherryBranchDecoration, LeafIcon, CherryFlowerIcon } from "@/components/public/cherry-icons";
import { Reveal, Stagger, StaggerItem, WordsReveal } from "@/components/public/motion/reveal";
import { FillButton } from "@/components/public/motion/fill-button";
import { ParallaxBranch } from "@/components/public/motion/parallax-branch";
import { CherryBlossom } from "@/components/public/motion/cherry-blossom";
import { BloomReveal } from "@/components/public/motion/bloom-reveal";
import { StrokeBranch } from "@/components/public/motion/stroke-branch";
import { Tilt3D } from "@/components/public/motion/tilt-3d";
import { Flower3D } from "@/components/public/motion/flower-3d";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PresentationSection />
      <InfosSection />
      <GallerySection />
      <CtaBanner />
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden cherry-branch-bg min-h-[100vh] flex items-center">
      {/* Décor : grosse fleur SVG qui se dessine en haut-droite */}
      <div className="pointer-events-none absolute -top-20 -right-10 hidden md:block opacity-90 animate-sway">
        <CherryBlossom size={420} delay={0.6} />
      </div>
      <div className="pointer-events-none absolute -bottom-32 -left-32 hidden md:block opacity-50">
        <CherryBlossom size={260} delay={1.4} withStem={false} />
      </div>
      <CherryBranchDecoration className="absolute top-[20%] -right-32 w-[420px] opacity-25 pointer-events-none hidden md:block" />

      {/* Numéro section éditorial */}
      <div className="hidden lg:block absolute -left-4 top-1/3 text-[10rem] font-serif italic text-cherry-bloom/15 leading-none select-none pointer-events-none">
        nº01
      </div>

      <div className="container-narrow relative z-10 py-24 md:py-32 grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-7 space-y-8">
          <Reveal duration={0.7} delay={0.1}>
            <div className="eyebrow-tag">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cherry-bloom animate-pulse" />
              Sur rendez-vous · Studio en région
            </div>
          </Reveal>

          <h1 className="text-display text-cherry-leaf">
            <WordsReveal text="La beauté," staggerChildren={0.08} delay={0.2} />
            <br />
            <span className="italic text-cherry-deep">
              <WordsReveal
                text="au bout des doigts."
                delay={0.7}
                staggerChildren={0.08}
              />
            </span>
          </h1>

          <Reveal delay={1.3} y={20}>
            <p className="text-lg text-foreground/75 max-w-md leading-relaxed border-l-2 border-cherry-bloom/40 pl-5">
              Réservez votre prochain rendez-vous dans un cocon doux et raffiné.
              Pose, nail art, déposes — pensés sur mesure pour vous.
            </p>
          </Reveal>

          <Reveal delay={1.5} y={20}>
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <FillButton
                href="/reservation"
                variant="primary"
                size="lg"
                iconRight={<ArrowRight className="h-4 w-4" />}
              >
                Prendre rendez-vous
              </FillButton>
              <Link
                href="/prestations"
                className="link-editorial text-sm uppercase tracking-[0.2em] text-cherry-leaf font-medium"
              >
                Voir les prestations
              </Link>
            </div>
          </Reveal>

          <Reveal delay={1.7} y={16}>
            <div className="flex flex-wrap gap-x-10 gap-y-4 pt-8 border-t border-dashed border-border/60">
              <Stat number="4+" label="Années d'expérience" />
              <Stat number="200+" label="Clientes accompagnées" />
              <Stat number="48h" label="Délai de validation" />
            </div>
          </Reveal>
        </div>

        {/* Portrait avec tilt léger sur le curseur */}
        <Reveal
          delay={0.7}
          y={50}
          className="md:col-span-5 relative"
          duration={1.1}
        >
          <Tilt3D intensity={4} depth={10} className="rounded-2xl">
            <div className="relative aspect-[4/5] shape-arch overflow-hidden bg-rose-gold shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-gold via-cherry-bloom/40 to-cherry-leaf/40" />
              {/* Fleur 3D : 5 pétales empilés en profondeur, centre rose discret */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Flower3D
                  size={300}
                  petalColor="#FBF7F4"
                  autoRotate
                  followMouse
                />
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white/90 z-10">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] opacity-80 mb-1">
                    Studio
                  </div>
                  <div className="font-serif text-2xl italic">Hanami</div>
                </div>
                <div className="text-right text-[10px] uppercase tracking-[0.25em] opacity-80">
                  01 / 04
                </div>
              </div>
            </div>
          </Tilt3D>

          {/* Tag floating en bas-gauche */}
          <div className="hidden md:flex absolute -bottom-6 -left-6 bg-background border border-border/50 rounded-full pl-2 pr-5 py-2 items-center gap-3 shadow-lg animate-float z-10">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cherry-leaf text-white">
              <CherryFlowerIcon className="h-5 w-5" />
            </span>
            <span className="text-xs">
              <span className="block uppercase tracking-[0.2em] text-foreground/55">
                Studio
              </span>
              <span className="font-serif text-base text-cherry-leaf">
                Sur rendez-vous
              </span>
            </span>
          </div>
        </Reveal>
      </div>

      {/* Indicator scroll */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-foreground/40">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="block h-10 w-px bg-foreground/30 animate-pulse" />
      </div>
    </section>
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

function PresentationSection() {
  return (
    <section
      id="presentation"
      className="relative container-narrow py-28 md:py-40"
    >
      <StrokeBranch className="-top-20 -left-20 w-[420px] h-[600px] hidden lg:block opacity-60" />

      <div className="grid md:grid-cols-12 gap-12 items-start">
        <Reveal className="md:col-span-5 md:sticky md:top-28">
          <Tilt3D intensity={4} depth={8}>
            <div className="relative aspect-[4/5] shape-arch overflow-hidden bg-rose-gold/60 flex items-center justify-center text-foreground/40">
              <div className="absolute inset-0 bg-gradient-to-tr from-cherry-leaf/30 via-rose-gold to-cherry-bloom/40" />
              <div className="relative">
                <CherryBlossom
                  size={200}
                  trigger="inView"
                  petalColor="#FBF7F4"
                  strokeColor="#ffffff"
                />
              </div>
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <div className="inline-block bg-background/85 backdrop-blur-md rounded-lg px-4 py-3 border border-white/40">
                  <p className="font-serif italic text-sm text-cherry-leaf leading-snug">
                    « Prendre le temps,
                    <br />
                    jusqu&apos;à la dernière touche. »
                  </p>
                </div>
              </div>
            </div>
          </Tilt3D>
        </Reveal>

        <div className="md:col-span-7 md:pl-10 space-y-10">
          <BloomReveal bloomPosition="left" bloomSize={70}>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="section-numeral">01</span>
                <span className="marker">À propos</span>
              </div>
              <h2 className="text-display-sm text-cherry-leaf">
                Une passion née
                <br />
                <span className="italic text-cherry-deep">d&apos;une attention.</span>
              </h2>
            </div>
          </BloomReveal>

          <Stagger
            className="space-y-6 text-foreground/80 leading-relaxed text-[1.05rem]"
            staggerChildren={0.12}
          >
            <StaggerItem>
              <p>
                Bienvenue chez <strong className="text-cherry-leaf">Indescent Nails</strong>. Diplômée et passionnée, je vous
                accueille dans un espace pensé comme une parenthèse — calme,
                soigné, à votre rythme.
              </p>
            </StaggerItem>
            <StaggerItem>
              <p>
                Mon approche : prendre le temps. Comprendre vos envies, choisir
                les bons produits, soigner chaque détail jusqu&apos;à la
                dernière touche. Que ce soit pour une pose discrète ou un nail
                art expressif, je m&apos;engage à un travail propre, précis et
                durable.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="pt-2 flex items-baseline gap-3 border-l-2 border-cherry-bloom/40 pl-5 py-2">
                <p>
                  <span className="block marker mb-1">
                    Zone d&apos;exercice
                  </span>
                  <span className="text-cherry-leaf">
                    Salon situé en région — accueil sur rendez-vous uniquement.
                  </span>
                </p>
              </div>
            </StaggerItem>
          </Stagger>

          <Stagger
            className="grid grid-cols-3 gap-4 pt-4 border-t border-dashed border-border/60"
            staggerChildren={0.08}
          >
            {[
              { label: "Précision", n: "01" },
              { label: "Hygiène", n: "02" },
              { label: "Sur mesure", n: "03" },
            ].map((v) => (
              <StaggerItem key={v.label}>
                <div>
                  <div className="font-serif italic text-cherry-deep text-xl">
                    {v.n}
                  </div>
                  <div className="text-xs uppercase tracking-[0.25em] text-cherry-leaf mt-1">
                    {v.label}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

function InfosSection() {
  return (
    <section className="relative bg-rose-gold/40 py-24 md:py-28 overflow-hidden">
      <ParallaxBranch
        className="bottom-10 -left-20 w-[400px] hidden md:block opacity-30 -rotate-12"
        intensity={100}
      />

      <div className="container-narrow relative">
        <BloomReveal bloomPosition="top" bloomSize={70} className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-10 bg-cherry-bloom" />
            <span className="marker">Informations pratiques</span>
            <span className="h-px w-10 bg-cherry-bloom" />
          </div>
          <h2 className="text-display-sm text-cherry-leaf">
            Bon à savoir avant
            <br />
            <span className="italic text-cherry-deep">votre venue.</span>
          </h2>
        </BloomReveal>

        <Stagger
          className="grid md:grid-cols-3 gap-5 mb-16"
          staggerChildren={0.12}
          amount={0.2}
        >
          <InfoCard
            n="01"
            icon={<Clock className="h-5 w-5" />}
            title="Horaires"
            lines={[
              "Mardi — Jeudi · 10h — 19h",
              "Samedi · 9h — 17h",
              "Lundi, Vendredi, Dimanche · fermé",
            ]}
          />
          <InfoCard
            n="02"
            icon={<MapPin className="h-5 w-5" />}
            title="Localisation"
            lines={[
              "Salon sur rendez-vous",
              "Adresse communiquée à la réservation",
              "Stationnement à proximité",
            ]}
          />
          <InfoCard
            n="03"
            icon={<Calendar className="h-5 w-5" />}
            title="Réservation"
            lines={[
              "Demande en ligne 7 j / 7",
              "Validation sous 24 — 48h",
              "Délai minimum · 48h avant le RDV",
            ]}
          />
        </Stagger>

        <Reveal y={32}>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-cherry-leaf/15 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 opacity-50 pointer-events-none">
              <CherryBlossom
                size={140}
                trigger="inView"
                withStem={false}
              />
            </div>
            <div className="relative">
              <h3 className="font-serif text-2xl md:text-3xl text-cherry-leaf mb-10">
                Comment se passe un rendez-vous ?
              </h3>
              <Stagger
                className="grid md:grid-cols-4 gap-x-6 gap-y-8"
                staggerChildren={0.08}
              >
                {[
                  {
                    n: "01",
                    title: "Vous réservez",
                    text: "Choisissez un créneau et remplissez votre demande en ligne.",
                  },
                  {
                    n: "02",
                    title: "Je valide",
                    text: "Vous recevez un e-mail de confirmation après validation.",
                  },
                  {
                    n: "03",
                    title: "Vous venez",
                    text: "Présentez-vous à l'horaire convenu, les ongles propres.",
                  },
                  {
                    n: "04",
                    title: "On crée",
                    text: "Échange, pose ou nail art, et finition soignée.",
                  },
                ].map((step) => (
                  <StaggerItem key={step.n} className="space-y-2 relative">
                    <div className="font-serif italic text-3xl text-cherry-deep">
                      {step.n}
                    </div>
                    <div className="font-medium text-cherry-leaf uppercase tracking-wider text-xs">
                      {step.title}
                    </div>
                    <div className="text-sm text-foreground/70 leading-relaxed">
                      {step.text}
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              <div className="mt-10 pt-8 border-t border-cherry-leaf/15 grid md:grid-cols-2 gap-8 text-sm">
                <div>
                  <div className="marker mb-2">À prévoir</div>
                  <p className="text-foreground/70 leading-relaxed">
                    Venir avec les ongles propres, sans crème ni huile. Si vous
                    avez une pose existante, indiquez-le dans le formulaire
                    pour ajouter une dépose.
                  </p>
                </div>
                <div>
                  <div className="marker mb-2">Annulation & retard</div>
                  <p className="text-foreground/70 leading-relaxed">
                    Toute annulation doit être signalée au moins 24h à
                    l&apos;avance. Au-delà de 15 minutes de retard, le RDV
                    peut être annulé.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function InfoCard({
  n,
  icon,
  title,
  lines,
}: {
  n: string;
  icon: React.ReactNode;
  title: string;
  lines: string[];
}) {
  return (
    <StaggerItem>
      <Tilt3D intensity={4} depth={8} className="h-full">
        <div className="group relative h-full bg-white rounded-2xl p-7 border border-border/40 shadow-sm transition-all duration-500 hover:shadow-md hover:border-cherry-bloom/40 hover:-translate-y-0.5">
          <div className="relative">
            <div className="flex items-start justify-between mb-5">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-cherry-bloom/15 text-cherry-bloom transition-colors group-hover:bg-cherry-bloom group-hover:text-white">
                {icon}
              </span>
              <span className="font-serif italic text-2xl text-cherry-bloom/40">
                {n}
              </span>
            </div>
            <div className="font-serif text-xl text-cherry-leaf mb-3">
              {title}
            </div>
            <ul className="space-y-1.5 text-sm text-foreground/70">
              {lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        </div>
      </Tilt3D>
    </StaggerItem>
  );
}

function GallerySection() {
  return (
    <section className="container-narrow py-28 relative">
      <div className="grid md:grid-cols-12 gap-8 mb-14 items-end">
        <BloomReveal bloomPosition="left" bloomSize={70} className="md:col-span-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="section-numeral">02</span>
            <span className="marker">Réalisations</span>
          </div>
          <h2 className="text-display-sm text-cherry-leaf">
            Inspirations
            <br />
            <span className="italic text-cherry-deep">& créations.</span>
          </h2>
        </BloomReveal>
        <Reveal className="md:col-span-5" delay={0.1}>
          <p className="text-foreground/70 leading-relaxed">
            Quelques réalisations récentes — un aperçu de ma palette créative.
            Pour le book complet, rendez-vous sur Instagram.
          </p>
        </Reveal>
      </div>

      <Stagger
        className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5"
        staggerChildren={0.07}
        amount={0.1}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <StaggerItem
            key={i}
            className={i % 5 === 0 ? "md:row-span-2 md:col-span-1" : ""}
          >
            <Tilt3D intensity={5} depth={10}>
              <div
                className={`group relative ${
                  i % 5 === 0 ? "aspect-[3/4]" : "aspect-square"
                } rounded-xl bg-gradient-to-br from-rose-gold via-cherry-bloom/30 to-cherry-leaf/30 overflow-hidden cursor-pointer`}
              >
                <div className="absolute inset-0 flex items-center justify-center text-foreground/30 transition-transform duration-700 group-hover:scale-110">
                  <LeafIcon className="h-10 w-10" />
                </div>
                <div className="absolute inset-0 bg-cherry-leaf/0 transition-colors duration-500 group-hover:bg-cherry-leaf/20" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 bg-gradient-to-t from-cherry-leaf/95 to-transparent">
                  <div className="text-white text-xs uppercase tracking-[0.2em]">
                    Réalisation #{i + 1}
                  </div>
                  <div className="text-white/80 font-serif italic text-sm mt-1">
                    Pose en gel — couleur sur mesure
                  </div>
                </div>
              </div>
            </Tilt3D>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="text-center mt-14" delay={0.1}>
        <FillButton
          href="https://instagram.com/indescentnails"
          external
          variant="outline"
          size="default"
          iconRight={<Instagram className="h-4 w-4" />}
        >
          Voir plus sur Instagram
        </FillButton>
      </Reveal>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="container-narrow pb-32">
      <Reveal y={48}>
        <div className="rounded-2xl bg-cherry-leaf text-white p-12 md:p-20 text-center relative overflow-hidden">
          <CherryBranchDecoration className="absolute top-0 right-0 w-[400px] opacity-15 pointer-events-none" />
          <CherryBranchDecoration className="absolute bottom-0 left-0 w-[400px] opacity-15 pointer-events-none rotate-180" />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-50 pointer-events-none">
            <CherryBlossom
              size={140}
              trigger="inView"
              withStem={false}
              petalColor="#EDE0E1"
              centerColor="#FBF7F4"
              strokeColor="#ffffff"
            />
          </div>

          <div className="relative pt-16">
            <div className="marker !text-white/70 mb-6">
              Votre prochain RDV
            </div>
            <h2 className="text-display-sm !text-white mb-4">
              Prête pour votre
              <br />
              <span className="italic text-rose-gold">prochaine pose ?</span>
            </h2>
            <p className="opacity-85 mb-10 max-w-md mx-auto leading-relaxed">
              Réservez en quelques clics. Vous recevrez un e-mail de
              confirmation dès validation de votre demande.
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
  );
}
