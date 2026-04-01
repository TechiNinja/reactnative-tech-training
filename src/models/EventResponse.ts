export type EventCategoryResponse = {
  id: number;
  gender: string;
  format: string;
  status: string;
  createdAt: string;
};

export type EventResponse = {
  id: number;
  name: string;
  sportName: string;
  startDate: string;
  endDate: string;
  eventVenue: string;
  registrationDeadline: string;
  maxParticipantsCount: number;
  tournamentType: string;
  organizerName?: string;
  status: string;
  description: string;
  categories: EventCategoryResponse[];
  createdAt: string;
  updatedAt?: string;
};