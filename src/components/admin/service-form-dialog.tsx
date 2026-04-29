"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SERVICE_CATEGORY_LABELS,
  SERVICE_CATEGORY_ORDER,
  type ServiceCategory,
} from "@/lib/enums";

export type ServiceFormValues = {
  category: ServiceCategory;
  name: string;
  description: string | null;
  priceCents: number;
  durationMinutes: number;
  active: boolean;
  sortOrder: number;
};

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: {
    id: string;
    category: string;
    name: string;
    description: string | null;
    priceCents: number;
    durationMinutes: number;
    active: boolean;
    sortOrder: number;
  } | null;
  onSubmit: (values: ServiceFormValues) => Promise<void>;
}

const DEFAULTS: ServiceFormValues = {
  category: "PRESTATION",
  name: "",
  description: "",
  priceCents: 0,
  durationMinutes: 60,
  active: true,
  sortOrder: 0,
};

export function ServiceFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: ServiceFormDialogProps) {
  const [values, setValues] = useState<ServiceFormValues>(DEFAULTS);
  const [submitting, setSubmitting] = useState(false);
  const [priceInput, setPriceInput] = useState("0");

  useEffect(() => {
    if (open) {
      if (initial) {
        setValues({
          category: initial.category as ServiceCategory,
          name: initial.name,
          description: initial.description ?? "",
          priceCents: initial.priceCents,
          durationMinutes: initial.durationMinutes,
          active: initial.active,
          sortOrder: initial.sortOrder,
        });
        setPriceInput((initial.priceCents / 100).toString());
      } else {
        setValues(DEFAULTS);
        setPriceInput("0");
      }
    }
  }, [open, initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cream max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initial ? "Modifier la prestation" : "Nouvelle prestation"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="svc-category">Catégorie</Label>
            <Select
              value={values.category}
              onValueChange={(v) =>
                setValues((s) => ({ ...s, category: v as ServiceCategory }))
              }
            >
              <SelectTrigger id="svc-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_CATEGORY_ORDER.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {SERVICE_CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="svc-name">Nom</Label>
            <Input
              id="svc-name"
              required
              value={values.name}
              onChange={(e) =>
                setValues((s) => ({ ...s, name: e.target.value }))
              }
              placeholder="Pose en gel — couleur unie"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="svc-desc">Description (optionnelle)</Label>
            <Textarea
              id="svc-desc"
              rows={3}
              value={values.description ?? ""}
              onChange={(e) =>
                setValues((s) => ({ ...s, description: e.target.value }))
              }
              placeholder="Précisez ce qui est inclus, l'effet recherché…"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="svc-price">Tarif (€)</Label>
              <Input
                id="svc-price"
                type="number"
                min="0"
                step="1"
                required
                value={priceInput}
                onChange={(e) => {
                  const v = e.target.value;
                  setPriceInput(v);
                  const n = Number(v);
                  setValues((s) => ({
                    ...s,
                    priceCents: Number.isFinite(n) ? Math.round(n * 100) : 0,
                  }));
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="svc-duration">Durée (min)</Label>
              <Input
                id="svc-duration"
                type="number"
                min="1"
                step="5"
                required
                value={values.durationMinutes}
                onChange={(e) =>
                  setValues((s) => ({
                    ...s,
                    durationMinutes: Number(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <div className="space-y-1.5">
              <Label htmlFor="svc-order">Ordre d&apos;affichage</Label>
              <Input
                id="svc-order"
                type="number"
                min="0"
                value={values.sortOrder}
                onChange={(e) =>
                  setValues((s) => ({
                    ...s,
                    sortOrder: Number(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <label className="flex items-center gap-2 text-sm pb-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={values.active}
                onChange={(e) =>
                  setValues((s) => ({ ...s, active: e.target.checked }))
                }
                className="h-4 w-4 rounded border-border text-cherry-leaf focus:ring-cherry-leaf"
              />
              <span>Active (visible publiquement)</span>
            </label>
          </div>

          <DialogFooter className="gap-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-md border border-border/60 px-4 py-2 text-sm text-foreground/70 hover:border-foreground/40 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-cherry-bloom px-6 py-2 text-sm font-medium text-white uppercase tracking-wider hover:bg-cherry-bloom/90 transition disabled:opacity-60"
            >
              {submitting
                ? "Enregistrement…"
                : initial
                ? "Mettre à jour"
                : "Créer"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
