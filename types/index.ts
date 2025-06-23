export interface SlangTerm {
  id: string;
  term: string;
  reading: string;
  meaning: string;
  formalityLevel: FormalityLevel;
  exampleSentenceJap: string;
  exampleSentenceEng: string;
  isTrend: boolean;
  situation: string;
  subcategory?: string;
  difficulty: DifficultyLevel;
  tags: string[];
  dateAdded: string;
}

export interface UserProgress {
  id: string;
  termId: string;
  learnedAt: string;
  reviewCount: number;
  isFavorite: boolean;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalTermsLearned: number;
  lastVisitDate: string;
  totalReviews: number;
}

export type Situation =
  | 'EXPRESSING_EMOTION'
  | 'SOCIAL_RESPONSES'
  | 'DESCRIBING_THINGS'
  | 'CONVERSATION_FILLERS'
  | 'TEXTING_CASUAL';

export enum FormalityLevel {
  Casual = 'casual',
  Informal = 'informal',
  VeryCasual = 'very-casual',
}
export enum DifficultyLevel {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
}
