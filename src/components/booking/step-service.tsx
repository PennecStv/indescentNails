"use client";

import { useState, useEffect } from "react";

import { Label } from "@/components/ui/label";
import {
  SERVICE_CATEGORY_LABELS,
  SERVICE_CATEGORY_ORDER,
  type ServiceCategory,
} from "@/lib/enums";
import { formatPrice, formatDuration, cn } from "@/lib/utils";
import type { ServiceListItem } from "./booking-wizard";

export type ServiceChoice = { serviceId: string; needsRemoval: boolean };

export function StepService({
  services,
  value,
  onChange,
}: {
  services: ServiceListItem[];
  value: ServiceChoice | null;
  onChange: (v: ServiceChoice | null) => void;
}) {
  const [serviceId, setServiceId] = useState(value?.serviceId ?? "");
  const [needsRemoval, setNeedsRemoval] = useState<boolean>(
    value?.needsRemoval ?? false
  );

  useEffect(() => {
    if (serviceId) onChange({ serviceId, needsRemoval });
    else onChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, needsRemoval]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl text-cherry-leaf">Votre prestation</h3>
        <p className="text-sm text-foreground/65 mt-1">
          Vous pourrez préciser tout détail supplémentaire le jour du
          rendez-vous.
        </p>
      </div>

      <div>
        <Label className="mb-2 block">Choisissez la prestation principale</Label>
        <div className="space-y-4">
          {SERVICE_CATEGORY_ORDER.map((cat) => {
            const items = services.filter((s) => s.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat}>
                <div className="text-xs uppercase tracking-wider text-cherry-bloom mb-2">
                  {SERVICE_CATEGORY_LABELS[cat as ServiceCategory]}
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {items.map((s) => {
                    const selected = serviceId === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setServiceId(s.id)}
                        className={cn(
                          "text-left rounded-lg border px-4 py-3 transition-all",
                          selected
                            ? "bg-cherry-bloom/10 border-cherry-bloom"
                            : "bg-white border-border hover:border-cherry-bloom"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-medium text-sm">{s.name}</div>
                          <div className="text-cherry-bloom text-sm whitespace-nowrap">
                            {formatPrice(s.priceCents)}
                          </div>
                        </div>
                        <div className="text-xs text-foreground/55 mt-1">
                          {formatDuration(s.durationMinutes)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-border/50">
        <Label className="mb-2 block">Une dépose est-elle nécessaire ?</Label>
        <p className="text-xs text-foreground/55 mb-3">
          Cochez « Oui » si vous avez actuellement une pose (gel, résine,
          semi-permanent) à retirer avant la nouvelle prestation.
        </p>
        <div className="flex gap-3">
          {[
            { v: false, l: "Non, ongles naturels" },
            { v: true, l: "Oui, dépose nécessaire" },
          ].map(({ v, l }) => {
            const selected = needsRemoval === v;
            return (
              <button
                key={String(v)}
                type="button"
                onClick={() => setNeedsRemoval(v)}
                className={cn(
                  "flex-1 rounded-lg border px-4 py-3 text-sm transition-all",
                  selected
                    ? "bg-cherry-leaf/10 border-cherry-leaf text-cherry-leaf font-medium"
                    : "bg-white border-border hover:border-cherry-leaf"
                )}
              >
                {l}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
