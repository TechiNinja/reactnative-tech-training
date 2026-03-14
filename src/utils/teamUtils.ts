import { Registration, Team, GenderType, FormatType } from '../models/Event';

export const generateTeams = (
  participants: Registration[],
  gender: GenderType,
  format: FormatType,
  existingTeamCount: number,
): Team[] => {
  const teams: Team[] = [];
  let teamIndex = existingTeamCount + 1;

  for (let index = 0; index + 1 < participants.length; index += 2) {
    const pair = participants.slice(index, index + 2);
    teams.push({
      id: `team-${Date.now()}-${teamIndex}`,
      name: `Team ${teamIndex}`,
      players: pair,
      gender,
      format,
    });
    teamIndex++;
  }

  return teams;
};
