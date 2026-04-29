"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addDays,
  addWeeks,
  format,
  isSameDay,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { fr } from "date-fns/locale";
import {
  CalendarDays,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { SlotCreateDialog } from "./slot-create-dialog";
import { SlotDetailDialog } from "./slot-detail-dialog";

export type CalendarSlot = {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  note: string | null;
  booking: {
    id: string;
    status: string;
    customerName: string;
    serviceName: string;
  } | null;
};

interface CalendarWeekProps {
  weekStartIso: string;
  initialSlots: CalendarSlot[];
}

const HOUR_START = 8;
const HOUR_END = 21;
const MINUTES_PER_ROW = 30;
const ROW_HEIGHT_PX = 28;
const TOTAL_ROWS = ((HOUR_END - HOUR_START) * 60) / MINUTES_PER_ROW;
const GRID_HEIGHT = TOTAL_ROWS * ROW_HEIGHT_PX;

export function CalendarWeek({ weekStartIso, initialSlots }: CalendarWeekProps) {
  const router = useRouter();
  const weekStart = useMemo(() => new Date(weekStartIso), [weekStartIso]);
  const [slots, setSlots] = useState<CalendarSlot[]>(initialSlots);

  const [createOpen, setCreateOpen] = useState(false);
  const [createDefaults, setCreateDefaults] = useState<{
    date: string;
    startTime: string;
  } | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailSlot, setDetailSlot] = useState<CalendarSlot | null>(null);

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  function navigate(delta: number) {
    const target =
      delta === 0
        ? startOfWeek(new Date(), { weekStartsOn: 1 })
        : delta > 0
        ? addWeeks(weekStart, delta)
        : subWeeks(weekStart, -delta);
    router.push(`/admin/calendrier?week=${format(target, "yyyy-MM-dd")}`);
  }

  function handleEmptyClick(day: Date, rowIndex: number) {
    const totalMinutes = HOUR_START * 60 + rowIndex * MINUTES_PER_ROW;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    setCreateDefaults({
      date: format(day, "yyyy-MM-dd"),
      startTime: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    });
    setCreateOpen(true);
  }

  function handleSlotClick(s: CalendarSlot) {
    setDetailSlot(s);
    setDetailOpen(true);
  }

  async function handleSlotCreated(newSlot: CalendarSlot) {
    setSlots((list) => [...list, newSlot].sort((a, b) => a.startAt.localeCompare(b.startAt)));
    setCreateOpen(false);
    toast.success("Créneau créé.");
    router.refresh();
  }

  async function handleSlotUpdated(updated: CalendarSlot) {
    setSlots((list) => list.map((s) => (s.id === updated.id ? updated : s)));
    toast.success("Créneau mis à jour.");
    router.refresh();
  }

  async function handleSlotDeleted(id: string) {
    setSlots((list) => list.filter((s) => s.id !== id));
    setDetailOpen(false);
    toast.success("Créneau supprimé.");
    router.refresh();
  }

  const today = new Date();
  const weekEnd = addDays(weekStart, 6);
  const heading =
    format(weekStart, "d MMM", { locale: fr }) +
    " — " +
    format(weekEnd, "d MMM yyyy", { locale: fr });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-md border border-border/60 p-2 text-foreground/70 hover:border-cherry-leaf/40 hover:text-cherry-leaf transition"
            aria-label="Semaine précédente"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => navigate(0)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-3 py-2 text-sm text-foreground/70 hover:border-cherry-leaf/40 hover:text-cherry-leaf transition"
          >
            <CalendarDays className="h-4 w-4" />
            Aujourd&apos;hui
          </button>
          <button
            type="button"
            onClick={() => navigate(1)}
            className="inline-flex items-center justify-center rounded-md border border-border/60 p-2 text-foreground/70 hover:border-cherry-leaf/40 hover:text-cherry-leaf transition"
            aria-label="Semaine suivante"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <span className="ml-2 font-serif text-lg text-cherry-leaf">
            {heading}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setCreateDefaults({
              date: format(today, "yyyy-MM-dd"),
              startTime: "10:00",
            });
            setCreateOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-cherry-bloom px-4 py-2 text-xs font-medium text-white uppercase tracking-wider hover:bg-cherry-bloom/90 transition"
        >
          <CalendarPlus className="h-4 w-4" />
          Nouveau créneau
        </button>
      </div>

      <div className="rounded-2xl border border-border/60 bg-white overflow-hidden">
        {/* Header jours */}
        <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] border-b border-border/60 bg-cream/60">
          <div />
          {days.map((d) => {
            const isToday = isSameDay(d, today);
            return (
              <div
                key={d.toISOString()}
                className={cn(
                  "px-2 py-3 text-center border-l border-border/60",
                  isToday && "bg-cherry-bloom/10"
                )}
              >
                <div className="text-[10px] uppercase tracking-wider text-foreground/55">
                  {format(d, "EEE", { locale: fr })}
                </div>
                <div
                  className={cn(
                    "font-serif text-lg",
                    isToday ? "text-cherry-bloom" : "text-cherry-leaf"
                  )}
                >
                  {format(d, "d")}
                </div>
              </div>
            );
          })}
        </div>

        {/* Grille horaire */}
        <div className="grid grid-cols-[60px_repeat(7,minmax(0,1fr))] overflow-x-auto">
          {/* Colonne heures */}
          <div className="relative" style={{ height: GRID_HEIGHT }}>
            {Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => (
              <div
                key={i}
                className="absolute right-2 -translate-y-1/2 text-[10px] text-foreground/50"
                style={{ top: i * 60 * (ROW_HEIGHT_PX / MINUTES_PER_ROW) }}
              >
                {HOUR_START + i}h
              </div>
            ))}
          </div>

          {/* Colonnes jours */}
          {days.map((d) => (
            <DayColumn
              key={d.toISOString()}
              day={d}
              slots={slots.filter((s) => isSameDay(new Date(s.startAt), d))}
              onEmptyClick={(rowIndex) => handleEmptyClick(d, rowIndex)}
              onSlotClick={handleSlotClick}
            />
          ))}
        </div>
      </div>

      <SlotCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaults={createDefaults}
        onCreated={handleSlotCreated}
      />

      <SlotDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        slot={detailSlot}
        onUpdated={handleSlotUpdated}
        onDeleted={handleSlotDeleted}
      />
    </div>
  );
}

function DayColumn({
  day,
  slots,
  onEmptyClick,
  onSlotClick,
}: {
  day: Date;
  slots: CalendarSlot[];
  onEmptyClick: (rowIndex: number) => void;
  onSlotClick: (s: CalendarSlot) => void;
}) {
  return (
    <div
      className="relative border-l border-border/60"
      style={{ height: GRID_HEIGHT }}
    >
      {/* Lignes horaires en background */}
      {Array.from({ length: TOTAL_ROWS }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onEmptyClick(i)}
          className={cn(
            "absolute inset-x-0 hover:bg-cherry-bloom/5 transition border-t border-dashed border-border/30",
            i % 2 === 0 ? "border-border/40 border-dashed" : "border-transparent"
          )}
          style={{ top: i * ROW_HEIGHT_PX, height: ROW_HEIGHT_PX }}
          aria-label={`Créer un créneau le ${format(day, "EEEE d", { locale: fr })}`}
        />
      ))}

      {/* Slots */}
      {slots.map((s) => {
        const start = new Date(s.startAt);
        const end = new Date(s.endAt);
        const startMinutes = start.getHours() * 60 + start.getMinutes();
        const endMinutes = end.getHours() * 60 + end.getMinutes();
        const top = ((startMinutes - HOUR_START * 60) / MINUTES_PER_ROW) * ROW_HEIGHT_PX;
        const height = ((endMinutes - startMinutes) / MINUTES_PER_ROW) * ROW_HEIGHT_PX;

        const isBooked = s.status === "BOOKED";
        const isBlocked = s.status === "BLOCKED";

        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSlotClick(s)}
            className={cn(
              "absolute inset-x-1 rounded-md px-2 py-1 text-left text-xs overflow-hidden transition shadow-sm",
              isBooked
                ? "bg-cherry-bloom/30 text-ink hover:bg-cherry-bloom/40 border border-cherry-bloom/40"
                : isBlocked
                ? "bg-foreground/10 text-foreground/60 hover:bg-foreground/15 border border-border/60 line-through"
                : "bg-cherry-leaf/15 text-cherry-leaf hover:bg-cherry-leaf/25 border border-cherry-leaf/30"
            )}
            style={{ top, height: Math.max(height, ROW_HEIGHT_PX - 2) }}
          >
            <div className="font-medium truncate">
              {format(start, "HH:mm")}–{format(end, "HH:mm")}
            </div>
            {isBooked && s.booking && (
              <div className="truncate text-[11px] mt-0.5">
                {s.booking.customerName}
              </div>
            )}
            {isBlocked && <div className="text-[11px] mt-0.5">Bloqué</div>}
          </button>
        );
      })}
    </div>
  );
}
