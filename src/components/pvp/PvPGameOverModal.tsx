import React, { useEffect, useMemo } from 'react';
import { PvPRoom, PvPPlayer, PVP_MODES_CONFIG } from '../../types/pvp';
import { recordMatchOutcome, PvPUserStats } from '../../lib/pvpService';
import { sounds } from '../../lib/audio';
import {
  Trophy,
  Swords,
  Crown,
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  Equal,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  Flame
} from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface PvPGameOverModalProps {
  room: PvPRoom;
  currentUserId: string;
  onPlayAgain: () => void;
  onReturnToLobby: () => void;
}

export const PvPGameOverModal: React.FC<PvPGameOverModalProps> = ({
  room,
  currentUserId,
  onPlayAgain,
  onReturnToLobby
}) => {
  const currentUserPlayer = room.players.find(p => p.uid === currentUserId) || room.players[0];
  const userTeam = currentUserPlayer?.team || 'blue';

  const isTie = room.winner === 'tie';
  const isWin = room.winner === userTeam;
  const isLoss = !isTie && !isWin;

  // Record outcome and calculate rating delta (memoized per room & player to prevent duplicate writes)
  const outcome = useMemo(() => {
    return recordMatchOutcome(room, currentUserId);
  }, [room.id, currentUserId]);

  useEffect(() => {
    if (isWin) {
      sounds.playFanfare();
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else if (isTie) {
      sounds.playLevelUp();
    } else {
      sounds.playMistake();
    }
  }, [isWin, isTie]);

  // Find MVP
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
  const mvpPlayer = sortedPlayers[0];

  const config = PVP_MODES_CONFIG[room.mode];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800"
      >
        {/* Top Header Banner */}
        <div
          className={`p-6 sm:p-8 text-center text-white relative overflow-hidden ${
            isWin
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600'
              : isTie
              ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600'
              : 'bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800'
          }`}
        >
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider text-white">
              {config.title} &bull; 2-Minute Score Race Concluded
            </div>

            <div className="flex items-center justify-center gap-3">
              {isWin ? (
                <Trophy className="w-10 h-10 text-amber-300 animate-bounce" />
              ) : isTie ? (
                <Equal className="w-10 h-10 text-amber-300" />
              ) : (
                <Swords className="w-10 h-10 text-slate-300" />
              )}

              <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight">
                {isWin ? 'VICTORY!' : isTie ? 'STALEMATE! (TIE)' : 'DEFEAT'}
              </h2>
            </div>

            <p className="text-sm text-white/90 max-w-md mx-auto font-medium">
              {isWin
                ? 'Outstanding performance! Your squad dominated the 2-minute cognitive sprint.'
                : isTie
                ? 'Scores were dead even at the buzzer. As per tournament rules, no one wins!'
                : 'A valiant effort! Analyze the stats and jump back in for the rematch.'}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Final Score Comparison Bar */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            {/* Team Blue */}
            <div
              className={`p-4 rounded-xl border text-center transition-all ${
                room.winner === 'blue'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-2 ring-blue-400/40'
                  : 'bg-white text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider mb-1">
                <span className={`w-2.5 h-2.5 rounded-full ${room.winner === 'blue' ? 'bg-white' : 'bg-blue-600'}`} />
                <span>Team Blue</span>
                {room.winner === 'blue' && <Crown className="w-3.5 h-3.5 text-amber-300" />}
              </div>
              <div className="font-mono font-black text-3xl sm:text-4xl">
                {room.blueScore.toLocaleString()}
              </div>
              <span className={`text-[11px] font-bold ${room.winner === 'blue' ? 'text-blue-100' : 'text-slate-400'}`}>
                {room.winner === 'blue' ? 'WINNER' : room.winner === 'tie' ? 'TIED' : 'RUNNER-UP'}
              </span>
            </div>

            {/* Team Red */}
            <div
              className={`p-4 rounded-xl border text-center transition-all ${
                room.winner === 'red'
                  ? 'bg-rose-600 text-white border-rose-500 shadow-md ring-2 ring-rose-400/40'
                  : 'bg-white text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider mb-1">
                <span className={`w-2.5 h-2.5 rounded-full ${room.winner === 'red' ? 'bg-white' : 'bg-rose-600'}`} />
                <span>Team Red</span>
                {room.winner === 'red' && <Crown className="w-3.5 h-3.5 text-amber-300" />}
              </div>
              <div className="font-mono font-black text-3xl sm:text-4xl">
                {room.redScore.toLocaleString()}
              </div>
              <span className={`text-[11px] font-bold ${room.winner === 'red' ? 'text-rose-100' : 'text-slate-400'}`}>
                {room.winner === 'red' ? 'WINNER' : room.winner === 'tie' ? 'TIED' : 'RUNNER-UP'}
              </span>
            </div>
          </div>

          {/* MVP Spotlight Banner */}
          {mvpPlayer && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-yellow-500/10 border border-amber-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.2 rounded bg-amber-200 text-amber-900">
                      Match MVP
                    </span>
                    <span className="font-display font-black text-sm text-slate-900">
                      {mvpPlayer.displayName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Highest individual score of the battle with{' '}
                    <span className="font-bold text-amber-800">{mvpPlayer.score} pts</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">
                  {mvpPlayer.team === 'blue' ? '🔵 Team Blue' : '🔴 Team Red'}
                </span>
              </div>
            </div>
          )}

          {/* Individual Player Scoreboard Breakdown */}
          <div className="space-y-3">
            <h4 className="font-display font-black text-xs uppercase tracking-wider text-slate-500">
              Individual Combat Breakdown
            </h4>

            <div className="space-y-2">
              {sortedPlayers.map((player, rank) => {
                const teamTotal = player.team === 'blue' ? room.blueScore : room.redScore;
                const contribution = teamTotal > 0 ? Math.round((player.score / teamTotal) * 100) : 0;
                const isMe = player.uid === currentUserId;

                return (
                  <div
                    key={`${player.id || player.uid || 'p'}-${rank}`}
                    className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                      isMe
                        ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-400/40 shadow-xs'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-slate-400 w-4 text-center">
                        #{rank + 1}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-lg text-white text-xs font-black flex items-center justify-center shrink-0 ${
                          player.team === 'blue' ? 'bg-blue-600' : 'bg-rose-600'
                        }`}
                      >
                        {player.displayName.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{player.displayName}</span>
                          {isMe && (
                            <span className="text-[9px] bg-blue-200 text-blue-800 px-1 rounded font-black">
                              YOU
                            </span>
                          )}
                          {rank === 0 && <Crown className="w-3 h-3 text-amber-500" />}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {player.team === 'blue' ? '🔵 Team Blue' : '🔴 Team Red'} &bull; <strong className="text-slate-600 font-semibold">{player.rating ?? 0} Elo</strong> &bull; {contribution}% of team
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-black text-sm text-slate-900">
                        {player.score} <span className="text-[10px] font-normal text-slate-400">pts</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rating Delta Banner */}
          <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-slate-300">PvP Elo Rating:</span>
              <span className="font-mono font-black text-cyan-300">{outcome.newStats.rating}</span>
            </div>

            <span
              className={`font-mono font-black text-xs px-2.5 py-0.5 rounded-lg ${
                outcome.ratingDelta > 0
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {outcome.ratingDelta > 0 ? `+${outcome.ratingDelta}` : outcome.ratingDelta} Elo
            </span>
          </div>

          {/* Win Streak & Bot Toughness Status */}
          <div className="p-3.5 rounded-2xl border flex items-center justify-between transition-colors bg-slate-50 border-slate-200">
            <div className="flex items-center gap-2.5">
              <Flame className={`w-4 h-4 shrink-0 ${outcome.newStats.currentWinStreak > 0 ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Win Streak:</span>
                  <span className="font-mono font-black text-amber-600 text-xs">
                    {outcome.newStats.currentWinStreak} consecutive {outcome.newStats.currentWinStreak === 1 ? 'win' : 'wins'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isWin
                    ? `🔥 Streak increased! Opponent bots in your rank will now be tougher (+${Math.min(100, outcome.newStats.currentWinStreak * 10)}% reaction speed & accuracy).`
                    : isTie
                    ? `Stalemate. Win streak remains at ${outcome.newStats.currentWinStreak}.`
                    : `Streak reset. Bot difficulty returns to rank baseline.`}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                isWin
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : isTie
                  ? 'bg-slate-200 text-slate-700 border-slate-300'
                  : 'bg-rose-100 text-rose-800 border-rose-300'
              }`}>
                {isWin ? '+1 STREAK' : isTie ? 'HELD' : 'STREAK RESET'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={onPlayAgain}
              className="w-full sm:flex-1 py-3.5 px-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-display font-black text-sm rounded-2xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Queue New Match</span>
            </button>

            <button
              onClick={onReturnToLobby}
              className="w-full sm:w-auto py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl border border-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>PvP Lobby</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
