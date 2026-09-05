import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../lib/audio';
import { GameResult, GameType } from '../types';
import { Brain, Heart, Zap, RefreshCw, Trophy, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface MemoryMatrixProps {
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

export const MemoryMatrix: React.FC<MemoryMatrixProps> = ({ onGameOver, onExit }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [phase, setPhase] = useState<'ready' | 'memorize' | 'recall' | 'level-success' | 'game-over'>('ready');
  const [countdown, setCountdown] = useState(3);

  // Grid configuration based on level
  const gridSize = level <= 2 ? 4 : level <= 5 ? 5 : 6;
  const totalTiles = gridSize * gridSize;
  const targetCount = Math.min(3 + level, Math.floor(totalTiles * 0.45));

  const [activePattern, setActivePattern] = useState<number[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [mistakenTiles, setMistakenTiles] = useState<number[]>([]);
  
  // Metrics tracking
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctClicks, setCorrectClicks] = useState(0);
  const [roundStartTime, setRoundStartTime] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start new round
  const startRound = (newLevel = level) => {
    const currentGridSize = newLevel <= 2 ? 4 : newLevel <= 5 ? 5 : 6;
    const currentTotal = currentGridSize * currentGridSize;
    const currentTargets = Math.min(3 + newLevel, Math.floor(currentTotal * 0.45));

    // Generate random pattern of unique tile indices
    const indices: number[] = [];
    while (indices.length < currentTargets) {
      const rand = Math.floor(Math.random() * currentTotal);
      if (!indices.includes(rand)) {
        indices.push(rand);
      }
    }

    setActivePattern(indices);
    setSelectedTiles([]);
    setMistakenTiles([]);
    setPhase('memorize');
    sounds.playDigitFlash();

    // Memorization flash duration
    const displayDuration = Math.max(1200, 2200 - newLevel * 100);
    timerRef.current = setTimeout(() => {
      setPhase('recall');
      setRoundStartTime(Date.now());
      sounds.playTick();
    }, displayDuration);
  };

  // Ready countdown
  useEffect(() => {
    if (phase === 'ready') {
      if (countdown > 0) {
        sounds.playTick();
        const t = setTimeout(() => setCountdown(c => c - 1), 700);
        return () => clearTimeout(t);
      } else {
        startRound(1);
      }
    }
  }, [phase, countdown]);

  // Clean up timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleTileClick = (index: number) => {
    if (phase !== 'recall') return;
    if (selectedTiles.includes(index) || mistakenTiles.includes(index)) return;

    const reactionTime = Date.now() - roundStartTime;
    setReactionTimes(prev => [...prev, reactionTime]);
    setTotalAttempts(prev => prev + 1);

    if (activePattern.includes(index)) {
      // Correct click
      const newSelected = [...selectedTiles, index];
      setSelectedTiles(newSelected);
      setCorrectClicks(prev => prev + 1);
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      sounds.playCorrect(newStreak);

      const points = 100 + newStreak * 25 + level * 30;
      setScore(s => s + points);

      // Check if all pattern tiles found
      if (newSelected.length === activePattern.length) {
        setPhase('level-success');
        sounds.playLevelUp();
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.6 }
        });

        setTimeout(() => {
          setLevel(lvl => {
            const nextLvl = lvl + 1;
            startRound(nextLvl);
            return nextLvl;
          });
        }, 1200);
      }
    } else {
      // Mistake click
      setMistakenTiles(prev => [...prev, index]);
      setStreak(0);
      sounds.playMistake();
      
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        setPhase('game-over');
        endGame();
      }
    }
  };

  const endGame = () => {
    const avgReaction = reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 800;
    const accuracyPct = totalAttempts > 0
      ? Math.min(100, Math.round((correctClicks / totalAttempts) * 100))
      : 0;

    onGameOver({
      gameType: 'memory-matrix',
      gameTitle: 'Memory Matrix',
      score,
      accuracy: accuracyPct,
      level,
      responseTimeMs: avgReaction
    });
  };

  return (
    <div id="memory-matrix-game" className="max-w-2xl mx-auto p-4 sm:p-6 flex flex-col items-center">
      {/* Top Status Bar */}
      <div className="w-full flex items-center justify-between bg-white border border-cyan-200 rounded-3xl p-5 mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-100 border border-cyan-300 text-cyan-800 rounded-2xl flex items-center justify-center font-black text-sm shadow-xs">
            L{level}
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-600">Memory Matrix</div>
            <div className="font-display text-base sm:text-lg font-black text-slate-900">Level {level} &bull; {gridSize}×{gridSize} Grid</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Score</div>
            <div className="font-mono text-xl font-black text-blue-600">{score.toLocaleString()} PTS</div>
          </div>

          <div className="flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-2xl border border-rose-100">
            {[1, 2, 3].map((heart) => (
              <Heart
                key={heart}
                className={`w-4 h-4 transition-all ${
                  heart <= lives
                    ? 'text-rose-500 fill-rose-500 scale-100'
                    : 'text-slate-200 fill-slate-200 scale-90'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-8 flex flex-col items-center justify-center shadow-md relative min-h-[420px]">
        {phase === 'ready' && (
          <div className="text-center py-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full mb-3 inline-block">
              Get Ready 🧠
            </span>
            <div className="font-display text-7xl font-black text-slate-900 my-2 animate-bounce">
              {countdown}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-2">Observe pattern positions attentively.</p>
          </div>
        )}

        {(phase === 'memorize' || phase === 'recall' || phase === 'level-success') && (
          <div className="w-full flex flex-col items-center">
            {/* Phase instruction banner */}
            <div className={`mb-6 px-4 py-2 rounded-2xl text-xs font-extrabold shadow-xs transition-all ${
              phase === 'memorize'
                ? 'bg-cyan-100 text-cyan-900 border border-cyan-300'
                : phase === 'level-success'
                ? 'bg-lime-100 text-lime-900 border border-lime-300 animate-pop'
                : 'bg-blue-50 text-blue-900 border border-blue-200'
            }`}>
              {phase === 'memorize' ? (
                <span>Memorize Active Tiles ({activePattern.length} Targets)</span>
              ) : phase === 'level-success' ? (
                <span>🎉 Perfect! Advancing to Level {level + 1}...</span>
              ) : (
                <span>Select Active Tiles ({selectedTiles.length}/{activePattern.length})</span>
              )}
            </div>

            {/* Matrix Grid */}
            <div
              className="grid gap-3 w-full max-w-[340px] sm:max-w-[380px] aspect-square p-4 bg-slate-50 rounded-3xl border border-slate-200 shadow-inner"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
              }}
            >
              {Array.from({ length: totalTiles }).map((_, idx) => {
                const isTarget = activePattern.includes(idx);
                const isSelected = selectedTiles.includes(idx);
                const isMistake = mistakenTiles.includes(idx);
                const isMemorizeFlash = phase === 'memorize' && isTarget;

                let tileClass = 'bg-white hover:bg-slate-100 border-2 border-slate-200 shadow-xs text-slate-700';

                if (isMemorizeFlash) {
                  tileClass = 'bg-gradient-to-br from-cyan-400 to-blue-500 border-cyan-400 text-white scale-[1.03] shadow-md shadow-cyan-400/40';
                } else if (isSelected) {
                  tileClass = 'bg-gradient-to-br from-cyan-500 to-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/30 scale-[0.98]';
                } else if (isMistake) {
                  tileClass = 'bg-rose-500 border-rose-500 text-white animate-shake shadow-md shadow-rose-500/30';
                }

                return (
                  <button
                    key={idx}
                    id={`matrix-tile-${idx}`}
                    disabled={phase !== 'recall' || isSelected || isMistake}
                    onClick={() => handleTileClick(idx)}
                    className={`aspect-square rounded-2xl border-2 transition-all flex items-center justify-center cursor-pointer active:scale-95 disabled:cursor-default font-black ${tileClass}`}
                  >
                    {isSelected && <span className="text-xl">✓</span>}
                    {isMistake && <span className="text-base">✕</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {phase === 'game-over' && (
          <div className="text-center py-8">
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full mb-3 inline-block">
              Session Finished
            </span>
            <h3 className="font-display text-3xl font-black text-slate-900 mb-1">Workout Complete!</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">Level {level} reached &bull; Final Score: <strong className="text-blue-600 font-black">{score.toLocaleString()} PTS</strong></p>
            <div className="flex gap-3 justify-center">
              <button
                id="btn-retry-memory"
                onClick={() => {
                  setLevel(1);
                  setScore(0);
                  setLives(3);
                  setStreak(0);
                  setTotalAttempts(0);
                  setCorrectClicks(0);
                  setReactionTimes([]);
                  setCountdown(3);
                  setPhase('ready');
                }}
                className="py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white text-xs font-extrabold rounded-2xl shadow-md shadow-blue-500/25 transition-all cursor-pointer"
              >
                Play Again
              </button>
              <button
                id="btn-exit-memory"
                onClick={onExit}
                className="py-3 px-6 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-extrabold rounded-2xl transition-colors cursor-pointer"
              >
                Return to Hub
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="w-full flex items-center justify-between mt-4 px-2">
        <button
          id="btn-exit-game-early"
          onClick={onExit}
          className="text-xs font-extrabold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          ← Exit Game
        </button>
        {streak > 1 && (
          <div className="text-xs font-extrabold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            <span>🔥 {streak}× Combo Streak!</span>
          </div>
        )}
      </div>
    </div>
  );
};
