export type CognitiveCategory = 
  | 'Memory'
  | 'Speed'
  | 'Attention'
  | 'Flexibility'
  | 'Problem Solving'
  | 'Mindfulness';

export interface CategoryInfo {
  id: CognitiveCategory;
  name: string;
  icon: string;
  color: string;
}

export type GameId = 
  | 'memory_matrix'
  | 'reaction_speed'
  | 'color_confusion'
  | 'n_back'
  | 'breathing_pacer';

export interface GameMetadata {
  id: GameId;
  title: string;
  subtitle: string;
  category: CognitiveCategory;
  themeColor: string;
  durationSeconds: number;
}

export interface GameSessionResult {
  id: string;
  gameId: GameId;
  score: number;
  accuracyPercentage: number;
  responseTimeMs?: number;
  brainPowerGained: number;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  brainPower: number;
  dailyStreak: number;
  lastPlayedDate: string | null;
  highScores: Record<string, number>;
  completedDrillsCount: number;
  isPro: boolean;
}
