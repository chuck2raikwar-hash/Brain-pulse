import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../lib/audio';
import { GameType } from '../types';
import { Gauge, Zap, AlertTriangle, RefreshCw, Trophy, Clock, Play } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface QuickReactionDrillProps {
  onGameOver: (result: {
    gameType: GameType;
    gameTitle: string;
    score: number;
    accuracy: number;
    level: number;
    responseTimeMs: number;
  }) => void;
  onExit: () => void;
}

type DrillState = 'idle' | 'waiting' | 'ready' | 'result' | 'early';

const TOTAL_TRIALS = 5;

export const QuickReactionDrill: React.FC<QuickReactionDrillProps> = ({ onGameOver, onExit }) => {
  const [drillState, setDrillState] = useState<DrillState>('idle');
  const [trial, setTrial] = useState(1);
  const [trialTimes, setTrialTimes] = useState<number[]>([]);
  const [lastTime, setLastTime] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startPerfTime = useRef<number>(0);

  // Keyboard Spacebar trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const startTrial = () => {
    setDrillState('waiting');
    setLastTime(null);

    // Random wait between 1.5s and 4.2s
    const randomDelay = Math.floor(Math.random() * 2700) + 1500;

    timerRef.current = setTimeout(() => {
      sounds.playReactionClick();
      startPerfTime.current = performance.now();
      setDrillState('ready');
    }, randomDelay);
  };

  const handleClick = () => {
    if (drillState === 'idle') {
      startTrial();
    } else if (drillState === 'waiting') {
      // False start!
      if (timerRef.current) clearTimeout(timerRef.current);
      sounds.playMistake();
      setDrillState('early');
    } else if (drillState === 'ready') {
      // Clicked in green zone!
      const elapsed = Math.round(performance.now() - startPerfTime.current);
      sounds.playCorrect(2);
      setLastTime(elapsed);

      const nextTimes = [...trialTimes, elapsed];
      setTrialTimes(nextTimes);
      setDrillState('result');

      if (trial >= TOTAL_TRIALS) {
        // Completed all trials
        const avg = Math.round(nextTimes.reduce((a, b) => a + b, 0) / nextTimes.length);
        const reflexScore = Math.max(100, Math.round(1000 - avg * 1.5));
        sounds.playFanfare();
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });

        setTimeout(() => {
          onGameOver({
            gameType: 'reaction-drill',
            gameTitle: 'Quick-Reaction Drill',
            score: reflexScore,
            accuracy: 100,
            level: 5,
            responseTimeMs: avg
          });
        }, 1500);
      }
    } else if (drillState === 'early' || drillState === 'result') {
      if (drillState === 'result') {
        setTrial(t => t + 1);
      }
      startTrial();
    }
  };

  const getTier = (ms: number) => {
    if (ms < 200) return { label: 'Supersonic Reflex', color: 'text-emerald-400' };
    if (ms < 250) return { label: 'Pro Gamer Speed', color: 'text-cyan-400' };
    if (ms < 300) return { label: 'Above Average', color: 'text-blue-400' };
    if (ms < 380) return { label: 'Normal Baseline', color: 'text-amber-400' };
    return { label: 'Sluggish / Delayed', color: 'text-rose-400' };
  };

  return (
    <div id="quick-reaction-drill-game" className="max-w-4xl mx-auto space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
                Neuromuscular Velocity &bull; Trial {Math.min(trial, TOTAL_TRIALS)}/{TOTAL_TRIALS}
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-black text-slate-900">
              Quick-Reaction Drill
            </h1>
          </div>
        </div>

        {/* Previous Average */}
        {trialTimes.length > 0 && (
          <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 text-center">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Avg Speed</span>
            <span className="font-mono text-base font-black text-red-600">
              {Math.round(trialTimes.reduce((a, b) => a + b, 0) / trialTimes.length)} ms
            </span>
          </div>
        )}

        <button
          onClick={onExit}
          className="text-xs font-extrabold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors cursor-pointer"
        >
          Exit
        </button>
      </div>

      {/* Main Big Interactive Reaction Target */}
      <div
        id="reaction-touch-pad"
        onClick={handleClick}
        className={`w-full min-h-[380px] rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all duration-150 shadow-lg ${
          drillState === 'idle'
            ? 'bg-slate-900 text-white hover:bg-slate-800'
            : drillState === 'waiting'
            ? 'bg-rose-600 text-white'
            : drillState === 'ready'
            ? 'bg-emerald-500 text-white ring-8 ring-emerald-300 animate-pulse'
            : drillState === 'early'
            ? 'bg-amber-600 text-white'
            : 'bg-slate-900 text-white'
        }`}
      >
        {drillState === 'idle' && (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-red-400">
              <Zap className="w-8 h-8" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black">
              Click Anywhere to Begin
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
              When the screen turns ELECTRIC GREEN, click or tap as fast as humanly possible.
            </p>
          </div>
        )}

        {drillState === 'waiting' && (
          <div className="space-y-3">
            <span className="font-mono text-3xl sm:text-5xl font-black tracking-wider uppercase">
              WAIT FOR GREEN...
            </span>
            <p className="text-xs text-rose-200">
              Keep your finger poised. Clicking now triggers a false-start.
            </p>
          </div>
        )}

        {drillState === 'ready' && (
          <div className="space-y-2">
            <span className="font-mono text-5xl sm:text-7xl font-black tracking-widest uppercase">
              CLICK NOW!
            </span>
          </div>
        )}

        {drillState === 'early' && (
          <div className="space-y-3">
            <AlertTriangle className="w-12 h-12 text-white mx-auto" />
            <h2 className="font-display text-2xl font-black">Too Early!</h2>
            <p className="text-xs text-amber-100">
              You clicked before the screen turned green. Click to try trial {trial} again.
            </p>
          </div>
        )}

        {drillState === 'result' && lastTime !== null && (
          <div className="space-y-3">
            <span className="font-mono text-5xl sm:text-6xl font-black">
              {lastTime} ms
            </span>
            <div className={`text-sm font-black uppercase tracking-wider ${getTier(lastTime).color}`}>
              {getTier(lastTime).label}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {trial < TOTAL_TRIALS ? 'Click to proceed to next trial' : 'Calculating final reflex score...'}
            </p>
          </div>
        )}
      </div>

      {/* Trial Log Summary */}
      {trialTimes.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center justify-between gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 uppercase">Trials:</span>
          <div className="flex items-center gap-2">
            {trialTimes.map((ms, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-center"
              >
                <span className="text-[10px] text-slate-400 block font-bold">#{idx + 1}</span>
                <span className="font-mono text-xs font-black text-slate-800">{ms}ms</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
