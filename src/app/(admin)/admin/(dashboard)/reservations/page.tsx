import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@/lib/enums";
import { formatDateTime, formatTime } from "@/lib/dates";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Réservations" };

const STATUS_TABS: { key: string | "ALL"; label: string }[] = [
  { key: "PENDING", label: "À traiter" },
  { key: "CONFIRMED", label: "Confirmées" },
  { key: "REJECTED", label: "Refusées" },
  { key: "CANCELLED", label: "Annulées" },
  { key: "ALL", label: "Toutes" },
];

const STATUS_BADGES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-cherry-leaf/15 text-cherry-leaf",
  REJECTED: "bg-foreground/10 text-foreground/65",
  CANCELLED: "bg-foreground/10 text-foreground/65",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  REJECTED: "Refusée",
  CANCELLED: "Annulée",
};

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status: rawStatus, q: rawQuery } = await searchParams;
  const status =
    rawStatus && rawStatus !== "ALL" && rawStatus in BookingStatus
      ? rawStatus
      : rawStatus === "ALL"
      ? "ALL"
      : "PENDING";
  const q = rawQuery?.trim().toLowerCase() ?? "";

  const where: {
    status?: string;
    OR?: Array<Record<string, unknown>>;
  } = {};
  if (status !== "ALL") where.status = status;
  if (q) {
    where.OR = [
      { customerFirstName: { contains: q } },
      { customerLastName: { contains: q } },
      { customerEmail: { contains: q } },
    ];
  }

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: [{ createdAt: "desc" }],
    take: 200,
    include: {
      slot: { select: { startAt: true, endAt: true } },
      service: { select: { name: true, priceCents: true } },
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-cherry-bloom">
          Demandes
        </p>
        <h1 className="font-serif text-3xl text-cherry-leaf">Réservations</h1>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav className="flex flex-wrap gap-2">
          {STATUS_TABS.map((t) => {
            const active = status === t.key;
            const href =
              t.key === "ALL"
                ? "/admin/reservations?status=ALL"
                : `/admin/reservations?status=${t.key}`;
            return (
              <Link
                key={t.key}
                href={href}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs uppercase tracking-wider transition",
                  active
                    ? "bg-cherry-leaf text-white border-cherry-leaf"
                    : "border-border/60 text-foreground/70 hover:border-cherry-leaf/40 hover:text-cherry-leaf"
                )}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>

        <form className="flex items-center gap-2">
          <input type="hidden" name="status" value={status} />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Nom ou e-mail…"
            className="h-9 rounded-md border border-input bg-white px-3 text-sm placeholder:text-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            type="submit"
            className="rounded-md bg-cherry-leaf px-3 py-2 text-xs uppercase tracking-wider text-white hover:bg-cherry-leaf/90 transition"
          >
            Filtrer
          </button>
        </form>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-white p-12 text-center text-foreground/55">
          <p className="text-sm">Aucune réservation pour ce filtre.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-white overflow-hidden">
          <ul className="divide-y divide-border/60">
            {bookings.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/admin/reservations/${b.id}`}
                  className="flex items-center gap-4 p-5 hover:bg-cream/60 transition"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground truncate">
                        {b.customerFirstName} {b.customerLastName}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full",
                          STATUS_BADGES[b.status] ?? "bg-foreground/10"
                        )}
                      >
                        {STATUS_LABELS[b.status] ?? b.status}
                      </span>
                    </div>
                    <div className="text-sm text-foreground/65 truncate mt-0.5">
                      {b.service.name}{" "}
                      <span className="text-foreground/40 mx-1">·</span>{" "}
                      {formatPrice(b.service.priceCents)}
                    </div>
                    <div className="text-xs text-foreground/50 mt-1">
                      Demande reçue le {formatDateTime(b.createdAt)}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-medium text-cherry-leaf">
                      {formatDateTime(b.slot.startAt).split(" à ")[0]}
                    </div>
                    <div className="text-xs text-foreground/55">
                      {formatTime(b.slot.startAt)} – {formatTime(b.slot.endAt)}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
