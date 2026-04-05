import { useMemo, useState } from 'react';
import { mockTeams } from '../constants/MockTeams';
import { Team } from '../models/Team';
import { SportTabType } from '../components/TeamStatusTabs/TeamStatusTabs';

export const useTeamsListViewModel = () => {
  const [activeTab, setActiveTab] = useState<SportTabType>('ALL');

  const filteredTeams = useMemo(() => {
    if (activeTab === 'ALL') return mockTeams;
    return mockTeams.filter((team) => team.sport === activeTab);
  }, [activeTab]);

  const getWinRate = (team: Team) => {
    const totalMatches = team.wins + team.losses;
    return totalMatches === 0
      ? '0%'
      : `${Math.round((team.wins / totalMatches) * 100)}%`;
  };

  return {
    activeTab,
    setActiveTab,
    teams: filteredTeams,
    getWinRate,
  };
};
