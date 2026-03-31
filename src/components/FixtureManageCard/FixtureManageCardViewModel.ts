import { useState, useMemo } from 'react';
import { Fixture, MatchStatus } from '../../models/Event';

type UseFixtureManageCardVMProps = {
  fixture: Fixture;
  onSetLive?: () => void;
  onUpdateScore?: (scoreA: number, scoreB: number) => void;
  onComplete?: (scoreA: number, scoreB: number) => void;
};

export const useFixtureManageCardViewModel = ({
  fixture,
  onSetLive,
  onUpdateScore,
  onComplete,
}: UseFixtureManageCardVMProps) => {
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [tempScoreA, setTempScoreA] = useState(fixture.scoreA);
  const [tempScoreB, setTempScoreB] = useState(fixture.scoreB);

  const isLive = fixture.status === MatchStatus.LIVE;
  const isUpcoming = fixture.status === MatchStatus.UPCOMING;
  const isCompleted = fixture.status === MatchStatus.COMPLETED;

  const isTBD = fixture.teamA === 'TBD' || fixture.teamB === 'TBD';

  const handleOpenScoreModal = () => {
    setTempScoreA(fixture.scoreA);
    setTempScoreB(fixture.scoreB);
    setShowScoreModal(true);
  };

  const handleSaveScore = () => {
    onUpdateScore?.(tempScoreA, tempScoreB);
    setShowScoreModal(false);
  };

  const handleCompleteMatch = () => {
    onComplete?.(tempScoreA, tempScoreB);
    setShowScoreModal(false);
  };

  const incrementScore = (team: 'A' | 'B') => {
    if (team === 'A') {
      setTempScoreA((prev) => prev + 1);
    } else {
      setTempScoreB((prev) => prev + 1);
    }
  };

  const decrementScore = (team: 'A' | 'B') => {
    if (team === 'A') {
      setTempScoreA((prev) => Math.max(0, prev - 1));
    } else {
      setTempScoreB((prev) => Math.max(0, prev - 1));
    }
  };

  const canComplete = useMemo(
    () => tempScoreA !== tempScoreB,
    [tempScoreA, tempScoreB],
  );

  return {
    showScoreModal,
    setShowScoreModal,
    tempScoreA,
    tempScoreB,

    isLive,
    isUpcoming,
    isCompleted,
    isTBD,
    canComplete,

    handleOpenScoreModal,
    handleSaveScore,
    handleCompleteMatch,
    incrementScore,
    decrementScore,
    onSetLive,
  };
};
