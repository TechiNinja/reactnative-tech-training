import { useMemo } from 'react';
import { FixtureResponse } from '../../models/ApiResponses';

type UseFixtureManageCardVMProps = {
  fixture: FixtureResponse;
  isOrganizer: boolean;
};

const formatDateTimeIST = (dt: string | null | undefined): string | null => {
  if (!dt) return null;
  const date = new Date(dt);
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(date.getTime() + istOffset);
  const day = istDate.getUTCDate().toString().padStart(2, '0');
  const month = (istDate.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = istDate.getUTCFullYear();
  const hours = istDate.getUTCHours();
  const minutes = istDate.getUTCMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
  return `${day}/${month}/${year}, ${displayHours}:${minutes} ${ampm}`;
};

export const useFixtureManageCardVM = ({
  fixture,
  isOrganizer,
}: UseFixtureManageCardVMProps) => {
  const isLive      = fixture.status?.toUpperCase() === 'LIVE';
  const isCompleted = fixture.status?.toUpperCase() === 'COMPLETED';
  const isUpcoming  = fixture.status?.toUpperCase() === 'UPCOMING';
  const isBye       = fixture.isBye;

  const sideADisplay = !fixture.sideAName || fixture.sideAName === 'BYE' ? 'TBD' : fixture.sideAName;
  const sideBDisplay = !fixture.sideBName || fixture.sideBName === 'BYE' ? 'TBD' : fixture.sideBName;
  const isTBDMatch   = sideADisplay === 'TBD' || sideBDisplay === 'TBD';

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
    () => formatDateTimeIST(fixture.matchDateTime),
    [fixture.matchDateTime],
  );

  const viewBtnLabel = isLive
    ? 'Update Score →'
    : isCompleted
    ? 'View Result →'
    : 'Go Live →';

  const showActions    = isOrganizer && !isBye && !isTBDMatch;
  const showLiveWatch  = !isOrganizer && isLive;
  const showSchedule   = isUpcoming;
  const showDelete     = isUpcoming;

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