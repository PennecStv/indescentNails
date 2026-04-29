import { Instagram, Mail, Phone, Clock, ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/public/contact-form";

export const metadata = {
  title: "Contact",
  description:
    "Une question ? Contactez Indescent Nails sur Instagram, par e-mail ou via le formulaire de contact.",
};

export default function ContactPage() {
  return (
    <section className="container-narrow py-16 max-w-4xl">
      <div className="text-center mb-12">
        <div className="section-subtitle">Contact</div>
        <h1 className="font-serif text-4xl md:text-5xl text-cherry-leaf mb-4">
          On échange ?
        </h1>
        <p className="text-foreground/70 max-w-xl mx-auto">
          Pour toute question, le canal le plus rapide reste Instagram. Vous
          pouvez aussi me laisser un message via le formulaire ci-dessous.
        </p>
      </div>

      <a
        href="https://instagram.com/indescentnails"
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-2xl bg-cherry-bloom text-white p-8 mb-10 hover:bg-cherry-bloom/90 transition group"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Instagram className="h-10 w-10" />
            <div>
              <div className="text-xs uppercase tracking-widest opacity-80">
                Canal privilégié
              </div>
              <div className="font-serif text-2xl">@indescentnails</div>
              <div className="text-sm opacity-80 mt-1">
                Réponse sous 24h en moyenne
              </div>
            </div>
          </div>
          <ArrowUpRight className="h-6 w-6 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </div>
      </a>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="font-serif text-2xl text-cherry-leaf">
            Autres moyens de me joindre
          </h2>
          <ContactInfo
            icon={<Mail className="h-5 w-5" />}
            title="Par e-mail"
            value="contact@indescent-nails.fr"
            href="mailto:contact@indescent-nails.fr"
          />
          <ContactInfo
            icon={<Phone className="h-5 w-5" />}
            title="Par téléphone"
            value="06 XX XX XX XX"
            href="tel:+330600000000"
          />
          <div className="flex items-start gap-3 pt-4 border-t border-border/40">
            <Clock className="h-5 w-5 text-cherry-bloom mt-0.5" />
            <div>
              <div className="font-medium text-cherry-leaf mb-1">
                Disponibilités
              </div>
              <div className="text-sm text-foreground/70 space-y-0.5">
                <div>Réponses du mardi au samedi</div>
                <div>Entre 9h et 19h</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="font-serif text-2xl text-cherry-leaf mb-4">
            Formulaire de contact
          </h2>
          <ContactForm />
        </div>
      </div>
    </section>
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
      className="flex items-start gap-3 group hover:text-cherry-bloom transition-colors"
    >
      <span className="text-cherry-bloom mt-0.5">{icon}</span>
      <span>
        <span className="block text-xs uppercase tracking-wider text-foreground/50 mb-0.5">
          {title}
        </span>
        <span className="font-medium">{value}</span>
      </span>
    </a>
  );
}
