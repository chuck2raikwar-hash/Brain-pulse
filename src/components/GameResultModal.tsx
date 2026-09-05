import React, { useEffect } from 'react';
import { GameResult } from '../types';
import { sounds } from '../lib/audio';
import { Trophy, Zap, Target, Clock, Sparkles, RefreshCw, ArrowRight, CheckCircle2, Award, Flame } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface GameResultModalProps {
  result: GameResult;
  onPlayAgain: () => void;
  onClose: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({ result, onPlayAgain, onClose }) => {
  useEffect(() => {
    if (result.isNewHighScore) {
      sounds.playFanfare();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 }
      });
    }
  }, [result.isNewHighScore]);

  return (
    <div id="game-result-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-800 relative overflow-hidden"
      >
        {/* Playful background glows */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-200/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-lime-200/40 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center relative z-10">
          {result.isNewHighScore ? (
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-full mb-4 shadow-md shadow-orange-500/20 animate-pop">
              <Award className="w-4 h-4 text-slate-950" /> New High Score Record! 🏆
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-extrabold uppercase tracking-wider rounded-full mb-4">
              <CheckCircle2 className="w-4 h-4 text-cyan-600" /> Workout Complete! ✨
            </div>
          )}

          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900">{result.gameTitle}</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Session recorded & saved to your profile</p>

          {/* Primary Score Box */}
          <div className="my-5 p-5 bg-gradient-to-br from-blue-50 via-cyan-50 to-lime-50 rounded-3xl border border-blue-100 flex flex-col items-center justify-center shadow-inner">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Final Score</span>
            <span className="font-display text-5xl font-black text-blue-600 my-1">
              {result.score.toLocaleString()}
            </span>
            <div className="inline-flex items-center gap-1 text-xs font-extrabold text-lime-700 bg-lime-100/80 px-3 py-1 rounded-full mt-1">
              <Zap className="w-3.5 h-3.5 fill-lime-600" />
              <span>+{result.brainPowerGained} Brain Power XP</span>
            </div>
          </div>

          {/* Detailed Metric Grid */}
          <div className="grid grid-cols-3 gap-2.5 mb-6 text-center">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-0.5">Accuracy</div>
              <div className="font-display text-base font-black text-slate-800">{result.accuracy}%</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-0.5">Level</div>
              <div className="font-display text-base font-black text-slate-800">Lvl {result.level}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-0.5">Speed</div>
              <div className="font-display text-base font-black text-slate-800">{result.responseTimeMs}ms</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              id="modal-play-again-btn"
              onClick={onPlayAgain}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              Play Again
            </button>
            <button
              id="modal-return-hub-btn"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-extrabold uppercase tracking-wider rounded-2xl transition-colors cursor-pointer"
            >
              Back to Hub
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
