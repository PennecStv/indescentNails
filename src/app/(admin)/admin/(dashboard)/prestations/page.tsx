import { prisma } from "@/lib/prisma";
import { ServicesAdmin } from "@/components/admin/services-admin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Prestations" };

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-cherry-bloom">
          Catalogue
        </p>
        <h1 className="font-serif text-3xl text-cherry-leaf">Prestations</h1>
        <p className="text-sm text-foreground/65 mt-1">
          Créez, modifiez ou désactivez vos prestations. Les prestations
          inactives ne sont plus proposées à la réservation.
        </p>
      </header>

      <ServicesAdmin
        initial={services.map((s) => ({
          id: s.id,
          category: s.category,
          name: s.name,
          description: s.description,
          priceCents: s.priceCents,
          durationMinutes: s.durationMinutes,
          active: s.active,
          sortOrder: s.sortOrder,
        }))}
      />
    </div>
  );
}
