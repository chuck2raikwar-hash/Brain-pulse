/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { Navbar, NavTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { GamesHubView } from './components/GamesHubView';
import { ProgressTrackerView } from './components/ProgressTrackerView';
import { LeaderboardView } from './components/LeaderboardView';
import { SettingsView } from './components/SettingsView';
import { GameResultModal } from './components/GameResultModal';
import { PvPHubView } from './components/pvp/PvPHubView';
import { PvPForfeitModal } from './components/pvp/PvPForfeitModal';
import { PvPRoom } from './types/pvp';

// Games
import { MemoryMatrix } from './games/MemoryMatrix';
import { ColorConfusion } from './games/ColorConfusion';
import { NumberRecall } from './games/NumberRecall';
import { NBackGame } from './games/NBackGame';
import { MatchingCards } from './games/MatchingCards';
import { RecallSequence } from './games/RecallSequence';
import { DistractionTask } from './games/DistractionTask';
import { LogicPuzzles } from './games/LogicPuzzles';
import { WordGames } from './games/WordGames';
import { PatternRecognition } from './games/PatternRecognition';
import { GuidedMeditation } from './games/GuidedMeditation';
import { BreathingPacer } from './games/BreathingPacer';
import { JournalingPrompts } from './games/JournalingPrompts';
import { QuickReactionDrill } from './games/QuickReactionDrill';
import { StretchingDualTask } from './games/StretchingDualTask';

import { GameType, GameResult } from './types';
import { GAME_MODES } from './data/games';
import { PaywallModal } from './components/PaywallModal';
import { Brain, Sparkles, Lock, ArrowRight, Crown, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function MainAppContent() {
  const {
    user,
    profile,
    loading,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    isPaywallOpen,
    openPaywall,
    closePaywall,
    canUserPlay,
    recordGame
  } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavTab>('games');
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [lastGameResult, setLastGameResult] = useState<GameResult | null>(null);
  const [selectedGameForPaywall, setSelectedGameForPaywall] = useState<string | null>(null);
  const [pendingGameToStart, setPendingGameToStart] = useState<GameType | null>(null);

  // PvP Active Match Interception & Forfeit Protection
  const [activePvPRoom, setActivePvPRoom] = useState<PvPRoom | null>(null);
  const pvpForfeitHandlerRef = React.useRef<(() => void) | null>(null);
  const [isLeavePvPModalOpen, setIsLeavePvPModalOpen] = useState(false);
  const [pendingNavigationTab, setPendingNavigationTab] = useState<NavTab | null>(null);
  const [forfeitToastMessage, setForfeitToastMessage] = useState<string | null>(null);

  const handleActiveRoomChange = React.useCallback((room: PvPRoom | null, forfeitFn?: () => void) => {
    setActivePvPRoom(prev => {
      if (!prev && !room) return prev;
      if (prev?.id === room?.id && prev?.phase === room?.phase) return prev;
      return room;
    });
    if (forfeitFn) {
      pvpForfeitHandlerRef.current = forfeitFn;
    } else if (!room) {
      pvpForfeitHandlerRef.current = null;
    }
  }, []);

  const access = canUserPlay();

  // Navigation request handler that protects PvP matches and queues
  const handleRequestTabChange = React.useCallback((targetTab: NavTab) => {
    // If navigating directly to PvP or already on same tab, allow without penalty
    if (targetTab === 'pvp' || targetTab === currentTab) {
      if (activeGame) {
        handleExitGame();
      }
      setCurrentTab(targetTab);
      return;
    }

    // Check if player is currently in an active PvP queue, voting, or match
    const isPvPActive =
      currentTab === 'pvp' &&
      !!activePvPRoom &&
      (activePvPRoom.phase === 'queueing' ||
        activePvPRoom.phase === 'voting' ||
        activePvPRoom.phase === 'in_progress');

    if (isPvPActive) {
      // Intercept and open forfeit warning modal
      setPendingNavigationTab(targetTab);
      setIsLeavePvPModalOpen(true);
      return;
    }

    if (activeGame) {
      handleExitGame();
    }
    setCurrentTab(targetTab);
  }, [currentTab, activeGame, activePvPRoom]);

  const handleConfirmLeavePvP = React.useCallback(() => {
    setIsLeavePvPModalOpen(false);
    if (pvpForfeitHandlerRef.current) {
      pvpForfeitHandlerRef.current();
    }
    setActivePvPRoom(null);

    const destTab = pendingNavigationTab || 'games';
    setPendingNavigationTab(null);
    setCurrentTab(destTab);

    setForfeitToastMessage('Match forfeited: 20 ELO rating points deducted from your combat record.');
    setTimeout(() => {
      setForfeitToastMessage(null);
    }, 5000);
  }, [pendingNavigationTab]);

  const handleStayInPvP = React.useCallback(() => {
    setIsLeavePvPModalOpen(false);
    setPendingNavigationTab(null);
  }, []);

  // Prevent accidental page reloads/closes during active PvP match or queue
  React.useEffect(() => {
    const isPvPActive =
      currentTab === 'pvp' &&
      !!activePvPRoom &&
      (activePvPRoom.phase === 'queueing' ||
        activePvPRoom.phase === 'voting' ||
        activePvPRoom.phase === 'in_progress');

    if (!isPvPActive) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'You are currently in an active PvP match or matchmaking queue. Leaving this page will count as a forfeit and deduct 20 ELO points.';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentTab, activePvPRoom]);

  const getTabDisplayName = (tab: NavTab | null) => {
    switch (tab) {
      case 'games': return 'Games Hub';
      case 'dashboard': return 'Dashboard';
      case 'progress': return 'Progress Tracker';
      case 'leaderboard': return 'Leaderboard';
      case 'settings': return 'Settings';
      default: return 'another page';
    }
  };

  // Auto-launch pending game after signing in if trial is valid
  React.useEffect(() => {
    if (user && pendingGameToStart) {
      const playCheck = canUserPlay();
      if (playCheck.canPlay) {
        const nextGame = pendingGameToStart;
        setPendingGameToStart(null);
        setActiveGame(nextGame);
      }
    }
  }, [user, pendingGameToStart, canUserPlay]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800 gap-4">
        <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 via-cyan-500 to-lime-400 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-cyan-500/30 animate-bounce">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="font-display text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-cyan-500 to-lime-500 bg-clip-text text-transparent">
            BrainPulse
          </div>
          <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-spin" />
            <span>Powering up your brain gym...</span>
          </div>
        </div>
      </div>
    );
  }

  const handleSelectGame = (gameId: GameType) => {
    const playStatus = canUserPlay();
    if (!playStatus.canPlay) {
      setPendingGameToStart(gameId);
      if (playStatus.reason === 'not_signed_in') {
        openAuthModal('play_gate');
        return;
      }
      if (playStatus.reason === 'trial_expired') {
        const game = GAME_MODES[gameId];
        setSelectedGameForPaywall(game?.name || 'Cognitive Activity');
        openPaywall();
        return;
      }
    }

    setLastGameResult(null);
    setActiveGame(gameId);
  };

  const handleExitGame = () => {
    setActiveGame(null);
    setLastGameResult(null);
  };

  const handleGameOver = async (data: {
    gameType: GameType;
    gameTitle: string;
    score: number;
    accuracy: number;
    level: number;
    responseTimeMs: number;
  }) => {
    // Record game in cloud Firestore database & update profile stats
    const result = await recordGame(data);
    if (result) {
      setLastGameResult(result);
    } else {
      // Fallback local representation if offline
      setLastGameResult({
        gameType: data.gameType,
        gameTitle: data.gameTitle,
        score: data.score,
        accuracy: data.accuracy,
        level: data.level,
        responseTimeMs: data.responseTimeMs,
        isNewHighScore: false,
        previousHighScore: profile?.highScores?.[data.gameType] || 0,
        streakGained: profile?.dailyStreak || 1,
        brainPowerGained: Math.floor(data.score / 20) + 10
      });
    }
  };

  const handlePlayAgain = () => {
    const game = activeGame || lastGameResult?.gameType;
    setLastGameResult(null);
    if (game) {
      // Re-trigger game
      setActiveGame(null);
      setTimeout(() => {
        setActiveGame(game);
      }, 50);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Top Global Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={handleRequestTabChange}
        activeGameId={activeGame}
        onExitGame={handleExitGame}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Trial / Paywall Announcement Strip (when not in game) */}
        {!activeGame && (
          <div>
            {!user ? (
              <div
                id="guest-trial-banner"
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-2xl p-4 sm:p-5 text-white shadow-md shadow-blue-500/15 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4"
              >
                <div className="flex items-center gap-3.5 text-center sm:text-left">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-lime-300 animate-pulse" />
                  </div>
                  <div>
                    <div className="font-display font-extrabold text-sm sm:text-base flex items-center gap-2 justify-center sm:justify-start">
                      <span>Unlock All 15 Games with 1-Week Free Trial</span>
                      <span className="bg-lime-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                        7 Days Free
                      </span>
                    </div>
                    <p className="text-xs text-blue-100 mt-0.5">
                      Sign in with Google or Email to start your free trial, track personal streaks, and compete on the global leaderboard.
                    </p>
                  </div>
                </div>
                <button
                  id="banner-signin-trial-btn"
                  onClick={() => openAuthModal('play_gate')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white text-blue-700 hover:bg-lime-300 hover:text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span>Start 7-Day Free Trial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : user && !profile?.isSubscribed && access.canPlay ? (
              <div
                id="active-trial-banner"
                className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-4 text-emerald-900 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-extrabold text-emerald-950 flex items-center gap-2">
                      <span>7-Day Free Trial Active</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                        {access.daysLeft} Day{access.daysLeft === 1 ? '' : 's'} Left
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Enjoying the brain training? Upgrade to Pro anytime for unlimited access to all 15 cognitive drills.
                    </p>
                  </div>
                </div>
                <button
                  id="banner-upgrade-pro-btn"
                  onClick={openPaywall}
                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-95 text-xs font-black rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>Upgrade to Pro</span>
                </button>
              </div>
            ) : user && !profile?.isSubscribed && !access.canPlay ? (
              <div
                id="expired-trial-banner"
                className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 text-rose-950 shadow-md shadow-rose-500/10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 animate-in fade-in duration-200"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-display font-extrabold text-sm sm:text-base text-rose-950 flex items-center gap-2">
                      <span>Your 7-Day Free Trial Has Concluded</span>
                      <span className="bg-rose-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                        Games Locked
                      </span>
                    </div>
                    <p className="text-xs text-rose-800 mt-0.5">
                      Subscribe to BrainPulse Pro to unlock all 15 cognitive activities, maintain your daily streaks, and log live leaderboard scores.
                    </p>
                  </div>
                </div>
                <button
                  id="banner-subscribe-paywall-btn"
                  onClick={openPaywall}
                  className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>Subscribe to Unlock ($9.99/mo)</span>
                </button>
              </div>
            ) : null}
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeGame ? (
            <motion.div
              key={activeGame}
              initial={{ opacity: 0, scale: 0.98, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {activeGame === 'memory-matrix' && (
                <MemoryMatrix onGameOver={handleGameOver} onExit={handleExitGame} />
              )}
              {activeGame === 'color-confusion' && (
                <ColorConfusion onGameOver={handleGameOver} onExit={handleExitGame} />
              )}
              {activeGame === 'number-recall' && (
                <NumberRecall onGameOver={handleGameOver} onExit={handleExitGame} />
              )}
              {activeGame === 'n-back' && (
                <NBackGame onGameOver={handleGameOver} onExit={handleExitGame} />
              )}
              {activeGame === 'matching-cards' && (
                <MatchingCards onGameOver={handleGameOver} onExit={handleExitGame} />
              )}
              {activeGame === 'recall-sequence' && (
                <RecallSequence onGameOver={handleGameOver} onExit={handleExitGame} />
              )}
              {activeGame === 'distraction-task' && (
                <DistractionTask onGameOver={handleGameOver} onExit={handleExitGame} />
              )}
              {activeGame === 'logic-puzzles' && (
                <LogicPuzzles onGameOver={handleGameOver} onExit={handleExitGame} />
              )}
              {activeGame === 'word-games' && (
                <WordGames onGameOver={handleGameOver} onExit={handleExitGame} />
              )}
              {activeGame === 'pattern-recognition' && (
                <PatternRecognition onGameOver={handleGameOver} onExit={handleExitGame} />
              )}
              {activeGame === 'guided-meditation' && (
                <GuidedMeditation onGameOver={handleGameOver} onExit={handleExitGame} />
              )}
              {activeGame === 'breathing-pacer' && (
                <BreathingPacer onGameOver={handleGameOver} onExit={handleExitGame} />
              )}
              {activeGame === 'journaling-prompts' && (
                <JournalingPrompts onGameOver={handleGameOver} onExit={handleExitGame} />
              )}
              {activeGame === 'reaction-drill' && (
                <QuickReactionDrill onGameOver={handleGameOver} onExit={handleExitGame} />
              )}
              {activeGame === 'stretching-dual' && (
                <StretchingDualTask onGameOver={handleGameOver} onExit={handleExitGame} />
              )}
            </motion.div>
          ) : (
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentTab === 'dashboard' && (
                <DashboardView
                  onSelectGame={handleSelectGame}
                  onNavigateTab={(tab) => handleRequestTabChange(tab as NavTab)}
                />
              )}
              {currentTab === 'games' && (
                <GamesHubView onSelectGame={handleSelectGame} />
              )}
              {currentTab === 'pvp' && (
                <PvPHubView
                  currentUserId={user?.uid || 'guest-athlete'}
                  currentUserDisplayName={profile?.displayName || 'Brain Athlete'}
                  currentUserPhotoURL={profile?.photoURL}
                  onOpenPaywall={openPaywall}
                  onActiveRoomChange={handleActiveRoomChange}
                />
              )}
              {currentTab === 'progress' && (
                <ProgressTrackerView onSelectGame={handleSelectGame} />
              )}
              {currentTab === 'leaderboard' && (
                <LeaderboardView />
              )}
              {currentTab === 'settings' && (
                <SettingsView />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Intercepted PvP Forfeit Confirmation Modal (triggered when trying to leave PvP) */}
      <PvPForfeitModal
        isOpen={isLeavePvPModalOpen}
        targetDestinationName={getTabDisplayName(pendingNavigationTab)}
        onStay={handleStayInPvP}
        onConfirmForfeit={handleConfirmLeavePvP}
      />

      {/* Forfeit Toast Notification */}
      <AnimatePresence>
        {forfeitToastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-md bg-rose-950 text-rose-100 border border-rose-700/80 rounded-2xl p-4 shadow-2xl flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-800 text-rose-200 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold leading-snug">{forfeitToastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over / Session Result Celebration Modal */}
      {lastGameResult && (
        <GameResultModal
          result={lastGameResult}
          onPlayAgain={handlePlayAgain}
          onClose={() => {
            setLastGameResult(null);
            setActiveGame(null);
            setCurrentTab('games');
          }}
        />
      )}

      {/* Authentication Modal / Cloud Profile Sync */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <AuthModal onClose={closeAuthModal} />
        </div>
      )}

      {/* Paywall & Subscription Checkout Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={closePaywall}
        onSuccess={() => {
          closePaywall();
          if (pendingGameToStart) {
            const nextGame = pendingGameToStart;
            setPendingGameToStart(null);
            setActiveGame(nextGame);
          }
        }}
        gameTitle={selectedGameForPaywall || undefined}
      />

      {/* Global Footer */}
      <footer className="border-t border-slate-200/80 bg-white/80 backdrop-blur-md py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 font-display">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-xs font-black shadow-sm">
              ⚡
            </div>
            <span className="font-extrabold text-sm text-slate-800">BrainPulse</span>
            <span className="text-[11px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">
              Cognitive Fitness Gym
            </span>
          </div>
          <div className="text-[11px] font-medium text-slate-400">
            Train daily to boost memory, speed & focus &bull; Live Cloud Sync &copy; 2026
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
