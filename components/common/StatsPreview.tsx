import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  borderRadius,
  colors,
  spacing,
  typography,
} from '../../constants/theme';
import { UserStats } from '../../types';

interface StatsPreviewProps {
  userStats: UserStats;
}

const StatsPreview: React.FC<StatsPreviewProps> = ({ userStats }) => (
  <View style={styles.statsPreview}>
    <View style={styles.statItem}>
      <Text style={styles.statNumber}>{userStats.totalTermsLearned}</Text>
      <Text style={styles.statLabel}>Terms Learned</Text>
    </View>
    <View style={styles.statItem}>
      <Text style={styles.statNumber}>{userStats.totalReviews}</Text>
      <Text style={styles.statLabel}>Total Reviews</Text>
    </View>
    <View style={styles.statItem}>
      <Text style={styles.statNumber}>{userStats.longestStreak}</Text>
      <Text style={styles.statLabel}>Best Streak</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  statsPreview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: typography.english.fontSize.large,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: typography.english.fontSize.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});

export default StatsPreview;
