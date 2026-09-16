import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sounds } from '../lib/audio';
import { GameResult, GameType } from '../types';
import { Zap, Clock, Flame, RefreshCw, Trophy, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface ColorConfusionProps {
  onGameOver: (result: {
    gameType: GameType;
    gameTitle: string;
    score: number;
    accuracy: number;
    level: number;
    responseTimeMs: number;
  }) => void;
  onExit: () => void;
  onScoreUpdate?: (pointsDelta: number, isCorrect?: boolean) => void;
}

interface ColorItem {
  name: string;
  hex: string;
  bgClass: string;
  textClass: string;
}

const COLORS: ColorItem[] = [
  { name: 'RED', hex: '#ef4444', bgClass: 'bg-red-500', textClass: 'text-red-500' },
  { name: 'BLUE', hex: '#3b82f6', bgClass: 'bg-blue-500', textClass: 'text-blue-500' },
  { name: 'GREEN', hex: '#10b981', bgClass: 'bg-emerald-500', textClass: 'text-emerald-500' },
  { name: 'YELLOW', hex: '#eab308', bgClass: 'bg-yellow-400', textClass: 'text-yellow-400' },
  { name: 'PURPLE', hex: '#a855f7', bgClass: 'bg-purple-500', textClass: 'text-purple-500' },
  { name: 'ORANGE', hex: '#f97316', bgClass: 'bg-orange-500', textClass: 'text-orange-500' },
  { name: 'PINK', hex: '#ec4899', bgClass: 'bg-pink-500', textClass: 'text-pink-500' },
  { name: 'TEAL', hex: '#14b8a6', bgClass: 'bg-teal-500', textClass: 'text-teal-500' },
  { name: 'CYAN', hex: '#06b6d4', bgClass: 'bg-cyan-500', textClass: 'text-cyan-500' },
  { name: 'INDIGO', hex: '#6366f1', bgClass: 'bg-indigo-500', textClass: 'text-indigo-500' },
  { name: 'AMBER', hex: '#d97706', bgClass: 'bg-amber-600', textClass: 'text-amber-600' },
  { name: 'VIOLET', hex: '#7c3aed', bgClass: 'bg-violet-600', textClass: 'text-violet-600' }
];

export const ColorConfusion: React.FC<ColorConfusionProps> = ({ onGameOver, onExit, onScoreUpdate }) => {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'game-over'>('ready');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(45); // 45s blitz test
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [level, setLevel] = useState(1);

  // Current Trial State
  const [targetType, setTargetType] = useState<'INK_COLOR' | 'WRITTEN_WORD'>('INK_COLOR');
  const [displayedWord, setDisplayedWord] = useState<ColorItem>(COLORS[0]);
  const [inkColor, setInkColor] = useState<ColorItem>(COLORS[1]);
  const [options, setOptions] = useState<ColorItem[]>([]);
  const [trialStartTime, setTrialStartTime] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Generate next trial with gradual difficulty curve
  const nextTrial = useCallback((qIndex = totalCount) => {
    let promptType: 'INK_COLOR' | 'WRITTEN_WORD';
    const wordIdx = Math.floor(Math.random() * COLORS.length);
    let inkIdx = wordIdx;
    let optionCount = 3;

    if (qIndex < 2) {
      // Questions 1 & 2: Congruent warm-up (Word text matches its ink color!), 3 options
      promptType = 'INK_COLOR';
      inkIdx = wordIdx;
      optionCount = 3;
    } else if (qIndex < 4) {
      // Questions 3 & 4: Gentle conflict: Prompt asks for WRITTEN WORD (natural to read), 3 options
      promptType = 'WRITTEN_WORD';
      inkIdx = (wordIdx + 1 + Math.floor(Math.random() * (COLORS.length - 1))) % COLORS.length;
      optionCount = 3;
    } else if (qIndex < 7) {
      // Questions 5 to 7: First INK COLOR conflict, 3 options
      promptType = 'INK_COLOR';
      inkIdx = (wordIdx + 1 + Math.floor(Math.random() * (COLORS.length - 1))) % COLORS.length;
      optionCount = 3;
    } else if (qIndex < 11) {
      // Questions 8 to 11: 4 options, standard Stroop (75% INK_COLOR, 25% WRITTEN_WORD)
      promptType = Math.random() < 0.75 ? 'INK_COLOR' : 'WRITTEN_WORD';
      inkIdx = (wordIdx + 1 + Math.floor(Math.random() * (COLORS.length - 1))) % COLORS.length;
      optionCount = 4;
    } else {
      // Questions 12+: Rapid switching between INK_COLOR and WRITTEN_WORD with 4 options
      promptType = Math.random() < 0.60 ? 'INK_COLOR' : 'WRITTEN_WORD';
      inkIdx = (wordIdx + 1 + Math.floor(Math.random() * (COLORS.length - 1))) % COLORS.length;
      optionCount = 4;
    }

    const word = COLORS[wordIdx];
    const ink = COLORS[inkIdx];
    const correctTarget = promptType === 'INK_COLOR' ? ink : word;

    // Pick options including correct target
    const currentOptions: ColorItem[] = [correctTarget];
    while (currentOptions.length < optionCount) {
      const randColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      if (!currentOptions.find(c => c.name === randColor.name)) {
        currentOptions.push(randColor);
      }
    }
    // Shuffle options
    currentOptions.sort(() => Math.random() - 0.5);

    setTargetType(promptType);
    setDisplayedWord(word);
    setInkColor(ink);
    setOptions(currentOptions);
    setTrialStartTime(Date.now());
    setFeedback(null);
  }, [totalCount]);

  // Ready countdown
  useEffect(() => {
    if (phase === 'ready') {
      if (countdown > 0) {
        sounds.playTick();
        const t = setTimeout(() => setCountdown(c => c - 1), 700);
        return () => clearTimeout(t);
      } else {
        setPhase('playing');
        nextTrial();
      }
    }
  }, [phase, countdown, nextTrial]);

  // Main game timer
  useEffect(() => {
    if (phase !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase('game-over');
          return 0;
        }
        if (prev <= 6) {
          sounds.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  // Handle Game Over
  const hasEndedRef = useRef(false);
  const onGameOverRef = useRef(onGameOver);
  onGameOverRef.current = onGameOver;

  useEffect(() => {
    if (phase === 'game-over' && !hasEndedRef.current) {
      hasEndedRef.current = true;
      const avgReaction = reactionTimes.length > 0
        ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
        : 650;
      const accuracyPct = totalCount > 0
        ? Math.min(100, Math.round((correctCount / totalCount) * 100))
        : 0;

      onGameOverRef.current({
        gameType: 'color-confusion',
        gameTitle: 'Color Confusion (Stroop)',
        score,
        accuracy: accuracyPct,
        level: Math.max(1, Math.floor(correctCount / 5)),
        responseTimeMs: avgReaction
      });
    }
  }, [phase, score, correctCount, totalCount, reactionTimes]);

  const handleSelectOption = (selected: ColorItem) => {
    if (phase !== 'playing') return;

    const reaction = Date.now() - trialStartTime;
    setReactionTimes(prev => [...prev, reaction]);
    setTotalCount(c => c + 1);

    const correctAnswer = targetType === 'INK_COLOR' ? inkColor.name : displayedWord.name;
    const isCorrect = selected.name === correctAnswer;

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setCorrectCount(c => c + 1);
      sounds.playCorrect(newStreak);

      // Equalized question points: 100 base + speed/streak bonus (0-30 max)
      const speedBonus = reaction < 600 ? 15 : reaction < 900 ? 10 : 0;
      const streakBonus = Math.min(15, newStreak * 2);
      const points = 100 + speedBonus + streakBonus;
      setScore(s => s + points);
      setFeedback('correct');
      onScoreUpdate?.(points, true);

      if (newStreak % 7 === 0) {
        sounds.playLevelUp();
      }
    } else {
      setStreak(0);
      sounds.playMistake();
      setFeedback('wrong');
      onScoreUpdate?.(0, false);
    }

    // Advance immediately with next question index
    const nextQIndex = totalCount + 1;
    setTimeout(() => {
      nextTrial(nextQIndex);
    }, 150);
  };

  // Keyboard shortcut listener (keys 1, 2, 3, 4)
  useEffect(() => {
    if (phase !== 'playing') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: Record<string, number> = {
        '1': 0,
        '2': 1,
        '3': 2,
        '4': 3
      };
      if (keyMap[e.key] !== undefined && options[keyMap[e.key]]) {
        handleSelectOption(options[keyMap[e.key]]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, options, trialStartTime, targetType, inkColor, displayedWord]);

  return (
    <div id="color-confusion-game" className="max-w-2xl mx-auto p-4 sm:p-6 flex flex-col items-center">
      {/* Top Status Bar */}
      <div className="w-full flex items-center justify-between bg-white border border-lime-200 rounded-3xl p-5 mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-lime-100 border border-lime-300 text-lime-800 rounded-2xl flex items-center justify-center font-black text-sm shadow-xs">
            ⚡
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-lime-600">Reaction & Focus</div>
            <div className="font-display text-base sm:text-lg font-black text-slate-900">Color Confusion</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Score</div>
            <div className="font-mono text-xl font-black text-blue-600">{score.toLocaleString()} PTS</div>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-1.5 rounded-2xl border border-amber-200 text-amber-900">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="font-mono text-base font-black">
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-8 flex flex-col items-center justify-center shadow-md relative min-h-[420px]">
        {phase === 'ready' && (
          <div className="text-center py-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-lime-600 bg-lime-50 px-3 py-1 rounded-full mb-3 inline-block">
              Speed & Inhibition 🎨
            </span>
            <div className="font-display text-7xl font-black text-slate-900 my-2 animate-bounce">
              {countdown}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-2">Differentiate between text word and ink color.</p>
          </div>
        )}

        {phase === 'playing' && (
          <div className="w-full flex flex-col items-center">
            {/* Dynamic Rule Prompt */}
            <div
              id="stroop-prompt-banner"
              className={`mb-6 py-2.5 px-6 rounded-2xl text-xs font-extrabold shadow-xs transition-all ${
                targetType === 'INK_COLOR'
                  ? 'bg-cyan-100 text-cyan-900 border-2 border-cyan-300'
                  : 'bg-orange-100 text-orange-900 border-2 border-orange-300'
              }`}
            >
              {targetType === 'INK_COLOR' ? (
                <span>Rule: Match the <strong className="underline font-black text-cyan-950">INK COLOR</strong> of the word</span>
              ) : (
                <span>Rule: Match the <strong className="underline font-black text-orange-950">WRITTEN WORD</strong> itself</span>
              )}
            </div>

            {/* Stimulus Word Display */}
            <div
              id="stimulus-word-box"
              className="my-4 py-8 px-12 bg-slate-50 rounded-3xl border border-slate-200 flex items-center justify-center min-w-[280px] sm:min-w-[340px] shadow-inner"
            >
              <span
                className="font-display text-5xl sm:text-6xl font-black tracking-wide transition-all select-none"
                style={{ color: inkColor.hex }}
              >
                {displayedWord.name}
              </span>
            </div>

            {/* Response Options (4 choices) */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-md mt-6">
              {options.map((opt, idx) => (
                <button
                  key={opt.name}
                  id={`color-opt-${idx}`}
                  onClick={() => handleSelectOption(opt)}
                  className="py-3.5 px-4 bg-white hover:bg-slate-50 active:scale-95 border-2 border-slate-200 hover:border-slate-300 rounded-2xl text-xs font-extrabold text-slate-800 flex items-center justify-between transition-all shadow-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full shrink-0 border border-black/10 shadow-xs"
                      style={{ backgroundColor: opt.hex }}
                    />
                    <span>{opt.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">
                    {idx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'game-over' && (
          <div className="text-center py-8">
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full mb-3 inline-block">
              Time Expired ⏱️
            </span>
            <h3 className="font-display text-3xl font-black text-slate-900 mb-1">Blitz Complete!</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">Total Score: <strong className="text-blue-600 font-black">{score.toLocaleString()} PTS</strong> &bull; ({correctCount}/{totalCount} accurate)</p>
            <div className="flex gap-3 justify-center">
              <button
                id="btn-retry-color"
                onClick={() => {
                  setTimeLeft(45);
                  setScore(0);
                  setStreak(0);
                  setMaxStreak(0);
                  setCorrectCount(0);
                  setTotalCount(0);
                  setReactionTimes([]);
                  setCountdown(3);
                  setPhase('ready');
                }}
                className="py-3 px-6 bg-gradient-to-r from-lime-500 to-emerald-500 hover:opacity-90 text-slate-950 font-black text-xs rounded-2xl shadow-md shadow-lime-500/25 transition-all cursor-pointer"
              >
                Play Again
              </button>
              <button
                id="btn-exit-color"
                onClick={onExit}
                className="py-3 px-6 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-extrabold rounded-2xl transition-colors cursor-pointer"
              >
                Return to Hub
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer info & keyboard tips */}
      <div className="w-full flex items-center justify-between mt-4 px-2">
        <button
          id="btn-exit-color-early"
          onClick={onExit}
          className="text-xs font-extrabold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          ← Exit Game
        </button>
        <div className="flex items-center gap-4 text-xs font-extrabold text-slate-500">
          {streak > 1 && (
            <span className="text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              🔥 {streak}× Streak
            </span>
          )}
          <span className="hidden sm:inline bg-slate-100 px-2.5 py-1 rounded-lg text-slate-500 font-medium text-[11px]">Key shortcuts 1 - 4</span>
        </div>
      </div>
    </div>
  );
};
