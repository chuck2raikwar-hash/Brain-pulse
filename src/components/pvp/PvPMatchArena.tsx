import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { PvPRoom, PvPPlayer, PvPMode, PVP_MODES_CONFIG } from '../../types/pvp';
import { GameType } from '../../types';
import { GAME_MODES } from '../../data/games';
import { PvPGameRunner } from './PvPGameRunner';
import { sounds } from '../../lib/audio';
import { recordForfeitOutcome, getRankTierInfo } from '../../lib/pvpService';
import {
  Clock,
  Swords,
  Trophy,
  Users,
  Shield,
  Flame,
  Zap,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  TrendingUp,
  Activity,
  Award,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PvPForfeitModal } from './PvPForfeitModal';

interface PvPMatchArenaProps {
  room: PvPRoom;
  currentUserId: string;
  selectedGame: GameType;
  onMatchComplete: (finalRoom: PvPRoom) => void;
  onExit: () => void;
}

interface ScoreEvent {
  id: string;
  playerName: string;
  team: 'blue' | 'red';
  points: number;
  timeStr: string;
}

export const PvPMatchArena: React.FC<PvPMatchArenaProps> = ({
  room: initialRoom,
  currentUserId,
  selectedGame,
  onMatchComplete,
  onExit
}) => {
  // 2 Minutes = 120 seconds
  const [secondsRemaining, setSecondsRemaining] = useState(120);
  const [room, setRoom] = useState<PvPRoom>(initialRoom);
  const [scoreEvents, setScoreEvents] = useState<ScoreEvent[]>([]);
  const [lastLeadTeam, setLastLeadTeam] = useState<'blue' | 'red' | 'tie'>('tie');
  const [leadAnnouncement, setLeadAnnouncement] = useState<string | null>(null);
  const [showForfeitModal, setShowForfeitModal] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const botIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFinishedRef = useRef(false);

  const gameInfo = GAME_MODES[selectedGame] || GAME_MODES['memory-matrix'];
  const config = PVP_MODES_CONFIG[room.mode];

  // User player
  const currentUserPlayer = room.players.find(p => p.uid === currentUserId) || room.players[0];
  const userTeam = currentUserPlayer?.team || 'blue';

  const handleConfirmForfeit = () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    if (botIntervalRef.current) clearInterval(botIntervalRef.current);

    sounds.playMistake();
    recordForfeitOutcome(room, currentUserId);
    onExit();
  };

  // 2-Minute Countdown Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          clearInterval(botIntervalRef.current!);
          finishMatch();
          return 0;
        }

        // Ticking audio in final 10 seconds
        if (prev <= 10) {
          sounds.playTick();
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (botIntervalRef.current) clearInterval(botIntervalRef.current);
    };
  }, []);

  // Handle Score Addition
  const addPlayerScore = useCallback((playerId: string, points: number) => {
    setRoom(prevRoom => {
      let targetPlayer: PvPPlayer | undefined;
      const updatedPlayers = prevRoom.players.map(p => {
        if (p.id === playerId || p.uid === playerId) {
          targetPlayer = p;
          return {
            ...p,
            score: p.score + points,
            level: p.level + (Math.random() > 0.6 ? 1 : 0)
          };
        }
        return p;
      });

      if (!targetPlayer) return prevRoom;

      const newBlueScore = updatedPlayers
        .filter(p => p.team === 'blue')
        .reduce((sum, p) => sum + p.score, 0);

      const newRedScore = updatedPlayers
        .filter(p => p.team === 'red')
        .reduce((sum, p) => sum + p.score, 0);

      // Check lead change
      const currentLead: 'blue' | 'red' | 'tie' =
        newBlueScore > newRedScore ? 'blue' : newRedScore > newBlueScore ? 'red' : 'tie';

      if (currentLead !== 'tie' && currentLead !== lastLeadTeam) {
        setLastLeadTeam(currentLead);
        sounds.playLeadChange();
        setLeadAnnouncement(
          currentLead === 'blue' ? 'TEAM BLUE TOOK THE LEAD!' : 'TEAM RED TOOK THE LEAD!'
        );
        setTimeout(() => setLeadAnnouncement(null), 2500);
      }

      // Add score ticker event
      const event: ScoreEvent = {
        id: `ev-${Date.now()}-${Math.random()}`,
        playerName: targetPlayer.displayName,
        team: targetPlayer.team,
        points,
        timeStr: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })
      };

      setScoreEvents(events => [event, ...events].slice(0, 6));

      return {
        ...prevRoom,
        players: updatedPlayers,
        blueScore: newBlueScore,
        redScore: newRedScore,
        updatedAt: Date.now()
      };
    });
  }, [lastLeadTeam]);

  // Bot scoring simulation loop during the 2 minutes
  const addPlayerScoreRef = useRef(addPlayerScore);
  addPlayerScoreRef.current = addPlayerScore;

  const initialBotPlayers = useMemo(() => room.players.filter(p => p.isBot), []);

  // Dynamic Rank-Tiered Bot simulation loop
  // Bots scale in toughness per rank: Bronze bots are deliberate with occasional mistakes,
  // while Grandmaster bots are lightning-fast with near-perfect accuracy and combo streaks.
  useEffect(() => {
    if (initialBotPlayers.length === 0) return;

    const activeTimers: NodeJS.Timeout[] = [];
    let isCancelled = false;

    initialBotPlayers.forEach(bot => {
      const botRating = bot.rating !== undefined && bot.rating !== null ? bot.rating : 0;
      const effectiveStreak = bot.botStreakLevel ?? room.playerWinStreak ?? 0;
      const rankInfo = getRankTierInfo(botRating, effectiveStreak);

      const runBotCycle = () => {
        if (isCancelled) return;

        // Add ±15% natural human-like jitter to the rank interval
        const jitter = (Math.random() - 0.5) * 0.3;
        const delay = Math.max(800, Math.round(rankInfo.botTickIntervalMs * (1 + jitter)));

        const timer = setTimeout(() => {
          if (isCancelled) return;

          // Check accuracy / mistake chance
          const accuracyRoll = Math.random() * 100;
          let points = 0;

          if (accuracyRoll > rankInfo.botAccuracyMax) {
            // Mistake / slow hesitation: minimal or 0 points
            points = Math.floor(Math.random() * 15);
          } else {
            // Normal hit: calculate rank base score
            const base = rankInfo.botBaseScoreMin + Math.floor(
              Math.random() * (rankInfo.botBaseScoreMax - rankInfo.botBaseScoreMin + 1)
            );
            // Combo streak probability check
            const isStreak = Math.random() < rankInfo.streakChance;
            const streakBonus = isStreak ? Math.round(base * 0.4) : 0;
            points = base + streakBonus;
          }

          if (points > 0) {
            addPlayerScoreRef.current(bot.id, points);
          }

          runBotCycle();
        }, delay);

        activeTimers.push(timer);
      };

      // Stagger initial starts so bots do not all fire at t=0
      const initialDelay = 1000 + Math.floor(Math.random() * 2000);
      const startTimer = setTimeout(runBotCycle, initialDelay);
      activeTimers.push(startTimer);
    });

    return () => {
      isCancelled = true;
      activeTimers.forEach(t => clearTimeout(t));
    };
  }, [initialBotPlayers]);

  // User earned score from the active game
  const handleUserScoreEarned = (pointsDelta: number) => {
    sounds.playCorrect(2);
    addPlayerScore(currentUserId, pointsDelta);
  };

  // Match Conclusion
  const finishMatch = () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;

    sounds.playBuzzer();

    setRoom(finalRoom => {
      let matchWinner: 'blue' | 'red' | 'tie' = 'tie';
      if (finalRoom.blueScore > finalRoom.redScore) {
        matchWinner = 'blue';
      } else if (finalRoom.redScore > finalRoom.blueScore) {
        matchWinner = 'red';
      } else {
        matchWinner = 'tie'; // If score ties no one wins!
      }

      const completedRoom: PvPRoom = {
        ...finalRoom,
        phase: 'completed',
        winner: matchWinner,
        endsAt: Date.now()
      };

      setTimeout(() => {
        onMatchComplete(completedRoom);
      }, 1000);

      return completedRoom;
    });
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const blueScore = room.blueScore;
  const redScore = room.redScore;
  const totalPoints = blueScore + redScore;
  const bluePercent = totalPoints > 0 ? Math.round((blueScore / totalPoints) * 100) : 50;
  const redPercent = 100 - bluePercent;
  const scoreDiff = Math.abs(blueScore - redScore);

  const bluePlayers = room.players.filter(p => p.team === 'blue');
  const redPlayers = room.players.filter(p => p.team === 'red');

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Top Main Scoreboard Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle dynamic glow based on leader */}
        <div
          className={`absolute inset-0 opacity-15 pointer-events-none transition-colors duration-500 ${
            blueScore > redScore
              ? 'bg-blue-600'
              : redScore > blueScore
              ? 'bg-rose-600'
              : 'bg-slate-800'
          }`}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Team Blue Score Block */}
          <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-display font-black text-xl shadow-lg shadow-blue-500/30">
                BLU
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-sm uppercase tracking-wider text-blue-400">
                    Team Blue (Alpha)
                  </span>
                  {userTeam === 'blue' && (
                    <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/40">
                      YOUR SQUAD
                    </span>
                  )}
                </div>
                <div className="font-mono font-black text-3xl sm:text-4xl text-white tracking-tight">
                  {blueScore.toLocaleString()}
                </div>
              </div>
            </div>
            {blueScore > redScore && (
              <span className="text-xs font-black text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-xl border border-blue-800/80">
                +{scoreDiff} LEADING
              </span>
            )}
          </div>

          {/* Center Match Clock & Tug-of-War Gauge */}
          <div className="flex flex-col items-center justify-center w-full md:w-72">
            <div className="flex items-center gap-2 mb-1">
              <Clock
                className={`w-4 h-4 ${
                  secondsRemaining <= 30 ? 'text-rose-400 animate-bounce' : 'text-cyan-400'
                }`}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Time Remaining
              </span>
            </div>

            <div
              className={`font-mono font-black text-3xl sm:text-4xl tracking-tight transition-colors ${
                secondsRemaining <= 30
                  ? 'text-rose-400 animate-pulse scale-105'
                  : 'text-white'
              }`}
            >
              {formatTimer(secondsRemaining)}
            </div>

            {/* Score Tug-of-War Bar */}
            <div className="w-full mt-2">
              <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden flex border border-slate-700">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${bluePercent}%` }}
                />
                <div
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{ width: `${redPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400 mt-1 px-1">
                <span>{bluePercent}% Blue</span>
                <span>{redPercent}% Red</span>
              </div>
            </div>
          </div>

          {/* Team Red Score Block */}
          <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-end flex-row-reverse md:flex-row">
            {redScore > blueScore && (
              <span className="text-xs font-black text-rose-400 bg-rose-950/80 px-2.5 py-1 rounded-xl border border-rose-800/80">
                +{scoreDiff} LEADING
              </span>
            )}
            <div className="flex items-center gap-3 flex-row-reverse md:flex-row text-right md:text-right">
              <div>
                <div className="flex items-center gap-2 justify-end">
                  {userTeam === 'red' && (
                    <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-rose-500/30 text-rose-300 border border-rose-400/40">
                      YOUR SQUAD
                    </span>
                  )}
                  <span className="font-display font-black text-sm uppercase tracking-wider text-rose-400">
                    Team Red (Omega)
                  </span>
                </div>
                <div className="font-mono font-black text-3xl sm:text-4xl text-white tracking-tight">
                  {redScore.toLocaleString()}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-display font-black text-xl shadow-lg shadow-rose-500/30">
                RED
              </div>
            </div>
          </div>
        </div>

        {/* Win Streak Escalation Alert */}
        {room.playerWinStreak !== undefined && room.playerWinStreak > 0 && (
          <div className="mt-3 flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
              <span className="font-bold">
                Win Streak Escalation (Lvl {room.playerWinStreak}):
              </span>
              <span className="text-amber-200/90 text-[11px] hidden sm:inline">
                Bots fighting with +{Math.min(100, room.playerWinStreak * 10)}% toughness!
              </span>
            </div>
            <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40 shrink-0">
              Resets on defeat
            </span>
          </div>
        )}

        {/* Lead Change Banner */}
        <AnimatePresence>
          {leadAnnouncement && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-3 py-1.5 px-4 rounded-xl text-center text-xs font-black uppercase tracking-wider border shadow-md ${
                leadAnnouncement.includes('BLUE')
                  ? 'bg-blue-600/90 text-white border-blue-400'
                  : 'bg-rose-600/90 text-white border-rose-400'
              }`}
            >
              {leadAnnouncement}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Arena Layout: Score Ticker Sidebar + Active Game */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        {/* Left Side: Live Score Ticker & Squad Roster */}
        <div className="lg:col-span-1 space-y-4">
          {/* Active Mode Info Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${config.badgeColor}`}>
                {config.title}
              </span>
              <button
                onClick={() => setShowForfeitModal(true)}
                className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 font-bold cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Forfeit</span>
              </button>
            </div>
            <div>
              <h4 className="font-display font-extrabold text-slate-900 text-sm">{gameInfo.name}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{gameInfo.description}</p>
            </div>
          </div>

          {/* Roster with Live Player Scores */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <h5 className="font-display font-black text-xs uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Player Roster</span>
              <span className="text-[10px] font-bold text-slate-400">{room.players.length} Competitors</span>
            </h5>

            <div className="space-y-2">
              {/* Blue Team Players */}
              <div className="space-y-1">
                <div className="text-[10px] font-black text-blue-700 px-1">🔵 Team Blue</div>
                {bluePlayers.map((p, i) => (
                  <div
                    key={`${p.id || p.uid || 'blue'}-${i}`}
                    className={`p-2 rounded-xl border flex items-center justify-between text-xs ${
                      p.uid === currentUserId
                        ? 'bg-blue-50/90 border-blue-300 font-bold text-blue-950 ring-1 ring-blue-400/30'
                        : 'bg-slate-50/70 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <div className="w-5 h-5 rounded-md bg-blue-600 text-white text-[9px] font-black flex items-center justify-center shrink-0">
                        {p.displayName.slice(0, 1).toUpperCase()}
                      </div>
                      <span className="truncate">{p.displayName}</span>
                      <span className="text-[10px] text-blue-700/70 font-semibold shrink-0">
                        ({p.rating ?? 0})
                      </span>
                      {p.isBot && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold shrink-0 inline-flex items-center gap-1 ${
                          (p.botStreakLevel ?? room.playerWinStreak ?? 0) > 0
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}>
                          {(p.botStreakLevel ?? room.playerWinStreak ?? 0) > 0 && (
                            <Flame className="w-2.5 h-2.5 text-amber-600 inline shrink-0" />
                          )}
                          <span>{p.botTitle || `${p.botRankTier || getRankTierInfo(p.rating ?? 0).tier} AI`}</span>
                        </span>
                      )}
                      {p.uid === currentUserId && (
                        <span className="text-[9px] bg-blue-200 text-blue-800 px-1 rounded font-black">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-black text-blue-700">{p.score}</span>
                  </div>
                ))}
              </div>

              {/* Red Team Players */}
              <div className="space-y-1 pt-1">
                <div className="text-[10px] font-black text-rose-700 px-1">🔴 Team Red</div>
                {redPlayers.map((p, i) => (
                  <div
                    key={`${p.id || p.uid || 'red'}-${i}`}
                    className={`p-2 rounded-xl border flex items-center justify-between text-xs ${
                      p.uid === currentUserId
                        ? 'bg-rose-50/90 border-rose-300 font-bold text-rose-950 ring-1 ring-rose-400/30'
                        : 'bg-slate-50/70 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <div className="w-5 h-5 rounded-md bg-rose-600 text-white text-[9px] font-black flex items-center justify-center shrink-0">
                        {p.displayName.slice(0, 1).toUpperCase()}
                      </div>
                      <span className="truncate">{p.displayName}</span>
                      <span className="text-[10px] text-rose-700/70 font-semibold shrink-0">
                        ({p.rating ?? 0})
                      </span>
                      {p.isBot && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold shrink-0 inline-flex items-center gap-1 ${
                          (p.botStreakLevel ?? room.playerWinStreak ?? 0) > 0
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-rose-100 text-rose-900 border border-rose-200'
                        }`}>
                          {(p.botStreakLevel ?? room.playerWinStreak ?? 0) > 0 && (
                            <Flame className="w-2.5 h-2.5 text-amber-600 inline shrink-0" />
                          )}
                          <span>{p.botTitle || `${p.botRankTier || getRankTierInfo(p.rating ?? 0).tier} AI`}</span>
                        </span>
                      )}
                      {p.uid === currentUserId && (
                        <span className="text-[9px] bg-rose-200 text-rose-800 px-1 rounded font-black">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-black text-rose-700">{p.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Action Ticker / Killfeed */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
            <h5 className="font-display font-black text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-600" />
              <span>Live Action Ticker</span>
            </h5>
            <div className="space-y-1.5 text-[11px]">
              {scoreEvents.length === 0 ? (
                <div className="text-slate-400 italic text-center py-2">Match underway...</div>
              ) : (
                scoreEvents.map((ev, evIdx) => (
                  <div
                    key={`${ev.id || 'ev'}-${evIdx}`}
                    className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-100"
                  >
                    <div className="flex items-center gap-1.5 truncate pr-1">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${ev.team === 'blue' ? 'bg-blue-600' : 'bg-rose-600'}`} />
                      <span className="font-bold truncate">{ev.playerName}</span>
                    </div>
                    <span className="font-mono font-black text-emerald-600 shrink-0">
                      +{ev.points} pts
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right / Center: Active 5-Minute Cognitive Game */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-4 sm:p-6">
            <PvPGameRunner
              gameType={selectedGame}
              onScoreEarned={handleUserScoreEarned}
              onExitMatch={() => setShowForfeitModal(true)}
            />
          </div>
        </div>
      </div>

      {/* Forfeit Confirmation Modal */}
      <PvPForfeitModal
        isOpen={showForfeitModal}
        targetDestinationName="Lobby"
        onStay={() => setShowForfeitModal(false)}
        onConfirmForfeit={() => {
          setShowForfeitModal(false);
          handleConfirmForfeit();
        }}
      />
    </div>
  );
};
