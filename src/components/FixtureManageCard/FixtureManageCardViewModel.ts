import { useMemo } from 'react';
import { FixtureResponse } from '../../models/ApiResponses';
import { APP_STRINGS } from '../../constants/appStrings';
import { formatDisplayDateTime } from '../../utils/dateUtils';

type FixtureManageCardVMProps = {
  fixture: FixtureResponse;
  isOrganizer: boolean;
};

const MatchStatus = {
  LIVE: 'LIVE',
  COMPLETED: 'COMPLETED',
  UPCOMING: 'UPCOMING',
} as const;

const SideName = {
  BYE: 'BYE',
  TBD: APP_STRINGS.fixtureScreen.tbd,
} as const;

export const useFixtureManageCardViewModel = ({
  fixture,
  isOrganizer,
}: FixtureManageCardVMProps) => {
  const isLive = fixture.status?.toUpperCase() === MatchStatus.LIVE;
  const isCompleted = fixture.status?.toUpperCase() === MatchStatus.COMPLETED;
  const isUpcoming = fixture.status?.toUpperCase() === MatchStatus.UPCOMING;
  const isBye = fixture.isBye;

  const sideADisplay = !fixture.sideAName || fixture.sideAName === SideName.BYE
    ? SideName.TBD
    : fixture.sideAName;
  const sideBDisplay = !fixture.sideBName || fixture.sideBName === SideName.BYE
    ? SideName.TBD
    : fixture.sideBName;

  const isTBDMatch = sideADisplay === SideName.TBD || sideBDisplay === SideName.TBD;

  const liveSet = useMemo(
    () => fixture.sets?.find((s) => s.status?.toLowerCase() === 'live') ?? null,
    [fixture.sets],
  );

  const scoreA = useMemo(() => {
    if (isLive) {
      if (liveSet) return liveSet.scoreA;
      return fixture.sets?.find((s) => s.status?.toLowerCase() === 'live')?.scoreA ?? 0;
    }
    if (isCompleted) {
      return fixture.sets?.reduce((sum, s) => sum + (s.scoreA > s.scoreB ? 1 : 0), 0) ?? 0;
    }
    return 0;
  }, [isLive, isCompleted, liveSet, fixture.sets]);

  const scoreB = useMemo(() => {
    if (isLive) {
      if (liveSet) return liveSet.scoreB;
      return fixture.sets?.find((s) => s.status?.toLowerCase() === 'live')?.scoreB ?? 0;
    }
    if (isCompleted) {
      return fixture.sets?.reduce((sum, s) => sum + (s.scoreB > s.scoreA ? 1 : 0), 0) ?? 0;
    }
    return 0;
  }, [isLive, isCompleted, liveSet, fixture.sets]);

  const winnerName = useMemo(() => {
    if (!isCompleted || !fixture.result) return null;
    return fixture.result.winnerId === fixture.sideAId
      ? fixture.sideAName
      : fixture.sideBName;
  }, [isCompleted, fixture.result, fixture.sideAId, fixture.sideAName, fixture.sideBName]);

  const displayDateTime = useMemo(
    () => formatDisplayDateTime(fixture.matchDateTime) || null,
    [fixture.matchDateTime],
  );

  const viewBtnLabel = isLive
    ? APP_STRINGS.matchScreen.updateScore
    : isCompleted
    ? APP_STRINGS.matchScreen.viewResult
    : APP_STRINGS.matchScreen.goLive;

  const participantBtnLabel = isLive
    ? APP_STRINGS.matchScreen.tapToWatchLive
    : APP_STRINGS.matchScreen.viewScore;

  const showActions = isOrganizer && !isBye;
  const showLiveWatch = !isOrganizer && isLive && !isBye;
  const showViewResult = !isOrganizer && isCompleted && !isBye;
  const showSchedule = false;

  const teams = [
    { name: sideADisplay, score: scoreA, index: 0 },
    { name: sideBDisplay, score: scoreB, index: 1 },
  ];

  return {
    isLive,
    isCompleted,
    isUpcoming,
    isBye,
    isTBDMatch,
    sideADisplay,
    sideBDisplay,
    totalScoreA: scoreA,
    totalScoreB: scoreB,
    winnerName,
    displayDateTime,
    viewBtnLabel,
    participantBtnLabel,
    showActions,
    showLiveWatch,
    showViewResult,
    showSchedule,
    teams,
  };
};