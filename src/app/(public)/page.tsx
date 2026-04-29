import Link from "next/link";
import { Calendar, Clock, MapPin, Sparkles, Heart, Instagram } from "lucide-react";

import { CherryBranchDecoration, LeafIcon } from "@/components/public/cherry-icons";

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
    <section className="relative overflow-hidden cherry-branch-bg">
      <CherryBranchDecoration className="absolute -top-4 right-0 w-[480px] opacity-70 pointer-events-none hidden md:block" />
      <div className="container-narrow py-20 md:py-32 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 animate-fade-in">
          <div className="section-subtitle">Prothésiste ongulaire</div>
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] text-cherry-leaf">
            La beauté
            <br />
            <span className="italic text-cherry-bloom">au bout des doigts.</span>
          </h1>
          <p className="text-lg text-foreground/75 max-w-md leading-relaxed">
            Réservez votre prochain rendez-vous dans un cocon doux et raffiné.
            Pose, nail art, déposes — pensés sur mesure pour vous.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/reservation" className="btn-primary-cta">
              Prendre rendez-vous
            </Link>
            <Link
              href="/prestations"
              className="inline-flex items-center justify-center rounded-full border border-cherry-leaf/40 px-8 py-3 text-sm font-medium uppercase tracking-wider text-cherry-leaf hover:bg-cherry-leaf/10 transition"
            >
              Voir les prestations
            </Link>
          </div>
        </div>

        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-rose-gold shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-gold via-cherry-bloom/30 to-cherry-leaf/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white/80 px-8">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-60" />
              <div className="text-sm uppercase tracking-widest opacity-80">
                Photo à venir
              </div>
              <div className="text-xs opacity-60 mt-2">
                Visuel hero / portrait à fournir
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PresentationSection() {
  return (
    <section id="presentation" className="container-narrow py-20">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="aspect-square rounded-2xl bg-rose-gold/60 flex items-center justify-center text-foreground/40">
          <div className="text-center">
            <Heart className="h-10 w-10 mx-auto mb-2" />
            <div className="text-sm uppercase tracking-widest">Portrait</div>
          </div>
        </div>
        <div>
          <div className="section-subtitle">À propos</div>
          <h2 className="section-title">Une passion née d&apos;une attention</h2>
          <div className="space-y-4 text-foreground/80 leading-relaxed">
            <p>
              Bienvenue chez Indescent Nails. Diplômée et passionnée, je vous
              accueille dans un espace pensé comme une parenthèse — calme,
              soigné, à votre rythme.
            </p>
            <p>
              Mon approche : prendre le temps. Comprendre vos envies, choisir
              les bons produits, soigner chaque détail jusqu&apos;à la dernière
              touche. Que ce soit pour une pose discrète ou un nail art
              expressif, je m&apos;engage à un travail propre, précis et durable.
            </p>
            <p>
              <strong className="text-cherry-leaf">Zone d&apos;exercice :</strong>{" "}
              salon situé en région — accueil sur rendez-vous uniquement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfosSection() {
  return (
    <section className="bg-rose-gold/40 py-20">
      <div className="container-narrow">
        <div className="text-center mb-14">
          <div className="section-subtitle">Informations pratiques</div>
          <h2 className="section-title">Bon à savoir avant votre venue</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-14">
          <InfoCard
            icon={<Clock className="h-6 w-6" />}
            title="Horaires"
            lines={[
              "Mardi — Jeudi : 10h — 19h",
              "Samedi : 9h — 17h",
              "Lundi, Vendredi, Dimanche : fermé",
            ]}
          />
          <InfoCard
            icon={<MapPin className="h-6 w-6" />}
            title="Localisation"
            lines={[
              "Salon sur rendez-vous",
              "Adresse communiquée à la réservation",
              "Stationnement à proximité",
            ]}
          />
          <InfoCard
            icon={<Calendar className="h-6 w-6" />}
            title="Réservation"
            lines={[
              "Demande en ligne 7 j / 7",
              "Validation sous 24 — 48h",
              "Délai minimum : 48h avant le RDV",
            ]}
          />
        </div>

        <div className="bg-white/60 rounded-2xl p-8 md:p-10 border border-cherry-leaf/15">
          <h3 className="font-serif text-2xl text-cherry-leaf mb-6">
            Comment se passe un rendez-vous ?
          </h3>
          <ol className="grid md:grid-cols-4 gap-6">
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
              <li key={step.n} className="space-y-2">
                <div className="font-serif text-3xl text-cherry-bloom">{step.n}</div>
                <div className="font-medium text-cherry-leaf">{step.title}</div>
                <div className="text-sm text-foreground/70">{step.text}</div>
              </li>
            ))}
          </ol>

          <div className="mt-8 pt-6 border-t border-cherry-leaf/15 grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <div className="font-medium text-cherry-leaf mb-1">À prévoir</div>
              <p className="text-foreground/70">
                Venir avec les ongles propres, sans crème ni huile. Si vous
                avez une pose existante, indiquez-le dans le formulaire pour
                ajouter une dépose.
              </p>
            </div>
            <div>
              <div className="font-medium text-cherry-leaf mb-1">
                Annulation & retard
              </div>
              <p className="text-foreground/70">
                Toute annulation doit être signalée au moins 24h à l&apos;avance.
                Au-delà de 15 minutes de retard, le RDV peut être annulé.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  title,
  lines,
}: {
  icon: React.ReactNode;
  title: string;
  lines: string[];
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-border/50 shadow-sm">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-cherry-bloom/15 text-cherry-bloom mb-4">
        {icon}
      </div>
      <div className="font-serif text-xl text-cherry-leaf mb-3">{title}</div>
      <ul className="space-y-1 text-sm text-foreground/70">
        {lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </div>
  );
}

function GallerySection() {
  return (
    <section className="container-narrow py-20">
      <div className="text-center mb-12">
        <div className="section-subtitle">Réalisations</div>
        <h2 className="section-title">Inspirations & créations</h2>
        <p className="text-foreground/70 max-w-xl mx-auto">
          Quelques-unes de mes réalisations récentes. Pour le book complet,
          rendez-vous sur Instagram.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl bg-gradient-to-br from-rose-gold via-cherry-bloom/30 to-cherry-leaf/20 relative overflow-hidden group"
          >
            <div className="absolute inset-0 flex items-center justify-center text-foreground/30">
              <LeafIcon className="h-8 w-8" />
            </div>
            <div className="absolute inset-0 bg-cherry-leaf/0 group-hover:bg-cherry-leaf/15 transition-colors" />
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <a
          href="https://instagram.com/indescentnails"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-cherry-bloom hover:underline"
        >
          <Instagram className="h-5 w-5" />
          Voir plus sur Instagram
        </a>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="container-narrow pb-20">
      <div className="rounded-2xl bg-cherry-leaf text-white p-10 md:p-14 text-center relative overflow-hidden">
        <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
          <CherryBranchDecoration className="w-64" />
        </div>
        <h2 className="font-serif text-3xl md:text-4xl mb-3">
          Prête pour votre prochaine pose ?
        </h2>
        <p className="opacity-90 mb-6 max-w-md mx-auto">
          Réservez en quelques clics. Vous recevrez un e-mail de confirmation
          dès validation.
        </p>
        <Link
          href="/reservation"
          className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-medium uppercase tracking-wider text-cherry-leaf hover:bg-rose-gold transition"
        >
          Prendre rendez-vous
        </Link>
      </div>
    </section>
  );
}
