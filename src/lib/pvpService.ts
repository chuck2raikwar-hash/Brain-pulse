import { doc, getDoc, setDoc, updateDoc, onSnapshot, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from './firebase';
import { PvPMode, PvPRoom, PvPPlayer, PvPMatchPhase, TeamType, PVP_MODES_CONFIG, PVP_VOTABLE_GAMES, PvPHistoryRecord } from '../types/pvp';
import { GameType } from '../types';
import { GAME_MODES } from '../data/games';

// Realistic bot athlete profiles with avatar photos
export const BOT_PROFILES = [
  { name: 'SynapsePulse', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
  { name: 'CortexRider', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { name: 'NeuralVortex', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  { name: 'QuantumMind', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
  { name: 'AlphaFocus', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80' },
  { name: 'ZenithDrift', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80' },
  { name: 'NeuroSpark', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' },
  { name: 'ChronoReflex', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' },
  { name: 'AxiomSolver', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80' },
  { name: 'MindArchitect', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80' },
  { name: 'PrismLogic', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80' },
  { name: 'VectorBlitz', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80' },
  { name: 'EchoThought', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80' },
  { name: 'VortexSynapse', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80' },
  { name: 'CogniNova', avatar: 'https://images.unsplash.com/photo-1517256673644-36ad11246d21?w=100&auto=format&fit=crop&q=80' }
];

// Generate short 6-character room codes (e.g. BP-8392)
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BP-${result}`;
}

// Cross-tab broadcast channel for instant 0ms latency sync on same machine
const pvpChannel: BroadcastChannel | null =
  typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined'
    ? new BroadcastChannel('brainpulse_pvp_channel')
    : null;

// Ensure unique tab session ID for PvP so two tabs on same browser can play against each other
export function getPvPPlayerId(currentUserId?: string): string {
  if (currentUserId && !currentUserId.startsWith('guest') && !currentUserId.startsWith('local')) {
    return currentUserId;
  }
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      let tabSessionId = sessionStorage.getItem('brainpulse_pvp_tab_id');
      if (!tabSessionId) {
        tabSessionId = `athlete_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
        sessionStorage.setItem('brainpulse_pvp_tab_id', tabSessionId);
      }
      return tabSessionId;
    } catch {
      // ignore
    }
  }
  return currentUserId || `athlete_${Date.now()}`;
}

// In-memory active rooms cache for fast local access
const localActiveRoomsCache = new Map<string, PvPRoom>();

// Broadcast room update locally
function broadcastRoomLocal(room: PvPRoom) {
  localActiveRoomsCache.set(room.id, room);
  if (room.code) {
    localActiveRoomsCache.set(room.code.toUpperCase(), room);
  }
  try {
    pvpChannel?.postMessage({ type: 'ROOM_UPDATE', room });
  } catch (err) {
    console.warn('BroadcastChannel error:', err);
  }
}

export interface RankTierProfile {
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Grandmaster';
  level: number;
  minElo: number;
  maxElo: number;
  name: string;
  badgeClass: string;
  botTitle: string;
  botAccuracyMin: number;
  botAccuracyMax: number;
  botTickIntervalMs: number;
  botBaseScoreMin: number;
  botBaseScoreMax: number;
  streakChance: number;
  toughnessLabel: string;
  description: string;
  streakLevel: number;
  streakBonusPct: number;
  isStreakHardened: boolean;
}

export function getRankTierInfo(rating: number, winStreak = 0): RankTierProfile {
  const r = Math.max(0, rating || 0);
  let base: Omit<RankTierProfile, 'streakLevel' | 'streakBonusPct' | 'isStreakHardened'>;

  if (r >= 1800) {
    base = {
      tier: 'Grandmaster',
      level: 7,
      minElo: 1800,
      maxElo: 9999,
      name: 'Grandmaster',
      badgeClass: 'text-amber-500 bg-amber-50 border-amber-300',
      botTitle: 'Grandmaster AI',
      botAccuracyMin: 94,
      botAccuracyMax: 96,
      botTickIntervalMs: 3400,
      botBaseScoreMin: 110,
      botBaseScoreMax: 125,
      streakChance: 0.35,
      toughnessLabel: 'Tier 7/7 • Grandmaster AI',
      description: 'Masterful cognitive pace, high accuracy, and strong competitive rhythm.'
    };
  } else if (r >= 1600) {
    base = {
      tier: 'Master',
      level: 6,
      minElo: 1600,
      maxElo: 1799,
      name: 'Master',
      badgeClass: 'text-purple-600 bg-purple-50 border-purple-300',
      botTitle: 'Master AI',
      botAccuracyMin: 91,
      botAccuracyMax: 94,
      botTickIntervalMs: 3900,
      botBaseScoreMin: 105,
      botBaseScoreMax: 120,
      streakChance: 0.28,
      toughnessLabel: 'Tier 6/7 • Master AI',
      description: 'Quick answers, sharp accuracy, and consistent scoring.'
    };
  } else if (r >= 1400) {
    base = {
      tier: 'Diamond',
      level: 5,
      minElo: 1400,
      maxElo: 1599,
      name: 'Diamond',
      badgeClass: 'text-cyan-600 bg-cyan-50 border-cyan-300',
      botTitle: 'Diamond AI',
      botAccuracyMin: 88,
      botAccuracyMax: 92,
      botTickIntervalMs: 4400,
      botBaseScoreMin: 100,
      botBaseScoreMax: 115,
      streakChance: 0.22,
      toughnessLabel: 'Tier 5/7 • Diamond AI',
      description: 'Brisk pace, solid problem resolution, and high accuracy.'
    };
  } else if (r >= 1000) {
    base = {
      tier: 'Platinum',
      level: 4,
      minElo: 1000,
      maxElo: 1399,
      name: 'Platinum',
      badgeClass: 'text-emerald-600 bg-emerald-50 border-emerald-300',
      botTitle: 'Platinum AI',
      botAccuracyMin: 90,
      botAccuracyMax: 95,
      botTickIntervalMs: 4000,
      botBaseScoreMin: 105,
      botBaseScoreMax: 120,
      streakChance: 0.22,
      toughnessLabel: 'Tier 4/7 • Expert AI',
      description: 'Agile pattern tracking and steady response pacing.'
    };
  } else if (r >= 600) {
    base = {
      tier: 'Gold',
      level: 3,
      minElo: 600,
      maxElo: 999,
      name: 'Gold',
      badgeClass: 'text-yellow-600 bg-yellow-50 border-yellow-300',
      botTitle: 'Gold AI',
      botAccuracyMin: 85,
      botAccuracyMax: 90,
      botTickIntervalMs: 4700,
      botBaseScoreMin: 100,
      botBaseScoreMax: 115,
      streakChance: 0.16,
      toughnessLabel: 'Tier 3/7 • Competitor AI',
      description: 'Balanced pace, dependable reflexes, and occasional combo streaks.'
    };
  } else if (r >= 250) {
    base = {
      tier: 'Silver',
      level: 2,
      minElo: 250,
      maxElo: 599,
      name: 'Silver',
      badgeClass: 'text-slate-600 bg-slate-50 border-slate-300',
      botTitle: 'Silver AI',
      botAccuracyMin: 78,
      botAccuracyMax: 84,
      botTickIntervalMs: 5500,
      botBaseScoreMin: 100,
      botBaseScoreMax: 110,
      streakChance: 0.10,
      toughnessLabel: 'Tier 2/7 • Adept AI',
      description: 'Deliberate pace, dependable baseline accuracy, relaxed point output.'
    };
  } else {
    base = {
      tier: 'Bronze',
      level: 1,
      minElo: 0,
      maxElo: 249,
      name: 'Bronze',
      badgeClass: 'text-amber-700 bg-amber-50/80 border-amber-300',
      botTitle: 'Bronze AI',
      botAccuracyMin: 68,
      botAccuracyMax: 75,
      botTickIntervalMs: 6500,
      botBaseScoreMin: 95,
      botBaseScoreMax: 105,
      streakChance: 0.05,
      toughnessLabel: 'Tier 1/7 • Novice AI',
      description: 'Gentle pace for beginners. Thoughtful reaction windows and occasional calculation mistakes.'
    };
  }

  // Win-Streak Escalation: Bots scale gently each consecutive win and reset on loss
  const streakLevel = Math.max(0, winStreak || 0);

  if (streakLevel > 0) {
    const streakBonusPct = Math.min(100, streakLevel * 10);
    // Moderate response scaling: tick interval drops by 3% per win (capped at 20% max speedup)
    const speedScale = Math.max(0.80, 1 - streakLevel * 0.03);
    const botTickIntervalMs = Math.max(2800, Math.round(base.botTickIntervalMs * speedScale));

    // Higher accuracy: +2% accuracy per streak level (capped at 99%)
    const accuracyBoost = Math.min(14, Math.round(streakLevel * 2.0));
    const botAccuracyMin = Math.min(98, base.botAccuracyMin + accuracyBoost);
    const botAccuracyMax = Math.min(99, base.botAccuracyMax + Math.round(accuracyBoost * 0.7));

    // Higher scoring pressure: +2% score output per streak level (up to +20% max)
    const scoreScale = 1 + (streakBonusPct * 0.2) / 100;
    const botBaseScoreMin = Math.round(base.botBaseScoreMin * scoreScale);
    const botBaseScoreMax = Math.round(base.botBaseScoreMax * scoreScale);

    // Combo streak chance boosts
    const streakChance = Math.min(0.65, base.streakChance + streakLevel * 0.03);

    let streakTitleTag = 'Hardened';
    if (streakLevel === 2) streakTitleTag = 'Enraged';
    else if (streakLevel === 3) streakTitleTag = 'Frenzy';
    else if (streakLevel >= 4) streakTitleTag = `Overdrive +${streakLevel}`;

    const botTitle = `${base.tier} AI [🔥 ${streakTitleTag}]`;
    const toughnessLabel = `${base.toughnessLabel} (🔥 Streak Lvl ${streakLevel} • +${streakBonusPct}% Toughness)`;

    return {
      ...base,
      botTitle,
      botAccuracyMin,
      botAccuracyMax,
      botTickIntervalMs,
      botBaseScoreMin,
      botBaseScoreMax,
      streakChance,
      toughnessLabel,
      streakLevel,
      streakBonusPct,
      isStreakHardened: true
    };
  }

  return {
    ...base,
    streakLevel: 0,
    streakBonusPct: 0,
    isStreakHardened: false
  };
}

export function generateBotPlayer(
  index: number,
  team: TeamType,
  targetRating = 0,
  winStreak = 0
): PvPPlayer {
  const botInfo = BOT_PROFILES[index % BOT_PROFILES.length];
  // Match around target player's Elo: within ±30 Elo variance for skill parity, clamped at 0
  const eloVariance = Math.floor((Math.random() - 0.5) * 60);
  const rating = Math.max(0, targetRating + eloVariance);
  const rankInfo = getRankTierInfo(rating, winStreak);
  const accuracy = Math.floor(
    rankInfo.botAccuracyMin + Math.random() * (rankInfo.botAccuracyMax - rankInfo.botAccuracyMin + 1)
  );
  const entropy = Math.random().toString(36).slice(2, 7);
  return {
    id: `bot-${index}-${Date.now()}-${entropy}`,
    uid: `bot-${index}-${entropy}`,
    displayName: `${botInfo.name} [${rankInfo.botTitle}]`,
    photoURL: botInfo.avatar,
    team,
    isReady: true,
    vote: null,
    score: 0,
    accuracy,
    level: rankInfo.level,
    isBot: true,
    rating,
    role: team === 'blue' ? 'Squad AI' : 'Opponent AI',
    botRankTier: rankInfo.tier,
    botDifficultyLabel: rankInfo.toughnessLabel,
    botTitle: rankInfo.botTitle,
    botStreakLevel: rankInfo.streakLevel,
    botStreakBonusPct: rankInfo.streakBonusPct
  };
}

// Create Initial Room State
export function createInitialRoom(
  mode: PvPMode,
  hostPlayer: { uid: string; displayName: string; photoURL?: string; rating?: number },
  isPrivate = false,
  fillWithBots = false,
  codeOverride?: string,
  roomIdOverride?: string,
  winStreak = 0
): PvPRoom {
  const config = PVP_MODES_CONFIG[mode];
  const maxPlayers = config.totalPlayers;
  const teamSize = config.teamSize;
  const hostRating = hostPlayer.rating !== undefined && hostPlayer.rating !== null ? hostPlayer.rating : 0;

  const player1: PvPPlayer = {
    id: hostPlayer.uid,
    uid: hostPlayer.uid,
    displayName: hostPlayer.displayName || 'Brain Athlete',
    photoURL: hostPlayer.photoURL,
    team: 'blue',
    isReady: true,
    vote: null,
    score: 0,
    accuracy: 100,
    level: 1,
    isBot: false,
    rating: hostRating,
    role: 'Host Captain'
  };

  const players: PvPPlayer[] = [player1];

  if (fillWithBots) {
    // Fill remaining Blue team slots with peers at host's rating
    for (let b = 1; b < teamSize; b++) {
      players.push(generateBotPlayer(b - 1, 'blue', hostRating, winStreak));
    }
    // Fill Red team slots with opponents scaled to host's rating and win streak
    for (let r = 0; r < teamSize; r++) {
      players.push(generateBotPlayer(r + teamSize, 'red', hostRating, winStreak));
    }
  }

  const roomId = roomIdOverride || `room-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const code = codeOverride || generateRoomCode();
  const streakMultiplier = winStreak > 0 ? 1 + (Math.min(100, winStreak * 10) / 100) : 1;

  const room: PvPRoom = {
    id: roomId,
    code,
    mode,
    phase: fillWithBots || players.length === maxPlayers ? 'voting' : 'queueing',
    players,
    maxPlayers,
    votes: {},
    selectedGame: null,
    matchDurationSeconds: 120, // 2 minutes
    timeRemaining: 120,
    startedAt: null,
    endsAt: null,
    blueScore: 0,
    redScore: 0,
    winner: null,
    isPrivateRoom: isPrivate,
    playerWinStreak: winStreak,
    botStreakMultiplier: streakMultiplier,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  broadcastRoomLocal(room);
  return room;
}

// Resolve Game Votes with Tie-Breaking
export function resolveWinningGame(votes: Record<string, number>): GameType {
  const gameEntries = Object.entries(votes);
  
  if (gameEntries.length === 0) {
    // No votes cast - pick random from 14 games
    const randomIndex = Math.floor(Math.random() * PVP_VOTABLE_GAMES.length);
    return PVP_VOTABLE_GAMES[randomIndex];
  }

  // Find max votes
  let maxCount = -1;
  for (const [, count] of gameEntries) {
    if (count > maxCount) {
      maxCount = count;
    }
  }

  // Find all games that have maxCount (tied games)
  const tiedGames: GameType[] = [];
  for (const [gameId, count] of gameEntries) {
    if (count === maxCount) {
      tiedGames.push(gameId as GameType);
    }
  }

  // If single winner, return it. If tie, randomly pick any of the tied games!
  const pickedIndex = Math.floor(Math.random() * tiedGames.length);
  return tiedGames[pickedIndex];
}

// Local Storage for PvP history and Elo rating
const PVP_STORAGE_KEY = 'brainpulse_pvp_stats_v1';
const PVP_HISTORY_KEY = 'brainpulse_pvp_history_v1';

export interface PvPUserStats {
  rating: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  ties: number;
  totalPvPScore: number;
  mvpCount: number;
  highestTeamScore: number;
  currentWinStreak: number;
  highestWinStreak: number;
}

export function getLocalPvPStats(): PvPUserStats {
  try {
    const raw = localStorage.getItem(PVP_STORAGE_KEY);
    const hasApplied1800Request = localStorage.getItem('brainpulse_pvp_rating_1800_applied_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure user is updated to 1800 Elo as requested for testing the best bot
      if (!hasApplied1800Request) {
        parsed.rating = 1800;
        localStorage.setItem('brainpulse_pvp_rating_1800_applied_v1', 'true');
      }
      if (typeof parsed.currentWinStreak !== 'number') {
        parsed.currentWinStreak = 0;
      }
      if (typeof parsed.highestWinStreak !== 'number') {
        parsed.highestWinStreak = 0;
      }
      saveLocalPvPStats(parsed);
      return parsed;
    } else {
      localStorage.setItem('brainpulse_pvp_rating_1800_applied_v1', 'true');
    }
  } catch (e) {
    console.error('Failed to load PvP stats', e);
  }
  return {
    rating: 1800,
    matchesPlayed: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    totalPvPScore: 0,
    mvpCount: 0,
    highestTeamScore: 0,
    currentWinStreak: 0,
    highestWinStreak: 0
  };
}

export function setPlayerElo(rating: number): PvPUserStats {
  const current = getLocalPvPStats();
  current.rating = Math.max(0, rating);
  saveLocalPvPStats(current);
  return current;
}

export function saveLocalPvPStats(stats: PvPUserStats) {
  try {
    localStorage.setItem(PVP_STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save PvP stats', e);
  }
}

// Cache for outcomes recorded during the current app session to guarantee idempotency
const recordedRoomOutcomes = new Map<string, { ratingDelta: number; newStats: PvPUserStats; isWin: boolean; isTie: boolean; isLoss: boolean }>();

export function getLocalPvPHistory(): PvPHistoryRecord[] {
  try {
    const raw = localStorage.getItem(PVP_HISTORY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const seenIds = new Set<string>();
        const seenRoomIds = new Set<string>();
        const sanitized: PvPHistoryRecord[] = [];

        for (let i = 0; i < parsed.length; i++) {
          const item = parsed[i];
          if (!item || typeof item !== 'object') continue;

          // Deduplicate if room ID was already included
          if (item.roomId && seenRoomIds.has(item.roomId)) {
            continue;
          }
          if (item.id && seenIds.has(item.id)) {
            continue;
          }

          if (item.roomId) seenRoomIds.add(item.roomId);

          // Guarantee unique key even if old localStorage had duplicated record IDs
          const safeId = item.id && !seenIds.has(item.id)
            ? item.id
            : `rec-${item.roomId || 'hist'}-${item.timestamp || Date.now()}-${i}`;
          seenIds.add(safeId);

          sanitized.push({
            ...item,
            id: safeId
          });
        }
        return sanitized;
      }
    }
  } catch (e) {
    console.error('Failed to load PvP history', e);
  }
  return [];
}

export function addLocalPvPHistory(record: PvPHistoryRecord) {
  try {
    const existing = getLocalPvPHistory();
    // Exclude any existing record with same ID or same roomId
    const filtered = existing.filter(r => r.id !== record.id && (!record.roomId || r.roomId !== record.roomId));
    const updated = [record, ...filtered].slice(0, 30);
    localStorage.setItem(PVP_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save PvP history record', e);
  }
}

// Record match outcome & compute Elo changes
export function recordMatchOutcome(
  room: PvPRoom,
  userUid: string
): { ratingDelta: number; newStats: PvPUserStats; isWin: boolean; isTie: boolean; isLoss: boolean } {
  const cacheKey = `${room.id}_${userUid}`;
  if (recordedRoomOutcomes.has(cacheKey)) {
    return recordedRoomOutcomes.get(cacheKey)!;
  }

  // Determine winner
  const userPlayer = room.players.find(p => p.uid === userUid);
  const userTeam = userPlayer?.team || 'blue';
  const isTie = room.winner === 'tie';
  const isWin = room.winner === userTeam;
  const isLoss = !isTie && !isWin;

  // Check if this room has already been logged in stored history
  const existingHistory = getLocalPvPHistory();
  const existingRecord = existingHistory.find(r => r.roomId === room.id);
  if (existingRecord) {
    const currentStats = getLocalPvPStats();
    const result = {
      ratingDelta: existingRecord.ratingDelta,
      newStats: currentStats,
      isWin,
      isTie,
      isLoss
    };
    recordedRoomOutcomes.set(cacheKey, result);
    return result;
  }

  const currentStats = getLocalPvPStats();
  const userScore = userPlayer?.score || 0;

  // Find MVP
  let highestPlayer = room.players[0];
  for (const p of room.players) {
    if (p.score > (highestPlayer?.score || 0)) {
      highestPlayer = p;
    }
  }
  const isMvp = highestPlayer?.uid === userUid;

  const isPrivate = !!room.isPrivateRoom;

  // Calculate Rating Delta: strictly 0 for private custom matches (unranked friendly)
  let ratingDelta = 0;
  if (!isPrivate) {
    if (isWin) {
      ratingDelta = 25 + (isMvp ? 10 : 0);
    } else if (isTie) {
      ratingDelta = 8;
    } else {
      ratingDelta = -15;
    }
  }

  const newRating = isPrivate ? currentStats.rating : Math.max(0, currentStats.rating + ratingDelta);
  const userTeamScore = userTeam === 'blue' ? room.blueScore : room.redScore;

  // Win-Streak calculation: increases every win in ranked, resets to 0 upon defeat.
  // Private custom friendly matches do not affect competitive win streaks.
  const prevStreak = currentStats.currentWinStreak || 0;
  const prevBestStreak = currentStats.highestWinStreak || 0;
  let currentWinStreak = prevStreak;
  let highestWinStreak = prevBestStreak;

  if (!isPrivate) {
    if (isWin) {
      currentWinStreak = prevStreak + 1;
      highestWinStreak = Math.max(prevBestStreak, currentWinStreak);
    } else if (isLoss) {
      // Defeat in ranked matchmaking resets win streak back to 0
      currentWinStreak = 0;
    }
  }

  const updatedStats: PvPUserStats = {
    rating: newRating,
    matchesPlayed: currentStats.matchesPlayed + 1,
    wins: currentStats.wins + (isWin ? 1 : 0),
    losses: currentStats.losses + (isLoss ? 1 : 0),
    ties: currentStats.ties + (isTie ? 1 : 0),
    totalPvPScore: currentStats.totalPvPScore + userScore,
    mvpCount: currentStats.mvpCount + (isMvp ? 1 : 0),
    highestTeamScore: Math.max(currentStats.highestTeamScore, userTeamScore),
    currentWinStreak,
    highestWinStreak
  };

  saveLocalPvPStats(updatedStats);

  // Save history record with guaranteed unique ID
  const selectedGameInfo = room.selectedGame ? GAME_MODES[room.selectedGame] : null;
  const uniqueEntropy = Math.random().toString(36).slice(2, 8);
  const baseTitle = selectedGameInfo?.name || 'Cognitive Sprint';
  const gameTitle = isPrivate
    ? (room.isForfeitWin ? `${baseTitle} (Custom - Forfeit Victory)` : `${baseTitle} (Custom Match)`)
    : (room.isForfeitWin ? `${baseTitle} (Opponent Forfeit)` : baseTitle);
  const historyRecord: PvPHistoryRecord = {
    id: `rec-${room.id}-${Date.now()}-${uniqueEntropy}`,
    roomId: room.id,
    mode: room.mode,
    gameType: room.selectedGame || 'memory-matrix',
    gameTitle,
    userTeam,
    blueScore: room.blueScore,
    redScore: room.redScore,
    winner: room.winner || 'tie',
    userScore,
    mvpPlayerName: room.isForfeitWin ? 'Forfeit Victory' : (highestPlayer?.displayName || 'Brain Athlete'),
    timestamp: Date.now(),
    ratingDelta
  };

  addLocalPvPHistory(historyRecord);

  const finalResult = {
    ratingDelta,
    newStats: updatedStats,
    isWin,
    isTie,
    isLoss
  };

  recordedRoomOutcomes.set(cacheKey, finalResult);
  return finalResult;
}

// Record forfeit penalty
export function recordForfeitOutcome(
  room: PvPRoom,
  userUid: string
): { ratingDelta: number; newStats: PvPUserStats } {
  const cacheKey = `forfeit_${room.id}_${userUid}`;
  if (recordedRoomOutcomes.has(cacheKey)) {
    const cached = recordedRoomOutcomes.get(cacheKey)!;
    return { ratingDelta: cached.ratingDelta, newStats: cached.newStats };
  }

  const existingHistory = getLocalPvPHistory();
  const existingRecord = existingHistory.find(r => r.roomId === room.id);
  if (existingRecord) {
    const currentStats = getLocalPvPStats();
    return {
      ratingDelta: existingRecord.ratingDelta,
      newStats: currentStats
    };
  }

  const currentStats = getLocalPvPStats();
  const userPlayer = room.players.find(p => p.uid === userUid);
  const userTeam = userPlayer?.team || 'blue';
  const opponentTeam = userTeam === 'blue' ? 'red' : 'blue';

  const isPrivate = !!room.isPrivateRoom;
  const forfeitPenalty = isPrivate ? 0 : -20;
  const newRating = isPrivate ? currentStats.rating : Math.max(0, currentStats.rating + forfeitPenalty);

  const updatedStats: PvPUserStats = {
    ...currentStats,
    rating: newRating,
    matchesPlayed: currentStats.matchesPlayed + 1,
    losses: currentStats.losses + 1,
    // Private matches do not wipe competitive ranked win streaks
    currentWinStreak: isPrivate ? (currentStats.currentWinStreak || 0) : 0
  };

  saveLocalPvPStats(updatedStats);

  const selectedGameInfo = room.selectedGame ? GAME_MODES[room.selectedGame] : null;
  const uniqueEntropy = Math.random().toString(36).slice(2, 8);
  const baseTitle = selectedGameInfo?.name || 'Cognitive Battle';
  const gameTitle = isPrivate ? `${baseTitle} (Custom - Forfeit)` : `${baseTitle} (Forfeit)`;
  const historyRecord: PvPHistoryRecord = {
    id: `rec-forfeit-${room.id}-${Date.now()}-${uniqueEntropy}`,
    roomId: room.id,
    mode: room.mode,
    gameType: room.selectedGame || 'memory-matrix',
    gameTitle,
    userTeam,
    blueScore: room.blueScore,
    redScore: room.redScore,
    winner: opponentTeam,
    userScore: userPlayer?.score || 0,
    mvpPlayerName: 'Opponent Squad',
    timestamp: Date.now(),
    ratingDelta: forfeitPenalty
  };

  addLocalPvPHistory(historyRecord);

  const finalResult = {
    ratingDelta: forfeitPenalty,
    newStats: updatedStats,
    isWin: false,
    isTie: false,
    isLoss: true
  };

  recordedRoomOutcomes.set(cacheKey, finalResult);
  return {
    ratingDelta: forfeitPenalty,
    newStats: updatedStats
  };
}

// Concede match and grant opponent instant victory & ELO
export async function forfeitAndConcedeMatch(
  room: PvPRoom,
  userUid: string,
  reason?: string
): Promise<PvPRoom> {
  // 1. Record forfeit penalty for the forfeiting player (-20 ELO, streak reset to 0)
  recordForfeitOutcome(room, userUid);

  const userPlayer = room.players.find(p => p.uid === userUid);
  const userTeam = userPlayer?.team || 'blue';
  const opponentTeam = userTeam === 'blue' ? 'red' : 'blue';

  const completedRoom: PvPRoom = {
    ...room,
    phase: 'completed',
    winner: opponentTeam,
    isForfeitWin: true,
    forfeitedBy: {
      uid: userUid,
      displayName: userPlayer?.displayName || 'Opponent',
      team: userTeam
    },
    forfeitReason: reason || `${userPlayer?.displayName || 'Opponent'} forfeited the match`,
    endsAt: Date.now(),
    updatedAt: Date.now()
  };

  // 2. Broadcast locally and synchronize with Firestore so all opposing players immediately receive the victory modal & +25 ELO
  await syncRoomToFirestore(completedRoom);
  return completedRoom;
}

// Real-time Firestore Room Synchronization Helpers
export async function syncRoomToFirestore(room: PvPRoom): Promise<void> {
  broadcastRoomLocal(room);
  try {
    await setDoc(doc(db, 'pvp_rooms', room.id), {
      ...room,
      updatedAt: Date.now()
    });
  } catch (error) {
    console.warn('Firestore room sync warning:', error);
  }
}

// Host creates a private match room in Firestore
export async function createHostRoomInFirestore(
  mode: PvPMode,
  hostPlayer: { uid: string; displayName: string; photoURL?: string; rating?: number }
): Promise<PvPRoom> {
  const room = createInitialRoom(mode, hostPlayer, true, false);
  await syncRoomToFirestore(room);
  return room;
}

// Search for an open matchmaking room created by another human player in the same mode and Elo tier
export async function findOpenMatchmakingRoom(
  mode: PvPMode,
  userUid: string,
  userRating: number,
  maxEloDiff = 180
): Promise<PvPRoom | null> {
  try {
    const roomsCol = collection(db, 'pvp_rooms');
    const q = query(
      roomsCol,
      where('mode', '==', mode),
      where('phase', '==', 'queueing'),
      limit(10)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const now = Date.now();
    let bestMatch: PvPRoom | null = null;
    let minDiff = Infinity;

    snap.forEach(docSnap => {
      const room = docSnap.data() as PvPRoom;
      // Skip private rooms, stale rooms (> 45s ago), rooms already full, or rooms containing user
      if (room.isPrivateRoom) return;
      if (now - (room.updatedAt || 0) > 45000) return;
      if (room.players.length >= room.maxPlayers) return;
      if (room.players.some(p => p.uid === userUid)) return;

      const hostRating = room.players[0]?.rating ?? 0;
      const diff = Math.abs(hostRating - userRating);
      if (diff <= maxEloDiff && diff < minDiff) {
        minDiff = diff;
        bestMatch = room;
      }
    });

    if (bestMatch) {
      broadcastRoomLocal(bestMatch);
      return bestMatch;
    }
  } catch (err) {
    console.warn('Matchmaking room search warning:', err);
  }
  return null;
}

// Create a public matchmaking lobby in Firestore so other players can join
export async function createMatchmakingRoomInFirestore(
  mode: PvPMode,
  hostPlayer: { uid: string; displayName: string; photoURL?: string; rating?: number },
  winStreak = 0
): Promise<PvPRoom> {
  const room = createInitialRoom(mode, hostPlayer, false, false, undefined, undefined, winStreak);
  await syncRoomToFirestore(room);
  return room;
}

// 5-minute expiry window for custom match lobbies (300 seconds)
export const CUSTOM_ROOM_EXPIRY_MS = 5 * 60 * 1000;

// Host abandons and closes their custom private match lobby
export async function abandonCustomRoom(
  room: PvPRoom,
  userUid: string,
  reason: string = 'Host abandoned the queue'
): Promise<PvPRoom> {
  const abandonedRoom: PvPRoom = {
    ...room,
    phase: 'abandoned',
    isAbandoned: true,
    abandonedReason: reason,
    forfeitedBy: {
      uid: userUid,
      displayName: room.players.find(p => p.uid === userUid)?.displayName || 'Host',
      team: 'blue'
    },
    updatedAt: Date.now()
  };

  localActiveRoomsCache.set(room.id, abandonedRoom);
  if (room.code) {
    localActiveRoomsCache.set(room.code.toUpperCase(), abandonedRoom);
  }
  broadcastRoomLocal(abandonedRoom);

  try {
    const roomRef = doc(db, 'pvp_rooms', room.id);
    await setDoc(roomRef, {
      ...abandonedRoom,
      phase: 'abandoned',
      isAbandoned: true,
      abandonedReason: reason,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (err) {
    console.warn('Error syncing abandoned room to Firestore:', err);
  }

  return abandonedRoom;
}

// Expire an inactive custom match lobby after 5 minutes
export async function expireCustomRoom(
  room: PvPRoom
): Promise<PvPRoom> {
  const expiredRoom: PvPRoom = {
    ...room,
    phase: 'abandoned',
    isAbandoned: true,
    isExpired: true,
    abandonedReason: 'Lobby expired after 5 minutes of inactivity',
    updatedAt: Date.now()
  };

  localActiveRoomsCache.set(room.id, expiredRoom);
  if (room.code) {
    localActiveRoomsCache.set(room.code.toUpperCase(), expiredRoom);
  }
  broadcastRoomLocal(expiredRoom);

  try {
    const roomRef = doc(db, 'pvp_rooms', room.id);
    await setDoc(roomRef, {
      ...expiredRoom,
      phase: 'abandoned',
      isAbandoned: true,
      isExpired: true,
      abandonedReason: 'Lobby expired after 5 minutes of inactivity',
      updatedAt: Date.now()
    }, { merge: true });
  } catch (err) {
    console.warn('Error syncing expired room to Firestore:', err);
  }

  return expiredRoom;
}

// Find an active match room by its 6-character code
export async function findRoomByCode(rawCode: string): Promise<PvPRoom | null> {
  const cleanCode = rawCode.trim().toUpperCase();
  if (!cleanCode) return null;

  const now = Date.now();

  // 1. Check local in-memory cache first
  const cached = localActiveRoomsCache.get(cleanCode);
  if (cached) {
    if (cached.isAbandoned || cached.phase === 'abandoned') {
      throw new Error(`This custom lobby was closed because the host abandoned the queue. No one can join.`);
    }
    if (cached.isPrivateRoom && (now - (cached.createdAt || 0) > CUSTOM_ROOM_EXPIRY_MS)) {
      expireCustomRoom(cached).catch(() => {});
      throw new Error(`This custom match room code has expired (5-minute time limit exceeded). Please ask the host to create a new lobby.`);
    }
    if (cached.phase === 'queueing' || cached.phase === 'voting') {
      return cached;
    }
  }

  // 2. Query Firestore pvp_rooms collection
  try {
    const roomsCol = collection(db, 'pvp_rooms');
    const q = query(roomsCol, where('code', '==', cleanCode), limit(5));
    const snap = await getDocs(q);

    if (!snap.empty) {
      let bestRoom: PvPRoom | null = null;
      let wasAbandoned = false;
      let wasExpired = false;

      snap.forEach(docSnap => {
        const data = docSnap.data() as PvPRoom;
        const isExp = Boolean(data.isPrivateRoom && (now - (data.createdAt || 0) > CUSTOM_ROOM_EXPIRY_MS));

        if (data.isAbandoned || data.phase === 'abandoned') {
          wasAbandoned = true;
        } else if (isExp || data.isExpired) {
          wasExpired = true;
          expireCustomRoom(data).catch(() => {});
        } else if (data.phase === 'queueing' || data.phase === 'voting') {
          if (!bestRoom || data.updatedAt > bestRoom.updatedAt) {
            bestRoom = data;
          }
        }
      });

      if (bestRoom) {
        broadcastRoomLocal(bestRoom);
        return bestRoom;
      }

      if (wasAbandoned) {
        throw new Error(`This custom lobby was closed because the host abandoned the queue. No one can join.`);
      }

      if (wasExpired) {
        throw new Error(`This custom match room code has expired (5-minute time limit exceeded). Please ask the host to create a new lobby.`);
      }
    }
  } catch (error: any) {
    // Re-throw our explicit abandonment/expiry errors so callers can display them
    if (
      error?.message?.includes('abandoned') ||
      error?.message?.includes('expired') ||
      error?.message?.includes('5-minute')
    ) {
      throw error;
    }
    console.warn('Error querying room by code from Firestore:', error);
  }

  return cached || null;
}

// Join room by code with team selection option (Teammate Blue or Rival Red)
export async function joinRoomByCode(
  code: string,
  challenger: { uid: string; displayName: string; photoURL?: string; rating?: number },
  preferredTeam: TeamType = 'red'
): Promise<PvPRoom> {
  const cleanCode = code.trim().toUpperCase();
  const room = await findRoomByCode(cleanCode);

  if (!room) {
    throw new Error(`Match not found for code "${cleanCode}". Make sure the host has created the match and has the lobby open.`);
  }

  if (room.isAbandoned || room.phase === 'abandoned') {
    throw new Error(`This custom lobby was closed because the host abandoned the queue. No one can join.`);
  }

  if (room.isPrivateRoom && (Date.now() - (room.createdAt || 0) > CUSTOM_ROOM_EXPIRY_MS)) {
    throw new Error(`This custom match room code has expired (5-minute limit exceeded). Please ask the host to generate a new room code.`);
  }

  // If challenger is already the host or in the room (e.g. rejoining or duplicate tab)
  const existingPlayerIndex = room.players.findIndex(p => p.uid === challenger.uid || p.id === challenger.uid);
  if (existingPlayerIndex !== -1) {
    return room;
  }

  const config = PVP_MODES_CONFIG[room.mode];
  const teamSize = config.teamSize;
  const hostPlayer = room.players[0] || {
    id: 'host',
    uid: 'host',
    displayName: 'Host Captain',
    team: 'blue',
    isReady: true,
    vote: null,
    score: 0,
    accuracy: 100,
    level: 1,
    isBot: false,
    rating: 0,
    role: 'Host Captain'
  };

  // If 1v1 mode, force opposite team (Red)
  const effectiveTeam: TeamType = teamSize === 1 ? 'red' : preferredTeam;

  const challengerPlayer: PvPPlayer = {
    id: challenger.uid,
    uid: challenger.uid,
    displayName: challenger.displayName || 'Brain Athlete',
    photoURL: challenger.photoURL,
    team: effectiveTeam,
    isReady: true,
    vote: null,
    score: 0,
    accuracy: 100,
    level: 1,
    isBot: false,
    rating: challenger.rating !== undefined && challenger.rating !== null ? challenger.rating : 0,
    role: effectiveTeam === 'blue' ? 'Teammate' : 'Rival Captain'
  };

  const updatedPlayers: PvPPlayer[] = [];
  const avgRating = Math.round(
    ((hostPlayer.rating !== undefined && hostPlayer.rating !== null ? hostPlayer.rating : 0) +
     (challenger.rating !== undefined && challenger.rating !== null ? challenger.rating : 0)) / 2
  );

  if (effectiveTeam === 'blue') {
    // Both Host and Challenger are on Team Blue!
    updatedPlayers.push(hostPlayer, challengerPlayer);

    // If squad size > 2 (e.g. 3v3, 4v4, 5v5), fill remaining Blue slots with bots matched to average Elo
    for (let b = 2; b < teamSize; b++) {
      updatedPlayers.push(generateBotPlayer(b - 1, 'blue', avgRating));
    }

    // Fill all Red team slots with rival bots matched to average Elo
    for (let r = 0; r < teamSize; r++) {
      updatedPlayers.push(generateBotPlayer(r + teamSize, 'red', avgRating));
    }
  } else {
    // Host is Team Blue Captain, Challenger is Team Red Captain
    updatedPlayers.push(hostPlayer, challengerPlayer);

    // Fill remaining Blue team slots with squadmates matched to average Elo
    for (let b = 1; b < teamSize; b++) {
      updatedPlayers.push(generateBotPlayer(b - 1, 'blue', avgRating));
    }

    // Fill remaining Red team slots with squadmates matched to average Elo
    for (let r = 1; r < teamSize; r++) {
      updatedPlayers.push(generateBotPlayer(r + teamSize, 'red', avgRating));
    }
  }

  const updatedRoom: PvPRoom = {
    ...room,
    players: updatedPlayers,
    phase: 'voting', // Move straight to voting now that challenger has joined
    updatedAt: Date.now()
  };

  await syncRoomToFirestore(updatedRoom);
  return updatedRoom;
}

// Cast a game vote in a room
export async function castVoteInRoom(
  roomId: string,
  playerId: string,
  gameType: GameType
): Promise<void> {
  const cached = localActiveRoomsCache.get(roomId);
  if (cached) {
    const updatedPlayers = cached.players.map(p => {
      if (p.uid === playerId || p.id === playerId) {
        return { ...p, vote: gameType };
      }
      return p;
    });

    const votes: Record<string, number> = {};
    updatedPlayers.forEach(p => {
      if (p.vote) {
        votes[p.vote] = (votes[p.vote] || 0) + 1;
      }
    });

    cached.players = updatedPlayers;
    cached.votes = votes;
    if (cached.phase === 'queueing') {
      cached.phase = 'voting';
    }
    cached.updatedAt = Date.now();
    broadcastRoomLocal(cached);
  }

  const roomRef = doc(db, 'pvp_rooms', roomId);
  try {
    const snap = await getDoc(roomRef);
    if (snap.exists()) {
      const room = snap.data() as PvPRoom;
      const updatedPlayers = room.players.map(p => {
        if (p.uid === playerId || p.id === playerId) {
          return { ...p, vote: gameType };
        }
        return p;
      });

      // Recalculate votes map
      const votes: Record<string, number> = {};
      updatedPlayers.forEach(p => {
        if (p.vote) {
          votes[p.vote] = (votes[p.vote] || 0) + 1;
        }
      });

      const updatedRoom: PvPRoom = {
        ...room,
        phase: room.phase === 'queueing' ? 'voting' : room.phase,
        players: updatedPlayers,
        votes,
        updatedAt: Date.now()
      };
      await syncRoomToFirestore(updatedRoom);
    } else if (cached) {
      await syncRoomToFirestore(cached);
    }
  } catch (err) {
    console.warn('Error casting vote in Firestore room:', err);
  }
}

// Set winning game and begin match
export async function setRoomGameAndStart(
  roomId: string,
  selectedGame: GameType
): Promise<void> {
  const now = Date.now();
  const cached = localActiveRoomsCache.get(roomId);
  if (cached) {
    cached.selectedGame = selectedGame;
    cached.phase = 'in_progress';
    cached.startedAt = now;
    cached.endsAt = now + 120 * 1000;
    cached.timeRemaining = 120;
    cached.updatedAt = now;
    broadcastRoomLocal(cached);
  }

  const roomRef = doc(db, 'pvp_rooms', roomId);
  try {
    const snap = await getDoc(roomRef);
    if (snap.exists()) {
      const room = snap.data() as PvPRoom;
      const updatedRoom: PvPRoom = {
        ...room,
        selectedGame,
        phase: 'in_progress',
        startedAt: now,
        endsAt: now + 120 * 1000,
        timeRemaining: 120,
        updatedAt: now
      };
      await syncRoomToFirestore(updatedRoom);
    } else if (cached) {
      await syncRoomToFirestore(cached);
    }
  } catch (err) {
    console.warn('Error starting match in Firestore room:', err);
  }
}

// Update a player's score live in the match room
export async function updatePlayerScoreInRoom(
  roomId: string,
  playerId: string,
  pointsDelta: number
): Promise<void> {
  const roomRef = doc(db, 'pvp_rooms', roomId);
  try {
    const snap = await getDoc(roomRef);
    if (snap.exists()) {
      const room = snap.data() as PvPRoom;
      const updatedPlayers = room.players.map(p => {
        if (p.uid === playerId || p.id === playerId) {
          return {
            ...p,
            score: p.score + pointsDelta,
            level: p.level + (Math.random() > 0.6 ? 1 : 0)
          };
        }
        return p;
      });

      const blueScore = updatedPlayers
        .filter(p => p.team === 'blue')
        .reduce((sum, p) => sum + p.score, 0);

      const redScore = updatedPlayers
        .filter(p => p.team === 'red')
        .reduce((sum, p) => sum + p.score, 0);

      const updatedRoom: PvPRoom = {
        ...room,
        players: updatedPlayers,
        blueScore,
        redScore,
        updatedAt: Date.now()
      };
      await syncRoomToFirestore(updatedRoom);
    }
  } catch (err) {
    console.warn('Error updating score in Firestore room:', err);
  }
}

// Complete the match in Firestore
export async function finishRoomMatch(
  roomId: string,
  finalRoom: PvPRoom
): Promise<void> {
  const updatedRoom: PvPRoom = {
    ...finalRoom,
    phase: 'completed',
    updatedAt: Date.now()
  };
  await syncRoomToFirestore(updatedRoom);
}

// Subscribe to real-time updates for a match room
export function subscribeToPvPRoom(
  roomId: string,
  onUpdate: (room: PvPRoom) => void
): () => void {
  let channelHandler: ((ev: MessageEvent) => void) | null = null;
  if (pvpChannel) {
    channelHandler = (ev: MessageEvent) => {
      if (ev.data?.type === 'ROOM_UPDATE' && ev.data?.room?.id === roomId) {
        onUpdate(ev.data.room as PvPRoom);
      }
    };
    pvpChannel.addEventListener('message', channelHandler);
  }

  const roomRef = doc(db, 'pvp_rooms', roomId);
  const unsubFirestore = onSnapshot(
    roomRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as PvPRoom;
        localActiveRoomsCache.set(roomId, data);
        if (data.code) {
          localActiveRoomsCache.set(data.code.toUpperCase(), data);
        }
        onUpdate(data);
      }
    },
    (error) => {
      console.warn('PvP room onSnapshot error:', error);
    }
  );

  return () => {
    unsubFirestore();
    if (pvpChannel && channelHandler) {
      pvpChannel.removeEventListener('message', channelHandler);
    }
  };
}

export function resetLocalPvPData() {
  try {
    localStorage.removeItem(PVP_STORAGE_KEY);
    localStorage.removeItem(PVP_HISTORY_KEY);
    recordedRoomOutcomes.clear();
  } catch (e) {
    console.error('Error clearing local PvP data:', e);
  }
}
