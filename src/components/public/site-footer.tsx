import Link from "next/link";
import { Instagram, Mail, Phone, Clock } from "lucide-react";

import { CherryFlowerIcon, CherryBranchDecoration } from "./cherry-icons";
import { FillButton } from "./motion/fill-button";
import { Reveal, Stagger, StaggerItem } from "./motion/reveal";
import { CherryBlossom } from "./motion/cherry-blossom";

const SERVICE_TAGS = [
  "Pose gel",
  "Nail art",
  "Manucure",
  "Semi-permanent",
  "Déposes",
  "French",
  "Chrome",
  "Sur mesure",
];

export function SiteFooter() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-border/40 bg-rose-gold/40">
      <CherryBranchDecoration className="pointer-events-none absolute -top-10 -right-20 w-[520px] opacity-40 hidden md:block" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 hidden md:block opacity-50">
        <CherryBlossom size={180} trigger="inView" withStem={false} />
      </div>

      <div className="border-y border-border/30 py-10 bg-background/30 backdrop-blur-sm relative overflow-hidden">
        <div className="container-narrow relative">
          <div className="marker mb-5">Savoir-faire</div>
          <div className="flex flex-wrap gap-2">
            {SERVICE_TAGS.map((tag, i) => (
              <span
                key={tag}
                className="group inline-flex items-center gap-2 rounded-full border border-cherry-leaf/25 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cherry-leaf transition-all duration-500 hover:border-cherry-bloom hover:bg-cherry-bloom hover:text-white hover:-translate-y-0.5"
              >
                <span className="font-serif italic text-cherry-bloom group-hover:text-white transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container-narrow relative py-16 grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-5 space-y-5">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <CherryFlowerIcon className="h-8 w-8 text-cherry-bloom transition-transform duration-500 group-hover:rotate-45" />
            <span className="font-serif text-2xl text-cherry-leaf">
              Indescent <span className="italic text-cherry-bloom">Nails</span>
            </span>
          </Link>
          <p className="text-display-sm !text-3xl md:!text-4xl text-cherry-leaf leading-tight">
            <span className="italic text-cherry-bloom">L&apos;ongle</span> comme
            une <span className="italic">parenthèse</span>.
          </p>
          <p className="text-sm text-foreground/70 leading-relaxed max-w-sm">
            Prothésiste ongulaire passionnée. Pose, nail art et déposes dans un
            univers calme et raffiné — pensé sur mesure.
          </p>
          <FillButton
            href="https://instagram.com/indescentnails"
            external
            variant="outline"
            size="default"
            iconRight={<Instagram className="h-4 w-4" />}
          >
            @indescentnails
          </FillButton>
        </Reveal>

        <Stagger
          className="md:col-span-3 text-sm space-y-4"
          staggerChildren={0.05}
        >
          <StaggerItem>
            <div className="marker mb-4">Contact</div>
          </StaggerItem>
          <StaggerItem>
            <a
              href="mailto:contact@indescent-nails.fr"
              className="link-editorial flex items-center gap-2 text-foreground/80 hover:text-cherry-bloom"
            >
              <Mail className="h-4 w-4" /> contact@indescent-nails.fr
            </a>
          </StaggerItem>
          <StaggerItem>
            <div className="flex items-center gap-2 text-foreground/80">
              <Phone className="h-4 w-4" /> 06 XX XX XX XX
            </div>
          </StaggerItem>
        </Stagger>

        <Stagger
          className="md:col-span-4 text-sm space-y-4"
          staggerChildren={0.05}
        >
          <StaggerItem>
            <div className="marker mb-4">Horaires</div>
          </StaggerItem>
          <StaggerItem>
            <div className="flex items-start gap-3 text-foreground/80">
              <Clock className="h-4 w-4 mt-0.5 shrink-0 text-cherry-bloom" />
              <div className="space-y-0.5 leading-relaxed">
                <div>Mardi — Jeudi · 10h — 19h</div>
                <div>Samedi · 9h — 17h</div>
                <div className="text-foreground/45">
                  Lundi, Vendredi, Dimanche · fermé
                </div>
              </div>
            </div>
          </StaggerItem>
        </Stagger>
      </div>

      <div className="border-t border-border/40 relative">
        <div className="container-narrow py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] uppercase tracking-[0.2em] text-foreground/55">
          <div>
            © {new Date().getFullYear()} Indescent Nails — Tous droits réservés
          </div>
          <nav className="flex gap-6">
            <Link href="/mentions-legales" className="link-editorial">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="link-editorial">
              Confidentialité
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
