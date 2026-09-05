export type GameType =
  | 'memory-matrix'
  | 'color-confusion'
  | 'number-recall'
  | 'n-back'
  | 'logic-puzzles'
  | 'word-games'
  | 'pattern-recognition'
  | 'matching-cards'
  | 'recall-sequence'
  | 'distraction-task'
  | 'guided-meditation'
  | 'breathing-pacer'
  | 'journaling-prompts'
  | 'reaction-drill'
  | 'stretching-dual';

export type ActivityCategory =
  | 'Cognitive & Puzzles'
  | 'Memory & Attention'
  | 'Mindfulness & Relaxation'
  | 'Physical & Dual-Task';

export type CognitiveDomain =
  | 'Working Memory'
  | 'Selective Attention'
  | 'Short-Term Memory'
  | 'Fluid Intelligence'
  | 'Spatial Reasoning'
  | 'Language Processing'
  | 'Executive Function'
  | 'Mindfulness & Calm'
  | 'Processing Speed'
  | 'Mind-Body Coordination';

export interface GameModeInfo {
  id: GameType;
  name: string;
  category: string;
  activityCategory: ActivityCategory;
  domain: CognitiveDomain;
  description: string;
  difficulty: 'Adaptive' | 'Fast-Paced' | 'Progressive' | 'High Focus' | 'Mindful' | 'Reflexive';
  badgeColor: string;
  accentColor: string;
  iconName: string;
  estimatedTime: string;
  rules: string[];
  tips: string;
}

export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'canceled';
export type SubscriptionPlan = 'monthly' | 'annual';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string;
  photoURL?: string;
  brainPowerScore: number;
  dailyStreak: number;
  lastActiveDateStr: string; // YYYY-MM-DD
  totalGamesPlayed: number;
  totalScore: number;
  favoriteGame: GameType | 'None' | string;
  peakMemoryAccuracy: number;
  peakFocusScore: number;
  peakReactionTimeMs: number;
  highScores: Partial<Record<GameType, number>> & Record<string, number>;
  gamesPlayedCount: Partial<Record<GameType, number>> & Record<string, number>;
  journalEntries?: JournalEntry[];
  
  // Subscription & Paywall System
  subscriptionStatus: SubscriptionStatus;
  isSubscribed: boolean;
  trialStartedAt: number; // epoch ms
  trialExpiresAt: number; // epoch ms (7 days from trialStartedAt)
  subscriptionPlan: SubscriptionPlan | null;
  subscriptionExpiresAt?: number | null;

  createdAt: number;
  updatedAt: number;
}

export interface JournalEntry {
  id: string;
  timestamp: number;
  dateStr: string;
  prompt: string;
  category: string;
  mood: string;
  content: string;
  wordCount: number;
}

export interface GameHistoryEntry {
  id: string;
  userId: string;
  gameType: GameType;
  gameTitle: string;
  score: number;
  accuracy: number; // percentage 0-100
  level: number;
  responseTimeMs: number;
  timestamp: number;
  dateStr: string;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  displayName: string;
  photoURL?: string;
  gameType: GameType | 'overall';
  score: number;
  level: number;
  accuracy: number;
  responseTimeMs: number;
  updatedAt: number;
}

export interface GameResult {
  gameType: GameType;
  gameTitle: string;
  score: number;
  accuracy: number;
  level: number;
  responseTimeMs: number;
  isNewHighScore: boolean;
  previousHighScore: number;
  streakGained: number;
  brainPowerGained: number;
}
