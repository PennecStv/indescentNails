"use client";

import { useMemo } from "react";
import { format, parseISO, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/dates";
import type { SlotListItem } from "./booking-wizard";

export type SlotChoice = { slotId: string };

export function StepSlot({
  slots,
  value,
  onChange,
}: {
  slots: SlotListItem[];
  value: SlotChoice | null;
  onChange: (v: SlotChoice) => void;
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, SlotListItem[]>();
    for (const s of slots) {
      const day = startOfDay(parseISO(s.startAt)).toISOString();
      const arr = map.get(day) ?? [];
      arr.push(s);
      map.set(day, arr);
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([day, items]) => ({
        day: parseISO(day),
        items: items.sort((a, b) => a.startAt.localeCompare(b.startAt)),
      }));
  }, [slots]);

  if (slots.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="font-serif text-xl text-cherry-leaf mb-2">
          Aucun créneau disponible
        </h3>
        <p className="text-sm text-foreground/60">
          Aucun créneau futur n&apos;est ouvert pour le moment. Contactez-nous
          via Instagram pour être prévenu des prochaines disponibilités.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl text-cherry-leaf">
          Choisissez votre créneau
        </h3>
        <p className="text-sm text-foreground/65 mt-1">
          Seuls les créneaux à plus de 48h sont affichés. Sélection unique.
        </p>
      </div>

      <div className="space-y-6 max-h-[480px] overflow-y-auto pr-2">
        {grouped.map(({ day, items }) => (
          <div key={day.toISOString()}>
            <div className="text-sm font-medium text-cherry-leaf capitalize mb-2">
              {format(day, "EEEE d MMMM", { locale: fr })}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {items.map((s) => {
                const selected = value?.slotId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onChange({ slotId: s.id })}
                    className={cn(
                      "rounded-lg border px-4 py-3 text-sm transition-all text-left",
                      selected
                        ? "bg-cherry-bloom text-white border-cherry-bloom shadow-sm"
                        : "bg-white border-border hover:border-cherry-bloom hover:bg-cherry-bloom/5"
                    )}
                  >
                    <div className="font-medium">{formatTime(s.startAt)}</div>
                    <div
                      className={cn(
                        "text-xs",
                        selected ? "text-white/80" : "text-foreground/55"
                      )}
                    >
                      → {formatTime(s.endAt)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
