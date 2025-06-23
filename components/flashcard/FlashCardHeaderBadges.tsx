import { MaterialIcons as Icon } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, spacing } from '../../constants/theme';
import { DifficultyLevel, FormalityLevel, SlangTerm } from '../../types';

interface FlashCardHeaderBadgesProps {
  term: SlangTerm;
}

const getFormalityColor = (level: FormalityLevel) => {
  switch (level) {
    case FormalityLevel.Casual:
      return colors.success;
    case FormalityLevel.Informal:
      return colors.warning;
    case FormalityLevel.VeryCasual:
      return colors.error;
    default:
      return colors.textSecondary;
  }
};

const getDifficultyColor = (level: DifficultyLevel) => {
  switch (level) {
    case DifficultyLevel.Beginner:
      return colors.success;
    case DifficultyLevel.Intermediate:
      return colors.warning;
    case DifficultyLevel.Advanced:
      return colors.error;
    default:
      return colors.textSecondary;
  }
};

const FlashCardHeaderBadges: React.FC<FlashCardHeaderBadgesProps> = ({
  term,
}) => (
  <View style={styles.badges}>
    {term.isTrend && (
      <View style={[styles.badge, styles.trendBadge]}>
        <Icon name='trending-up' size={12} color={colors.card} />
        <Text style={styles.trendText}>TRENDING</Text>
      </View>
    )}
    <View
      style={[
        styles.badge,
        { backgroundColor: getFormalityColor(term.formalityLevel) },
      ]}
    >
      <Text style={styles.badgeText}>{term.formalityLevel.toUpperCase()}</Text>
    </View>
    <View
      style={[
        styles.badge,
        { backgroundColor: getDifficultyColor(term.difficulty) },
      ]}
    >
      <Text style={styles.badgeText}>{term.difficulty.toUpperCase()}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
  },
  trendBadge: {
    backgroundColor: colors.primary,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.card,
  },
  trendText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.card,
  },
});

export default FlashCardHeaderBadges;
