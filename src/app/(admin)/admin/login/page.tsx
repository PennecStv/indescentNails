import { LoginForm } from "@/components/admin/login-form";
import { CherryFlowerIcon } from "@/components/public/cherry-icons";

export const metadata = {
  title: "Connexion",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <CherryFlowerIcon className="h-12 w-12 text-cherry-bloom mx-auto mb-3" />
          <h1 className="font-serif text-3xl text-cherry-leaf">Espace admin</h1>
          <p className="text-sm text-foreground/65 mt-1">
            Connectez-vous pour accéder au tableau de bord.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-8">
          <LoginForm callbackUrl={callbackUrl ?? "/admin"} />
        </div>
      </div>
    </main>
  );
}
