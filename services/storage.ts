import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserProgress, UserStats} from '../types';

const KEYS = {
  USER_PROGRESS: 'user_progress',
  USER_STATS: 'user_stats',
  LAST_VISIT: 'last_visit',
  DAILY_TERM_INDEX: 'daily_term_index',
};

export class StorageService {
  static async getUserProgress(): Promise<UserProgress[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_PROGRESS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting user progress:', error);
      return [];
    }
  }

  static async saveUserProgress(progress: UserProgress[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving user progress:', error);
    }
  }

  static async getUserStats(): Promise<UserStats> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_STATS);
      return data ? JSON.parse(data) : {
        currentStreak: 0,
        longestStreak: 0,
        totalTermsLearned: 0,
        lastVisitDate: '',
        totalReviews: 0,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalTermsLearned: 0,
        lastVisitDate: '',
        totalReviews: 0,
      };
    }
  }

  static async saveUserStats(stats: UserStats): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving user stats:', error);
    }
  }

  static async getDailyTermIndex(): Promise<number> {
    try {
      const data = await AsyncStorage.getItem(KEYS.DAILY_TERM_INDEX);
      return data ? parseInt(data, 10) : 0;
    } catch (error) {
      console.error('Error getting daily term index:', error);
      return 0;
    }
  }

  static async saveDailyTermIndex(index: number): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.DAILY_TERM_INDEX, index.toString());
    } catch (error) {
      console.error('Error saving daily term index:', error);
    }
  }

  static async getLastVisit(): Promise<string> {
    try {
      const data = await AsyncStorage.getItem(KEYS.LAST_VISIT);
      return data || '';
    } catch (error) {
      console.error('Error getting last visit:', error);
      return '';
    }
  }

  static async saveLastVisit(date: string): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.LAST_VISIT, date);
    } catch (error) {
      console.error('Error saving last visit:', error);
    }
  }
}