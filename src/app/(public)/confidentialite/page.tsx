export const metadata = {
  title: "Politique de confidentialité",
  robots: { index: false, follow: false },
};

export default function ConfidentialitePage() {
  return (
    <article className="container-narrow py-16 max-w-3xl">
      <div className="section-subtitle">Données personnelles</div>
      <h1 className="font-serif text-4xl text-cherry-leaf mb-8">
        Politique de confidentialité
      </h1>

      <Section title="Données collectées">
        <p>
          Lors d&apos;une réservation, nous collectons : nom, prénom, e-mail,
          numéro de téléphone, prestation choisie, et deux photos
          (modèle d&apos;inspiration et état actuel des ongles).
        </p>
        <p>
          Le formulaire de contact collecte uniquement nom, e-mail et
          contenu du message.
        </p>
      </Section>

      <Section title="Finalités">
        <p>Ces données sont utilisées pour :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Traiter votre demande de rendez-vous</li>
          <li>Vous contacter en cas de modification</li>
          <li>Préparer la prestation</li>
          <li>Répondre à vos messages</li>
        </ul>
      </Section>

      <Section title="Durée de conservation">
        <p>
          Vos coordonnées sont conservées pendant la durée nécessaire au
          suivi de votre rendez-vous, puis pendant une durée de 12 mois à des
          fins de prise de contact ultérieure. Les photos uploadées sont
          supprimées à votre demande, et au plus tard 30 jours après la
          prestation.
        </p>
      </Section>

      <Section title="Vos droits">
        <p>
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
          rectification, de suppression et de portabilité de vos données.
          Pour exercer ces droits, contactez-nous à contact@indescent-nails.fr.
        </p>
      </Section>

      <Section title="Sécurité">
        <p>
          Vos données sont stockées sur un serveur sécurisé. L&apos;accès aux
          données est restreint à la gérante d&apos;Indescent Nails.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          Le site utilise uniquement des cookies techniques nécessaires à son
          fonctionnement (session admin). Aucun cookie de suivi publicitaire
          n&apos;est utilisé.
        </p>
      </Section>

      <p className="text-sm text-foreground/50 mt-12">
        Document à compléter et faire valider avant la mise en production
        (durées de conservation, base légale).
      </p>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-serif text-2xl text-cherry-leaf mb-3">{title}</h2>
      <div className="text-foreground/80 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
