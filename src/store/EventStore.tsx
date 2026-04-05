import React, { createContext, useContext, useState } from 'react';
import {
  Event,
  GenderType,
  FormatType,
  Fixture,
  MatchStatus,
} from '../models/Event';
import { MOCK_EVENTS } from '../constants/mockEvents';
import { generateBracket } from '../utils/fixtureUtils';

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

  createFixtures: (eventId: string) => void;
  updateFixtureScore: (
    eventId: string,
    fixtureId: string,
    scoreA: number,
    scoreB: number,
  ) => void;
  updateFixtureStatus: (
    eventId: string,
    fixtureId: string,
    status: MatchStatus,
  ) => void;
  completeFixture: (
    eventId: string,
    fixtureId: string,
    scoreA: number,
    scoreB: number,
  ) => void;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

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
      prev.map((event): Event => {  
        if (event.id !== eventId) return event;

        const newRegistrationId = `reg-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 9)}`;

        return {
          ...event,
          registrations: [
            ...event.registrations,
            {
              id: newRegistrationId,
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

  const updateFixtureStatus = (
    eventId: string,
    fixtureId: string,
    status: MatchStatus,
  ) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== eventId) return event;

        return {
          ...event,
          fixtures: event.fixtures.map((fixture) =>
            fixture.id === fixtureId ? { ...fixture, status } : fixture,
          ),
        };
      }),
    );
  };

  const completeFixture = (
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
          fixtures: event.fixtures.map((fixture) => {
            if (fixture.id !== fixtureId) return fixture;
            const winner =
              scoreA > scoreB
                ? fixture.teamA
                : scoreB > scoreA
                ? fixture.teamB
                : undefined;
            return {
              ...fixture,
              scoreA,
              scoreB,
              status: MatchStatus.COMPLETED,
              winner: winner ?? undefined,
            };
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

        for (const eventFormat of event.formats) {
          if (eventFormat === FormatType.Singles) {
            const males = event.registrations
              .filter(
                (player) =>
                  player.gender === GenderType.Male &&
                  player.formats.includes(FormatType.Singles),
              )
              .map((player) => player.name);

            const females = event.registrations
              .filter(
                (player) =>
                  player.gender === GenderType.Female &&
                  player.formats.includes(FormatType.Singles),
              )
              .map((player) => player.name);

            if (males.length >= 2) {
              fixtures = fixtures.concat(
                generateBracket(males, GenderType.Male, FormatType.Singles),
              );
            }

            if (females.length >= 2) {
              fixtures = fixtures.concat(
                generateBracket(females, GenderType.Female, FormatType.Singles),
              );
            }
          }

          if (eventFormat === FormatType.Doubles) {
            if (!event.teamsCreated) return event;

            const males = event.teams
              .filter(
                (team) =>
                  team.gender === GenderType.Male &&
                  team.format === FormatType.Doubles,
              )
              .map((team) => team.name);

            const females = event.teams
              .filter(
                (team) =>
                  team.gender === GenderType.Female &&
                  team.format === FormatType.Doubles,
              )
              .map((team) => team.name);

            if (males.length >= 2) {
              fixtures = fixtures.concat(
                generateBracket(males, GenderType.Male, FormatType.Doubles),
              );
            }

            if (females.length >= 2) {
              fixtures = fixtures.concat(
                generateBracket(females, GenderType.Female, FormatType.Doubles),
              );
            }
          }
        }

        if (!fixtures.length) return event;

        return {
          ...event,
          fixtures: fixtures,
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
        createFixtures,
        updateFixtureScore,
        updateFixtureStatus,
        completeFixture,
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