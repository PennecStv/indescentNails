"use client";

import Link from "next/link";
import { useState } from "react";
import { Lock, Trash2, Unlock } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDateTime, formatTime } from "@/lib/dates";
import type { CalendarSlot } from "./calendar-week";

interface SlotDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slot: CalendarSlot | null;
  onUpdated: (slot: CalendarSlot) => void;
  onDeleted: (id: string) => void;
}

export function SlotDetailDialog({
  open,
  onOpenChange,
  slot,
  onUpdated,
  onDeleted,
}: SlotDetailDialogProps) {
  const [pending, setPending] = useState(false);

  if (!slot) return null;

  const isBooked = slot.status === "BOOKED";
  const isBlocked = slot.status === "BLOCKED";

  async function toggleBlock() {
    if (!slot) return;
    setPending(true);
    const newStatus = slot.status === "BLOCKED" ? "AVAILABLE" : "BLOCKED";
    try {
      const res = await fetch(`/api/admin/slots/${slot.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Action impossible.");
        return;
      }
      onUpdated({
        ...slot,
        status: data.slot.status,
        note: data.slot.note ?? null,
      });
    } catch {
      toast.error("Réseau indisponible.");
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!slot) return;
    if (!confirm("Supprimer ce créneau ?")) return;
    setPending(true);
    try {
      const res = await fetch(`/api/admin/slots/${slot.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Suppression impossible.");
        return;
      }
      onDeleted(slot.id);
    } catch {
      toast.error("Réseau indisponible.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cream max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isBooked
              ? "Créneau réservé"
              : isBlocked
              ? "Créneau bloqué"
              : "Créneau disponible"}
          </DialogTitle>
          <DialogDescription>
            {formatDateTime(slot.startAt)} · jusqu&apos;à {formatTime(slot.endAt)}
          </DialogDescription>
        </DialogHeader>

        {slot.note && (
          <div className="rounded-md bg-white border border-border/60 p-3 text-sm text-foreground/75">
            <span className="text-xs uppercase tracking-wider text-foreground/55">
              Note
            </span>
            <p className="mt-1">{slot.note}</p>
          </div>
        )}

        {isBooked && slot.booking && (
          <div className="rounded-md bg-white border border-border/60 p-3 space-y-1">
            <div className="text-sm">
              <span className="text-foreground/55">Client : </span>
              <span className="font-medium">{slot.booking.customerName}</span>
            </div>
            <div className="text-sm">
              <span className="text-foreground/55">Prestation : </span>
              {slot.booking.serviceName}
            </div>
            <div className="text-xs text-foreground/55 mt-1">
              Statut : {slot.booking.status}
            </div>
            <Link
              href={`/admin/reservations/${slot.booking.id}`}
              className="inline-block mt-2 text-xs uppercase tracking-wider text-cherry-leaf hover:underline"
            >
              Voir la réservation →
            </Link>
          </div>
        )}

        <DialogFooter className="gap-2">
          {!isBooked && (
            <>
              <button
                type="button"
                onClick={toggleBlock}
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-md border border-border/60 px-3 py-2 text-sm text-foreground/70 hover:border-cherry-leaf/40 hover:text-cherry-leaf transition disabled:opacity-60"
              >
                {isBlocked ? (
                  <>
                    <Unlock className="h-3.5 w-3.5" />
                    Débloquer
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    Bloquer
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-md border border-border/60 px-3 py-2 text-sm text-destructive hover:border-destructive/40 hover:bg-destructive/10 transition disabled:opacity-60"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Supprimer
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md border border-border/60 px-3 py-2 text-sm text-foreground/70 hover:border-foreground/40 transition"
          >
            Fermer
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
