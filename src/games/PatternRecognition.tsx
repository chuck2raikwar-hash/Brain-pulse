import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sounds } from '../lib/audio';
import { GameType } from '../types';
import {
  Boxes,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trophy,
  ArrowRight,
  HelpCircle,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface PatternRecognitionProps {
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

import { PatternQuestion, getRandomPatternQuestions } from './data/patternQuestions';

export const PatternRecognition: React.FC<PatternRecognitionProps> = ({ onGameOver, onExit, onScoreUpdate }) => {
  const [questions, setQuestions] = useState<PatternQuestion[]>(() => getRandomPatternQuestions(10));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(Date.now());
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const q = questions[currentIdx % questions.length] || questions[0];

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const clearAutoAdvance = useCallback(() => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setAutoAdvanceCountdown(null);
  }, []);

  const handleNext = useCallback(() => {
    clearAutoAdvance();
    setSelectedOpt(null);
    setShowExplanation(false);
    setStartTime(Date.now());

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(c => c + 1);
    } else {
      sounds.playFanfare();
      const avgLatency = reactionTimes.length > 0
        ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
        : 1200;

      onGameOver({
        gameType: 'pattern-recognition',
        gameTitle: 'Pattern Recognition',
        score: score,
        accuracy: Math.round((correctAnswers / questions.length) * 100),
        level: questions.length,
        responseTimeMs: avgLatency
      });
    }
  }, [clearAutoAdvance, currentIdx, questions.length, reactionTimes, onGameOver, score, correctAnswers]);

  const handleOptionSelect = (optIndex: number) => {
    if (selectedOpt !== null) return;
    const latency = Date.now() - startTime;
    setReactionTimes(prev => [...prev, latency]);
    setSelectedOpt(optIndex);
    setShowExplanation(true);

    const isCorrect = optIndex === q.correctIndex;
    if (isCorrect) {
      sounds.playCorrect(3);
      setCorrectAnswers(c => c + 1);
      const speedBonus = latency < 1500 ? 25 : latency < 3000 ? 10 : 0;
      const questionPoints = 100 + speedBonus;
      setScore(s => s + questionPoints);
      onScoreUpdate?.(questionPoints, true);
      if (currentIdx === questions.length - 1) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
    } else {
      sounds.playMistake();
      onScoreUpdate?.(0, false);
    }

    // Start auto-advance (2.2 seconds) so it automatically moves on
    clearAutoAdvance();
    let timeLeft = 2.2;
    setAutoAdvanceCountdown(timeLeft);

    countdownIntervalRef.current = setInterval(() => {
      timeLeft = Math.max(0, +(timeLeft - 0.1).toFixed(1));
      setAutoAdvanceCountdown(timeLeft);
      if (timeLeft <= 0) {
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      }
    }, 100);

    autoAdvanceTimeoutRef.current = setTimeout(() => {
      handleNext();
    }, 2200);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedOpt === null) {
        // Options 1, 2, 3, 4 or A, B, C, D
        if (e.key === '1' || e.key === 'a' || e.key === 'A') handleOptionSelect(0);
        else if (e.key === '2' || e.key === 'b' || e.key === 'B') handleOptionSelect(1);
        else if (e.key === '3' || e.key === 'c' || e.key === 'C') handleOptionSelect(2);
        else if (e.key === '4' || e.key === 'd' || e.key === 'D') handleOptionSelect(3);
      } else {
        // Once answered, space or enter immediately advances
        if (e.code === 'Space' || e.key === 'Enter' || e.key === 'ArrowRight') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOpt, handleNext]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => clearAutoAdvance();
  }, [clearAutoAdvance]);

  return (
    <div id="pattern-recognition-activity" className="max-w-4xl mx-auto space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-fuchsia-600 text-white flex items-center justify-center shadow-md">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-fuchsia-100 text-fuchsia-800">
                Fluid Intelligence &bull; Problem {currentIdx + 1} of {questions.length} (Pool: 100)
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-black text-slate-900">
              Pattern Recognition
            </h1>
          </div>
        </div>

        {/* Counters & Exit */}
        <div className="flex items-center gap-4 text-center">
          <div className="bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Timer</span>
            <span className="font-mono text-base font-black text-slate-700 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
            </span>
          </div>

          <div className="bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Score</span>
            <span className="font-mono text-base font-black text-fuchsia-600">{score}</span>
          </div>

          <button
            onClick={onExit}
            className="text-xs font-extrabold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Main Sequence Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col items-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
          {q.domain}
        </span>
        <h2 className="font-display text-lg sm:text-xl font-black text-slate-900 text-center mb-8 max-w-xl">
          {q.questionText}
        </h2>

        {/* Visual Sequence Chain */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 flex-wrap">
          {q.sequenceVisuals.map((step, idx) => {
            const isMissing = step.label === '?';
            return (
              <React.Fragment key={idx}>
                <div
                  className={`w-16 h-20 sm:w-20 sm:h-24 rounded-2xl border-2 flex flex-col items-center justify-center text-center select-none shadow-xs ${
                    isMissing
                      ? 'bg-fuchsia-50 border-dashed border-fuchsia-400 text-fuchsia-600'
                      : 'bg-slate-900 border-slate-800 text-white'
                  }`}
                >
                  <span className="font-mono text-2xl sm:text-3xl font-black">
                    {step.label}
                  </span>
                  <span className="text-[9px] font-bold opacity-70 mt-1">
                    {step.sub}
                  </span>
                </div>
                {idx < q.sequenceVisuals.length - 1 && (
                  <span className="text-slate-300 font-bold">&rarr;</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* 4 Multiple Choice Options */}
        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl">
          {q.options.map((opt, i) => {
            const isSelected = selectedOpt === i;
            const isCorrect = i === q.correctIndex;
            const optionLetter = String.fromCharCode(65 + i); // A, B, C, D

            let cardStyle = 'bg-slate-50 border-slate-200 hover:border-fuchsia-400 hover:bg-fuchsia-50/40 text-slate-900';

            if (selectedOpt !== null) {
              if (isCorrect) {
                cardStyle = 'bg-emerald-600 border-emerald-700 text-white shadow-md scale-[1.02] ring-2 ring-emerald-400';
              } else if (isSelected) {
                cardStyle = 'bg-rose-600 border-rose-700 text-white ring-2 ring-rose-400';
              } else {
                cardStyle = 'opacity-40 bg-slate-50 border-slate-200 text-slate-400';
              }
            }

            return (
              <button
                key={i}
                id={`pattern-opt-${i}`}
                onClick={() => handleOptionSelect(i)}
                disabled={selectedOpt !== null}
                className={`p-3.5 sm:p-4 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between border-2 ${cardStyle}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center font-mono text-base sm:text-lg font-black shrink-0">
                    {opt.label}
                  </div>
                  <div>
                    <span className="text-xs font-black block">{opt.sub}</span>
                    <span className="text-[10px] font-bold opacity-75">Option {optionLetter}</span>
                  </div>
                </div>

                {selectedOpt !== null && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Post-selection Banner & Next Question Controls */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 w-full max-w-2xl bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs"
            >
              {/* Auto-advance Countdown Bar */}
              {autoAdvanceCountdown !== null && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-600 mb-1">
                    <span className="flex items-center gap-1.5 text-fuchsia-700">
                      <span className="w-2 h-2 rounded-full bg-fuchsia-600 animate-ping" />
                      <span>Next question in {autoAdvanceCountdown}s...</span>
                    </span>
                    <span className="text-slate-400">or tap button below</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 transition-all duration-100"
                      style={{ width: `${Math.max(0, Math.min(100, (autoAdvanceCountdown / 2.2) * 100))}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-fuchsia-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <strong className="text-slate-900 font-black block">
                    Underlying Pattern Rule:
                  </strong>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {q.explanation}
                  </p>
                </div>
              </div>

              {/* Action button to immediately proceed */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">
                  Tip: Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] text-slate-700 font-mono">Space</kbd> or <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[10px] text-slate-700 font-mono">Enter</kbd> to proceed
                </span>

                <button
                  id="btn-next-pattern"
                  onClick={handleNext}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 active:scale-95 text-white text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-fuchsia-500/20 transition-all"
                >
                  <span>{currentIdx + 1 < questions.length ? 'Next Question' : 'Complete Challenge'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
