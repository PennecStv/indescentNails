import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Demande envoyée",
  robots: { index: false, follow: false },
};

export default function MerciPage() {
  return (
    <section className="container-narrow py-20 text-center max-w-xl">
      <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-cherry-leaf/10 text-cherry-leaf mb-6">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <h1 className="font-serif text-4xl text-cherry-leaf mb-3">
        Demande bien reçue 🌸
      </h1>
      <p className="text-foreground/70 leading-relaxed mb-2">
        Merci pour votre demande de rendez-vous. Vous allez recevoir un e-mail
        d&apos;accusé de réception.
      </p>
      <p className="text-foreground/70 leading-relaxed mb-8">
        La validation définitive se fera sous 24 — 48h. Vous serez prévenu·e
        par e-mail.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary-cta">
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full border border-cherry-leaf/40 px-8 py-3 text-sm uppercase tracking-wider text-cherry-leaf hover:bg-cherry-leaf/10 transition"
        >
          Une question ?
        </Link>
      </div>
    </section>
  );
}
