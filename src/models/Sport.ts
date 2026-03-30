import { FormatType } from "./Event";

export type CreateSportRequest = {
  name: string;
  allowedFormats: FormatType[];
};

export type SportResponse = {
  id: number;
  name: string;
  allowedFormats: FormatType[];
};