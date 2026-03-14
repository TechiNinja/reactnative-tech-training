export enum RequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  WITHDRAWN = 'Withdrawn',
}

export enum GenderType {
  Male = 'Male',
  Female = 'Female',
  Mixed = 'Mixed',
  Both = 'Both',
}

export enum MatchFormat {
  Singles = 'Singles',
  Doubles = 'Doubles',
  Both = 'Both',
}

export type EventRequestResponse = {
  id: number;
  eventName: string;
  sportId: number;
  sportsName: string;
  gender: GenderType;
  format: MatchFormat;
  requestedVenue: string;
  logisticsRequirements: string;
  startDate: string;
  endDate: string;
  status: RequestStatus;
  remarks: string;
  adminId: number;
  adminName: string;
  operationsReviewerName?: string;
  operationsReviewerId?: number;
  createdDate: string;
  updatedDate?: string;
};

export type CreateEventRequest = {
  eventName: string;
  sportId: number;
  requestedVenue: string;
  logisticsRequirements: string;
  format: MatchFormat;
  gender: GenderType;
  startDate: string;
  endDate: string;
};

export type EditEventRequest = {
  eventName: string;
  requestedVenue: string;
  logisticsRequirements: string;
  format: MatchFormat;
  gender: GenderType;
  startDate: string;
  endDate: string;
};

export type DecideEventRequest = {
  remarks: string;
};

export type EventRequestFilter = {
  id?: number;
  status?: RequestStatus;
  adminId?: number;
};

export type Sport = {
  id: number;
  name: string;
  allowedFormats: MatchFormat[];
};