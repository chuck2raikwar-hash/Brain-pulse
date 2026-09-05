import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  PvPMode,
  PvPRoom,
  PvPMatchPhase,
  PVP_MODES_CONFIG,
  PvPHistoryRecord,
  PvPPlayer,
  TeamType
} from '../../types/pvp';
import { GameType } from '../../types';
import {
  createInitialRoom,
  createHostRoomInFirestore,
  findRoomByCode,
  joinRoomByCode,
  subscribeToPvPRoom,
  castVoteInRoom,
  setRoomGameAndStart,
  getPvPPlayerId,
  getLocalPvPStats,
  getLocalPvPHistory,
  recordForfeitOutcome,
  syncRoomToFirestore,
  findOpenMatchmakingRoom,
  createMatchmakingRoomInFirestore,
  generateBotPlayer,
  getRankTierInfo,
  PvPUserStats,
  BOT_PROFILES
} from '../../lib/pvpService';
import { PvPQueueModal } from './PvPQueueModal';
import { PvPVotingPhase } from './PvPVotingPhase';
import { PvPMatchArena } from './PvPMatchArena';
import { PvPGameOverModal } from './PvPGameOverModal';
import { PvPForfeitModal } from './PvPForfeitModal';
import { sounds } from '../../lib/audio';
import {
  Swords,
  Users,
  Shield,
  Flame,
  Trophy,
  Zap,
  Sparkles,
  Clock,
  Award,
  Crown,
  Play,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  History,
  Hash,
  Copy,
  Check,
  Radio,
  Gamepad2,
  Lock,
  Plus,
  Share2,
  ChevronRight,
  X,
  Loader2,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PvPHubViewProps {
  currentUserId: string;
  currentUserDisplayName: string;
  currentUserPhotoURL?: string;
  onOpenPaywall?: () => void;
  onActiveRoomChange?: (room: PvPRoom | null, forfeitAndExit?: () => void) => void;
}

export const PvPHubView: React.FC<PvPHubViewProps> = ({
  currentUserId,
  currentUserDisplayName,
  currentUserPhotoURL,
  onOpenPaywall,
  onActiveRoomChange
}) => {
  const effectivePlayerId = useMemo(() => getPvPPlayerId(currentUserId), [currentUserId]);
  const [activeRoom, setActiveRoom] = useState<PvPRoom | null>(null);
  const activeRoomRef = useRef<PvPRoom | null>(null);
  activeRoomRef.current = activeRoom;
  const [userStats, setUserStats] = useState<PvPUserStats>(getLocalPvPStats());
  const [history, setHistory] = useState<PvPHistoryRecord[]>(getLocalPvPHistory());
  const [selectedMode, setSelectedMode] = useState<PvPMode>('1v1');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showHostModal, setShowHostModal] = useState(false);
  const [hostSelectedMode, setHostSelectedMode] = useState<PvPMode>('2v2');
  const [generatedHostRoom, setGeneratedHostRoom] = useState<PvPRoom | null>(null);
  const [isCreatingHost, setIsCreatingHost] = useState(false);

  // Team Choice Modal State (for rooms with >2 players)
  const [pendingJoinRoom, setPendingJoinRoom] = useState<PvPRoom | null>(null);
  const [showTeamChoiceModal, setShowTeamChoiceModal] = useState(false);

  // Queue search & rank fallback state
  const [queueSearchPhase, setQueueSearchPhase] = useState<'searching_players' | 'player_found' | 'deploying_bots'>('searching_players');
  const [queueSearchCountdown, setQueueSearchCountdown] = useState<number>(6);
  const queueIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const queueCountdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Forfeit and leave match/queue helper
  const handleForfeitAndLeave = useCallback(() => {
    if (queueIntervalRef.current) {
      clearInterval(queueIntervalRef.current);
      queueIntervalRef.current = null;
    }
    if (queueCountdownTimerRef.current) {
      clearInterval(queueCountdownTimerRef.current);
      queueCountdownTimerRef.current = null;
    }
    const current = activeRoomRef.current;
    if (current) {
      recordForfeitOutcome(current, effectivePlayerId);
      sounds.playMistake();
    }
    setActiveRoom(null);
    refreshStats();
  }, [effectivePlayerId]);

  const onActiveRoomChangeRef = useRef(onActiveRoomChange);
  onActiveRoomChangeRef.current = onActiveRoomChange;

  const handleForfeitAndLeaveRef = useRef(handleForfeitAndLeave);
  handleForfeitAndLeaveRef.current = handleForfeitAndLeave;

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (queueIntervalRef.current) {
        clearInterval(queueIntervalRef.current);
      }
    };
  }, []);

  // Sync active room status with parent App component for tab navigation protection
  useEffect(() => {
    if (onActiveRoomChangeRef.current) {
      onActiveRoomChangeRef.current(activeRoom, handleForfeitAndLeaveRef.current);
    }
  }, [activeRoom?.id, activeRoom?.phase]);

  // Subscribe to real-time room updates (Firestore & cross-tab)
  useEffect(() => {
    if (!activeRoom?.id) return;
    const unsub = subscribeToPvPRoom(activeRoom.id, (updatedRoom) => {
      setActiveRoom(prev => {
        if (!prev) return updatedRoom;

        const PHASE_ORDER: Record<string, number> = {
          queueing: 0,
          voting: 1,
          in_progress: 2,
          completed: 3
        };

        const prevOrder = PHASE_ORDER[prev.phase] ?? 0;
        const nextOrder = PHASE_ORDER[updatedRoom.phase] ?? 0;

        // Never allow older snapshot to downgrade phase (e.g. voting -> queueing, or in_progress -> voting)
        if (nextOrder < prevOrder) {
          return prev;
        }
        if (prev.phase === 'completed' && updatedRoom.phase !== 'completed') {
          return prev;
        }
        if (updatedRoom.updatedAt && prev.updatedAt && updatedRoom.updatedAt < prev.updatedAt) {
          return prev;
        }
        if (prev.phase === 'queueing' && updatedRoom.phase === 'voting') {
          sounds.playMatchFound();
        }
        return updatedRoom;
      });
    });
    return () => unsub();
  }, [activeRoom?.id]);

  // Refresh stats whenever returning to hub
  const refreshStats = () => {
    setUserStats(getLocalPvPStats());
    setHistory(getLocalPvPHistory());
  };

  const getRankTier = (rating: number) => {
    if (rating >= 1800) return { name: 'Grandmaster', color: 'text-amber-500 bg-amber-50 border-amber-300' };
    if (rating >= 1600) return { name: 'Master', color: 'text-purple-600 bg-purple-50 border-purple-300' };
    if (rating >= 1400) return { name: 'Diamond', color: 'text-cyan-600 bg-cyan-50 border-cyan-300' };
    if (rating >= 1000) return { name: 'Platinum', color: 'text-emerald-600 bg-emerald-50 border-emerald-300' };
    if (rating >= 600) return { name: 'Gold', color: 'text-yellow-600 bg-yellow-50 border-yellow-300' };
    if (rating >= 250) return { name: 'Silver', color: 'text-slate-600 bg-slate-50 border-slate-300' };
    return { name: 'Bronze', color: 'text-amber-700 bg-amber-50/80 border-amber-300' };
  };

  const rankTier = getRankTier(userStats.rating);

  // Quick Queue Launch (Chess.com style matchmaking with rank-tiered bot fallback)
  const handleStartQueue = async (mode: PvPMode) => {
    if (queueIntervalRef.current) {
      clearInterval(queueIntervalRef.current);
      queueIntervalRef.current = null;
    }
    if (queueCountdownTimerRef.current) {
      clearInterval(queueCountdownTimerRef.current);
      queueCountdownTimerRef.current = null;
    }

    setSelectedMode(mode);
    sounds.playTick();
    setQueueSearchPhase('searching_players');
    setQueueSearchCountdown(6);

    const initialLocalRoom = createInitialRoom(
      mode,
      {
        uid: effectivePlayerId,
        displayName: currentUserDisplayName || 'Brain Athlete',
        photoURL: currentUserPhotoURL,
        rating: userStats.rating
      },
      false,
      false,
      undefined,
      undefined,
      userStats.currentWinStreak || 0
    );

    setActiveRoom(initialLocalRoom);

    // 1. Search for an open human matchmaking room in Firestore within our Elo bracket
    let matchedRoom: PvPRoom | null = null;
    try {
      matchedRoom = await findOpenMatchmakingRoom(mode, effectivePlayerId, userStats.rating, 180);
    } catch (e) {
      console.warn('Matchmaking lookup error:', e);
    }

    if (matchedRoom) {
      // Real human player found! Join their room
      try {
        const joined = await joinRoomByCode(matchedRoom.code, {
          uid: effectivePlayerId,
          displayName: currentUserDisplayName || 'Brain Athlete',
          photoURL: currentUserPhotoURL,
          rating: userStats.rating
        });
        setQueueSearchPhase('player_found');
        sounds.playMatchFound();
        setActiveRoom(joined);
        return;
      } catch (err) {
        console.warn('Could not join discovered room, continuing as host:', err);
      }
    }

    // 2. No open room found immediately: register a matchmaking lobby in Firestore so others can find us
    let hostRoom = initialLocalRoom;
    try {
      hostRoom = await createMatchmakingRoomInFirestore(mode, {
        uid: effectivePlayerId,
        displayName: currentUserDisplayName || 'Brain Athlete',
        photoURL: currentUserPhotoURL,
        rating: userStats.rating
      }, userStats.currentWinStreak || 0);
      setActiveRoom(hostRoom);
    } catch (err) {
      console.warn('Error creating matchmaking lobby:', err);
    }

    // 3. Search window countdown: wait 6 seconds for human players before falling back to rank-tiered bots
    let remaining = 6;
    queueCountdownTimerRef.current = setInterval(() => {
      remaining -= 1;
      setQueueSearchCountdown(remaining);

      if (remaining <= 0) {
        if (queueCountdownTimerRef.current) {
          clearInterval(queueCountdownTimerRef.current);
          queueCountdownTimerRef.current = null;
        }

        // If no human joined during search window, deploy bots calibrated to player's rank & win streak
        setActiveRoom(latestRoom => {
          if (!latestRoom || latestRoom.phase !== 'queueing') return latestRoom;

          const config = PVP_MODES_CONFIG[latestRoom.mode];
          const hasOtherHuman = latestRoom.players.some(p => p.uid !== effectivePlayerId && !p.isBot);

          if (hasOtherHuman && latestRoom.players.length >= config.totalPlayers) {
            sounds.playMatchFound();
            const votingRoom: PvPRoom = {
              ...latestRoom,
              phase: 'voting',
              updatedAt: Date.now()
            };
            syncRoomToFirestore(votingRoom);
            return votingRoom;
          }

          setQueueSearchPhase('deploying_bots');
          sounds.playMatchFound();

          const teamSize = config.teamSize;
          const currentBlueCount = latestRoom.players.filter(p => p.team === 'blue').length;
          const currentRedCount = latestRoom.players.filter(p => p.team === 'red').length;

          const filledPlayers = [...latestRoom.players];
          let botIdx = 0;
          const activeStreak = userStats.currentWinStreak || 0;

          // Fill Blue team with rank-calibrated bots scaled by win streak
          for (let b = currentBlueCount; b < teamSize; b++) {
            filledPlayers.push(generateBotPlayer(botIdx++, 'blue', userStats.rating, activeStreak));
          }

          // Fill Red team with rank-calibrated bots scaled by win streak
          for (let r = currentRedCount; r < teamSize; r++) {
            filledPlayers.push(generateBotPlayer(botIdx++, 'red', userStats.rating, activeStreak));
          }

          const votingRoom: PvPRoom = {
            ...latestRoom,
            players: filledPlayers,
            playerWinStreak: activeStreak,
            phase: 'voting',
            updatedAt: Date.now()
          };
          syncRoomToFirestore(votingRoom);
          return votingRoom;
        });
      }
    }, 1000);
  };

  // Host Private Room & Generate Code
  const handleCreateHostRoom = async (mode: PvPMode) => {
    sounds.playTick();
    setIsCreatingHost(true);
    try {
      const room = await createHostRoomInFirestore(
        mode,
        {
          uid: effectivePlayerId,
          displayName: currentUserDisplayName || 'Brain Athlete',
          photoURL: currentUserPhotoURL,
          rating: userStats.rating
        }
      );
      setGeneratedHostRoom(room);
    } catch (err) {
      console.warn('Error creating host room:', err);
      const fallback = createInitialRoom(
        mode,
        {
          uid: effectivePlayerId,
          displayName: currentUserDisplayName || 'Brain Athlete',
          photoURL: currentUserPhotoURL,
          rating: userStats.rating
        },
        true,
        false
      );
      setGeneratedHostRoom(fallback);
    } finally {
      setIsCreatingHost(false);
    }
  };

  const handleStartHostedMatch = () => {
    if (!generatedHostRoom) return;
    sounds.playTick();
    setShowHostModal(false);
    // Enter lobby in waiting phase so host waits for friend to enter code
    setActiveRoom(generatedHostRoom);
  };

  // Instant Match (Skip search and immediately deploy rank-calibrated bots)
  const handleInstantMatchBots = () => {
    if (!activeRoom) return;
    if (queueCountdownTimerRef.current) {
      clearInterval(queueCountdownTimerRef.current);
      queueCountdownTimerRef.current = null;
    }
    if (queueIntervalRef.current) {
      clearInterval(queueIntervalRef.current);
      queueIntervalRef.current = null;
    }

    sounds.playMatchFound();
    setQueueSearchPhase('deploying_bots');

    const config = PVP_MODES_CONFIG[activeRoom.mode];
    const teamSize = config.teamSize;
    const currentBlueCount = activeRoom.players.filter(p => p.team === 'blue').length;
    const currentRedCount = activeRoom.players.filter(p => p.team === 'red').length;

    const filledPlayers = [...activeRoom.players];
    let botIdx = 0;
    const activeStreak = userStats.currentWinStreak || 0;

    for (let b = currentBlueCount; b < teamSize; b++) {
      filledPlayers.push(generateBotPlayer(botIdx++, 'blue', userStats.rating, activeStreak));
    }
    for (let r = currentRedCount; r < teamSize; r++) {
      filledPlayers.push(generateBotPlayer(botIdx++, 'red', userStats.rating, activeStreak));
    }

    const filledRoom: PvPRoom = {
      ...activeRoom,
      players: filledPlayers,
      playerWinStreak: activeStreak,
      phase: 'voting',
      updatedAt: Date.now()
    };
    syncRoomToFirestore(filledRoom);
    setActiveRoom(filledRoom);
  };

  const handleCancelQueue = () => {
    handleForfeitAndLeave();
  };

  const handleVoteCast = (gameType: GameType) => {
    if (!activeRoom) return;
    castVoteInRoom(activeRoom.id, effectivePlayerId, gameType);
    setActiveRoom(prev => {
      if (!prev) return null;
      const nextVotes = { ...prev.votes };
      nextVotes[gameType] = (nextVotes[gameType] || 0) + 1;
      return {
        ...prev,
        votes: nextVotes,
        updatedAt: Date.now()
      };
    });
  };

  const handleVotingComplete = useCallback((selectedGame: GameType) => {
    const currentRoom = activeRoomRef.current;
    const gameToPlay = selectedGame || currentRoom?.selectedGame || 'memory-matrix';

    // 1. Immediately advance local phase to in_progress so PvPMatchArena mounts right away
    setActiveRoom(prev => {
      if (!prev) return null;
      return {
        ...prev,
        phase: 'in_progress',
        selectedGame: gameToPlay,
        startedAt: Date.now(),
        endsAt: Date.now() + 120 * 1000,
        timeRemaining: 120,
        updatedAt: Date.now()
      };
    });

    // 2. Sync to service & Firestore in background
    if (currentRoom?.id) {
      setRoomGameAndStart(currentRoom.id, gameToPlay);
    }
  }, []);

  const handleMatchComplete = (finalRoom: PvPRoom) => {
    setActiveRoom(finalRoom);
    refreshStats();
  };

  const handleReturnToLobby = () => {
    setActiveRoom(null);
    refreshStats();
  };

  // Initial Join Code Form Submission
  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = joinCodeInput.trim().toUpperCase();
    if (!code) return;

    sounds.playTick();
    setIsJoining(true);
    setJoinError(null);

    try {
      // Find the room first
      const room = await findRoomByCode(code);
      if (!room) {
        sounds.playMistake();
        setJoinError(`Match not found for code "${code}". Verify the code with your friend and make sure their lobby is open.`);
        return;
      }

      // Check if mode has more than 2 players (e.g. 2v2, 3v3, 4v4, 5v5)
      const config = PVP_MODES_CONFIG[room.mode];
      if (config.totalPlayers > 2) {
        // Prompt the user to choose: Join with host (Blue) or Play against host (Red)
        setPendingJoinRoom(room);
        setShowTeamChoiceModal(true);
      } else {
        // 1v1 mode: naturally joins on Team Red opposite to Host on Team Blue
        const joined = await joinRoomByCode(code, {
          uid: effectivePlayerId,
          displayName: currentUserDisplayName || 'Brain Challenger',
          photoURL: currentUserPhotoURL,
          rating: userStats.rating
        }, 'red');

        sounds.playMatchFound();
        setActiveRoom(joined);
        setJoinCodeInput('');
      }
    } catch (err: any) {
      console.warn('Error joining match by code:', err);
      sounds.playMistake();
      setJoinError(
        err?.message || `Match code "${code}" not found. Verify the code with your friend.`
      );
    } finally {
      setIsJoining(false);
    }
  };

  // Confirm Team Choice for multi-player rooms
  const handleConfirmTeamChoice = async (chosenTeam: TeamType) => {
    if (!pendingJoinRoom) return;

    sounds.playTick();
    setIsJoining(true);
    try {
      const joined = await joinRoomByCode(
        pendingJoinRoom.code,
        {
          uid: effectivePlayerId,
          displayName: currentUserDisplayName || 'Brain Athlete',
          photoURL: currentUserPhotoURL,
          rating: userStats.rating
        },
        chosenTeam
      );

      sounds.playMatchFound();
      setActiveRoom(joined);
      setShowTeamChoiceModal(false);
      setPendingJoinRoom(null);
      setJoinCodeInput('');
    } catch (err: any) {
      sounds.playMistake();
      setJoinError(err?.message || 'Failed to join match with selected team.');
      setShowTeamChoiceModal(false);
    } finally {
      setIsJoining(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    sounds.playTick();
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const getModeIcon = (mode: PvPMode) => {
    switch (mode) {
      case '1v1': return <Swords className="w-6 h-6" />;
      case '2v2': return <Users className="w-6 h-6" />;
      case '3v3': return <Shield className="w-6 h-6" />;
      case '4v4': return <Flame className="w-6 h-6" />;
      case '5v5': return <Trophy className="w-6 h-6" />;
    }
  };

  // Render Sub-Views (Voting, Match Arena, Game Over Modal)
  if (activeRoom) {
    if (activeRoom.phase === 'voting') {
      return (
        <div className="py-4">
          <PvPVotingPhase
            room={activeRoom}
            currentUserId={effectivePlayerId}
            onVoteCast={handleVoteCast}
            onVotingComplete={handleVotingComplete}
            onForfeit={handleForfeitAndLeave}
          />
        </div>
      );
    }

    if (activeRoom.phase === 'in_progress') {
      const activeSelectedGame = activeRoom.selectedGame || 'memory-matrix';
      return (
        <div className="py-4">
          <PvPMatchArena
            room={activeRoom}
            currentUserId={effectivePlayerId}
            selectedGame={activeSelectedGame}
            onMatchComplete={handleMatchComplete}
            onExit={handleReturnToLobby}
          />
        </div>
      );
    }

    if (activeRoom.phase === 'completed') {
      return (
        <div className="py-4">
          <PvPGameOverModal
            room={activeRoom}
            currentUserId={effectivePlayerId}
            onPlayAgain={() => handleStartQueue(activeRoom.mode)}
            onReturnToLobby={handleReturnToLobby}
          />
        </div>
      );
    }
  }

  const hostPlayerInfo = pendingJoinRoom?.players[0];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Active Queue Modal */}
      {activeRoom && activeRoom.phase === 'queueing' && (
        <PvPQueueModal
          mode={activeRoom.mode}
          room={activeRoom}
          onCancel={handleCancelQueue}
          onInstantMatchBots={handleInstantMatchBots}
          searchPhase={queueSearchPhase}
          searchCountdown={queueSearchCountdown}
        />
      )}

      {/* Hero PvP Header & Combat Record Card */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl p-6 sm:p-8 text-white">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide uppercase">
              <Swords className="w-3.5 h-3.5" />
              <span>Real-Time PvP Multiplayer</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
              Cognitive Battle Arena
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Challenge friends or queue in real-time squads (1v1 to 5v5). Face off in 2-minute cognitive sprints across 14 mini-games.
            </p>
          </div>

          {/* User Combat Tier Badge */}
          <div className="flex items-center gap-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shrink-0 shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl text-white">
                  {userStats.rating}
                </span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${rankTier.color}`}>
                  {rankTier.name}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span>{userStats.wins}W - {userStats.losses}L</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">
                  {userStats.matchesPlayed > 0 ? Math.round((userStats.wins / userStats.matchesPlayed) * 100) : 0}% Win Rate
                </span>
                {userStats.currentWinStreak > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400 animate-pulse shrink-0" />
                      {userStats.currentWinStreak} Streak
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Win Streak Active Notice Banner */}
      {userStats.currentWinStreak > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 px-5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-950 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="font-display font-black text-amber-950 text-sm flex items-center gap-2">
                <span>{userStats.currentWinStreak}-Match Win Streak Active!</span>
                <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full border border-amber-300">
                  Bot Scaling Active
                </span>
              </p>
              <p className="text-amber-800 text-xs">
                Bots deployed against you now have <strong>+{Math.min(100, userStats.currentWinStreak * 10)}% faster response speed &amp; accuracy</strong>. Win streak resets back to 0 if defeated.
              </p>
            </div>
          </div>
          <div className="text-xs font-bold text-amber-800 bg-amber-100/80 px-3 py-1.5 rounded-xl border border-amber-300/80 shrink-0">
            Highest: <span className="font-mono font-black text-amber-950">{userStats.highestWinStreak || userStats.currentWinStreak}</span>
          </div>
        </div>
      )}

      {/* Main Grid: Game Modes + Custom Match & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Matchmaking Mode Selectors (2 Cols on lg) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="font-display font-black text-xl text-slate-900">
                Quick Matchmaking
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500">Pick format &amp; battle</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.keys(PVP_MODES_CONFIG) as PvPMode[]).map(mode => {
              const config = PVP_MODES_CONFIG[mode];
              const isSelected = selectedMode === mode;

              return (
                <motion.div
                  key={mode}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => handleStartQueue(mode)}
                  className={`relative p-5 rounded-3xl border-2 transition-all cursor-pointer overflow-hidden bg-white shadow-sm flex flex-col justify-between gap-4 ${
                    isSelected
                      ? 'border-blue-600 ring-4 ring-blue-500/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 flex items-center justify-center text-blue-600">
                        {getModeIcon(mode)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-black text-lg text-slate-900">
                            {config.title}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500">{config.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-600 font-bold">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span>{config.teamSize} vs {config.teamSize} ({config.totalPlayers} Athletes)</span>
                    </div>

                    <div className="flex items-center gap-1 text-blue-600 font-black">
                      <span>Queue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Custom Match / Room Code Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between gap-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-blue-600" />
                <h3 className="font-display font-black text-lg text-slate-900">Custom Match</h3>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Private Lobby
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Host a private room with a shareable code, or enter a friend's code to join their squad or battle against them.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {/* Host Button */}
            <button
              onClick={() => {
                setShowHostModal(true);
                handleCreateHostRoom(hostSelectedMode);
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:opacity-95 text-white font-display font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer transition-all hover:scale-[1.01]"
            >
              <Plus className="w-4 h-4" />
              <span>Host a Match (Get Room Code)</span>
            </button>

            <div className="relative flex items-center justify-center my-1">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-2 text-[10px] uppercase font-bold text-slate-400 absolute">or join with code</span>
            </div>

            <form onSubmit={handleJoinByCode} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. BP-8942"
                  value={joinCodeInput}
                  onChange={e => {
                    setJoinCodeInput(e.target.value.toUpperCase());
                    if (joinError) setJoinError(null);
                  }}
                  maxLength={8}
                  disabled={isJoining}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isJoining || !joinCodeInput.trim()}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Joining...</span>
                    </>
                  ) : (
                    <span>Join</span>
                  )}
                </button>
              </div>

              {joinError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-700 font-medium animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{joinError}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Tournament Rules Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3 lg:col-span-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-display font-black text-lg text-slate-900">
              Official PvP Battle Rules
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                <span>Player Vote</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Vote from 14 cognitive games in 15 seconds. The most-voted game wins; ties are broken randomly.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
                <span>2-Minute Sprint</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Both teams compete simultaneously for 2 minutes. Every point scored syncs live to your team total.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
                <span>Win Condition</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                The team with the most total points wins! If the score ties at 0:00, no one wins (stalemate).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent PvP Battle History */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-600" />
            <h3 className="font-display font-black text-lg text-slate-900">Recent PvP Match History</h3>
          </div>
          <span className="text-xs font-bold text-slate-400">Last 30 battles</span>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl text-slate-400 space-y-2">
            <Swords className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-medium">No PvP matches logged yet.</p>
            <p className="text-xs">Pick a format above (1v1, 2v2, 3v3, 4v4, or 5v5) to start your first battle!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 5).map((record, index) => {
              const isWin = record.winner === record.userTeam;
              const isTie = record.winner === 'tie';

              return (
                <div
                  key={`${record.id || 'rec'}-${index}`}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                        isTie
                          ? 'bg-amber-100 text-amber-700'
                          : isWin
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {isTie ? 'TIE' : isWin ? 'WIN' : 'LOSS'}
                    </div>
                    <div>
                      <div className="font-display font-black text-slate-900 flex items-center gap-2">
                        <span>{record.gameTitle}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">({record.mode})</span>
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        MVP: <strong className="text-slate-700">{record.mvpPlayerName}</strong> • Your Score:{' '}
                        <strong className="text-slate-900">{record.userScore}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="font-mono font-black text-sm">
                      <span className="text-blue-600">{record.blueScore}</span>
                      <span className="text-slate-300 mx-1">-</span>
                      <span className="text-rose-600">{record.redScore}</span>
                    </div>

                    <div
                      className={`font-black text-xs px-2.5 py-1 rounded-full ${
                        record.ratingDelta > 0
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : record.ratingDelta < 0
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {record.ratingDelta > 0 ? `+${record.ratingDelta}` : record.ratingDelta} Elo
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* TEAM SELECTION MODAL (For Matches with > 2 Players) */}
      <AnimatePresence>
        {showTeamChoiceModal && pendingJoinRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 max-w-lg w-full space-y-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-[10px] font-black uppercase">
                    <Users className="w-3 h-3" />
                    <span>{pendingJoinRoom.mode} Squad Match • Room {pendingJoinRoom.code}</span>
                  </div>
                  <h3 className="font-display font-black text-xl text-slate-900">
                    Choose Your Team
                  </h3>
                  <p className="text-xs text-slate-600">
                    Match hosted by <strong className="text-slate-900">{hostPlayerInfo?.displayName || 'Host Athlete'}</strong>. Select how you would like to participate:
                  </p>
                </div>
                <button
                  onClick={() => setShowTeamChoiceModal(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Host Summary Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {hostPlayerInfo?.photoURL ? (
                    <img
                      src={hostPlayerInfo.photoURL}
                      alt={hostPlayerInfo.displayName}
                      className="w-10 h-10 rounded-xl object-cover border border-blue-300"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      {hostPlayerInfo?.displayName?.charAt(0) || 'H'}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>{hostPlayerInfo?.displayName || 'Host Athlete'}</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.2 rounded-full bg-blue-100 text-blue-800">
                        Team Blue Captain
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Rating: {hostPlayerInfo?.rating !== undefined && hostPlayerInfo.rating !== null ? hostPlayerInfo.rating : 0} Elo
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Format</span>
                  <div className="font-mono font-black text-xs text-slate-700">{pendingJoinRoom.mode}</div>
                </div>
              </div>

              {/* Team Options Grid */}
              <div className="grid grid-cols-1 gap-3">
                {/* OPTION 1: Join Team with Host (Team Blue) */}
                <button
                  onClick={() => handleConfirmTeamChoice('blue')}
                  disabled={isJoining}
                  className="w-full text-left p-4 rounded-2xl border-2 border-blue-200 hover:border-blue-500 bg-gradient-to-r from-blue-50/80 via-cyan-50/50 to-white hover:shadow-md hover:shadow-blue-500/10 transition-all cursor-pointer group flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-black text-sm text-blue-950 flex items-center gap-1.5">
                        <span>Team Up with Host</span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-600 text-white">
                          Team Blue
                        </span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-snug">
                      Join the Blue Squad alongside <strong className="text-blue-900">{hostPlayerInfo?.displayName || 'Host'}</strong>. Cooperate to beat rival opponents together!
                    </p>
                  </div>
                </button>

                {/* OPTION 2: Play Against Host (Team Red) */}
                <button
                  onClick={() => handleConfirmTeamChoice('red')}
                  disabled={isJoining}
                  className="w-full text-left p-4 rounded-2xl border-2 border-rose-200 hover:border-rose-500 bg-gradient-to-r from-rose-50/80 via-orange-50/50 to-white hover:shadow-md hover:shadow-rose-500/10 transition-all cursor-pointer group flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/30 group-hover:scale-105 transition-transform">
                    <Swords className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-black text-sm text-rose-950 flex items-center gap-1.5">
                        <span>Play Against Host</span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white">
                          Team Red Rival
                        </span>
                      </span>
                      <ChevronRight className="w-4 h-4 text-rose-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-snug">
                      Lead the Red Squad as Rival Captain and battle head-to-head directly against <strong className="text-rose-900">{hostPlayerInfo?.displayName || 'Host'}</strong>!
                    </p>
                  </div>
                </button>
              </div>

              {isJoining && (
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 pt-1">
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                  <span>Joining match lobby...</span>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Host Match Modal */}
      {showHostModal && generatedHostRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-6"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                <h3 className="font-display font-black text-xl text-slate-900">
                  Host Private Match
                </h3>
              </div>
              <button
                onClick={() => setShowHostModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Selector Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Select Team Format
              </label>
              <div className="grid grid-cols-5 gap-2">
                {(Object.keys(PVP_MODES_CONFIG) as PvPMode[]).map(mode => {
                  const isSelected = generatedHostRoom.mode === mode;
                  return (
                    <button
                      key={mode}
                      onClick={() => {
                        setHostSelectedMode(mode);
                        handleCreateHostRoom(mode);
                      }}
                      className={`py-2.5 px-2 rounded-xl text-xs font-display font-black flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      <span>{mode}</span>
                      <span className="text-[9px] opacity-70">
                        {PVP_MODES_CONFIG[mode].totalPlayers}P
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shareable Room Code Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 border border-cyan-200 text-center space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Your Shareable Room Code
              </span>

              <div className="flex items-center justify-center gap-3">
                <div className="px-6 py-3 rounded-2xl bg-white border-2 border-cyan-400 shadow-sm font-mono font-black text-2xl sm:text-3xl text-slate-900 tracking-widest flex items-center justify-center min-w-[170px]">
                  {isCreatingHost ? (
                    <Loader2 className="w-7 h-7 text-cyan-600 animate-spin" />
                  ) : (
                    generatedHostRoom.code
                  )}
                </div>
                <button
                  disabled={isCreatingHost}
                  onClick={() => copyToClipboard(generatedHostRoom.code)}
                  className={`p-3.5 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                    copiedCode
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                  title="Copy Match Code"
                >
                  {copiedCode ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>

              {copiedCode && (
                <p className="text-xs font-bold text-emerald-600 animate-in fade-in">
                  Room code copied to clipboard!
                </p>
              )}

              <p className="text-[11px] text-slate-600 font-medium leading-relaxed max-w-xs mx-auto">
                Share this code with your friend. In multi-player matches (&gt;2 players), they will get to choose whether to team up with you or face off against you!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                disabled={isCreatingHost}
                onClick={handleStartHostedMatch}
                className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:opacity-95 text-white font-display font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Enter Lobby &amp; Wait for Friend</span>
              </button>

              <button
                onClick={() => setShowHostModal(false)}
                className="w-full sm:w-auto py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
