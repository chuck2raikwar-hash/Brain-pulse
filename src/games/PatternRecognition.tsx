import React, { useState, useEffect, useRef } from 'react';
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
}

import { PatternQuestion, getRandomPatternQuestions } from './data/patternQuestions';

export const PatternRecognition: React.FC<PatternRecognitionProps> = ({ onGameOver, onExit }) => {
  const [questions, setQuestions] = useState<PatternQuestion[]>(() => getRandomPatternQuestions(10));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(Date.now());

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const q = questions[currentIdx % questions.length] || questions[0];

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

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
      setScore(s => s + 250);
      if (currentIdx === questions.length - 1) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
    } else {
      sounds.playMistake();
    }
  };

  const handleNext = () => {
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
  };

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
        <div className="grid sm:grid-cols-2 gap-4 w-full max-w-2xl">
          {q.options.map((opt, i) => {
            const isSelected = selectedOpt === i;
            const isCorrect = i === q.correctIndex;

            let cardStyle = 'bg-slate-50 border border-slate-200 hover:border-fuchsia-400 hover:bg-fuchsia-50/40 text-slate-900';

            if (selectedOpt !== null) {
              if (isCorrect) {
                cardStyle = 'bg-emerald-500 border-emerald-600 text-white shadow-md scale-[1.02]';
              } else if (isSelected) {
                cardStyle = 'bg-rose-500 border-rose-600 text-white';
              } else {
                cardStyle = 'opacity-50 bg-slate-50 border-slate-200 text-slate-400';
              }
            }

            return (
              <button
                key={i}
                id={`pattern-opt-${i}`}
                onClick={() => handleOptionSelect(i)}
                disabled={selectedOpt !== null}
                className={`p-4 rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between border-2 ${cardStyle}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-mono text-xl font-black">
                    {opt.label}
                  </div>
                  <div>
                    <span className="text-xs font-black block">{opt.sub}</span>
                  </div>
                </div>

                {selectedOpt !== null && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Banner */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 w-full max-w-2xl bg-slate-50 border border-slate-200 rounded-2xl p-5"
            >
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-fuchsia-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <strong className="text-slate-900 font-extrabold block">
                    Underlying Transformation Rule:
                  </strong>
                  <p className="text-slate-600 leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  id="btn-next-pattern"
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-black tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
                >
                  <span>{currentIdx + 1 < questions.length ? 'Next Pattern' : 'Complete Challenge'}</span>
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
