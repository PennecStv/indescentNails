import {
  Instagram,
  Mail,
  Phone,
  Clock,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";

import { ContactForm } from "@/components/public/contact-form";
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
import { Flower3D } from "@/components/public/motion/flower-3d";
import { Tilt3D } from "@/components/public/motion/tilt-3d";

export const metadata = {
  title: "Contact",
  description:
    "Une question ? Contactez Indescent Nails sur Instagram, par e-mail ou via le formulaire de contact.",
};

export default function ContactPage() {
  return (
    <>
      <section className="relative cherry-branch-bg overflow-hidden">
        <CherryBranchDecoration className="absolute -top-10 -right-10 w-[480px] opacity-30 pointer-events-none hidden md:block" />
        <div className="hidden lg:block absolute -left-4 bottom-12 text-[8rem] font-serif italic text-cherry-bloom/15 leading-none select-none pointer-events-none">
          nº03
        </div>
        <div className="container-narrow relative py-24 md:py-32 grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 space-y-8">
            <Reveal>
              <div className="eyebrow-tag">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-cherry-bloom animate-pulse" />
                Contact · Réponse sous 24h
              </div>
            </Reveal>
            <h1 className="text-display text-cherry-leaf">
              <WordsReveal text="On" staggerChildren={0.08} />{" "}
              <span className="italic text-cherry-deep">
                <WordsReveal
                  text="échange ?"
                  delay={0.25}
                  staggerChildren={0.08}
                />
              </span>
            </h1>
            <Reveal delay={0.7} y={20}>
              <p className="text-lg text-foreground/75 max-w-xl leading-relaxed border-l-2 border-cherry-bloom/40 pl-5">
                Pour toute question, le canal le plus rapide reste Instagram.
                Vous pouvez aussi me laisser un message via le formulaire
                ci-dessous.
              </p>
            </Reveal>
            <Reveal delay={0.9} y={16}>
              <div className="flex flex-wrap gap-x-10 gap-y-4 pt-6 border-t border-dashed border-border/60">
                <Stat number="24h" label="Temps de réponse" />
                <Stat number="3" label="Canaux dispos" />
                <Stat number="Mar→Sam" label="Disponibilité" />
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
              <div className="relative aspect-square rounded-full overflow-hidden bg-gradient-to-br from-cherry-bloom/40 via-rose-gold to-cherry-leaf/30 shadow-xl flex items-center justify-center">
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

      <section className="container-narrow py-20 max-w-5xl">
        <Reveal y={32}>
          <a
            href="https://instagram.com/indescentnails"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl bg-cherry-bloom text-white p-10 md:p-12 mb-16 hover:bg-cherry-bloom/90 transition-colors group relative overflow-hidden"
          >
            <CherryBranchDecoration className="absolute -bottom-6 -right-6 w-[280px] opacity-15 pointer-events-none" />

            <div className="relative flex items-center justify-between gap-6 flex-wrap md:flex-nowrap">
              <div className="flex items-center gap-5">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/15 group-hover:bg-white/25 transition-colors group-hover:rotate-12 duration-500">
                  <Instagram className="h-7 w-7" />
                </span>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.3em] opacity-80 mb-1">
                    Canal privilégié
                  </div>
                  <div className="font-serif text-3xl md:text-4xl">
                    @indescentnails
                  </div>
                  <div className="text-sm opacity-85 mt-1">
                    Réponse sous 24h en moyenne
                  </div>
                </div>
              </div>
              <ArrowUpRight className="h-7 w-7 opacity-70 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-2 group-hover:-translate-y-2" />
            </div>
          </a>
        </Reveal>

        <div className="relative grid md:grid-cols-12 gap-12">
          <ParallaxBranch
            className="-top-10 -left-10 w-[260px] hidden md:block opacity-25"
            intensity={70}
          />

          <div className="md:col-span-5 space-y-8">
            <BloomReveal bloomPosition="left" bloomSize={70}>
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="section-numeral">01</span>
                  <span className="marker">Autres moyens</span>
                </div>
                <h2 className="text-display-sm !text-3xl md:!text-4xl text-cherry-leaf">
                  Me joindre
                  <br />
                  <span className="italic text-cherry-bloom">autrement.</span>
                </h2>
              </div>
            </BloomReveal>

            <Stagger className="space-y-6 pt-4" staggerChildren={0.08}>
              <StaggerItem>
                <ContactInfo
                  icon={<Mail className="h-5 w-5" />}
                  title="Par e-mail"
                  value="contact@indescent-nails.fr"
                  href="mailto:contact@indescent-nails.fr"
                />
              </StaggerItem>
              <StaggerItem>
                <ContactInfo
                  icon={<Phone className="h-5 w-5" />}
                  title="Par téléphone"
                  value="06 XX XX XX XX"
                  href="tel:+330600000000"
                />
              </StaggerItem>
              <StaggerItem>
                <div className="flex items-start gap-3 pt-6 border-t border-border/40">
                  <Clock className="h-5 w-5 text-cherry-bloom mt-0.5 shrink-0" />
                  <div>
                    <div className="marker mb-2">Disponibilités</div>
                    <div className="text-sm text-foreground/70 space-y-0.5 leading-relaxed">
                      <div>Réponses du mardi au samedi</div>
                      <div>Entre 9h et 19h</div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            </Stagger>
          </div>

          <Reveal y={32} delay={0.15} className="md:col-span-7">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-cherry-leaf/15 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 opacity-50 pointer-events-none">
                <CherryBlossom
                  size={120}
                  trigger="inView"
                  withStem={false}
                />
              </div>
              <div className="relative">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="section-numeral">02</span>
                  <span className="marker">Formulaire</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl text-cherry-leaf mb-6">
                  Laissez-moi un mot
                </h2>
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>

        <BloomReveal bloomPosition="top" bloomSize={70} className="mt-24 text-center">
          <p className="text-foreground/70 mb-5 text-sm uppercase tracking-[0.2em]">
            Ou directement
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

function ContactInfo({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-start gap-4 group p-4 -mx-4 rounded-xl hover:bg-rose-gold/30 transition-colors relative overflow-hidden"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cherry-bloom/15 text-cherry-bloom group-hover:bg-cherry-bloom group-hover:text-white transition-colors shrink-0">
        {icon}
      </span>
      <span>
        <span className="block marker mb-1">{title}</span>
        <span className="font-serif text-lg text-cherry-leaf group-hover:text-cherry-bloom transition-colors">
          {value}
        </span>
      </span>
    </a>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="font-serif italic text-3xl text-cherry-deep leading-none whitespace-nowrap">
        {number}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-foreground/55">
        {label}
      </div>
    </div>
  );
}
