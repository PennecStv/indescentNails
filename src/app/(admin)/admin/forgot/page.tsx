import Link from "next/link";

export const metadata = {
  title: "Mot de passe oublié",
  robots: { index: false, follow: false },
};

export default function ForgotPage() {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-border/60 shadow-sm p-8 text-center">
        <h1 className="font-serif text-2xl text-cherry-leaf mb-3">
          Mot de passe oublié
        </h1>
        <p className="text-sm text-foreground/70 leading-relaxed mb-6">
          La fonctionnalité de réinitialisation par e-mail sera activée en
          phase 4 (système d&apos;e-mails). Pour le MVP, contactez le
          développeur ou modifiez le mot de passe via{" "}
          <code className="text-cherry-bloom">npm run db:seed</code> après mise
          à jour de <code>.env</code>.
        </p>
        <Link
          href="/admin/login"
          className="inline-flex items-center justify-center rounded-full border border-cherry-leaf/40 px-6 py-2 text-sm uppercase tracking-wider text-cherry-leaf hover:bg-cherry-leaf/10 transition"
        >
          Retour à la connexion
        </Link>
      </div>
    </main>
  );
}
