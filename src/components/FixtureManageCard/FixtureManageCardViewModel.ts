import { useMemo } from 'react';
import { FixtureResponse } from '../../models/ApiResponses';
import { APP_STRINGS } from '../../constants/AppStrings';

type UseFixtureManageCardVMProps = {
  fixture: FixtureResponse;
  isOrganizer: boolean;
};

const MatchStatus = {
  LIVE:      'LIVE',
  COMPLETED: 'COMPLETED',
  UPCOMING:  'UPCOMING',
} as const;

const SideName = {
  BYE: 'BYE',
  TBD: APP_STRINGS.fixtureScreen.tbd,
} as const;

const formatDateTimeLocal = (dt: string | null | undefined): string | null => {
  if (!dt) return null;
  return new Date(dt).toLocaleString(undefined, {
    day:    '2-digit',
    month:  '2-digit',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const useFixtureManageCardVM = ({
  fixture,
  isOrganizer,
}: UseFixtureManageCardVMProps) => {
  const isLive      = fixture.status?.toUpperCase() === MatchStatus.LIVE;
  const isCompleted = fixture.status?.toUpperCase() === MatchStatus.COMPLETED;
  const isUpcoming  = fixture.status?.toUpperCase() === MatchStatus.UPCOMING;
  const isBye       = fixture.isBye;

  const sideADisplay = !fixture.sideAName || fixture.sideAName === SideName.BYE
    ? SideName.TBD
    : fixture.sideAName;
  const sideBDisplay = !fixture.sideBName || fixture.sideBName === SideName.BYE
    ? SideName.TBD
    : fixture.sideBName;
  const isTBDMatch = sideADisplay === SideName.TBD || sideBDisplay === SideName.TBD;

  const totalScoreA = useMemo(
    () => fixture.sets?.reduce((sum, s) => sum + (s.scoreA > s.scoreB ? 1 : 0), 0) ?? 0,
    [fixture.sets],
  );

  const totalScoreB = useMemo(
    () => fixture.sets?.reduce((sum, s) => sum + (s.scoreB > s.scoreA ? 1 : 0), 0) ?? 0,
    [fixture.sets],
  );

  const winnerName = useMemo(() => {
    if (!isCompleted || !fixture.result) return null;
    return fixture.result.winnerId === fixture.sideAId
      ? fixture.sideAName
      : fixture.sideBName;
  }, [isCompleted, fixture.result, fixture.sideAId, fixture.sideAName, fixture.sideBName]);

  const displayDateTime = useMemo(
    () => formatDateTimeLocal(fixture.matchDateTime),
    [fixture.matchDateTime],
  );

  const viewBtnLabel = isLive
    ? APP_STRINGS.matchScreen.updateScore
    : isCompleted
    ? APP_STRINGS.matchScreen.viewResult
    : APP_STRINGS.matchScreen.goLive;

  const showActions   = isOrganizer && !isBye && !isTBDMatch;
  const showLiveWatch = !isOrganizer && isLive;
  const showSchedule  = isUpcoming;
  const showDelete    = isUpcoming;

  const teams = [
    { name: sideADisplay, score: totalScoreA, index: 0 },
    { name: sideBDisplay, score: totalScoreB, index: 1 },
  ];

  return {
    isLive,
    isCompleted,
    isUpcoming,
    isBye,
    isTBDMatch,
    sideADisplay,
    sideBDisplay,
    totalScoreA,
    totalScoreB,
    winnerName,
    displayDateTime,
    viewBtnLabel,
    showActions,
    showLiveWatch,
    showSchedule,
    showDelete,
    teams,
  };
};