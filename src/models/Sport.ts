export type SportFormat = 'Singles' | 'Doubles' | 'Both';

export type CreateSportRequest = {
  name: string;
  allowedFormats: SportFormat[];
};

export type SportResponse = {
  id: number;
  name: string;
  allowedFormats: SportFormat[];
};