import { format, parseISO, isValid, addMilliseconds } from 'date-fns';

export const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

export const daysInMonth = (month: number, year: number) =>
  new Date(year, month + 1, 0).getDate();

export const safeParse = (str: string | null | undefined): Date | null => {
  if (!str) return null;
  const d = parseISO(str);
  return isValid(d) ? d : null;
};

export const toLocalISO = (d: Date): string =>
  format(d, "yyyy-MM-dd'T'HH:mm:ss");

export const formatDisplayDate = (date: string | Date | null | undefined): string => {
  const d = date instanceof Date ? date : safeParse(date as string);
  return d ? format(d, 'dd MMM yyyy') : '';
};

export const formatDisplayDateTime = (date: string | Date | null | undefined): string => {
  const d = date instanceof Date ? date : safeParse(date as string);
  return d ? format(d, 'dd/MM/yyyy, hh:mm aa') : '';
};

export const to24Hour = (hour12: number, amPm: 'AM' | 'PM'): number => {
  if (amPm === 'AM') return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
};

export const to12Hour = (hour24: number): { hour12: number; amPm: 'AM' | 'PM' } => ({
  amPm: hour24 < 12 ? 'AM' : 'PM',
  hour12: hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24,
});

export const prefillDateFields = (d: Date) => ({
  day: d.getDate(),
  month: d.getMonth(),
  year: d.getFullYear(),
  minute: d.getMinutes(),
  ...to12Hour(d.getHours()),
});

export const shiftDateByDelta = (
  dateStr: string | null | undefined,
  deltaMs: number,
  fallback: Date,
): string => toLocalISO(addMilliseconds(safeParse(dateStr) ?? fallback, deltaMs));