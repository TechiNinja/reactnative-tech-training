import React, { createContext, useContext, useState } from 'react';
import {
  Event,
  GenderType,
  FormatType,
  Fixture,
  Registration,
  Team,
  MatchStatus,
} from '../models/Event';
import { MOCK_EVENTS } from '../constants/mockEvents';
import { generateBracket } from '../utils/fixtureUtils';

type EventContextType = {
  events: Event[];
  createEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
  registerParticipant: (eventId: string, name: string, gender: GenderType, formats: FormatType[]) => void;
  createTeams: (eventId: string) => void;
  createFixtures: (eventId: string) => void;
  updateFixtureScore: (eventId: string, fixtureId: string, scoreA: number, scoreB: number) => void;
  updateFixtureStatus: (eventId: string, fixtureId: string, status: MatchStatus) => void;
  completeFixture: (eventId: string, fixtureId: string, scoreA: number, scoreB: number) => void;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);

  const createEvent = (event: Event) => setEvents((prev) => [...prev, event]);

  const updateEvent = (updatedEvent: Event) =>
    setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));

  const deleteEvent = (eventId: string) =>
    setEvents((prev) => prev.filter((e) => e.id !== eventId));

  const registerParticipant = (eventId: string, name: string, gender: GenderType, formats: FormatType[]) => {
    setEvents((prev) =>
      prev.map((event): Event => {
        if (event.id !== eventId) return event;
        const newRegistrationId = `reg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        return {
          ...event,
          registrations: [...event.registrations, { id: newRegistrationId, name, gender, formats }],
          registeredTeams: event.registeredTeams + 1,
        };
      }),
    );
  };

  const createTeams = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event): Event => {
        if (event.id !== eventId) return event;
        const teams: Team[] = [];
        let teamIndex = 1;
        const teamFormat = event.format[0]; 
        const buildTeams = (players: Registration[]) => {
          for (let index = 0; index + 1 < players.length; index += 2) {
            if (teams.length >= event.totalTeams) break;
            teams.push({
              id: teamIndex.toString(),
              name: `Team ${teamIndex}`,
              players: players.slice(index, index + 2),
              gender: players[index].gender,
              format: teamFormat,
            });
            teamIndex++;
          }
        };
        buildTeams(event.registrations);
        return { ...event, teams, teamsCreated: true };
      }),
    );
  };

  const updateFixtureScore = (eventId: string, fixtureId: string, scoreA: number, scoreB: number) => {
    setEvents((prev) =>
      prev.map((event): Event => {
        if (event.id !== eventId) return event;
        return {
          ...event,
          fixtures: event.fixtures.map((f): Fixture =>
            f.id === fixtureId ? { ...f, scoreA, scoreB } : f,
          ),
        };
      }),
    );
  };

  const updateFixtureStatus = (eventId: string, fixtureId: string, status: MatchStatus) => {
    setEvents((prev) =>
      prev.map((event): Event => {
        if (event.id !== eventId) return event;
        return {
          ...event,
          fixtures: event.fixtures.map((f): Fixture =>
            f.id === fixtureId ? { ...f, status } : f,
          ),
        };
      }),
    );
  };

  const completeFixture = (eventId: string, fixtureId: string, scoreA: number, scoreB: number) => {
  setEvents((prev) =>
    prev.map((event): Event => {
      if (event.id !== eventId) return event;
      return {
        ...event,
        fixtures: event.fixtures.map((fixture): Fixture => {
          if (fixture.id !== fixtureId) return fixture;
          const winner: string | undefined =
            scoreA > scoreB ? fixture.teamA ?? undefined : scoreB > scoreA ? fixture.teamB ?? undefined : undefined;
          return { ...fixture, scoreA, scoreB, status: MatchStatus.COMPLETED, winner };
        }),
      };
    }),
  );
};

  const createFixtures = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event): Event => {
        if (event.id !== eventId) return event;
        let fixtures: Fixture[] = [];

        for (const eventFormat of event.format) {
          if (eventFormat === FormatType.Singles) {
            const males = event.registrations
              .filter((p) => p.gender === GenderType.Male && p.formats.includes(FormatType.Singles))
              .map((p) => p.name);
            const females = event.registrations
              .filter((p) => p.gender === GenderType.Female && p.formats.includes(FormatType.Singles))
              .map((p) => p.name);

            if (males.length >= 2) fixtures = fixtures.concat(generateBracket(males, GenderType.Male, FormatType.Singles));
            if (females.length >= 2) fixtures = fixtures.concat(generateBracket(females, GenderType.Female, FormatType.Singles));
          }

          if (eventFormat === FormatType.Doubles) {
            if (!event.teamsCreated) return event;
            const males = event.teams
              .filter((t) => t.gender === GenderType.Male && t.format === FormatType.Doubles)
              .map((t) => t.name);
            const females = event.teams
              .filter((t) => t.gender === GenderType.Female && t.format === FormatType.Doubles)
              .map((t) => t.name);

            if (males.length >= 2) fixtures = fixtures.concat(generateBracket(males, GenderType.Male, FormatType.Doubles));
            if (females.length >= 2) fixtures = fixtures.concat(generateBracket(females, GenderType.Female, FormatType.Doubles));
          }
        }

        if (!fixtures.length) return event;
        return { ...event, fixtures };
      }),
    );
  };

  return (
    <EventContext.Provider
      value={{ events, createEvent, updateEvent, deleteEvent, registerParticipant, createTeams, createFixtures, updateFixtureScore, updateFixtureStatus, completeFixture }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventStore = () => {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error('useEventStore must be used inside EventProvider');
  return ctx;
};