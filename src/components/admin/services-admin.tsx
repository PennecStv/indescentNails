"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  SERVICE_CATEGORY_LABELS,
  SERVICE_CATEGORY_ORDER,
  type ServiceCategory,
} from "@/lib/enums";
import { formatDuration, formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ServiceFormDialog, type ServiceFormValues } from "./service-form-dialog";

export type AdminService = {
  id: string;
  category: string;
  name: string;
  description: string | null;
  priceCents: number;
  durationMinutes: number;
  active: boolean;
  sortOrder: number;
};

interface ServicesAdminProps {
  initial: AdminService[];
}

export function ServicesAdmin({ initial }: ServicesAdminProps) {
  const [services, setServices] = useState<AdminService[]>(initial);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminService | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, AdminService[]>();
    for (const cat of SERVICE_CATEGORY_ORDER) map.set(cat, []);
    for (const s of services) {
      if (!map.has(s.category)) map.set(s.category, []);
      map.get(s.category)!.push(s);
    }
    return map;
  }, [services]);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(s: AdminService) {
    setEditing(s);
    setDialogOpen(true);
  }

  async function handleSubmit(values: ServiceFormValues) {
    const payload = {
      ...values,
      description: values.description?.trim() || null,
    };
    try {
      if (editing) {
        const res = await fetch(`/api/admin/services/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const { service } = await res.json();
        setServices((list) => list.map((s) => (s.id === service.id ? service : s)));
        toast.success("Prestation mise à jour.");
      } else {
        const res = await fetch(`/api/admin/services`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const { service } = await res.json();
        setServices((list) => [...list, service]);
        toast.success("Prestation créée.");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Enregistrement impossible.");
    }
  }

  async function toggleActive(s: AdminService) {
    setPendingId(s.id);
    try {
      const res = await fetch(`/api/admin/services/${s.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !s.active }),
      });
      if (!res.ok) throw new Error();
      const { service } = await res.json();
      setServices((list) => list.map((x) => (x.id === service.id ? service : x)));
    } catch {
      toast.error("Action impossible.");
    } finally {
      setPendingId(null);
    }
  }

  async function remove(s: AdminService) {
    if (
      !confirm(
        `Supprimer "${s.name}" ?\nSi des réservations y sont liées, la prestation sera désactivée plutôt que supprimée.`
      )
    ) {
      return;
    }
    setPendingId(s.id);
    try {
      const res = await fetch(`/api/admin/services/${s.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.softDeleted && data.service) {
        setServices((list) =>
          list.map((x) => (x.id === data.service.id ? data.service : x))
        );
        toast.info(data.message ?? "Prestation désactivée.");
      } else {
        setServices((list) => list.filter((x) => x.id !== s.id));
        toast.success("Prestation supprimée.");
      }
    } catch {
      toast.error("Suppression impossible.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-full bg-cherry-bloom px-5 py-2 text-sm font-medium text-white uppercase tracking-wider hover:bg-cherry-bloom/90 transition"
        >
          <Plus className="h-4 w-4" />
          Nouvelle prestation
        </button>
      </div>

      {SERVICE_CATEGORY_ORDER.map((cat) => {
        const list = grouped.get(cat) ?? [];
        if (list.length === 0) return null;

        return (
          <section
            key={cat}
            className="rounded-2xl border border-border/60 bg-white"
          >
            <header className="px-5 py-3 border-b border-border/60">
              <h2 className="font-serif text-lg text-cherry-leaf">
                {SERVICE_CATEGORY_LABELS[cat as ServiceCategory]}
              </h2>
            </header>

            <ul className="divide-y divide-border/60">
              {list.map((s) => {
                const isPending = pendingId === s.id;
                return (
                  <li
                    key={s.id}
                    className={cn(
                      "px-5 py-4 flex items-start justify-between gap-4 transition",
                      !s.active && "opacity-60"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{s.name}</h3>
                        {!s.active && (
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-foreground/10 text-foreground/70">
                            Inactive
                          </span>
                        )}
                      </div>
                      {s.description && (
                        <p className="text-sm text-foreground/65 mt-1 line-clamp-2">
                          {s.description}
                        </p>
                      )}
                      <p className="text-sm text-foreground/70 mt-1">
                        <span className="text-cherry-leaf font-medium">
                          {formatPrice(s.priceCents)}
                        </span>
                        <span className="text-foreground/40 mx-2">·</span>
                        {formatDuration(s.durationMinutes)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleActive(s)}
                        disabled={isPending}
                        className={cn(
                          "rounded-md border px-2.5 py-1.5 text-xs transition disabled:opacity-50",
                          s.active
                            ? "border-border/60 text-foreground/70 hover:border-cherry-leaf/40 hover:text-cherry-leaf"
                            : "border-cherry-leaf/40 text-cherry-leaf hover:bg-cherry-leaf/10"
                        )}
                      >
                        {s.active ? "Désactiver" : "Activer"}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(s)}
                        disabled={isPending}
                        className="inline-flex items-center justify-center rounded-md border border-border/60 p-1.5 text-foreground/70 hover:border-cherry-leaf/40 hover:text-cherry-leaf transition disabled:opacity-50"
                        title="Modifier"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(s)}
                        disabled={isPending}
                        className="inline-flex items-center justify-center rounded-md border border-border/60 p-1.5 text-foreground/70 hover:border-destructive/40 hover:text-destructive transition disabled:opacity-50"
                        title="Supprimer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}

      {services.length === 0 && (
        <div className="rounded-2xl border border-border/60 bg-white p-12 text-center text-foreground/55">
          <Sparkles className="h-10 w-10 mx-auto mb-3 text-cherry-bloom/60" />
          <p className="text-sm">Aucune prestation pour le moment.</p>
        </div>
      )}

      <ServiceFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
