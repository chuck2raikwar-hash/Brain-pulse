import React from 'react';
import { AlertTriangle, ShieldAlert, ArrowRight, X, Swords } from 'lucide-react';
import { motion } from 'motion/react';
import { getLocalPvPStats } from '../../lib/pvpService';

interface PvPForfeitModalProps {
  isOpen: boolean;
  targetDestinationName?: string;
  isPrivateRoom?: boolean;
  onStay: () => void;
  onConfirmForfeit: () => void;
}

export const PvPForfeitModal: React.FC<PvPForfeitModalProps> = ({
  isOpen,
  targetDestinationName = 'Games',
  isPrivateRoom = false,
  onStay,
  onConfirmForfeit
}) => {
  if (!isOpen) return null;

  const currentStats = getLocalPvPStats();
  const currentRating = currentStats.rating;
  const newRatingAfterPenalty = isPrivateRoom ? currentRating : Math.max(0, currentRating - 20);

  return (
    <div
      id="pvp-forfeit-warning-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-rose-200 overflow-hidden text-slate-800"
      >
        {/* Header Strip */}
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 p-6 text-white relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                <AlertTriangle className="w-6 h-6 text-amber-200 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-black text-xl tracking-tight">Forfeit Warning</h3>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-black/30 text-rose-200">
                    -20 ELO
                  </span>
                </div>
                <p className="text-xs text-rose-100 font-medium mt-0.5">Leaving Active PvP Match</p>
              </div>
            </div>

            <button
              onClick={onStay}
              className="w-8 h-8 rounded-xl bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close and stay in match"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5">
          <div className={`border rounded-2xl p-4 space-y-2 ${
            isPrivateRoom ? 'bg-amber-50 border-amber-200 text-amber-950' : 'bg-rose-50 border-rose-200 text-rose-950'
          }`}>
            <div className={`flex items-center gap-2 font-black text-sm ${
              isPrivateRoom ? 'text-amber-900' : 'text-rose-900'
            }`}>
              <ShieldAlert className={`w-4 h-4 shrink-0 ${isPrivateRoom ? 'text-amber-600' : 'text-rose-600'}`} />
              <span>{isPrivateRoom ? 'Leave Custom Match?' : 'Are you sure you want to leave PvP?'}</span>
            </div>
            <p className={`text-xs leading-relaxed ${isPrivateRoom ? 'text-amber-800' : 'text-rose-800'}`}>
              {isPrivateRoom ? (
                <>
                  This is a <strong>custom private lobby (Unranked Friendly)</strong>. Forfeiting or navigating to{' '}
                  <strong className="font-extrabold underline decoration-amber-400">{targetDestinationName}</strong>{' '}
                  will concede the friendly match to your opponent, with <strong>0 ELO deducted</strong> and no effect on your competitive win streak.
                </>
              ) : (
                <>
                  You are currently queued or in an active battle. Navigating to{' '}
                  <strong className="font-extrabold underline decoration-rose-400">{targetDestinationName}</strong>{' '}
                  or leaving the page is considered a match abandonment and will cost you <strong>20 ELO rating points</strong>.
                  Your opponent will immediately win the match and receive an instant forfeit victory with <strong>+25 ELO</strong>.
                </>
              )}
            </p>
          </div>

          {/* Rating Delta Preview Card */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between">
            <div className="text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Rating</div>
              <div className="font-display font-black text-lg text-slate-800">{currentRating}</div>
            </div>

            <div className="flex flex-col items-center gap-0.5">
              <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${
                isPrivateRoom ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-rose-100 text-rose-600 border-rose-200'
              }`}>
                {isPrivateRoom ? '±0 ELO (Unranked)' : '-20 ELO'}
              </span>
              <ArrowRight className={`w-4 h-4 ${isPrivateRoom ? 'text-amber-600' : 'text-rose-600'}`} />
            </div>

            <div className="text-center">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">New Rating</div>
              <div className={`font-display font-black text-lg ${isPrivateRoom ? 'text-slate-800' : 'text-rose-600'}`}>
                {newRatingAfterPenalty}
              </div>
            </div>
          </div>

          {/* Decision Buttons */}
          <div className="flex flex-col gap-2.5 pt-1">
            <button
              id="stay-in-pvp-btn"
              onClick={onStay}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-black text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
            >
              <Swords className="w-4 h-4" />
              <span>Stay in PvP Match (Keep Rating)</span>
            </button>

            <button
              id="confirm-forfeit-btn"
              onClick={onConfirmForfeit}
              className="w-full py-3 px-4 bg-slate-100 hover:bg-rose-100 hover:border-rose-300 text-slate-600 hover:text-rose-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Leave Page & Forfeit (-20 ELO)</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
