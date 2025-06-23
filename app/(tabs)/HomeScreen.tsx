import { MaterialIcons as Icon } from '@expo/vector-icons';
import { format, isToday, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FlashCard from '@/components/flashcard/FlashCard';
import { borderRadius, colors, spacing, typography } from '@/constants/theme';
import { slangTerms } from '@/data/slangTerms';
import { StorageService } from '@/services/storage';
import { UserProgress, UserStats } from '@/types';
import StatsPreview from '../../components/common/StatsPreview';

export default function DailyCardScreen() {
  const [dailyTerm, setDailyTerm] = useState(slangTerms[0]);
  const [userStats, setUserStats] = useState<UserStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalTermsLearned: 0,
    lastVisitDate: '',
    totalReviews: 0,
  });
  const [isLearned, setIsLearned] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeDailyTerm();
  }, []);

  const initializeDailyTerm = async () => {
    try {
      const stats = await StorageService.getUserStats();
      const progress = await StorageService.getUserProgress();
      const lastVisit = await StorageService.getLastVisit();
      const termIndex = await StorageService.getDailyTermIndex();

      const today = format(new Date(), 'yyyy-MM-dd');
      const todaysTerm = slangTerms[termIndex % slangTerms.length];

      setDailyTerm(todaysTerm);

      // Check if user has learned today's term
      const termProgress = progress.find((p) => p.termId === todaysTerm.id);
      setIsLearned(!!termProgress);

      // Update streak
      let updatedStats = { ...stats };
      if (lastVisit && !isToday(parseISO(lastVisit))) {
        // New day
        if (
          format(new Date(Date.now() - 86400000), 'yyyy-MM-dd') === lastVisit
        ) {
          // Consecutive day
          updatedStats.currentStreak += 1;
        } else {
          // Streak broken
          updatedStats.currentStreak = 1;
        }

        if (updatedStats.currentStreak > updatedStats.longestStreak) {
          updatedStats.longestStreak = updatedStats.currentStreak;
        }

        updatedStats.lastVisitDate = today;
        await StorageService.saveUserStats(updatedStats);
        await StorageService.saveLastVisit(today);
      } else if (!lastVisit) {
        // First visit
        updatedStats.currentStreak = 1;
        updatedStats.longestStreak = 1;
        updatedStats.lastVisitDate = today;
        await StorageService.saveUserStats(updatedStats);
        await StorageService.saveLastVisit(today);
      }

      setUserStats(updatedStats);
      setLoading(false);
    } catch (error) {
      console.error('Error initializing daily term:', error);
      setLoading(false);
    }
  };

  const markAsLearned = async () => {
    if (isLearned) return;

    try {
      const progress = await StorageService.getUserProgress();
      const newProgress: UserProgress = {
        id: Date.now().toString(),
        termId: dailyTerm.id,
        learnedAt: new Date().toISOString(),
        reviewCount: 1,
        isFavorite: false,
      };

      const updatedProgress = [...progress, newProgress];
      await StorageService.saveUserProgress(updatedProgress);

      const updatedStats = {
        ...userStats,
        totalTermsLearned: userStats.totalTermsLearned + 1,
        totalReviews: userStats.totalReviews + 1,
      };
      await StorageService.saveUserStats(updatedStats);

      setIsLearned(true);
      setUserStats(updatedStats);

      Alert.alert(
        'Great job! 🎉',
        "You've learned today's slang term! Come back tomorrow for a new one.",
        [{ text: 'OK', style: 'default' }]
      );
    } catch (error) {
      console.error('Error marking term as learned:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading today's term...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Today's Slang</Text>
            <Text style={styles.date}>
              {format(new Date(), 'EEEE, MMMM d')}
            </Text>
          </View>

          <View style={styles.streakContainer}>
            <View style={styles.streakBadge}>
              <Icon
                name='local-fire-department'
                size={20}
                color={colors.primary}
              />
              <Text style={styles.streakText}>
                {userStats.currentStreak} day streak
              </Text>
            </View>
            {userStats.longestStreak > userStats.currentStreak && (
              <Text style={styles.bestStreak}>
                Best: {userStats.longestStreak} days
              </Text>
            )}
          </View>
        </View>

        <FlashCard term={dailyTerm} />

        <View style={styles.actionContainer}>
          {!isLearned ? (
            <TouchableOpacity
              style={styles.learnButton}
              onPress={markAsLearned}
            >
              <Icon name='check-circle' size={24} color={colors.card} />
              <Text style={styles.learnButtonText}>Mark as Learned</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.completedContainer}>
              <Icon name='check-circle' size={24} color={colors.success} />
              <Text style={styles.completedText}>Completed for today!</Text>
              <Text style={styles.completedSubtext}>
                Come back tomorrow for a new term
              </Text>
            </View>
          )}
        </View>

        <StatsPreview userStats={userStats} />
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
    padding: spacing.md,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    width: '100%',
  },
  title: {
    fontSize: typography.english.fontSize.large,
    fontWeight: 'bold',
    color: colors.text,
  },
  date: {
    fontSize: typography.english.fontSize.medium,
    color: colors.textSecondary,
    marginLeft: 'auto',
  },
  streakContainer: {
    alignItems: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  streakText: {
    fontSize: typography.english.fontSize.medium,
    fontWeight: '600',
    color: colors.primary,
  },
  bestStreak: {
    fontSize: typography.english.fontSize.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  actionContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  learnButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  learnButtonText: {
    fontSize: typography.english.fontSize.medium,
    fontWeight: '600',
    color: colors.card,
  },
  completedContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  completedText: {
    fontSize: typography.english.fontSize.medium,
    fontWeight: '600',
    color: colors.success,
    marginTop: spacing.sm,
  },
  completedSubtext: {
    fontSize: typography.english.fontSize.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statsPreview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
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
