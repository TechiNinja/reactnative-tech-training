export enum EventStatus {
  OPEN = 'OPEN',
  UPCOMING = 'UPCOMING',
  LIVE = 'LIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}


export enum CategoryStatus {
  ACTIVE = 'ACTIVE',
  ABANDONED = 'ABANDONED',
}

export enum GenderType {
  Male = 'Male',
  Female = 'Female',
  Mixed = 'Mixed',
}

export enum FormatType {
  Singles = 'Singles',
  Doubles = 'Doubles',
}

export enum MatchStatus {
  UPCOMING = 'UPCOMING',
  LIVE = 'LIVE',
  COMPLETED = 'COMPLETED',
}

export enum UpcomingMatchStatus {
  UPCOMING = 'UPCOMING',
  REGISTRATION_OPEN = 'REGISTRATION_OPEN',
}

export enum FixtureTabType {
  ALL = 'ALL',
  LIVE = 'LIVE',
  UPCOMING = 'UPCOMING',
  COMPLETED = 'COMPLETED',
}

export enum EventStatusTab {
  ALL = 'ALL',
  LIVE = 'LIVE',
  UPCOMING = 'UPCOMING',
  OPEN = 'OPEN',
}

export interface Registration {
  id: string;
  name: string;
  gender: GenderType;
  formats: FormatType[];
}

export interface Team {
  id: string;
  name: string;
  players: Registration[];
  gender: GenderType;
  format: FormatType;
}

export interface Fixture {
  id: string;
  teamA: string | null;
  teamB: string | null;
  scoreA: number;
  scoreB: number;
  time: string;
  round: number;
  totalRounds: number;
  status: MatchStatus;
  winner?: string;
  gender: GenderType;
  format: FormatType;
  bracketPosition: number;
}

export interface Event {
  id: string;
  name: string;
  sport: string;
  date: string;
  time: string;
  venue: string;

  status: EventStatus;
  format: FormatType[];
  // formats: [FormatType.Singles | FormatType.Doubles];

  registeredTeams: number;
  totalTeams: number;

  registrationDeadline: string;
  registrations: Registration[];

  teamsCreated: boolean;
  fixturesCreated: boolean;

  teams: Team[];
  fixtures: Fixture[];

  description: string;
  rules: string[];
  prizes: string[];

  createdBy?: string;

  abandonedCategories?: string[];
}

