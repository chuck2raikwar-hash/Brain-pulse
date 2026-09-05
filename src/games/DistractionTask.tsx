import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../lib/audio';
import { GameType } from '../types';
import { Eye, Target, Sparkles, Clock, AlertCircle, RefreshCw, Trophy, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface DistractionTaskProps {
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

import { TargetChallenge, getRandomDistractionChallenges } from './data/distractionChallenges';

interface VisualItem {
  id: number;
  symbol: string;
  color: string;
  isTarget: boolean;
  rotation?: number;
}

export const DistractionTask: React.FC<DistractionTaskProps> = ({ onGameOver, onExit }) => {
  const [challenges] = useState<TargetChallenge[]>(() => getRandomDistractionChallenges(10));
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<VisualItem[]>([]);
  const [roundTimeLeft, setRoundTimeLeft] = useState(15);
  const [roundStartTime, setRoundStartTime] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [gameActive, setGameActive] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Setup round
  const setupRound = (roundIdx = currentRound) => {
    const config = challenges[roundIdx % challenges.length];
    const total = config.itemCount;
    const targetPos = Math.floor(Math.random() * total);

    const generated: VisualItem[] = [];
    for (let i = 0; i < total; i++) {
      if (i === targetPos) {
        generated.push({
          id: i,
          symbol: config.targetSymbol,
          color: config.targetColor,
          isTarget: true
        });
      } else {
        const distractor = config.distractors[Math.floor(Math.random() * config.distractors.length)];
        generated.push({
          id: i,
          symbol: distractor.symbol,
          color: distractor.color,
          isTarget: false
        });
      }
    }

    setItems(generated);
    setRoundTimeLeft(15);
    setRoundStartTime(Date.now());
  };

  useEffect(() => {
    setupRound(currentRound);
  }, [currentRound]);

  // Round countdown timer
  useEffect(() => {
    if (!gameActive) return;
    timerRef.current = setInterval(() => {
      setRoundTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameActive, currentRound]);

  const handleTimeout = () => {
    sounds.playMistake();
    setMistakes(m => m + 1);
    advanceRound(false);
  };

  const handleItemClick = (item: VisualItem) => {
    if (!gameActive) return;
    setTotalClicks(c => c + 1);

    if (item.isTarget) {
      // Correct target spotted!
      const latency = Date.now() - roundStartTime;
      setReactionTimes(prev => [...prev, latency]);
      sounds.playCorrect(3);

      const timeBonus = roundTimeLeft * 25;
      setScore(s => s + 200 + timeBonus);

      if (currentRound % 2 === 1) {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      }

      advanceRound(true);
    } else {
      // Mistake click
      sounds.playMistake();
      setMistakes(m => m + 1);
      setRoundTimeLeft(t => Math.max(1, t - 3)); // 3-second penalty
    }
  };

  const advanceRound = (wasSuccess: boolean) => {
    const nextRound = currentRound + 1;
    if (nextRound < challenges.length) {
      setCurrentRound(nextRound);
    } else {
      // Completed all challenges
      setGameActive(false);
      sounds.playFanfare();
      const avgLatency = reactionTimes.length > 0
        ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
        : 850;
      const accuracyRate = Math.max(10, Math.round(((totalClicks - mistakes) / Math.max(totalClicks, 1)) * 100));

      setTimeout(() => {
        onGameOver({
          gameType: 'distraction-task',
          gameTitle: 'Distraction Search',
          score: score + (wasSuccess ? 200 : 0),
          accuracy: accuracyRate,
          level: challenges.length,
          responseTimeMs: avgLatency
        });
      }, 1000);
    }
  };

  const currentChallenge = challenges[currentRound % challenges.length];

  return (
    <div id="distraction-task-game" className="max-w-4xl mx-auto space-y-6 text-slate-800">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                Selective Visual Attention &bull; Round {currentRound + 1}/{challenges.length} (Pool: 100)
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-black text-slate-900">Distraction Search</h1>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center gap-4 text-center">
          <div className="bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Timer</span>
            <span className={`font-mono text-base font-black flex items-center justify-center gap-1 ${
              roundTimeLeft <= 4 ? 'text-rose-600 animate-pulse' : 'text-slate-700'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              {roundTimeLeft}s
            </span>
          </div>

          <div className="bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Distractors</span>
            <span className="font-mono text-base font-black text-slate-700">
              {currentChallenge.itemCount - 1}
            </span>
          </div>

          <div className="bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Score</span>
            <span className="font-mono text-base font-black text-rose-600">{score}</span>
          </div>
        </div>

        <button
          id="btn-exit-distraction"
          onClick={onExit}
          className="text-xs font-extrabold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors cursor-pointer"
        >
          Exit
        </button>
      </div>

      {/* Target Clue Banner */}
      <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200/70 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <span className="text-[11px] font-extrabold uppercase text-rose-800 tracking-wider block">
              Spot This Target:
            </span>
            <span className="text-sm font-black text-slate-900">
              {currentChallenge.targetName}
            </span>
          </div>
        </div>

        {/* Target Badge Sample */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-rose-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500">Look for:</span>
          <div className={`w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xl font-black ${currentChallenge.targetColor}`}>
            {currentChallenge.targetSymbol}
          </div>
        </div>
      </div>

      {/* Visual Search Field Grid */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-9 lg:grid-cols-10 gap-2.5 sm:gap-3 max-w-3xl mx-auto">
          {items.map((item) => (
            <motion.button
              key={item.id}
              id={`search-item-${item.id}`}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleItemClick(item)}
              className="aspect-square rounded-xl bg-slate-50 border border-slate-200 hover:border-rose-400 hover:bg-rose-50/50 flex items-center justify-center text-xl sm:text-2xl font-black select-none cursor-pointer transition-colors shadow-xs"
            >
              <span className={item.color}>{item.symbol}</span>
            </motion.button>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Speed & precision matter: wrong clicks incur a 3-second time penalty.</span>
          <span>Round {currentRound + 1} of {challenges.length}</span>
        </div>
      </div>
    </div>
  );
};
