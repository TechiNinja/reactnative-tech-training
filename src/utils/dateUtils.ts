import { format, parseISO, isValid } from 'date-fns';

const toDate = (date: string | Date | null | undefined): Date | null => {
  if (!date) return null;
  if (date instanceof Date) return isValid(date) ? date : null;
  const parsed = parseISO(date);
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