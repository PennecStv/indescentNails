"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Check, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime, formatTime } from "@/lib/dates";

type AvailableSlot = {
  id: string;
  startAt: string;
  endAt: string;
};

interface BookingActionsProps {
  bookingId: string;
  currentStatus: string;
  currentSlotId: string;
  availableSlots: AvailableSlot[];
}

export function BookingActions({
  bookingId,
  currentStatus,
  availableSlots,
}: BookingActionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");

  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [chosenSlotId, setChosenSlotId] = useState<string>("");

  async function callAction(body: object): Promise<boolean> {
    setPending(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Action impossible.");
        return false;
      }
      return true;
    } catch {
      toast.error("Réseau indisponible.");
      return false;
    } finally {
      setPending(false);
    }
  }

  async function handleConfirm() {
    if (!confirm("Confirmer cette réservation et envoyer l'e-mail au client ?")) return;
    const ok = await callAction({ action: "confirm" });
    if (ok) {
      toast.success("Réservation confirmée.");
      router.refresh();
    }
  }

  async function handleReject() {
    const ok = await callAction({
      action: "reject",
      message: rejectMessage.trim() || undefined,
    });
    if (ok) {
      setRejectOpen(false);
      setRejectMessage("");
      toast.success("Réservation refusée.");
      router.refresh();
    }
  }

  async function handleReschedule() {
    if (!chosenSlotId) return;
    const ok = await callAction({
      action: "reschedule",
      newSlotId: chosenSlotId,
    });
    if (ok) {
      setRescheduleOpen(false);
      setChosenSlotId("");
      toast.success("Créneau modifié, e-mail envoyé.");
      router.refresh();
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        "Supprimer définitivement cette réservation ? Cette action est irréversible."
      )
    )
      return;
    const ok = await callAction({ action: "delete" });
    if (ok) {
      toast.success("Réservation supprimée.");
      router.push("/admin/reservations");
    }
  }

  const canConfirm = currentStatus === "PENDING";
  const canReject = currentStatus === "PENDING" || currentStatus === "CONFIRMED";
  const canReschedule = currentStatus === "PENDING" || currentStatus === "CONFIRMED";

  return (
    <>
      <div className="rounded-2xl border border-border/60 bg-white p-4 flex flex-wrap gap-2">
        {canConfirm && (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-full bg-cherry-leaf px-5 py-2 text-sm font-medium text-white hover:bg-cherry-leaf/90 transition disabled:opacity-60"
          >
            <Check className="h-4 w-4" />
            Confirmer
          </button>
        )}

        {canReject && (
          <button
            type="button"
            onClick={() => setRejectOpen(true)}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 px-5 py-2 text-sm text-foreground/75 hover:border-destructive/40 hover:text-destructive transition disabled:opacity-60"
          >
            <X className="h-4 w-4" />
            Refuser
          </button>
        )}

        {canReschedule && (
          <button
            type="button"
            onClick={() => setRescheduleOpen(true)}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 px-5 py-2 text-sm text-foreground/75 hover:border-cherry-leaf/40 hover:text-cherry-leaf transition disabled:opacity-60"
          >
            <Calendar className="h-4 w-4" />
            Reprogrammer
          </button>
        )}

        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 px-5 py-2 text-sm text-foreground/65 hover:border-destructive/40 hover:text-destructive transition ml-auto disabled:opacity-60"
        >
          <Trash2 className="h-4 w-4" />
          Supprimer
        </button>
      </div>

      {/* Reject dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="bg-cream max-w-md">
          <DialogHeader>
            <DialogTitle>Refuser la demande</DialogTitle>
            <DialogDescription>
              Le créneau sera libéré et le client recevra un e-mail.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="reject-msg">Message au client (optionnel)</Label>
            <Textarea
              id="reject-msg"
              rows={4}
              value={rejectMessage}
              onChange={(e) => setRejectMessage(e.target.value)}
              placeholder="Ex. Je ne suis pas disponible ce jour-là, n'hésitez pas à reproposer un autre créneau."
            />
          </div>
          <DialogFooter className="gap-2">
            <button
              type="button"
              onClick={() => setRejectOpen(false)}
              className="rounded-md border border-border/60 px-4 py-2 text-sm"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={pending}
              className="rounded-full bg-destructive px-5 py-2 text-sm font-medium text-white hover:bg-destructive/90 transition disabled:opacity-60"
            >
              {pending ? "Envoi…" : "Refuser et notifier"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule dialog */}
      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent className="bg-cream max-w-md">
          <DialogHeader>
            <DialogTitle>Reprogrammer la réservation</DialogTitle>
            <DialogDescription>
              Choisissez un autre créneau libre. Le client sera prévenu par
              e-mail.
            </DialogDescription>
          </DialogHeader>

          {availableSlots.length === 0 ? (
            <p className="text-sm text-foreground/65 py-4 text-center">
              Aucun créneau libre disponible. Créez-en un dans le calendrier.
            </p>
          ) : (
            <div className="space-y-1.5">
              <Label htmlFor="reschedule-slot">Nouveau créneau</Label>
              <select
                id="reschedule-slot"
                value={chosenSlotId}
                onChange={(e) => setChosenSlotId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">— Sélectionner —</option>
                {availableSlots.map((s) => (
                  <option key={s.id} value={s.id}>
                    {formatDateTime(s.startAt)} ({formatTime(s.startAt)} –{" "}
                    {formatTime(s.endAt)})
                  </option>
                ))}
              </select>
            </div>
          )}

          <DialogFooter className="gap-2">
            <button
              type="button"
              onClick={() => setRescheduleOpen(false)}
              className="rounded-md border border-border/60 px-4 py-2 text-sm"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleReschedule}
              disabled={pending || !chosenSlotId}
              className="rounded-full bg-cherry-bloom px-5 py-2 text-sm font-medium text-white hover:bg-cherry-bloom/90 transition disabled:opacity-60"
            >
              {pending ? "Envoi…" : "Reprogrammer"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
