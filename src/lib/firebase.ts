import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, GameHistoryEntry, LeaderboardEntry, GameType, GameResult } from '../types';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test initial connection to Firestore
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export const DEFAULT_GAMES: GameType[] = [
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
  'guided-meditation',
  'breathing-pacer',
  'journaling-prompts',
  'reaction-drill',
  'stretching-dual'
];

export function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function getDefaultUserProfile(user: User): UserProfile {
  const today = getTodayDateString();
  const now = Date.now();
  const initialHighScores: Record<string, number> = {};
  const initialGamesPlayed: Record<string, number> = {};
  DEFAULT_GAMES.forEach(g => {
    initialHighScores[g] = 0;
    initialGamesPlayed[g] = 0;
  });

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email?.split('@')[0] || 'Brain Athlete',
    photoURL: user.photoURL || undefined,
    brainPowerScore: 100,
    dailyStreak: 1,
    lastActiveDateStr: today,
    totalGamesPlayed: 0,
    totalScore: 0,
    favoriteGame: 'None',
    peakMemoryAccuracy: 0,
    peakFocusScore: 0,
    peakReactionTimeMs: 0,
    highScores: initialHighScores,
    gamesPlayedCount: initialGamesPlayed,
    subscriptionStatus: 'trial',
    isSubscribed: false,
    trialStartedAt: now,
    trialExpiresAt: now + SEVEN_DAYS_MS,
    subscriptionPlan: null,
    subscriptionExpiresAt: null,
    createdAt: now,
    updatedAt: now
  };
}

// User Profile Operations
export async function getOrCreateUserProfile(user: User): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      const today = getTodayDateString();
      const now = Date.now();
      const updates: any = {};
      let hasUpdates = false;

      // Ensure subscription & 7-day free trial fields exist
      if (!data.trialExpiresAt) {
        const trialStart = data.createdAt || now;
        data.trialStartedAt = trialStart;
        data.trialExpiresAt = trialStart + SEVEN_DAYS_MS;
        data.isSubscribed = !!data.isSubscribed;
        data.subscriptionStatus = data.isSubscribed ? 'active' : (now < data.trialExpiresAt ? 'trial' : 'expired');
        data.subscriptionPlan = data.subscriptionPlan || null;

        updates.trialStartedAt = data.trialStartedAt;
        updates.trialExpiresAt = data.trialExpiresAt;
        updates.subscriptionStatus = data.subscriptionStatus;
        updates.isSubscribed = data.isSubscribed;
        updates.subscriptionPlan = data.subscriptionPlan;
        hasUpdates = true;
      } else if (!data.isSubscribed && data.subscriptionStatus === 'trial' && now >= data.trialExpiresAt) {
        data.subscriptionStatus = 'expired';
        updates.subscriptionStatus = 'expired';
        hasUpdates = true;
      }

      // Check streak continuity
      if (data.lastActiveDateStr !== today) {
        const lastDate = new Date(data.lastActiveDateStr);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        let newStreak = data.dailyStreak || 1;
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1; // streak reset
        }

        data.dailyStreak = newStreak;
        data.lastActiveDateStr = today;
        updates.dailyStreak = newStreak;
        updates.lastActiveDateStr = today;
        hasUpdates = true;
      }

      if (hasUpdates) {
        data.updatedAt = now;
        updates.updatedAt = now;
        await updateDoc(userRef, updates);
      }

      return data;
    } else {
      const newProfile = getDefaultUserProfile(user);
      await setDoc(userRef, newProfile);
      return newProfile;
    }
  } catch (err: any) {
    console.error('Error fetching user profile:', err);
    if (err?.code === 'permission-denied' || err?.message?.includes('Missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
    }
    // Fallback profile
    return getDefaultUserProfile(user);
  }
}

export async function updateUserSubscription(
  userId: string,
  plan: 'monthly' | 'annual'
): Promise<{ status: 'active'; plan: 'monthly' | 'annual'; expiresAt: number }> {
  const userRef = doc(db, 'users', userId);
  const now = Date.now();
  const durationMs = plan === 'annual' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
  const expiresAt = now + durationMs;

  try {
    await updateDoc(userRef, {
      isSubscribed: true,
      subscriptionStatus: 'active',
      subscriptionPlan: plan,
      subscriptionExpiresAt: expiresAt,
      updatedAt: now
    });
    return { status: 'active', plan, expiresAt };
  } catch (err: any) {
    console.error('Error updating subscription:', err);
    if (err?.code === 'permission-denied' || err?.message?.includes('Missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    }
    throw err;
  }
}

export async function cancelUserSubscription(userId: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const now = Date.now();
  try {
    await updateDoc(userRef, {
      isSubscribed: false,
      subscriptionStatus: 'canceled',
      subscriptionPlan: null,
      updatedAt: now
    });
  } catch (err: any) {
    console.error('Error canceling subscription:', err);
    if (err?.code === 'permission-denied' || err?.message?.includes('Missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    }
    throw err;
  }
}

export async function expireTrialForTesting(userId: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const now = Date.now();
  try {
    await updateDoc(userRef, {
      isSubscribed: false,
      subscriptionStatus: 'expired',
      trialExpiresAt: now - 1000,
      subscriptionPlan: null,
      updatedAt: now
    });
  } catch (err: any) {
    console.error('Error expiring trial for testing:', err);
    if (err?.code === 'permission-denied' || err?.message?.includes('Missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    }
    throw err;
  }
}

export async function resetTrialForTesting(userId: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const now = Date.now();
  try {
    await updateDoc(userRef, {
      isSubscribed: false,
      subscriptionStatus: 'trial',
      trialStartedAt: now,
      trialExpiresAt: now + SEVEN_DAYS_MS,
      subscriptionPlan: null,
      updatedAt: now
    });
  } catch (err: any) {
    console.error('Error resetting trial for testing:', err);
    if (err?.code === 'permission-denied' || err?.message?.includes('Missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    }
    throw err;
  }
}

export async function resetUserToNewJoiner(user: User): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const freshProfile = getDefaultUserProfile(user);

  try {
    await setDoc(userRef, freshProfile);
    return freshProfile;
  } catch (err: any) {
    console.error('Error resetting user to new joiner:', err);
    if (err?.code === 'permission-denied' || err?.message?.includes('Missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    }
    throw err;
  }
}

export async function updateUserProfileName(userId: string, displayName: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, {
      displayName,
      updatedAt: Date.now()
    });
  } catch (err: any) {
    console.error('Error updating user profile name:', err);
    if (err?.code === 'permission-denied' || err?.message?.includes('Missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
    }
    throw err;
  }
}

// Record a completed game session
export async function recordGameSession(
  userId: string,
  profile: UserProfile,
  result: {
    gameType: GameType;
    gameTitle: string;
    score: number;
    accuracy: number;
    level: number;
    responseTimeMs: number;
  }
): Promise<{ updatedProfile: UserProfile; gameResult: GameResult }> {
  const now = Date.now();
  const today = getTodayDateString();
  const currentHighScore = profile.highScores?.[result.gameType] || 0;
  const isNewHighScore = result.score > currentHighScore;
  const newHighScore = Math.max(currentHighScore, result.score);

  // Compute favorite game
  const newGamesPlayedCount = {
    ...profile.gamesPlayedCount,
    [result.gameType]: (profile.gamesPlayedCount?.[result.gameType] || 0) + 1
  };

  let maxPlays = 0;
  let favorite: GameType = result.gameType;
  Object.entries(newGamesPlayedCount).forEach(([game, count]) => {
    if (count > maxPlays) {
      maxPlays = count;
      favorite = game as GameType;
    }
  });

  // Calculate brain power points earned
  const brainPowerGain = Math.max(10, Math.floor(result.score / 15) + Math.floor(result.accuracy / 4) + (result.level * 5));
  const newBrainPower = (profile.brainPowerScore || 100) + brainPowerGain;
  const newTotalScore = (profile.totalScore || 0) + result.score;
  const newTotalGames = (profile.totalGamesPlayed || 0) + 1;

  // Peak metrics calculation
  let peakAccuracy = profile.peakMemoryAccuracy || 0;
  let peakFocus = profile.peakFocusScore || 0;
  let peakReaction = profile.peakReactionTimeMs || 9999;

  if (result.gameType === 'memory-matrix' || result.gameType === 'number-recall') {
    peakAccuracy = Math.max(peakAccuracy, result.accuracy);
  }
  if (result.gameType === 'color-confusion' || result.gameType === 'n-back') {
    peakFocus = Math.max(peakFocus, result.score);
  }
  if (result.responseTimeMs > 0) {
    peakReaction = peakReaction === 9999 ? result.responseTimeMs : Math.min(peakReaction, result.responseTimeMs);
  }

  const updatedProfile: UserProfile = {
    ...profile,
    brainPowerScore: newBrainPower,
    totalGamesPlayed: newTotalGames,
    totalScore: newTotalScore,
    favoriteGame: favorite,
    peakMemoryAccuracy: peakAccuracy,
    peakFocusScore: peakFocus,
    peakReactionTimeMs: peakReaction === 9999 ? 0 : peakReaction,
    highScores: {
      ...profile.highScores,
      [result.gameType]: newHighScore
    },
    gamesPlayedCount: newGamesPlayedCount,
    updatedAt: now
  };

  const historyEntry: GameHistoryEntry = {
    id: `${result.gameType}_${now}`,
    userId,
    gameType: result.gameType,
    gameTitle: result.gameTitle,
    score: result.score,
    accuracy: result.accuracy,
    level: result.level,
    responseTimeMs: result.responseTimeMs,
    timestamp: now,
    dateStr: today
  };

  // Mirror to local storage for instant offline availability & zero latency UI
  try {
    const stored = localStorage.getItem('cortex_local_game_history');
    const list: GameHistoryEntry[] = stored ? JSON.parse(stored) : [];
    // Remove if already exists with same id or timestamp
    const filtered = list.filter(e => e.id !== historyEntry.id && !(e.gameType === historyEntry.gameType && Math.abs(e.timestamp - historyEntry.timestamp) < 500));
    filtered.unshift(historyEntry);
    localStorage.setItem('cortex_local_game_history', JSON.stringify(filtered.slice(0, 100)));
  } catch {
    // ignore
  }

  try {
    // 1. Update user profile document
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, updatedProfile, { merge: true });

    // 2. Add to game history subcollection
    const historyCol = collection(db, 'users', userId, 'game_history');
    await addDoc(historyCol, historyEntry);

    // 3. Update global leaderboard record if high score or overall update
    const leaderboardRecRef = doc(db, 'leaderboard_records', `${userId}_${result.gameType}`);
    await setDoc(leaderboardRecRef, {
      userId,
      displayName: profile.displayName || 'Brain Athlete',
      photoURL: profile.photoURL || '',
      gameType: result.gameType,
      score: newHighScore,
      level: result.level,
      accuracy: result.accuracy,
      responseTimeMs: result.responseTimeMs,
      updatedAt: now
    }, { merge: true });

    // 4. Update overall brain power record
    const overallLeaderboardRef = doc(db, 'leaderboard_records', `${userId}_overall`);
    await setDoc(overallLeaderboardRef, {
      userId,
      displayName: profile.displayName || 'Brain Athlete',
      photoURL: profile.photoURL || '',
      gameType: 'overall',
      score: newBrainPower,
      level: newTotalGames,
      accuracy: peakAccuracy,
      responseTimeMs: peakReaction === 9999 ? 0 : peakReaction,
      updatedAt: now
    }, { merge: true });
  } catch (err: any) {
    console.warn('Note: Could not sync game record to Firestore directly (local cache preserved):', err);
    if (err?.code === 'permission-denied' || err?.message?.includes('Missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.WRITE, `users/${userId}`);
    }
  }

  const gameResult: GameResult = {
    gameType: result.gameType,
    gameTitle: result.gameTitle,
    score: result.score,
    accuracy: result.accuracy,
    level: result.level,
    responseTimeMs: result.responseTimeMs,
    isNewHighScore,
    previousHighScore: currentHighScore,
    streakGained: profile.dailyStreak,
    brainPowerGained: brainPowerGain
  };

  return { updatedProfile, gameResult };
}

// Generate baseline calibration sessions for fresh profiles so telemetry starts calibrated
export function getBaselineCalibrationHistory(): GameHistoryEntry[] {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  return [
    {
      id: 'calib_run_4',
      userId: 'athlete-player',
      gameType: 'n-back',
      gameTitle: 'Pattern Match (2-Back Assessment)',
      score: 1340,
      accuracy: 94,
      level: 7,
      responseTimeMs: 440,
      timestamp: now - 3600000 * 5,
      dateStr: new Date(now - 3600000 * 5).toISOString().split('T')[0]
    },
    {
      id: 'calib_run_3',
      userId: 'athlete-player',
      gameType: 'color-confusion',
      gameTitle: 'Color Confusion (Stroop Speed)',
      score: 1180,
      accuracy: 92,
      level: 6,
      responseTimeMs: 410,
      timestamp: now - dayMs * 1,
      dateStr: new Date(now - dayMs * 1).toISOString().split('T')[0]
    },
    {
      id: 'calib_run_2',
      userId: 'athlete-player',
      gameType: 'reaction-drill',
      gameTitle: 'Reaction Speed Drill (Diagnostic)',
      score: 1040,
      accuracy: 95,
      level: 5,
      responseTimeMs: 360,
      timestamp: now - dayMs * 2,
      dateStr: new Date(now - dayMs * 2).toISOString().split('T')[0]
    },
    {
      id: 'calib_run_1',
      userId: 'athlete-player',
      gameType: 'memory-matrix',
      gameTitle: 'Memory Matrix (Calibration Baseline)',
      score: 860,
      accuracy: 88,
      level: 4,
      responseTimeMs: 520,
      timestamp: now - dayMs * 3,
      dateStr: new Date(now - dayMs * 3).toISOString().split('T')[0]
    }
  ];
}

// Fetch user's game history from Firestore and local cache
export async function fetchUserGameHistory(userId: string, count = 50): Promise<GameHistoryEntry[]> {
  let localEntries: GameHistoryEntry[] = [];
  try {
    const stored = localStorage.getItem('cortex_local_game_history');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        localEntries = parsed;
      }
    }
  } catch {
    // ignore
  }

  // If local history is completely empty, initialize baseline calibration so user can immediately see trajectory
  if (localEntries.length === 0) {
    localEntries = getBaselineCalibrationHistory();
    try {
      localStorage.setItem('cortex_local_game_history', JSON.stringify(localEntries));
    } catch {
      // ignore
    }
  }

  // If guest, local user, or not signed into Firebase, return local entries directly
  if (!auth.currentUser || userId.startsWith('local_') || userId === 'guest-player' || userId === 'athlete-player') {
    return localEntries.slice(0, count);
  }

  const pathForHistory = `users/${userId}/game_history`;
  try {
    const historyCol = collection(db, 'users', userId, 'game_history');
    const q = query(historyCol, orderBy('timestamp', 'desc'), limit(count));
    const snap = await getDocs(q);
    const firestoreList: GameHistoryEntry[] = [];
    snap.forEach(d => {
      firestoreList.push({ id: d.id, ...(d.data() as Omit<GameHistoryEntry, 'id'>) });
    });

    if (firestoreList.length === 0) {
      return localEntries.slice(0, count);
    }

    // Merge and deduplicate by ID and approximate timestamp
    const map = new Map<string, GameHistoryEntry>();
    localEntries.forEach(item => {
      const key = item.id || `${item.gameType}_${item.timestamp}`;
      map.set(key, item);
    });
    firestoreList.forEach(item => {
      const key = item.id || `${item.gameType}_${item.timestamp}`;
      map.set(key, item);
    });

    const merged = Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
    try {
      localStorage.setItem('cortex_local_game_history', JSON.stringify(merged.slice(0, 100)));
    } catch {
      // ignore
    }
    return merged.slice(0, count);
  } catch (err: any) {
    console.warn('Could not query Firestore game history, returning cached local sessions:', err);
    if (err?.code === 'permission-denied' || err?.message?.includes('Missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.LIST, pathForHistory);
    }
    return localEntries.slice(0, count);
  }
}

// Benchmark records for when database has freshly initialized or empty collection
function getBenchmarkRecords(gameType: string): LeaderboardEntry[] {
  const now = Date.now();
  const baseScores: Record<string, number> = {
    'overall': 2850,
    'memory-matrix': 1650,
    'color-confusion': 1420,
    'number-recall': 1780,
    'n-back': 1340,
    'matching-cards': 1520,
    'recall-sequence': 1380,
    'distraction-task': 1280,
    'logic-puzzles': 1200,
    'word-games': 1300,
    'pattern-recognition': 1450,
    'guided-meditation': 1050,
    'breathing-pacer': 1100,
    'journaling-prompts': 980,
    'reaction-drill': 1400,
    'stretching-dual': 1150,
  };

  const top = baseScores[gameType] || 1500;

  return [
    {
      id: 'bench_1',
      userId: 'bench_1',
      displayName: 'Elena Rostova',
      photoURL: '',
      gameType: gameType as GameType,
      score: top,
      level: 14,
      accuracy: 98,
      responseTimeMs: 320,
      updatedAt: now - 3600000 * 12
    },
    {
      id: 'bench_2',
      userId: 'bench_2',
      displayName: 'Marcus Vance',
      photoURL: '',
      gameType: gameType as GameType,
      score: Math.round(top * 0.88),
      level: 12,
      accuracy: 94,
      responseTimeMs: 385,
      updatedAt: now - 3600000 * 24
    },
    {
      id: 'bench_3',
      userId: 'bench_3',
      displayName: 'Aria Chen',
      photoURL: '',
      gameType: gameType as GameType,
      score: Math.round(top * 0.78),
      level: 10,
      accuracy: 91,
      responseTimeMs: 430,
      updatedAt: now - 3600000 * 48
    },
    {
      id: 'bench_4',
      userId: 'bench_4',
      displayName: 'Jordan Blake',
      photoURL: '',
      gameType: gameType as GameType,
      score: Math.round(top * 0.69),
      level: 8,
      accuracy: 88,
      responseTimeMs: 490,
      updatedAt: now - 3600000 * 72
    },
    {
      id: 'bench_5',
      userId: 'bench_5',
      displayName: 'Sofia Morales',
      photoURL: '',
      gameType: gameType as GameType,
      score: Math.round(top * 0.61),
      level: 7,
      accuracy: 85,
      responseTimeMs: 540,
      updatedAt: now - 3600000 * 96
    },
    {
      id: 'bench_6',
      userId: 'bench_6',
      displayName: 'Liam Takahashi',
      photoURL: '',
      gameType: gameType as GameType,
      score: Math.round(top * 0.54),
      level: 6,
      accuracy: 83,
      responseTimeMs: 590,
      updatedAt: now - 3600000 * 120
    }
  ];
}

// Fetch Leaderboard for a game or overall
export async function fetchLeaderboardRecords(gameType: GameType | 'overall' = 'overall', count = 25): Promise<LeaderboardEntry[]> {
  const pathForLeaderboard = 'leaderboard_records';
  try {
    const leaderboardCol = collection(db, pathForLeaderboard);
    // Simple filter query that doesn't require composite indexing in Firestore
    const q = query(leaderboardCol, where('gameType', '==', gameType), limit(count));
    const snap = await getDocs(q);
    const list: LeaderboardEntry[] = [];
    snap.forEach(d => {
      list.push({ id: d.id, ...(d.data() as Omit<LeaderboardEntry, 'id'>) });
    });
    
    // Sort descending by score
    list.sort((a, b) => b.score - a.score);

    if (list.length > 0) {
      return list;
    }
    return getBenchmarkRecords(gameType);
  } catch (err: any) {
    console.error('Error fetching leaderboard:', err);
    if (err?.code === 'permission-denied' || err?.message?.includes('Missing or insufficient permissions')) {
      handleFirestoreError(err, OperationType.LIST, pathForLeaderboard);
    }
    return getBenchmarkRecords(gameType);
  }
}

