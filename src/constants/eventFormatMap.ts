import { FormatType } from '../models/Event';

export const EVENT_FORMAT_MAP: Record<string, FormatType> = {
  '1v1': FormatType.Singles,
  '2v2': FormatType.Doubles,
};

export const EVENT_FORMAT_REVERSE_MAP: Record<FormatType, '1v1' | '2v2'> = {
  [FormatType.Singles]: '1v1',
  [FormatType.Doubles]: '2v2',
};
