"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { StepSlot, type SlotChoice } from "./step-slot";
import { StepPersonal, type PersonalInfo } from "./step-personal";
import { StepService, type ServiceChoice } from "./step-service";
import { StepPhotos, type PhotoFiles } from "./step-photos";
import { StepConfirm } from "./step-confirm";

export type ServiceListItem = {
  id: string;
  category: string;
  name: string;
  priceCents: number;
  durationMinutes: number;
};

export type SlotListItem = {
  id: string;
  startAt: string;
  endAt: string;
};

const STEP_LABELS = ["Créneau", "Identité", "Prestation", "Photos", "Confirmation"];

export function BookingWizard({
  initialServices,
  initialSlots,
}: {
  initialServices: ServiceListItem[];
  initialSlots: SlotListItem[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [slot, setSlot] = useState<SlotChoice | null>(null);
  const [personal, setPersonal] = useState<PersonalInfo | null>(null);
  const [service, setService] = useState<ServiceChoice | null>(null);
  const [photos, setPhotos] = useState<PhotoFiles | null>(null);

  const selectedSlot = useMemo(
    () => initialSlots.find((s) => s.id === slot?.slotId) ?? null,
    [initialSlots, slot]
  );
  const selectedService = useMemo(
    () => initialServices.find((s) => s.id === service?.serviceId) ?? null,
    [initialServices, service]
  );

  const canGoNext =
    (step === 0 && !!slot) ||
    (step === 1 && !!personal) ||
    (step === 2 && !!service) ||
    (step === 3 && !!photos);

  function next() {
    if (canGoNext) setStep((s) => Math.min(s + 1, 4));
  }
  function prev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit(conditionsAccepted: boolean) {
    if (!slot || !personal || !service || !photos || !conditionsAccepted) {
      toast.error("Toutes les étapes doivent être remplies.");
      return;
    }
    setSubmitting(true);
    const fd = new FormData();
    fd.set("slotId", slot.slotId);
    fd.set("firstName", personal.firstName);
    fd.set("lastName", personal.lastName);
    fd.set("phone", personal.phone);
    fd.set("email", personal.email);
    fd.set("serviceId", service.serviceId);
    fd.set("needsRemoval", String(service.needsRemoval));
    fd.set("conditionsAccepted", "true");
    fd.set("photoInspiration", photos.inspiration);
    fd.set("photoCurrent", photos.current);

    const res = await fetch("/api/bookings", { method: "POST", body: fd });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Une erreur est survenue.");
      return;
    }
    router.push("/reservation/merci");
  }

  return (
    <div className="space-y-8">
      <Stepper current={step} />

      <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6 md:p-8 min-h-[400px]">
        {step === 0 && (
          <StepSlot slots={initialSlots} value={slot} onChange={setSlot} />
        )}
        {step === 1 && (
          <StepPersonal value={personal} onChange={setPersonal} />
        )}
        {step === 2 && (
          <StepService
            services={initialServices}
            value={service}
            onChange={setService}
          />
        )}
        {step === 3 && (
          <StepPhotos value={photos} onChange={setPhotos} />
        )}
        {step === 4 && selectedSlot && selectedService && personal && service && photos && (
          <StepConfirm
            slot={selectedSlot}
            service={selectedService}
            personal={personal}
            needsRemoval={service.needsRemoval}
            photos={photos}
            submitting={submitting}
            onSubmit={submit}
            onEdit={(idx) => setStep(idx)}
          />
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={prev}
          disabled={step === 0}
        >
          <ArrowLeft className="h-4 w-4" /> Précédent
        </Button>
        {step < 4 && (
          <Button
            type="button"
            variant="cta"
            disabled={!canGoNext}
            onClick={next}
          >
            Suivant <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="hidden md:flex items-center justify-between gap-2 text-xs">
      {STEP_LABELS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex items-center gap-2 flex-1">
            <span
              className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-xs font-medium border transition-colors shrink-0",
                done
                  ? "bg-cherry-leaf text-white border-cherry-leaf"
                  : active
                    ? "bg-cherry-bloom text-white border-cherry-bloom"
                    : "bg-white text-foreground/50 border-border"
              )}
            >
              {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </span>
            <span
              className={cn(
                "uppercase tracking-wider",
                active ? "text-cherry-bloom font-medium" : "text-foreground/50"
              )}
            >
              {label}
            </span>
            {i < STEP_LABELS.length - 1 && (
              <span
                className={cn(
                  "flex-1 h-px",
                  done ? "bg-cherry-leaf" : "bg-border"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
