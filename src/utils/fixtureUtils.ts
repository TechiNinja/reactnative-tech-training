import { Fixture, FormatType, GenderType, MatchStatus } from '../models/Event';

export const generateFixtureId = () =>
  `fix-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const nextPowerOfTwo = (n: number) =>
  Math.pow(2, Math.ceil(Math.log2(n)));

export const generateBracket = (
  names: string[],
  gender: GenderType,
  format: FormatType,
): Fixture[] => {
  const generatedFixtures: Fixture[] = [];
  const teamList = [...names].sort(() => Math.random() - 0.5);
  const targetSize = nextPowerOfTwo(teamList.length);
  const totalRounds = Math.ceil(Math.log2(targetSize));

  let bracketPosition = 0;
  const round1MatchCount = targetSize / 2;

  for (let index = 0; index < round1MatchCount; index++) {
    const teamAIndex = index * 2;
    const teamBIndex = index * 2 + 1;

    const teamA = teamAIndex < teamList.length ? teamList[teamAIndex] : 'BYE';
    const teamB = teamBIndex < teamList.length ? teamList[teamBIndex] : 'BYE';

    if (teamA === 'BYE' && teamB === 'BYE') {
      bracketPosition++;
      continue;
    }

    generatedFixtures.push({
      id: generateFixtureId(),
      teamA,
      teamB,
      scoreA: 0,
      scoreB: 0,
      round: 1,
      totalRounds,
      time: new Date().toISOString(),
      status:
        teamA === 'BYE' || teamB === 'BYE'
          ? MatchStatus.COMPLETED
          : MatchStatus.UPCOMING,
      winner: teamA === 'BYE' ? teamB : teamB === 'BYE' ? teamA : undefined,
      gender,
      format,
      bracketPosition: bracketPosition++,
    });
  }

  for (let round = 2; round <= totalRounds; round++) {
    const matchesInRound = targetSize / Math.pow(2, round);
    for (let index = 0; index < matchesInRound; index++) {
      const prevMatch1 = generatedFixtures.find(
        (fixture) =>
          fixture.round === round - 1 && fixture.bracketPosition === index * 2,
      );
      const prevMatch2 = generatedFixtures.find(
        (fixture) =>
          fixture.round === round - 1 &&
          fixture.bracketPosition === index * 2 + 1,
      );

      const teamA =
        prevMatch1?.status === MatchStatus.COMPLETED && prevMatch1.winner
          ? prevMatch1.winner
          : 'TBD';
      const teamB =
        prevMatch2?.status === MatchStatus.COMPLETED && prevMatch2.winner
          ? prevMatch2.winner
          : 'TBD';

      generatedFixtures.push({
        id: generateFixtureId(),
        teamA,
        teamB,
        scoreA: 0,
        scoreB: 0,
        round,
        totalRounds,
        time: new Date().toISOString(),
        status: MatchStatus.UPCOMING,
        gender,
        format,
        bracketPosition: index,
      });
    }
  }

  return generatedFixtures;
};
