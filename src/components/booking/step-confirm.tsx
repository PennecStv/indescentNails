"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/dates";
import { formatPrice, formatDuration } from "@/lib/utils";
import type { ServiceListItem, SlotListItem } from "./booking-wizard";
import type { PersonalInfo } from "./step-personal";
import type { PhotoFiles } from "./step-photos";

export function StepConfirm({
  slot,
  service,
  personal,
  needsRemoval,
  photos,
  submitting,
  onSubmit,
  onEdit,
}: {
  slot: SlotListItem;
  service: ServiceListItem;
  personal: PersonalInfo;
  needsRemoval: boolean;
  photos: PhotoFiles;
  submitting: boolean;
  onSubmit: (conditionsAccepted: boolean) => void;
  onEdit: (stepIndex: number) => void;
}) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-2xl text-cherry-leaf">Récapitulatif</h3>
        <p className="text-sm text-foreground/65 mt-1">
          Vérifiez vos informations puis acceptez les conditions pour envoyer
          votre demande.
        </p>
      </div>

      <SummaryRow
        label="Créneau"
        value={formatDateTime(slot.startAt)}
        onEdit={() => onEdit(0)}
      />
      <SummaryRow
        label="Identité"
        value={
          <>
            {personal.firstName} {personal.lastName}
            <span className="block text-foreground/55 text-xs">
              {personal.email} · {personal.phone}
            </span>
          </>
        }
        onEdit={() => onEdit(1)}
      />
      <SummaryRow
        label="Prestation"
        value={
          <>
            {service.name} — {formatPrice(service.priceCents)}
            <span className="block text-foreground/55 text-xs">
              {formatDuration(service.durationMinutes)} ·{" "}
              {needsRemoval ? "Avec dépose" : "Sans dépose"}
            </span>
          </>
        }
        onEdit={() => onEdit(2)}
      />
      <SummaryRow
        label="Photos"
        value={
          <span className="text-foreground/65 text-sm">
            Inspiration : {photos.inspiration.name}
            <span className="block">Actuel : {photos.current.name}</span>
          </span>
        }
        onEdit={() => onEdit(3)}
      />

      <div className="bg-rose-gold/30 border border-cherry-bloom/20 rounded-xl p-4 space-y-3">
        <Checkbox
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          label={
            <span>
              J&apos;accepte les conditions : annulation au moins 24h à
              l&apos;avance, présentation à l&apos;heure (au-delà de 15 min de
              retard, le rendez-vous peut être annulé), et la collecte de mes
              données conformément à la{" "}
              <a
                href="/confidentialite"
                className="text-cherry-bloom underline"
                target="_blank"
                rel="noopener"
              >
                politique de confidentialité
              </a>
              .
            </span>
          }
        />
      </div>

      <Button
        type="button"
        variant="cta"
        size="lg"
        className="w-full"
        disabled={!accepted || submitting}
        onClick={() => onSubmit(accepted)}
      >
        {submitting ? "Envoi…" : "Envoyer ma demande de rendez-vous"}
      </Button>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: React.ReactNode;
  onEdit: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/40 pb-3">
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wider text-cherry-bloom mb-0.5">
          {label}
        </div>
        <div className="text-sm text-foreground">{value}</div>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="text-cherry-leaf text-xs uppercase tracking-wider flex items-center gap-1 hover:underline shrink-0"
      >
        <Pencil className="h-3 w-3" /> Modifier
      </button>
    </div>
  );
}
