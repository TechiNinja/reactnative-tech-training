import { format, parseISO, isValid, addMilliseconds } from 'date-fns';

const toDate = (date: string | Date | null | undefined): Date | null => {
  if (!date) return null;
  if (date instanceof Date) return isValid(date) ? date : null;
  const parsed = parseISO(date as string);
  return isValid(parsed) ? parsed : null;
};

export const formatDisplayDate = (date: string | Date | null | undefined): string => {
  const d = toDate(date);
  if (!d) return '';
  return format(d, 'dd MMM yyyy');
};

export const formatDisplayDateTime = (date: string | Date | null | undefined): string => {
  const d = toDate(date);
  if (!d) return '';
  return format(d, 'dd/MM/yyyy, hh:mm aa');
};

export const safeParse = (str: string | null | undefined): Date | null => {
  if (!str) return null;
  const d = parseISO(str);
  return isValid(d) ? d : null;
};

export const toLocalISO = (d: Date): string =>
  format(d, "yyyy-MM-dd'T'HH:mm:ss");

export const shiftDateByDelta = (
  dateStr: string | null | undefined,
  deltaMs: number,
  fallback: Date,
): string => toLocalISO(addMilliseconds(safeParse(dateStr) ?? fallback, deltaMs));