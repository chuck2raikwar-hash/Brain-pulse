import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile
} from 'firebase/auth';
import {
  auth,
  googleProvider,
  getOrCreateUserProfile,
  recordGameSession,
  updateUserProfileName,
  updateUserSubscription,
  cancelUserSubscription,
  expireTrialForTesting,
  resetTrialForTesting,
  resetUserToNewJoiner,
  SEVEN_DAYS_MS
} from '../lib/firebase';
import { resetLocalPvPData } from '../lib/pvpService';
import { UserProfile, GameType, GameResult, SubscriptionPlan, GameHistoryEntry } from '../types';

const LOCAL_STORAGE_PROFILE_KEY = 'cortex_guest_profile_v1';

const getInitialGuestProfile = (): UserProfile => {
  const saved = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }

  const defaultProfile: UserProfile = {
    uid: 'guest-player',
    email: null,
    displayName: 'Brain Athlete',
    photoURL: '',
    brainPowerScore: 120,
    dailyStreak: 1,
    lastActiveDateStr: new Date().toISOString().split('T')[0],
    totalGamesPlayed: 0,
    totalScore: 0,
    favoriteGame: 'None',
    peakMemoryAccuracy: 0,
    peakFocusScore: 0,
    peakReactionTimeMs: 0,
    highScores: {},
    gamesPlayedCount: {},
    subscriptionStatus: 'expired',
    isSubscribed: false,
    trialStartedAt: 0,
    trialExpiresAt: 0,
    subscriptionPlan: null,
    subscriptionExpiresAt: null,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(defaultProfile));
  return defaultProfile;
};

export interface PlayAccessStatus {
  canPlay: boolean;
  reason: 'not_signed_in' | 'trial_expired' | 'access_granted';
  daysLeft: number;
  passForNowActive?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalReason: string;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  isPaywallOpen: boolean;
  openPaywall: () => void;
  closePaywall: () => void;
  passForNow: boolean;
  setPassForNow: (enabled: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
  subscribe: (plan: SubscriptionPlan) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  expireTrialTesting: () => Promise<void>;
  resetTrialTesting: () => Promise<void>;
  resetToNewUser: () => Promise<UserProfile>;
  canUserPlay: () => PlayAccessStatus;
  recordGame: (data: {
    gameType: GameType;
    gameTitle: string;
    score: number;
    accuracy: number;
    level: number;
    responseTimeMs: number;
  }) => Promise<GameResult | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(getInitialGuestProfile);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<string>('default');
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [passForNow, setPassForNowState] = useState<boolean>(() => {
    const saved = localStorage.getItem('cortex_pass_for_now');
    // Default to true per user request: "let me pass fornow add it later"
    return saved !== null ? saved === 'true' : true;
  });

  const setPassForNow = React.useCallback((enabled: boolean) => {
    setPassForNowState(enabled);
    localStorage.setItem('cortex_pass_for_now', String(enabled));
  }, []);

  const openAuthModal = React.useCallback((reason: string = 'default') => {
    setAuthModalReason(reason);
    setIsAuthModalOpen(true);
  }, []);
  const closeAuthModal = React.useCallback(() => setIsAuthModalOpen(false), []);

  const openPaywall = React.useCallback(() => setIsPaywallOpen(true), []);
  const closePaywall = React.useCallback(() => setIsPaywallOpen(false), []);

  const loadProfile = async (currentUser: User) => {
    try {
      const p = await getOrCreateUserProfile(currentUser);
      setProfile(p);
    } catch (e) {
      console.error('Error loading profile from Firestore:', e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const AUTO_RESET_KEY = 'cortex_test_just_joined_v2';
      const shouldAutoResetToNewJoiner = !localStorage.getItem(AUTO_RESET_KEY);

      if (currentUser) {
        setUser(currentUser);
        localStorage.removeItem('cortex_local_user');
        if (shouldAutoResetToNewJoiner) {
          localStorage.setItem(AUTO_RESET_KEY, 'true');
          try {
            const fresh = await resetUserToNewJoiner(currentUser);
            setProfile(fresh);
            setPassForNow(false);
            localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(fresh));
            localStorage.removeItem('cortex_local_game_history');
            localStorage.removeItem('brainpulse_journal_entries');
            resetLocalPvPData();
          } catch (err) {
            console.warn('Auto reset to new joiner failed, falling back to loadProfile:', err);
            await loadProfile(currentUser);
          }
        } else {
          await loadProfile(currentUser);
        }
      } else {
        // Fall back to local athlete profile if previously signed in locally, or guest profile
        if (shouldAutoResetToNewJoiner) {
          localStorage.setItem(AUTO_RESET_KEY, 'true');
          const now = Date.now();
          const today = new Date().toISOString().split('T')[0];
          const freshLocal: UserProfile = {
            uid: 'athlete-player',
            email: null,
            displayName: 'Brain Athlete',
            photoURL: '',
            brainPowerScore: 100,
            dailyStreak: 1,
            lastActiveDateStr: today,
            totalGamesPlayed: 0,
            totalScore: 0,
            favoriteGame: 'None',
            peakMemoryAccuracy: 0,
            peakFocusScore: 0,
            peakReactionTimeMs: 0,
            highScores: {},
            gamesPlayedCount: {},
            subscriptionStatus: 'trial',
            isSubscribed: false,
            trialStartedAt: now,
            trialExpiresAt: now + SEVEN_DAYS_MS,
            subscriptionPlan: null,
            subscriptionExpiresAt: null,
            createdAt: now,
            updatedAt: now
          };
          const mockUser: any = {
            uid: 'athlete-player',
            email: null,
            displayName: 'Brain Athlete',
            photoURL: null,
            emailVerified: false,
            isAnonymous: false
          };
          setUser(mockUser);
          setProfile(freshLocal);
          setPassForNow(false);
          localStorage.setItem('cortex_local_user', JSON.stringify(mockUser));
          localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(freshLocal));
          localStorage.removeItem('cortex_local_game_history');
          localStorage.removeItem('brainpulse_journal_entries');
          resetLocalPvPData();
        } else {
          const savedLocalUser = localStorage.getItem('cortex_local_user');
          if (savedLocalUser) {
            try {
              const parsedUser = JSON.parse(savedLocalUser);
              setUser(parsedUser);
              const savedProf = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
              if (savedProf) {
                setProfile(JSON.parse(savedProf));
              } else {
                setProfile(getInitialGuestProfile());
              }
            } catch {
              setUser(null);
              setProfile(getInitialGuestProfile());
            }
          } else {
            setUser(null);
            setProfile(getInitialGuestProfile());
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setPassForNow]);

  const isOperationNotAllowed = (err: any): boolean => {
    return (
      err?.code === 'auth/operation-not-allowed' ||
      (typeof err?.message === 'string' && err.message.includes('auth/operation-not-allowed'))
    );
  };

  const activateLocalAthlete = (email: string, displayName: string) => {
    const cleanHandle = displayName?.trim() || email.split('@')[0] || 'Brain Athlete';
    const localUid = `local_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const mockUser: any = {
      uid: localUid,
      email,
      displayName: cleanHandle,
      photoURL: null,
      emailVerified: false,
      isAnonymous: false
    };

    const now = Date.now();
    const existing = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
    let baseProf = getInitialGuestProfile();
    if (existing) {
      try {
        baseProf = { ...baseProf, ...JSON.parse(existing) };
      } catch {
        // ignore
      }
    }

    const localProfile: UserProfile = {
      ...baseProf,
      uid: localUid,
      email,
      displayName: cleanHandle,
      subscriptionStatus: baseProf.isSubscribed ? 'active' : 'trial',
      trialStartedAt: baseProf.trialStartedAt || now,
      trialExpiresAt: baseProf.trialExpiresAt && baseProf.trialExpiresAt > now ? baseProf.trialExpiresAt : now + SEVEN_DAYS_MS,
      updatedAt: now
    };

    localStorage.setItem('cortex_local_user', JSON.stringify(mockUser));
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(localProfile));
    setUser(mockUser);
    setProfile(localProfile);
  };

  const signInWithGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      if (cred.user) {
        localStorage.removeItem('cortex_local_user');
        await loadProfile(cred.user);
        setIsAuthModalOpen(false);
      }
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        console.warn('Google Sign In warning:', err?.message || err);
      }
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        localStorage.removeItem('cortex_local_user');
        await loadProfile(cred.user);
        setIsAuthModalOpen(false);
      }
    } catch (err: any) {
      if (isOperationNotAllowed(err)) {
        // Email/Password provider is disabled in Firebase Console.
        // Smoothly activate local athlete profile so user can immediately play without error.
        activateLocalAthlete(email, email.split('@')[0] || 'Brain Athlete');
        setIsAuthModalOpen(false);
        return;
      }
      console.warn('Email sign in issue:', err?.message || err);
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: name });
        localStorage.removeItem('cortex_local_user');
        await loadProfile(cred.user);
        setIsAuthModalOpen(false);
      }
    } catch (err: any) {
      if (isOperationNotAllowed(err)) {
        // Email/Password provider is disabled in Firebase Console.
        // Smoothly activate local athlete profile so user can immediately play without error.
        activateLocalAthlete(email, name);
        setIsAuthModalOpen(false);
        return;
      }
      console.warn('Sign up issue:', err?.message || err);
      throw err;
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      if (isOperationNotAllowed(err)) {
        throw new Error('Email/Password provider is disabled in Firebase. Please sign in with Google or use the Instant Athlete profile.');
      }
      console.warn('Password reset issue:', err?.message || err);
      throw err;
    }
  };

  const logout = async () => {
    if (auth.currentUser) {
      await signOut(auth);
    }
    localStorage.removeItem('cortex_local_user');
    setUser(null);
    const guestProf = getInitialGuestProfile();
    setProfile(guestProf);
  };

  const refreshProfile = async () => {
    if (auth.currentUser) {
      await loadProfile(auth.currentUser);
    }
  };

  const updateName = async (name: string) => {
    if (user && profile && auth.currentUser) {
      await updateUserProfileName(user.uid, name);
      await updateProfile(auth.currentUser, { displayName: name });
      setProfile({
        ...profile,
        displayName: name
      });
    } else if (profile) {
      const updated = { ...profile, displayName: name };
      setProfile(updated);
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated));
      if (user) {
        const updatedUser = { ...user, displayName: name };
        setUser(updatedUser as any);
        localStorage.setItem('cortex_local_user', JSON.stringify(updatedUser));
      }
    }
  };

  const subscribe = async (plan: SubscriptionPlan) => {
    if (!user) {
      openAuthModal('subscribe');
      return;
    }
    let expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    if (auth.currentUser) {
      const result = await updateUserSubscription(user.uid, plan);
      expiresAt = result.expiresAt;
    }
    if (profile) {
      const updated: UserProfile = {
        ...profile,
        isSubscribed: true,
        subscriptionStatus: 'active',
        subscriptionPlan: plan,
        subscriptionExpiresAt: expiresAt,
        updatedAt: Date.now()
      };
      setProfile(updated);
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated));
    }
    setIsPaywallOpen(false);
  };

  const cancelSubscription = async () => {
    if (user && profile) {
      if (auth.currentUser) {
        await cancelUserSubscription(user.uid);
      }
      const updated: UserProfile = {
        ...profile,
        isSubscribed: false,
        subscriptionStatus: 'canceled',
        subscriptionPlan: null,
        updatedAt: Date.now()
      };
      setProfile(updated);
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated));
    }
  };

  const expireTrialTesting = async () => {
    if (user && profile) {
      if (auth.currentUser) {
        await expireTrialForTesting(user.uid);
      }
      const updated: UserProfile = {
        ...profile,
        isSubscribed: false,
        subscriptionStatus: 'expired',
        trialExpiresAt: Date.now() - 1000,
        subscriptionPlan: null,
        updatedAt: Date.now()
      };
      setProfile(updated);
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated));
    } else if (profile) {
      const updated: UserProfile = {
        ...profile,
        isSubscribed: false,
        subscriptionStatus: 'expired',
        trialExpiresAt: Date.now() - 1000
      };
      setProfile(updated);
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated));
    }
  };

  const resetTrialTesting = async () => {
    const now = Date.now();
    if (user && profile) {
      if (auth.currentUser) {
        await resetTrialForTesting(user.uid);
      }
      const updated: UserProfile = {
        ...profile,
        isSubscribed: false,
        subscriptionStatus: 'trial',
        trialStartedAt: now,
        trialExpiresAt: now + SEVEN_DAYS_MS,
        subscriptionPlan: null,
        updatedAt: now
      };
      setProfile(updated);
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated));
    } else if (profile) {
      const updated: UserProfile = {
        ...profile,
        isSubscribed: false,
        subscriptionStatus: 'trial',
        trialStartedAt: now,
        trialExpiresAt: now + SEVEN_DAYS_MS
      };
      setProfile(updated);
      localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updated));
    }
  };

  const resetToNewUser = async (): Promise<UserProfile> => {
    const now = Date.now();
    let freshProf: UserProfile;

    if (auth.currentUser) {
      try {
        freshProf = await resetUserToNewJoiner(auth.currentUser);
      } catch (err) {
        console.warn('Firestore resetUserToNewJoiner error, using local fallback:', err);
        const today = new Date().toISOString().split('T')[0];
        freshProf = {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          displayName: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'Brain Athlete',
          photoURL: auth.currentUser.photoURL || undefined,
          brainPowerScore: 100,
          dailyStreak: 1,
          lastActiveDateStr: today,
          totalGamesPlayed: 0,
          totalScore: 0,
          favoriteGame: 'None',
          peakMemoryAccuracy: 0,
          peakFocusScore: 0,
          peakReactionTimeMs: 0,
          highScores: {},
          gamesPlayedCount: {},
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
    } else {
      const today = new Date().toISOString().split('T')[0];
      const baseUid = user?.uid || `athlete-${Date.now().toString(36)}`;
      const baseDisplayName = user?.displayName || 'Brain Athlete';
      freshProf = {
        uid: baseUid,
        email: user?.email || null,
        displayName: baseDisplayName,
        photoURL: '',
        brainPowerScore: 100,
        dailyStreak: 1,
        lastActiveDateStr: today,
        totalGamesPlayed: 0,
        totalScore: 0,
        favoriteGame: 'None',
        peakMemoryAccuracy: 0,
        peakFocusScore: 0,
        peakReactionTimeMs: 0,
        highScores: {},
        gamesPlayedCount: {},
        subscriptionStatus: 'trial',
        isSubscribed: false,
        trialStartedAt: now,
        trialExpiresAt: now + SEVEN_DAYS_MS,
        subscriptionPlan: null,
        subscriptionExpiresAt: null,
        createdAt: now,
        updatedAt: now
      };
      const mockUser: any = {
        uid: baseUid,
        email: user?.email || null,
        displayName: baseDisplayName,
        photoURL: null,
        emailVerified: false,
        isAnonymous: false
      };
      setUser(mockUser);
      localStorage.setItem('cortex_local_user', JSON.stringify(mockUser));
    }

    // Set passForNow to false so user actually experiences the 7-day trial flow
    setPassForNow(false);

    // Clear local storage history, PvP stats, and journal
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(freshProf));
    localStorage.removeItem('cortex_local_game_history');
    localStorage.removeItem('brainpulse_journal_entries');
    resetLocalPvPData();

    setProfile(freshProf);
    return freshProf;
  };

  const canUserPlay = React.useCallback((): PlayAccessStatus => {
    // 0. If "Pass for Now" is enabled, bypass all blocking gates so the user can play freely right now
    if (passForNow) {
      return { canPlay: true, reason: 'access_granted', daysLeft: 999, passForNowActive: true };
    }

    // 1. Must be signed in with an account
    if (!user) {
      return { canPlay: false, reason: 'not_signed_in', daysLeft: 0, passForNowActive: false };
    }

    // 2. Paid active subscriber has unlimited access
    if (profile?.isSubscribed || profile?.subscriptionStatus === 'active') {
      return { canPlay: true, reason: 'access_granted', daysLeft: 999, passForNowActive: false };
    }

    // 3. Check 1-week free trial
    const now = Date.now();
    const trialExp = profile?.trialExpiresAt || 0;
    if (trialExp > now) {
      const msRemaining = trialExp - now;
      const days = Math.max(1, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)));
      return { canPlay: true, reason: 'access_granted', daysLeft: days, passForNowActive: false };
    }

    // 4. Free trial expired and not paid: access blocked
    return { canPlay: false, reason: 'trial_expired', daysLeft: 0, passForNowActive: false };
  }, [passForNow, user, profile?.isSubscribed, profile?.subscriptionStatus, profile?.trialExpiresAt]);

  const recordGame = React.useCallback(async (data: {
    gameType: GameType;
    gameTitle: string;
    score: number;
    accuracy: number;
    level: number;
    responseTimeMs: number;
  }): Promise<GameResult | null> => {
    if (user && profile && auth.currentUser) {
      const { updatedProfile, gameResult } = await recordGameSession(user.uid, profile, data);
      setProfile(updatedProfile);
      return gameResult;
    }

    // Guest / Local Athlete mode recording
    const currentProf = profile || getInitialGuestProfile();
    const prevHigh = currentProf.highScores?.[data.gameType] || 0;
    const isNewHighScore = data.score > prevHigh;
    const brainDelta = Math.max(10, Math.floor(data.score / 25));

    const updatedHighScores = {
      ...currentProf.highScores,
      [data.gameType]: Math.max(prevHigh, data.score)
    };

    const updatedCounts = {
      ...currentProf.gamesPlayedCount,
      [data.gameType]: (currentProf.gamesPlayedCount?.[data.gameType] || 0) + 1
    };

    const updatedProf: UserProfile = {
      ...currentProf,
      brainPowerScore: (currentProf.brainPowerScore || 100) + brainDelta,
      totalGamesPlayed: (currentProf.totalGamesPlayed || 0) + 1,
      totalScore: (currentProf.totalScore || 0) + data.score,
      highScores: updatedHighScores,
      gamesPlayedCount: updatedCounts,
      updatedAt: Date.now()
    };

    setProfile(updatedProf);
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updatedProf));

    // Save to local game history
    const now = Date.now();
    const localEntry: GameHistoryEntry = {
      id: `${data.gameType}_${now}`,
      userId: user?.uid || 'athlete-player',
      gameType: data.gameType,
      gameTitle: data.gameTitle,
      score: data.score,
      accuracy: data.accuracy,
      level: data.level,
      responseTimeMs: data.responseTimeMs,
      timestamp: now,
      dateStr: new Date().toISOString().split('T')[0]
    };
    try {
      const stored = localStorage.getItem('cortex_local_game_history');
      const list: GameHistoryEntry[] = stored ? JSON.parse(stored) : [];
      list.unshift(localEntry);
      localStorage.setItem('cortex_local_game_history', JSON.stringify(list.slice(0, 100)));
    } catch {
      // ignore
    }

    return {
      gameType: data.gameType,
      gameTitle: data.gameTitle,
      score: data.score,
      accuracy: data.accuracy,
      level: data.level,
      responseTimeMs: data.responseTimeMs,
      isNewHighScore,
      previousHighScore: prevHigh,
      streakGained: updatedProf.dailyStreak,
      brainPowerGained: brainDelta
    };
  }, [user, profile]);

  const contextValue = React.useMemo(() => ({
    user,
    profile,
    loading,
    isAuthModalOpen,
    authModalReason,
    openAuthModal,
    closeAuthModal,
    isPaywallOpen,
    openPaywall,
    closePaywall,
    passForNow,
    setPassForNow,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    logout,
    refreshProfile,
    updateName,
    subscribe,
    cancelSubscription,
    expireTrialTesting,
    resetTrialTesting,
    resetToNewUser,
    canUserPlay,
    recordGame
  }), [
    user,
    profile,
    loading,
    isAuthModalOpen,
    authModalReason,
    openAuthModal,
    closeAuthModal,
    isPaywallOpen,
    openPaywall,
    closePaywall,
    passForNow,
    setPassForNow,
    canUserPlay,
    recordGame
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
