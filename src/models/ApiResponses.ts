export interface MatchSetResponse {
  id: number;
  matchId: number;
  setNumber: number;
  scoreA: number;
  scoreB: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MatchResultResponse {
  id: number;
  winnerId?: number;
  createdAt: string;
}

export interface SetUpdateResponse {
  set: MatchSetResponse;
  result?: MatchResultResponse;
}

export interface FixtureResponse {
  id: number;
  roundNumber: number;
  matchNumber: number;
  bracketPosition: number;
  sideAId?: number;
  sideAName: string;
  sideBId?: number;
  sideBName: string;
  matchDateTime?: string; 
  matchVenue: string;
  status: string;
  isBye: boolean;
  totalSets: number;
  sets: MatchSetResponse[];
  result?: MatchResultResponse;
  createdAt: string;
}

export interface CategoryResponse {
  id: number;
  gender: string;
  format: string;
  status: string;
  eventId: number;
  eventName: string;
  tournamentType: string;
  maxParticipantsCount: number;
  createdAt: string;
  updatedAt?: string;
}