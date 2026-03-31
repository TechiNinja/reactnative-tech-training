import React from 'react';
import { Text, View, Pressable, Modal } from 'react-native';
import {
  User,
  Users,
  Play,
  CheckCircle,
  Minus,
  Plus,
  X,
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { styles } from './FixtureManageCardStyles';
import { Fixture, FormatType } from '../../models/Event';
import { APP_STRINGS } from '../../constants/appStrings';
import { useFixtureManageCardViewModel } from './FixtureManageCardViewModel';

type FixtureManageCardProps = {
  fixture: Fixture;
  roundName: string;
  isOrganizer: boolean;
  onSetLive?: () => void;
  onUpdateScore?: (scoreA: number, scoreB: number) => void;
  onComplete?: (scoreA: number, scoreB: number) => void;
};

const FixtureManageCard = ({
  fixture,
  roundName,
  isOrganizer,
  onSetLive,
  onUpdateScore,
  onComplete,
}: FixtureManageCardProps) => {
  const viewModel = useFixtureManageCardViewModel({
    fixture,
    onSetLive,
    onUpdateScore,
    onComplete,
  });

  const TeamIcon = fixture.format === FormatType.Doubles ? Users : User;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.roundName}>{roundName}</Text>
        <View
          style={[
            styles.statusBadge,
            viewModel.isLive && styles.statusLive,
            viewModel.isUpcoming && styles.statusUpcoming,
            viewModel.isCompleted && styles.statusCompleted,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              viewModel.isLive && styles.statusTextLive,
              viewModel.isUpcoming && styles.statusTextUpcoming,
              viewModel.isCompleted && styles.statusTextCompleted,
            ]}
          >
            {fixture.status}
          </Text>
        </View>
      </View>

      <View style={styles.matchContent}>
        {[
          { team: fixture.teamA, score: fixture.scoreA },
          { team: fixture.teamB, score: fixture.scoreB },
        ].map((item, index) => (
          <View key={index} style={styles.teamSection}>
            <View
              style={[
                styles.teamIcon,
                viewModel.isTBD && item.team === 'TBD' && styles.tbdIcon,
              ]}
            >
              <TeamIcon
                size={20}
                color={
                  item.team === 'TBD'
                    ? colors.textSecondary
                    : colors.appBackground
                }
              />
            </View>
            <Text
              style={[styles.teamName, item.team === 'TBD' && styles.tbdText]}
              numberOfLines={2}
            >
              {item.team}
            </Text>
            <Text
              style={[
                styles.score,
                fixture.winner === item.team && styles.winnerScore,
              ]}
            >
              {item.score}
            </Text>
          </View>
        ))}
      </View>

      {viewModel.isCompleted && fixture.winner && (
        <View style={styles.winnerBanner}>
          <CheckCircle size={14} color={colors.participantBackgroud} />
          <Text style={styles.winnerText}>Winner: {fixture.winner}</Text>
        </View>
      )}

      {isOrganizer && !viewModel.isTBD && (
        <View style={styles.controlsContainer}>
          {viewModel.isUpcoming && (
            <Pressable
              style={styles.controlButton}
              onPress={viewModel.onSetLive}
            >
              <Play size={16} color={colors.textPrimary} />
              <Text style={styles.controlButtonText}>
                {APP_STRINGS.eventScreen.startMatch}
              </Text>
            </Pressable>
          )}

          {viewModel.isLive && (
            <Pressable
              style={styles.controlButtonPrimary}
              onPress={viewModel.handleOpenScoreModal}
            >
              <Text style={styles.controlButtonTextPrimary}>
                {APP_STRINGS.eventScreen.updateScore}
              </Text>
            </Pressable>
          )}
        </View>
      )}

      <Modal
        visible={viewModel.showScoreModal}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {APP_STRINGS.eventScreen.updateScore}
              </Text>
              <Pressable onPress={() => viewModel.setShowScoreModal(false)}>
                <X size={24} color={colors.textSecondary} />
              </Pressable>
            </View>

            <View style={styles.scoreInputContainer}>
              {[
                {
                  team: fixture.teamA,
                  value: viewModel.tempScoreA,
                  key: 'A' as const,
                },
                {
                  team: fixture.teamB,
                  value: viewModel.tempScoreB,
                  key: 'B' as const,
                },
              ].map((team) => (
                <View key={team.key} style={styles.scoreInputSection}>
                  <Text style={styles.scoreTeamName} numberOfLines={1}>
                    {team.team}
                  </Text>
                  <View style={styles.scoreControls}>
                    <Pressable
                      style={styles.scoreButton}
                      onPress={() => viewModel.decrementScore(team.key)}
                    >
                      <Minus size={20} color={colors.textPrimary} />
                    </Pressable>
                    <Text style={styles.scoreValue}>{team.value}</Text>
                    <Pressable
                      style={styles.scoreButton}
                      onPress={() => viewModel.incrementScore(team.key)}
                    >
                      <Plus size={20} color={colors.textPrimary} />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={styles.saveButton}
                onPress={viewModel.handleSaveScore}
              >
                <Text style={styles.saveButtonText}>
                  {APP_STRINGS.eventScreen.saveScore}
                </Text>
              </Pressable>

              {viewModel.canComplete ? (
                <Pressable
                  style={styles.completeButton}
                  onPress={viewModel.handleCompleteMatch}
                >
                  <CheckCircle size={18} color={colors.primaryText} />
                  <Text style={styles.completeButtonText}>
                    {APP_STRINGS.eventScreen.completeMatch}
                  </Text>
                </Pressable>
              ) : (
                <Text style={styles.tieWarning}>
                  {APP_STRINGS.eventScreen.differentScores}
                </Text>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FixtureManageCard;
