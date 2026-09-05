import React, { useEffect, useState } from 'react';
import { PvPMode, PvPRoom, PVP_MODES_CONFIG, PvPPlayer } from '../../types/pvp';
import { sounds } from '../../lib/audio';
import {
  Brain,
  Swords,
  Users,
  Shield,
  Flame,
  Trophy,
  X,
  Zap,
  Sparkles,
  Loader2,
  Clock,
  Copy,
  Check,
  Hash,
  AlertTriangle,
  ShieldAlert,
  Bot,
  Radar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getLocalPvPStats, getRankTierInfo } from '../../lib/pvpService';

interface PvPQueueModalProps {
  mode: PvPMode;
  room: PvPRoom;
  onCancel: () => void;
  onInstantMatchBots: () => void;
  searchPhase?: 'searching_players' | 'player_found' | 'deploying_bots';
  searchCountdown?: number;
}

export const PvPQueueModal: React.FC<PvPQueueModalProps> = ({
  mode,
  room,
  onCancel,
  onInstantMatchBots,
  searchPhase = 'searching_players',
  searchCountdown = 6
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const config = PVP_MODES_CONFIG[mode];
  const maxPlayers = config.totalPlayers;
  const currentCount = room.players.length;

  const currentStats = getLocalPvPStats();
  const rankInfo = getRankTierInfo(currentStats.rating, currentStats.currentWinStreak);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    sounds.playTick();
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
      if (Math.random() > 0.6) {
        sounds.playTick();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatElapsed = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const getModeIcon = () => {
    switch (mode) {
      case '1v1': return <Swords className="w-5 h-5" />;
      case '2v2': return <Users className="w-5 h-5" />;
      case '3v3': return <Shield className="w-5 h-5" />;
      case '4v4': return <Flame className="w-5 h-5" />;
      case '5v5': return <Trophy className="w-5 h-5" />;
    }
  };

  const bluePlayers = room.players.filter(p => p.team === 'blue');
  const redPlayers = room.players.filter(p => p.team === 'red');
  const teamSize = config.teamSize;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 15 }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden text-slate-800"
      >
        {/* Top Header */}
        <div className={`p-6 bg-gradient-to-r ${config.bgGradient} text-white relative overflow-hidden`}>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                {getModeIcon()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-black text-xl tracking-tight">{config.title}</h3>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                    2:00 Match
                  </span>
                </div>
                <p className="text-xs text-white/80 font-medium mt-0.5">Chess.com Style Live Matchmaking</p>
              </div>
            </div>

            <button
              onClick={() => setShowCancelConfirm(true)}
              className="w-9 h-9 rounded-xl bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Cancel Matchmaking"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ELO Penalty Heads-Up Notice Strip */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-2.5 flex items-center gap-2.5 text-xs text-amber-900 font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
          <p className="leading-tight">
            <strong>Ranked Queue Lock:</strong> Leaving this page or pressing Games/other tabs forfeits the match and deducts <strong>-20 ELO</strong>.
          </p>
        </div>

        {/* Searching Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Pulsating Radar Searching Visual */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Outer Ripple 1 */}
              <motion.div
                animate={{ scale: [1, 1.4, 1.8], opacity: [0.6, 0.3, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border-2 border-cyan-400"
              />
              {/* Outer Ripple 2 */}
              <motion.div
                animate={{ scale: [1, 1.3, 1.6], opacity: [0.7, 0.3, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, delay: 0.7, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border-2 border-blue-500"
              />

              {/* Core Pulsing Brain */}
              <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-lime-400 flex items-center justify-center text-white shadow-xl shadow-cyan-500/30 z-10 animate-pulse">
                <Brain className="w-9 h-9" />
              </div>
            </div>

            <div className="text-center mt-4 space-y-2">
              <div className="font-display font-extrabold text-lg text-slate-900 flex items-center justify-center gap-2">
                {searchPhase === 'deploying_bots' ? (
                  <>
                    <Bot className="w-5 h-5 text-amber-600 animate-bounce" />
                    <span>No Players Found • Deploying {rankInfo.name} Bots</span>
                  </>
                ) : (
                  <>
                    <span>Searching for Human Opponents...</span>
                    <Loader2 className="w-4 h-4 text-cyan-600 animate-spin" />
                  </>
                )}
              </div>

              {/* Skill-Based Matchmaking Range & Search Window Indicator */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-[11px] font-bold text-cyan-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                  <span>Matchmaking Bracket:</span>
                  <span className="font-mono font-black text-cyan-950">~{currentStats.rating} ELO (&plusmn;30)</span>
                </div>

                {currentStats.currentWinStreak > 0 && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-[11px] font-bold text-amber-900">
                    <Flame className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    <span>Win Streak:</span>
                    <span className="font-mono font-black text-amber-950">{currentStats.currentWinStreak} (Bot Toughness +{Math.min(100, currentStats.currentWinStreak * 10)}%)</span>
                  </div>
                )}

                {searchPhase === 'searching_players' && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-900">
                    <Radar className="w-3 h-3 text-amber-600 animate-spin" />
                    <span>Player Search:</span>
                    <span className="font-mono font-black text-amber-950">{searchCountdown}s remaining</span>
                  </div>
                )}
              </div>

              {/* Toughness Fallback Notice */}
              <div className="max-w-md mx-auto px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 font-medium leading-relaxed">
                {searchPhase === 'deploying_bots' ? (
                  <p className="text-amber-900 font-semibold">
                    ⚡ No online opponents found in {rankInfo.name} bracket. Deployed <strong>{rankInfo.botTitle || `${rankInfo.name} AI`}</strong> ({rankInfo.toughnessLabel}) calibrated to your {currentStats.currentWinStreak > 0 ? `${currentStats.currentWinStreak}-win streak` : 'rank'}.
                  </p>
                ) : (
                  <p>
                    Looking for live opponents. If none are found, you will face <strong>{rankInfo.botTitle || `${rankInfo.name} AI`}</strong> (<span className="text-amber-700 font-bold">{rankInfo.toughnessLabel}</span>).
                  </p>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>Elapsed: <span className="font-mono text-slate-700">{formatElapsed(elapsedSeconds)}</span></span>
                <span>&bull;</span>
                <span>Roster: <span className="text-cyan-600 font-extrabold">{currentCount}/{maxPlayers}</span></span>
              </div>

              {/* Room Code Badge */}
              <div className="pt-1 flex items-center justify-center">
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                  title="Click to copy room code"
                >
                  <Hash className="w-3.5 h-3.5 text-blue-600" />
                  <span>Room Code: <strong className="font-mono text-slate-900">{room.code}</strong></span>
                  {copied ? (
                    <span className="text-emerald-600 text-[10px] font-black flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Copied
                    </span>
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Teams Slot Grid */}
          <div className="grid grid-cols-2 gap-3.5 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
            {/* Blue Team Column */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-blue-700 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span>Team Blue (Alpha)</span>
                </div>
                <span className="text-[10px] font-bold text-blue-500">{bluePlayers.length}/{teamSize}</span>
              </div>
              <div className="space-y-1.5">
                {Array.from({ length: teamSize }).map((_, idx) => {
                  const player = bluePlayers[idx];
                  return (
                    <div
                      key={`blue-${idx}`}
                      className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                        player
                          ? 'bg-blue-50/80 border-blue-200 text-blue-900 font-bold'
                          : 'bg-white/60 border-dashed border-slate-200 text-slate-400 font-medium'
                      }`}
                    >
                      {player ? (
                        <>
                          {player.photoURL ? (
                            <img
                              src={player.photoURL}
                              alt={player.displayName}
                              referrerPolicy="no-referrer"
                              className="w-6 h-6 rounded-lg object-cover shrink-0 border border-blue-300"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-xs">
                              {player.displayName.slice(0, 1).toUpperCase()}
                            </div>
                          )}
                          <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="text-xs truncate leading-tight font-bold">{player.displayName}</span>
                              {player.isBot && (
                                <span className={`text-[9px] px-1 rounded border font-bold shrink-0 inline-flex items-center gap-0.5 ${
                                  (player.botStreakLevel ?? currentStats.currentWinStreak ?? 0) > 0
                                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                                    : 'bg-blue-100 text-blue-900 border-blue-300'
                                }`}>
                                  {(player.botStreakLevel ?? currentStats.currentWinStreak ?? 0) > 0 && (
                                    <Flame className="w-2.5 h-2.5 text-amber-600 inline shrink-0" />
                                  )}
                                  <span>{player.botTitle || `${player.botRankTier || rankInfo.name} AI`}</span>
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-blue-600/80 font-bold leading-none">{player.rating ?? 0} Elo</span>
                          </div>
                          <span className="text-[9px] bg-blue-200 text-blue-800 px-1.5 py-0.2 rounded font-black">
                            READY
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-6 h-6 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-300 text-xs">
                            ?
                          </div>
                          <span className="text-xs italic text-slate-400">Searching...</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Red Team Column */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-rose-700 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                  <span>Team Red (Omega)</span>
                </div>
                <span className="text-[10px] font-bold text-rose-500">{redPlayers.length}/{teamSize}</span>
              </div>
              <div className="space-y-1.5">
                {Array.from({ length: teamSize }).map((_, idx) => {
                  const player = redPlayers[idx];
                  return (
                    <div
                      key={`red-${idx}`}
                      className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                        player
                          ? 'bg-rose-50/80 border-rose-200 text-rose-900 font-bold'
                          : 'bg-white/60 border-dashed border-slate-200 text-slate-400 font-medium'
                      }`}
                    >
                      {player ? (
                        <>
                          {player.photoURL ? (
                            <img
                              src={player.photoURL}
                              alt={player.displayName}
                              referrerPolicy="no-referrer"
                              className="w-6 h-6 rounded-lg object-cover shrink-0 border border-rose-300"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-lg bg-rose-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-xs">
                              {player.displayName.slice(0, 1).toUpperCase()}
                            </div>
                          )}
                          <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="text-xs truncate leading-tight font-bold">{player.displayName}</span>
                              {player.isBot && (
                                <span className={`text-[9px] px-1 rounded border font-bold shrink-0 inline-flex items-center gap-0.5 ${
                                  (player.botStreakLevel ?? currentStats.currentWinStreak ?? 0) > 0
                                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                                    : 'bg-rose-100 text-rose-900 border-rose-300'
                                }`}>
                                  {(player.botStreakLevel ?? currentStats.currentWinStreak ?? 0) > 0 && (
                                    <Flame className="w-2.5 h-2.5 text-amber-600 inline shrink-0" />
                                  )}
                                  <span>{player.botTitle || `${player.botRankTier || rankInfo.name} AI`}</span>
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-rose-600/80 font-bold leading-none">{player.rating ?? 0} Elo</span>
                          </div>
                          <span className="text-[9px] bg-rose-200 text-rose-800 px-1.5 py-0.2 rounded font-black">
                            READY
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-6 h-6 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-300 text-xs">
                            ?
                          </div>
                          <span className="text-xs italic text-slate-400">Searching...</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <button
              onClick={onInstantMatchBots}
              className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
            >
              <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>Skip Search &amp; Match {rankInfo.name} Bots ({rankInfo.toughnessLabel})</span>
            </button>

            <button
              onClick={() => setShowCancelConfirm(true)}
              className="w-full sm:w-auto py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              Cancel Queue
            </button>
          </div>
        </div>

        {/* Confirmation Modal when trying to Cancel Queue */}
        {showCancelConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-rose-200 space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-600">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-base text-slate-900">Leave Matchmaking?</h4>
                  <p className="text-[11px] text-rose-600 font-bold">Queue Dodge / Forfeiture Warning</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Canceling matchmaking now counts as abandoning the ranked queue and will deduct{' '}
                <strong className="text-rose-600 font-black">20 ELO rating points</strong> ({currentStats.rating} &rarr; {Math.max(0, currentStats.rating - 20)}).
              </p>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer hover:opacity-95"
                >
                  Stay in Queue (Keep Rating)
                </button>

                <button
                  onClick={() => {
                    setShowCancelConfirm(false);
                    onCancel();
                  }}
                  className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors cursor-pointer"
                >
                  Leave & Forfeit (-20 ELO)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
