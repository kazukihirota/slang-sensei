import { MaterialIcons as Icon } from '@expo/vector-icons';
import { eachDayOfInterval, endOfWeek, format, startOfWeek } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  borderRadius,
  colors,
  spacing,
  typography,
} from '../../constants/theme';
import { slangTerms } from '../../data/slangTerms';
import { StorageService } from '../../services/storage';
import { UserProgress, UserStats } from '../../types';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const [userStats, setUserStats] = useState<UserStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalTermsLearned: 0,
    lastVisitDate: '',
    totalReviews: 0,
  });
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyActivity, setWeeklyActivity] = useState<boolean[]>([]);

  const loadProgressData = useCallback(async () => {
    try {
      const stats = await StorageService.getUserStats();
      const progress = await StorageService.getUserProgress();

      setUserStats(stats);
      setUserProgress(progress);
      generateWeeklyActivity(progress);
      setLoading(false);
    } catch (error) {
      console.error('Error loading progress data:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  const generateWeeklyActivity = (progress: UserProgress[]) => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const activity = weekDays.map((day) => {
      const dayStr = format(day, 'yyyy-MM-dd');
      return progress.some(
        (p) => format(new Date(p.learnedAt), 'yyyy-MM-dd') === dayStr
      );
    });

    setWeeklyActivity(activity);
  };

  const getProgressPercentage = () => {
    return Math.round((userStats.totalTermsLearned / slangTerms.length) * 100);
  };

  const getRecentLearned = () => {
    return userProgress
      .sort(
        (a, b) =>
          new Date(b.learnedAt).getTime() - new Date(a.learnedAt).getTime()
      )
      .slice(0, 5)
      .map((p) => {
        const term = slangTerms.find((t) => t.id === p.termId);
        return {
          ...p,
          term: term || null,
        };
      })
      .filter((p) => p.term !== null);
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    color = colors.primary,
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ComponentProps<typeof Icon>['name'];
    color?: string;
  }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading progress...</Text>
      </View>
    );
  }

  const recentLearned = getRecentLearned();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Progress</Text>
          <Text style={styles.subtitle}>Keep up the great work!</Text>
        </View>

        <View style={styles.progressOverview}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressPercentage}>
              {getProgressPercentage()}%
            </Text>
            <Text style={styles.progressLabel}>Complete</Text>
          </View>
          <View style={styles.progressDetails}>
            <Text style={styles.progressText}>
              {userStats.totalTermsLearned} of {slangTerms.length} terms learned
            </Text>
            <Text style={styles.progressSubtext}>
              {slangTerms.length - userStats.totalTermsLearned} terms remaining
            </Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title='Current Streak'
            value={userStats.currentStreak}
            subtitle='days'
            icon='local-fire-department'
            color={colors.primary}
          />
          <StatCard
            title='Best Streak'
            value={userStats.longestStreak}
            subtitle='days'
            icon='stars'
            color={colors.accent}
          />
          <StatCard
            title='Total Reviews'
            value={userStats.totalReviews}
            icon='refresh'
            color={colors.success}
          />
          <StatCard
            title='Terms Learned'
            value={userStats.totalTermsLearned}
            icon='school'
            color={colors.secondary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week&apos;s Activity</Text>
          <View style={styles.weeklyActivity}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <View key={index} style={styles.dayColumn}>
                <Text style={styles.dayLabel}>{day}</Text>
                <View
                  style={[
                    styles.activityDot,
                    weeklyActivity[index] && styles.activityDotActive,
                  ]}
                />
              </View>
            ))}
          </View>
        </View>

        {recentLearned.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recently Learned</Text>
            {recentLearned.map((item, index) => (
              <View key={index} style={styles.recentItem}>
                <View style={styles.recentTermInfo}>
                  <Text style={styles.recentTerm}>{item.term?.term}</Text>
                  <Text style={styles.recentMeaning}>{item.term?.meaning}</Text>
                </View>
                <Text style={styles.recentDate}>
                  {format(new Date(item.learnedAt), 'MMM d')}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievements}>
            <View
              style={[
                styles.achievement,
                userStats.currentStreak >= 3 && styles.achievementUnlocked,
              ]}
            >
              <Icon
                name='local-fire-department'
                size={24}
                color={
                  userStats.currentStreak >= 3
                    ? colors.primary
                    : colors.textMuted
                }
              />
              <Text
                style={[
                  styles.achievementText,
                  userStats.currentStreak >= 3 &&
                    styles.achievementTextUnlocked,
                ]}
              >
                3-Day Streak
              </Text>
            </View>

            <View
              style={[
                styles.achievement,
                userStats.currentStreak >= 7 && styles.achievementUnlocked,
              ]}
            >
              <Icon
                name='stars'
                size={24}
                color={
                  userStats.currentStreak >= 7
                    ? colors.accent
                    : colors.textMuted
                }
              />
              <Text
                style={[
                  styles.achievementText,
                  userStats.currentStreak >= 7 &&
                    styles.achievementTextUnlocked,
                ]}
              >
                Week Warrior
              </Text>
            </View>

            <View
              style={[
                styles.achievement,
                userStats.totalTermsLearned >= 10 && styles.achievementUnlocked,
              ]}
            >
              <Icon
                name='school'
                size={24}
                color={
                  userStats.totalTermsLearned >= 10
                    ? colors.success
                    : colors.textMuted
                }
              />
              <Text
                style={[
                  styles.achievementText,
                  userStats.totalTermsLearned >= 10 &&
                    styles.achievementTextUnlocked,
                ]}
              >
                Scholar
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.english.fontSize.medium,
    color: colors.textSecondary,
  },
  header: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.english.fontSize.large,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.english.fontSize.medium,
    color: colors.textSecondary,
  },
  progressOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.primary,
  },
  progressDetails: {
    flex: 1,
  },
  progressText: {
    fontSize: typography.english.fontSize.medium,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  progressSubtext: {
    fontSize: typography.english.fontSize.small,
    color: colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    width: (width - spacing.lg * 2 - spacing.md) / 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  statTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  statSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
  },
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.english.fontSize.medium,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  weeklyActivity: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
  },
  dayColumn: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.borderLight,
  },
  activityDotActive: {
    backgroundColor: colors.primary,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  recentTermInfo: {
    flex: 1,
  },
  recentTerm: {
    fontSize: typography.japanese.fontSize.medium,
    fontWeight: '600',
    color: colors.text,
  },
  recentMeaning: {
    fontSize: typography.english.fontSize.small,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  recentDate: {
    fontSize: typography.english.fontSize.small,
    color: colors.textMuted,
  },
  achievements: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  achievement: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    opacity: 0.5,
  },
  achievementUnlocked: {
    opacity: 1,
    backgroundColor: colors.primaryLight,
  },
  achievementText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  achievementTextUnlocked: {
    color: colors.text,
    fontWeight: '600',
  },
});
