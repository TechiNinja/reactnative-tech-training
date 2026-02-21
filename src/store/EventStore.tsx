import React, { createContext, useContext, useState } from 'react';
import { Event, GenderType, FormatType, Fixture } from '../models/Event';
import { MOCK_EVENTS } from '../constants/mockEvents';

type EventContextType = {
  events: Event[];
  createEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;

  registerParticipant: (
    eventId: string,
    name: string,
    gender: GenderType,
    formats: FormatType[],
  ) => void;

  createTeams: (eventId: string) => void;
  createFixtures: (eventId: string) => void;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

const generateFixtureId = () =>
  `fix-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const nextPowerOfTwo = (n: number) => Math.pow(2, Math.ceil(Math.log2(n)));

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);

  const createEvent = (event: Event) => {
    setEvents((prev) => [...prev, event]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    );
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  const registerParticipant = (
    eventId: string,
    name: string,
    gender: GenderType,
    formats: FormatType[],
  ) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== eventId) return event;

        return {
          ...event,
          registrations: [
            ...event.registrations,
            {
              id: Date.now().toString(),
              name,
              gender,
              formats,
            },
          ],
          registeredTeams: event.registeredTeams + 1,
        };
      }),
    );
  };

  const createTeams = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== eventId) return event;

        const teams: Team[] = [];
        let teamIndex = 1;

        const buildTeams = (players: Registration[]) => {
          for (let index = 0; index + 1 < players.length; index += 2) {
            if (teams.length >= event.totalTeams) break;

            teams.push({
              id: teamIndex.toString(),
              name: `Team ${teamIndex}`,
              players: players.slice(index, index + 2),
              gender: players[index].gender,
            });

            teamIndex++;
          }
        };
      }),
    );
  };

  const updateFixtureScore = (
    eventId: string,
    fixtureId: string,
    scoreA: number,
    scoreB: number,
  ) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== eventId) return event;

        return {
          ...event,
          fixtures: event.fixtures.map((fixture) =>
            fixture.id === fixtureId ? { ...fixture, scoreA, scoreB } : fixture,
          ),
        };
      }),
    );
  };

  const generateBracket = (names: string[]): Fixture[] => {
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    const fixtures: Fixture[] = [];

    const targetSize = nextPowerOfTwo(shuffled.length);
    const byes = targetSize - shuffled.length;

    const players: (string | null)[] = [...shuffled];

    for (let index = 0; index < byes; index++) {
      players.push(null);
    }

    let round = 1;
    let current = players;

    while (current.length > 1) {
      const nextRound: (string | null)[] = [];

      for (let index = 0; index < current.length; index += 2) {
        const a = current[index];
        const b = current[index + 1];

        if (a && !b) {
          nextRound.push(a);
          continue;
        }
        if (!a && b) {
          nextRound.push(b);
          continue;
        }
        if (!a && !b) continue;

        fixtures.push({
          id: generateFixtureId(),
          teamA: a,
          teamB: b,
          scoreA: 0,
          scoreB: 0,
          round,
          time: new Date().toISOString(),
          status: 'UPCOMING',
        });

        nextRound.push(null);
      }

      current = nextRound;
      round++;
    }

    return fixtures;
  };

  const createFixtures = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== eventId) return event;

        let fixtures: Fixture[] = [];

        if (event.format === '1v1') {
          const males = event.registrations
            .filter((player) => player.gender === 'Male')
            .map((player) => player.name);

          const females = event.registrations
            .filter((player) => player.gender === 'Female')
            .map((player) => player.name);

          if (males.length >= 2) {
            fixtures = fixtures.concat(generateBracket(males));
          }

          if (females.length >= 2) {
            fixtures = fixtures.concat(generateBracket(females));
          }
        } else {
          if (!event.teamsCreated) return event;

          const males = event.teams
            .filter((team) => team.gender === 'Male')
            .map((team) => team.name);

          const females = event.teams
            .filter((team) => team.gender === 'Female')
            .map((team) => team.name);

          if (males.length >= 2) {
            fixtures = fixtures.concat(generateBracket(males));
          }

          if (females.length >= 2) {
            fixtures = fixtures.concat(generateBracket(females));
          }
        }

        if (!fixtures.length) return event;

        return {
          ...event,
          fixtures: updatedFixtures,
        };
      }),
    );
  };

  return (
    <EventContext.Provider
      value={{
        events,
        createEvent,
        updateEvent,
        deleteEvent,
        registerParticipant,
        createTeams,
        createFixtures,
      }}
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
