import { GameType } from '../types';

export type PvPMode = '1v1' | '2v2' | '3v3' | '4v4' | '5v5';
export type TeamType = 'blue' | 'red';
export type PvPMatchPhase = 'queueing' | 'voting' | 'countdown' | 'in_progress' | 'completed' | 'abandoned';

export interface PvPPlayer {
  id: string;
  uid: string;
  displayName: string;
  photoURL?: string;
  team: TeamType;
  isReady: boolean;
  vote: GameType | null;
  score: number;
  accuracy: number;
  level: number;
  isBot?: boolean;
  rating?: number;
  role?: string;
  botRankTier?: string;
  botDifficultyLabel?: string;
  botTitle?: string;
  botStreakLevel?: number;
  botStreakBonusPct?: number;
}

export interface PvPRoom {
  id: string;
  code: string;
  mode: PvPMode;
  phase: PvPMatchPhase;
  players: PvPPlayer[];
  maxPlayers: number;
  votes: Record<string, number>;
  selectedGame: GameType | null;
  matchDurationSeconds: number; // 120 = 2 minutes
  timeRemaining: number;
  startedAt: number | null;
  endsAt: number | null;
  blueScore: number;
  redScore: number;
  winner: 'blue' | 'red' | 'tie' | null;
  isPrivateRoom?: boolean;
  playerWinStreak?: number;
  botStreakMultiplier?: number;
  createdAt: number;
  updatedAt: number;
}

export interface PvPQueueItem {
  id: string;
  uid: string;
  displayName: string;
  photoURL?: string;
  mode: PvPMode;
  rating: number;
  joinedAt: number;
}

export interface PvPHistoryRecord {
  id: string;
  roomId: string;
  mode: PvPMode;
  gameType: GameType;
  gameTitle: string;
  userTeam: TeamType;
  blueScore: number;
  redScore: number;
  winner: 'blue' | 'red' | 'tie';
  userScore: number;
  mvpPlayerName: string;
  timestamp: number;
  ratingDelta: number;
}

export interface PvPModeConfig {
  mode: PvPMode;
  title: string;
  subtitle: string;
  teamSize: number;
  totalPlayers: number;
  iconName: string;
  badgeColor: string;
  bgGradient: string;
  description: string;
  recommendedTime: string;
  activePlayersEstimate: number;
}

export const PVP_MODES_CONFIG: Record<PvPMode, PvPModeConfig> = {
  '1v1': {
    mode: '1v1',
    title: '1v1 Duel',
    subtitle: '1 vs 1 Head-to-Head',
    teamSize: 1,
    totalPlayers: 2,
    iconName: 'Swords',
    badgeColor: 'bg-blue-500/15 text-blue-700 border-blue-300',
    bgGradient: 'from-blue-600 to-indigo-600',
    description: 'Pure cognitive duel. Two athletes, 2 minutes, 1 voted game.',
    recommendedTime: '2 min sprint',
    activePlayersEstimate: 142
  },
  '2v2': {
    mode: '2v2',
    title: '2v2 Squad Clash',
    subtitle: '2 vs 2 Tag Team',
    teamSize: 2,
    totalPlayers: 4,
    iconName: 'Users',
    badgeColor: 'bg-emerald-500/15 text-emerald-700 border-emerald-300',
    bgGradient: 'from-emerald-600 to-teal-600',
    description: 'Coordinate with a partner to multiply your combined brain power.',
    recommendedTime: '2 min sprint',
    activePlayersEstimate: 98
  },
  '3v3': {
    mode: '3v3',
    title: '3v3 Triad Battle',
    subtitle: '3 vs 3 Team War',
    teamSize: 3,
    totalPlayers: 6,
    iconName: 'Shield',
    badgeColor: 'bg-amber-500/15 text-amber-700 border-amber-300',
    bgGradient: 'from-amber-600 to-orange-600',
    description: 'Balanced team brawl. Strategic voting and high-octane score pace.',
    recommendedTime: '2 min sprint',
    activePlayersEstimate: 76
  },
  '4v4': {
    mode: '4v4',
    title: '4v4 Team Siege',
    subtitle: '4 vs 4 Full Squad',
    teamSize: 4,
    totalPlayers: 8,
    iconName: 'Flame',
    badgeColor: 'bg-violet-500/15 text-violet-700 border-violet-300',
    bgGradient: 'from-violet-600 to-purple-600',
    description: 'Large squad warfare with intense scoreboard swings and comebacks.',
    recommendedTime: '2 min sprint',
    activePlayersEstimate: 54
  },
  '5v5': {
    mode: '5v5',
    title: '5v5 Grand Arena',
    subtitle: '5 vs 5 Grand Legion',
    teamSize: 5,
    totalPlayers: 10,
    iconName: 'Trophy',
    badgeColor: 'bg-rose-500/15 text-rose-700 border-rose-300',
    bgGradient: 'from-rose-600 to-pink-600',
    description: 'Massive 10-player championship showdown for ultimate glory.',
    recommendedTime: '2 min sprint',
    activePlayersEstimate: 41
  }
};

export const PVP_VOTABLE_GAMES: GameType[] = [
  'memory-matrix',
  'color-confusion',
  'number-recall',
  'n-back',
  'matching-cards',
  'recall-sequence',
  'distraction-task',
  'logic-puzzles',
  'word-games',
  'pattern-recognition',
  'reaction-drill',
  'stretching-dual'
];
