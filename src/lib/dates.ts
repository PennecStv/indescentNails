import { format, formatRelative, isToday, isTomorrow, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export function formatDateLong(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "EEEE d MMMM yyyy", { locale: fr });
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "dd/MM/yyyy", { locale: fr });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "HH'h'mm", { locale: fr });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return `${formatDateLong(d)} à ${formatTime(d)}`;
}

export function formatRelativeFr(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  if (isToday(d)) return `Aujourd'hui à ${formatTime(d)}`;
  if (isTomorrow(d)) return `Demain à ${formatTime(d)}`;
  return formatRelative(d, new Date(), { locale: fr });
}

export function formatDayHeading(date: Date | string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "EEEE d MMMM", { locale: fr });
}
