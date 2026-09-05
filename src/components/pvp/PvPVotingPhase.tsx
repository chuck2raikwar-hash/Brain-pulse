import React, { useState, useEffect, useRef } from 'react';
import { PvPRoom, PvPMode, PVP_VOTABLE_GAMES, PVP_MODES_CONFIG } from '../../types/pvp';
import { GameType } from '../../types';
import { GAME_MODES } from '../../data/games';
import { resolveWinningGame } from '../../lib/pvpService';
import { sounds } from '../../lib/audio';
import {
  Brain,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Swords,
  Users,
  Shield,
  Flame,
  Trophy,
  Shuffle,
  Grid3X3,
  Binary,
  Layers,
  Radio,
  Eye,
  Puzzle,
  SpellCheck,
  Boxes,
  Gauge,
  Activity,
  Headphones,
  Wind
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { PvPForfeitModal } from './PvPForfeitModal';

interface PvPVotingPhaseProps {
  room: PvPRoom;
  currentUserId: string;
  onVoteCast: (gameType: GameType) => void;
  onVotingComplete: (selectedGame: GameType) => void;
  onForfeit?: () => void;
}

export const PvPVotingPhase: React.FC<PvPVotingPhaseProps> = ({
  room,
  currentUserId,
  onVoteCast,
  onVotingComplete,
  onForfeit
}) => {
  const [secondsLeft, setSecondsLeft] = useState(15);
  const [userVote, setUserVote] = useState<GameType | null>(null);
  const [localVotes, setLocalVotes] = useState<Record<string, number>>({});
  const [selectedGameResult, setSelectedGameResult] = useState<GameType | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [readyCountdown, setReadyCountdown] = useState<number | null>(null);
  const [showForfeitConfirm, setShowForfeitConfirm] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const readyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasCompletedRef = useRef(false);
  const winningGameRef = useRef<GameType | null>(null);
  const localVotesRef = useRef<Record<string, number>>({});
  localVotesRef.current = localVotes;
  const onVotingCompleteRef = useRef(onVotingComplete);
  onVotingCompleteRef.current = onVotingComplete;

  // Initialize and distribute bot votes if any
  useEffect(() => {
    // Simulate bot votes staggered over the first 3 seconds
    room.players.forEach((player, idx) => {
      if (player.isBot) {
        setTimeout(() => {
          if (hasCompletedRef.current) return;
          const randomGame = PVP_VOTABLE_GAMES[Math.floor(Math.random() * PVP_VOTABLE_GAMES.length)];
          setLocalVotes(prev => {
            const next = { ...prev };
            next[randomGame] = (next[randomGame] || 0) + 1;
            return next;
          });
        }, 500 + idx * 400 + Math.random() * 400);
      }
    });

    sounds.playMatchFound();
  }, []);

  const finalizeVoting = (forcedVotes?: Record<string, number>) => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Resolve winning game (with random tie breaking across all tied games)
    const votesToUse = forcedVotes || localVotesRef.current;
    const winningGame = resolveWinningGame(votesToUse);
    winningGameRef.current = winningGame;
    setSelectedGameResult(winningGame);
    setIsRevealing(true);
    sounds.playMatchStart();
    setReadyCountdown(3);
  };

  // 15-second countdown timer ticker
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          if (!hasCompletedRef.current) {
            finalizeVoting();
          }
          return 0;
        }
        if (prev - 1 <= 5) {
          sounds.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Ready countdown (3 -> 2 -> 1 -> Launch)
  useEffect(() => {
    if (readyCountdown === null) return;

    if (readyCountdown <= 0) {
      const gameToStart = winningGameRef.current || selectedGameResult || resolveWinningGame(localVotesRef.current);
      // Immediately launch the match
      onVotingCompleteRef.current(gameToStart);
      return;
    }

    readyTimerRef.current = setTimeout(() => {
      sounds.playTick();
      setReadyCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => {
      if (readyTimerRef.current) clearTimeout(readyTimerRef.current);
    };
  }, [readyCountdown, selectedGameResult]);

  const handleSelectGame = (gameId: GameType) => {
    if (isRevealing || hasCompletedRef.current) return;
    setUserVote(gameId);
    sounds.playVoteClick();
    onVoteCast(gameId);

    // Update local vote tally
    setLocalVotes(prev => {
      const next = { ...prev };
      if (userVote && next[userVote]) {
        next[userVote] = Math.max(0, next[userVote] - 1);
      }
      next[gameId] = (next[gameId] || 0) + 1;

      // Check if all players have voted
      const totalVotes = Object.values(next).reduce<number>((sum, count) => sum + (Number(count) || 0), 0);
      if (totalVotes >= room.players.length && !hasCompletedRef.current) {
        // Short delay so player sees their vote registered, then proceed to countdown
        setTimeout(() => {
          finalizeVoting(next);
        }, 600);
      }

      return next;
    });
  };

  const getGameIcon = (iconName: string) => {
    switch (iconName) {
      case 'Grid3X3': return <Grid3X3 className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'Binary': return <Binary className="w-5 h-5" />;
      case 'Repeat': return <Shuffle className="w-5 h-5" />;
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'Radio': return <Radio className="w-5 h-5" />;
      case 'Eye': return <Eye className="w-5 h-5" />;
      case 'Puzzle': return <Puzzle className="w-5 h-5" />;
      case 'SpellCheck': return <SpellCheck className="w-5 h-5" />;
      case 'Boxes': return <Boxes className="w-5 h-5" />;
      case 'Gauge': return <Gauge className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      case 'Headphones': return <Headphones className="w-5 h-5" />;
      case 'Wind': return <Wind className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const chosenGameInfo = selectedGameResult ? GAME_MODES[selectedGameResult] : null;
  const config = PVP_MODES_CONFIG[room.mode];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with 15s Voting Timer */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-lime-400 p-0.5 shadow-md shadow-cyan-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-xl text-slate-900">Vote for Match Game</h2>
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${config.badgeColor}`}>
                {config.title} &bull; 5 Min Game
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose from all 12 competitive cognitive games. Most votes wins! Ties broken at random.
            </p>
          </div>
        </div>

        {/* Voting Countdown Timer & Forfeit Option */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-md">
            <Clock className={`w-5 h-5 ${secondsLeft <= 5 ? 'text-rose-400 animate-bounce' : 'text-cyan-400'}`} />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Voting Closes in</span>
              <span className={`font-mono text-2xl font-black ${secondsLeft <= 5 ? 'text-rose-400' : 'text-white'}`}>
                0:{secondsLeft < 10 ? '0' : ''}{secondsLeft}s
              </span>
            </div>
          </div>

          {onForfeit && (
            <button
              onClick={() => setShowForfeitConfirm(true)}
              className="p-3 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-2xl transition-colors text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              title="Leave / Forfeit Match"
            >
              <span>Forfeit</span>
            </button>
          )}
        </div>
      </div>

      {/* Roster Strip showing Team Blue and Team Red */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Team Blue */}
        <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600 shadow-xs" />
            <span className="font-black text-xs text-blue-900 uppercase tracking-wider">Team Blue (Alpha)</span>
          </div>
          <div className="flex items-center gap-1.5">
            {room.players.filter(p => p.team === 'blue').map((p, i) => (
              <div
                key={`b-${i}`}
                title={`${p.displayName} (Rating: ${p.rating ?? 0})`}
                className="w-7 h-7 rounded-lg bg-blue-600 text-white text-[11px] font-black flex items-center justify-center shadow-xs border border-blue-400/50"
              >
                {p.displayName.slice(0, 1).toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        {/* Team Red */}
        <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-600 shadow-xs" />
            <span className="font-black text-xs text-rose-900 uppercase tracking-wider">Team Red (Omega)</span>
          </div>
          <div className="flex items-center gap-1.5">
            {room.players.filter(p => p.team === 'red').map((p, i) => (
              <div
                key={`r-${i}`}
                title={`${p.displayName} (Rating: ${p.rating ?? 0})`}
                className="w-7 h-7 rounded-lg bg-rose-600 text-white text-[11px] font-black flex items-center justify-center shadow-xs border border-rose-400/50"
              >
                {p.displayName.slice(0, 1).toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of the 14 Votable Games */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {PVP_VOTABLE_GAMES.map(gameId => {
          const game = GAME_MODES[gameId];
          if (!game) return null;
          const voteCount = localVotes[gameId] || 0;
          const isSelectedByMe = userVote === gameId;

          return (
            <button
              key={gameId}
              type="button"
              disabled={isRevealing}
              onClick={() => handleSelectGame(gameId)}
              className={`p-4.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between group cursor-pointer ${
                isSelectedByMe
                  ? 'bg-gradient-to-b from-blue-50 to-cyan-50/60 border-blue-500 ring-2 ring-blue-400/30 shadow-lg shadow-blue-500/10 scale-[1.02]'
                  : 'bg-white border-slate-200 hover:border-cyan-400 hover:shadow-md'
              }`}
            >
              {/* Live Vote Count Badge */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                  style={{ backgroundColor: game.accentColor }}
                >
                  {getGameIcon(game.iconName)}
                </div>

                <div className="flex items-center gap-1.5">
                  {isSelectedByMe && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-600 text-white flex items-center gap-1 shadow-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>My Vote</span>
                    </span>
                  )}
                  <span
                    className={`text-xs font-mono font-black px-2.5 py-1 rounded-xl border flex items-center gap-1 ${
                      voteCount > 0
                        ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    <span>{voteCount}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      {voteCount === 1 ? 'vote' : 'votes'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Game Title & Domain */}
              <div>
                <h4 className="font-display font-extrabold text-sm text-slate-900 group-hover:text-cyan-700 transition-colors">
                  {game.name}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                  <span className="font-semibold">{game.domain}</span>
                  <span>&bull;</span>
                  <span className="font-medium text-slate-400">{game.difficulty}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                  {game.description}
                </p>
              </div>

              {/* Click to Vote Prompt */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">2-Min Score Sprint</span>
                <span
                  className={`font-black ${
                    isSelectedByMe ? 'text-blue-600' : 'text-slate-500 group-hover:text-cyan-600'
                  }`}
                >
                  {isSelectedByMe ? 'Voted' : 'Click to Vote'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Game Selected Splash Overlay with 3, 2, 1 Countdown */}
      <AnimatePresence>
        {isRevealing && chosenGameInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-2xl border border-slate-200 space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-2.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-lime-400" />

              <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-cyan-500/30" style={{ backgroundColor: chosenGameInfo.accentColor }}>
                {getGameIcon(chosenGameInfo.iconName)}
              </div>

              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
                  Game Selected by Players
                </span>
                <h3 className="font-display font-black text-2xl text-slate-900 pt-2">
                  {chosenGameInfo.name}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {chosenGameInfo.description}
                </p>
              </div>

              {/* Ready Countdown */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col items-center justify-center gap-1 shadow-inner">
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-slate-400">
                  {readyCountdown && readyCountdown > 0 ? 'Match Commences In' : 'Starting Battle Arena...'}
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={readyCountdown ?? 'launch'}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`font-mono font-black ${
                      readyCountdown && readyCountdown > 0
                        ? 'text-4xl text-lime-400'
                        : 'text-2xl text-cyan-300 tracking-wider'
                    }`}
                  >
                    {readyCountdown && readyCountdown > 0 ? `${readyCountdown}` : 'READY... FIGHT!'}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Instant Start Button if desired */}
              <button
                type="button"
                onClick={() => {
                  const gameToStart = winningGameRef.current || selectedGameResult || resolveWinningGame(localVotesRef.current);
                  onVotingCompleteRef.current(gameToStart);
                }}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-lime-500 hover:opacity-95 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
              >
                Enter Battle Now &rarr;
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Forfeit Confirmation Modal */}
      <PvPForfeitModal
        isOpen={showForfeitConfirm}
        targetDestinationName="Lobby"
        onStay={() => setShowForfeitConfirm(false)}
        onConfirmForfeit={() => {
          setShowForfeitConfirm(false);
          if (onForfeit) onForfeit();
        }}
      />
    </div>
  );
};
