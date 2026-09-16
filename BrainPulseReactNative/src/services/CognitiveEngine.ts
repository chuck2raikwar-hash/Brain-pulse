import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, GameSessionResult, GameId } from '../types';

const PROFILE_KEY = '@brainpulse_profile';
const SESSIONS_KEY = '@brainpulse_sessions';

const DEFAULT_PROFILE: UserProfile = {
  id: 'local_user',
  displayName: 'Neural Challenger',
  brainPower: 1240,
  dailyStreak: 3,
  lastPlayedDate: new Date().toISOString(),
  highScores: {
    memory_matrix: 1450,
    reaction_speed: 215,
    color_confusion: 1800,
    n_back: 1200,
    breathing_pacer: 100,
  },
  completedDrillsCount: 14,
  isPro: true,
};

type Listener = () => void;

class CognitiveEngine {
  private static instance: CognitiveEngine;
  private profile: UserProfile = DEFAULT_PROFILE;
  private sessions: GameSessionResult[] = [];
  private listeners: Set<Listener> = new Set();
  private initialized: boolean = false;

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): CognitiveEngine {
    if (!CognitiveEngine.instance) {
      CognitiveEngine.instance = new CognitiveEngine();
    }
    return CognitiveEngine.instance;
  }

  private async loadFromStorage() {
    try {
      const storedProfile = await AsyncStorage.getItem(PROFILE_KEY);
      if (storedProfile) {
        this.profile = { ...DEFAULT_PROFILE, ...JSON.parse(storedProfile) };
      }
      const storedSessions = await AsyncStorage.getItem(SESSIONS_KEY);
      if (storedSessions) {
        this.sessions = JSON.parse(storedSessions);
      }
    } catch (e) {
      console.warn('Failed to load storage in React Native:', e);
    } finally {
      this.initialized = true;
      this.notify();
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getProfile(): UserProfile {
    return this.profile;
  }

  public getSessions(): GameSessionResult[] {
    return this.sessions;
  }

  public getHighScore(gameId: GameId): number {
    return this.profile.highScores[gameId] || 0;
  }

  public async recordResult(
    gameId: GameId,
    score: number,
    accuracy: number,
    responseTimeMs?: number
  ): Promise<GameSessionResult> {
    const gained = Math.max(15, Math.round(score / 25));
    const newSession: GameSessionResult = {
      id: Date.now().toString(),
      gameId,
      score,
      accuracyPercentage: accuracy,
      responseTimeMs,
      brainPowerGained: gained,
      timestamp: new Date().toISOString(),
    };

    this.sessions = [newSession, ...this.sessions.slice(0, 49)];
    
    // Update high score
    const currentHigh = this.profile.highScores[gameId] || 0;
    const isNewHigh = score > currentHigh;
    const updatedHighScores = {
      ...this.profile.highScores,
      [gameId]: Math.max(currentHigh, score),
    };

    // Update profile
    this.profile = {
      ...this.profile,
      brainPower: this.profile.brainPower + gained,
      completedDrillsCount: this.profile.completedDrillsCount + 1,
      highScores: updatedHighScores,
      lastPlayedDate: new Date().toISOString(),
    };

    this.notify();

    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(this.profile));
      await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(this.sessions));
    } catch (e) {
      console.warn('Failed to save to storage:', e);
    }

    return newSession;
  }

  public async updateDisplayName(name: string) {
    this.profile = { ...this.profile, displayName: name };
    this.notify();
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(this.profile));
    } catch (e) {
      console.warn(e);
    }
  }
}

export const cognitiveEngine = CognitiveEngine.getInstance();
