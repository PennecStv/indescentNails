export const metadata = {
  title: "Mentions légales",
  robots: { index: false, follow: false },
};

export default function MentionsLegalesPage() {
  return (
    <article className="container-narrow py-16 max-w-3xl prose-style">
      <div className="section-subtitle">Informations légales</div>
      <h1 className="font-serif text-4xl text-cherry-leaf mb-8">
        Mentions légales
      </h1>

      <Section title="Éditeur du site">
        <p>
          <strong>Indescent Nails</strong>
          <br />
          Auto-entreprise — à compléter
          <br />
          SIRET : à compléter
          <br />
          Adresse professionnelle : à compléter
          <br />
          E-mail : contact@indescent-nails.fr
        </p>
      </Section>

      <Section title="Directrice de la publication">
        <p>À compléter avec le nom de la gérante.</p>
      </Section>

      <Section title="Hébergement">
        <p>
          Le site est hébergé localement durant la phase de développement.
          L&apos;hébergeur définitif sera communiqué lors de la mise en
          production.
        </p>
      </Section>

      <Section title="Propriété intellectuelle">
        <p>
          L&apos;ensemble du contenu (textes, photos, illustrations) est
          protégé par le droit d&apos;auteur. Toute reproduction, même
          partielle, est soumise à autorisation préalable.
        </p>
      </Section>

      <Section title="Photos clients">
        <p>
          Les photos téléchargées par les clients lors d&apos;une réservation
          sont utilisées uniquement pour préparer le rendez-vous. Elles ne
          sont ni publiées, ni transmises à des tiers, et peuvent être
          supprimées sur simple demande.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Pour toute question relative à ces mentions, contactez-nous à
          contact@indescent-nails.fr.
        </p>
      </Section>

      <p className="text-sm text-foreground/50 mt-12">
        Document à compléter avant la mise en production (informations légales
        définitives, hébergeur, n° SIRET).
      </p>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-serif text-2xl text-cherry-leaf mb-3">{title}</h2>
      <div className="text-foreground/80 leading-relaxed">{children}</div>
    </section>
  );
}
