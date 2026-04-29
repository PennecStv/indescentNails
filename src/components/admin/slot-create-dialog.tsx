"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

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
import type { CalendarSlot } from "./calendar-week";

interface SlotCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaults: { date: string; startTime: string } | null;
  onCreated: (slot: CalendarSlot) => void;
}

export function SlotCreateDialog({
  open,
  onOpenChange,
  defaults,
  onCreated,
}: SlotCreateDialogProps) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && defaults) {
      setDate(defaults.date);
      setStartTime(defaults.startTime);
      setEndTime(addMinutes(defaults.startTime, 90));
      setNote("");
      setError(null);
    }
  }, [open, defaults]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          startTime,
          endTime,
          recurrenceFrequency: "NONE",
          occurrences: 1,
          note: note.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur lors de la création.");
        return;
      }
      onCreated({
        id: data.slot.id,
        startAt: data.slot.startAt,
        endAt: data.slot.endAt,
        status: data.slot.status,
        note: data.slot.note ?? null,
        booking: null,
      });
    } catch {
      toast.error("Réseau indisponible.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cream max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau créneau</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="slot-date">Date</Label>
            <Input
              id="slot-date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="slot-start">Début</Label>
              <Input
                id="slot-start"
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slot-end">Fin</Label>
              <Input
                id="slot-end"
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slot-note">Note (optionnelle)</Label>
            <Textarea
              id="slot-note"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Visible uniquement côté admin"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
              {error}
            </p>
          )}

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
              {submitting ? "Création…" : "Créer"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function addMinutes(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}
