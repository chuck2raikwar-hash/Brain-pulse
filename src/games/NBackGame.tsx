import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sounds } from '../lib/audio';
import { GameResult, GameType } from '../types';
import { Repeat, Check, X, Trophy, RefreshCw, Zap, Sparkles, Circle, Square, Triangle, Diamond, Hexagon, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface NBackGameProps {
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

type ShapeType = 'circle' | 'square' | 'triangle' | 'diamond' | 'hexagon' | 'star';
type ColorName = 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'purple';

interface StimulusCard {
  id: string;
  shape: ShapeType;
  color: ColorName;
  hex: string;
}

const SHAPES: ShapeType[] = ['circle', 'square', 'triangle', 'diamond', 'hexagon', 'star'];
const COLOR_CONFIGS: { name: ColorName; hex: string }[] = [
  { name: 'indigo', hex: '#6366f1' },
  { name: 'emerald', hex: '#10b981' },
  { name: 'amber', hex: '#f59e0b' },
  { name: 'rose', hex: '#f43f5e' },
  { name: 'cyan', hex: '#06b6d4' },
  { name: 'purple', hex: '#a855f7' }
];

export const NBackGame: React.FC<NBackGameProps> = ({ onGameOver, onExit }) => {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'game-over'>('ready');
  const [countdown, setCountdown] = useState(3);
  const [nStep, setNStep] = useState<number>(2); // 2-Back task
  const [trialIndex, setTrialIndex] = useState(0);
  const totalTrials = 20;

  const [history, setHistory] = useState<StimulusCard[]>([]);
  const [currentCard, setCurrentCard] = useState<StimulusCard | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hits, setHits] = useState(0);
  const [correctRejections, setCorrectRejections] = useState(0);
  const [misses, setMisses] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);
  
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);
  const [trialStartTime, setTrialStartTime] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'hit' | 'miss' | 'correct-reject' | 'false-alarm' | null>(null);

  const trialTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random card or intentional match
  const generateNextCard = (currentHist: StimulusCard[], currentIdx: number): StimulusCard => {
    // 35% probability of match with the card from N steps ago
    if (currentHist.length >= nStep && Math.random() < 0.35) {
      const matchTarget = currentHist[currentHist.length - nStep];
      return {
        id: `${matchTarget.shape}-${matchTarget.color}-${Date.now()}-${Math.random()}`,
        shape: matchTarget.shape,
        color: matchTarget.color,
        hex: matchTarget.hex
      };
    }

    const randShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const randColor = COLOR_CONFIGS[Math.floor(Math.random() * COLOR_CONFIGS.length)];
    return {
      id: `${randShape}-${randColor.name}-${Date.now()}-${Math.random()}`,
      shape: randShape,
      color: randColor.name,
      hex: randColor.hex
    };
  };

  const advanceTrial = useCallback(() => {
    setTrialIndex(prev => {
      const nextIdx = prev + 1;
      if (nextIdx >= totalTrials) {
        setPhase('game-over');
        return prev;
      }

      setHistory(currentHist => {
        const nextCard = generateNextCard(currentHist, nextIdx);
        setCurrentCard(nextCard);
        setHasAnsweredCurrent(false);
        setFeedback(null);
        setTrialStartTime(Date.now());
        sounds.playTick();
        return [...currentHist, nextCard];
      });

      return nextIdx;
    });
  }, [nStep, totalTrials]);

  // Ready countdown
  useEffect(() => {
    if (phase === 'ready') {
      if (countdown > 0) {
        sounds.playTick();
        const t = setTimeout(() => setCountdown(c => c - 1), 700);
        return () => clearTimeout(t);
      } else {
        setPhase('playing');
        // Initial first card
        const firstCard = generateNextCard([], 0);
        setCurrentCard(firstCard);
        setHistory([firstCard]);
        setTrialIndex(0);
        setTrialStartTime(Date.now());
      }
    }
  }, [phase, countdown]);

  // Handle User Response
  const handleUserAnswer = (userClaimedMatch: boolean) => {
    if (phase !== 'playing' || hasAnsweredCurrent || !currentCard) return;

    setHasAnsweredCurrent(true);
    const reaction = Date.now() - trialStartTime;
    setReactionTimes(prev => [...prev, reaction]);

    // Check actual ground truth: does currentCard match history[history.length - 1 - nStep]?
    const targetIdx = history.length - 1 - nStep;
    const isActualMatch = targetIdx >= 0 &&
      history[targetIdx].shape === currentCard.shape &&
      history[targetIdx].color === currentCard.color;

    if (userClaimedMatch && isActualMatch) {
      // Hit (Correct match)
      setHits(h => h + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      sounds.playCorrect(newStreak);
      setScore(s => s + 200 + newStreak * 25);
      setFeedback('hit');
    } else if (!userClaimedMatch && !isActualMatch) {
      // Correct Rejection
      setCorrectRejections(r => r + 1);
      sounds.playCorrect(1);
      setScore(s => s + 100);
      setFeedback('correct-reject');
    } else if (userClaimedMatch && !isActualMatch) {
      // False Alarm (Incorrect match claim)
      setFalseAlarms(f => f + 1);
      setStreak(0);
      sounds.playMistake();
      setFeedback('false-alarm');
    } else {
      // Miss (Failed to identify match)
      setMisses(m => m + 1);
      setStreak(0);
      sounds.playMistake();
      setFeedback('miss');
    }

    // Auto advance after short feedback flash
    setTimeout(() => {
      advanceTrial();
    }, 600);
  };

  // Keyboard navigation (Space/Enter/Right = Match, A/Left/N = No Match)
  useEffect(() => {
    if (phase !== 'playing' || hasAnsweredCurrent) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowRight' || e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleUserAnswer(true);
      } else if (e.key === 'ArrowLeft' || e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        handleUserAnswer(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, hasAnsweredCurrent, currentCard, history, nStep]);

  // Handle Game Over
  useEffect(() => {
    if (phase === 'game-over') {
      const avgReaction = reactionTimes.length > 0
        ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
        : 750;
      const totalDecisions = hits + correctRejections + misses + falseAlarms;
      const accuracyPct = totalDecisions > 0
        ? Math.min(100, Math.round(((hits + correctRejections) / totalDecisions) * 100))
        : 0;

      onGameOver({
        gameType: 'n-back',
        gameTitle: 'Pattern Match (2-Back)',
        score,
        accuracy: accuracyPct,
        level: nStep,
        responseTimeMs: avgReaction
      });
    }
  }, [phase, score, hits, correctRejections, misses, falseAlarms, reactionTimes, nStep, onGameOver]);

  const renderShapeIcon = (shape: ShapeType, hex: string) => {
    const props = { className: "w-20 h-20 sm:w-24 sm:h-24", style: { color: hex, fill: hex } };
    switch (shape) {
      case 'circle': return <Circle {...props} />;
      case 'square': return <Square {...props} />;
      case 'triangle': return <Triangle {...props} />;
      case 'diamond': return <Diamond {...props} />;
      case 'hexagon': return <Hexagon {...props} />;
      case 'star': return <Star {...props} />;
    }
  };

  return (
    <div id="nback-game" className="max-w-2xl mx-auto p-4 sm:p-6 flex flex-col items-center">
      {/* Top Status Bar */}
      <div className="w-full flex items-center justify-between bg-white border border-blue-200 rounded-3xl p-5 mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 border border-blue-300 text-blue-800 rounded-2xl flex items-center justify-center font-black text-sm shadow-xs">
            <Repeat className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">Continuous Memory</div>
            <div className="font-display text-base sm:text-lg font-black text-slate-900">Pattern Match ({nStep}-Back)</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Score</div>
            <div className="font-mono text-xl font-black text-blue-600">{score.toLocaleString()} PTS</div>
          </div>

          <div className="text-xs font-extrabold text-blue-900 bg-blue-50 px-3.5 py-1.5 rounded-2xl border border-blue-200">
            Card <span className="font-black text-blue-600">{Math.min(trialIndex + 1, totalTrials)}</span>/{totalTrials}
          </div>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-8 flex flex-col items-center justify-center shadow-md relative min-h-[440px]">
        {phase === 'ready' && (
          <div className="text-center py-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3 inline-block">
              Continuous Recall 🔁
            </span>
            <div className="font-display text-7xl font-black text-slate-900 my-2 animate-bounce">
              {countdown}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-2">Does the card match the one seen <strong className="text-blue-600">{nStep} steps</strong> ago?</p>
          </div>
        )}

        {phase === 'playing' && currentCard && (
          <div className="w-full flex flex-col items-center">
            {/* Instruction prompt */}
            <div className="mb-4 text-xs font-extrabold px-4 py-1.5 rounded-full bg-slate-100 text-slate-700">
              {trialIndex < nStep ? (
                <span>Observe Card ({trialIndex + 1}/{nStep}) to initialize sequence</span>
              ) : (
                <span>Does this match the card <strong className="text-blue-600">{nStep} turns</strong> ago?</span>
              )}
            </div>

            {/* Stimulus Card */}
            <motion.div
              key={currentCard.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="w-48 h-52 sm:w-56 sm:h-60 bg-slate-50 rounded-3xl border-2 border-slate-200 shadow-lg flex flex-col items-center justify-center relative overflow-hidden"
            >
              {renderShapeIcon(currentCard.shape, currentCard.hex)}
              <span className="mt-4 text-xs font-extrabold uppercase tracking-wider text-slate-600">
                {currentCard.color} {currentCard.shape}
              </span>

              {/* Feedback Overlay */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 flex items-center justify-center font-black text-sm sm:text-base ${
                      feedback === 'hit' || feedback === 'correct-reject'
                        ? 'bg-lime-500/90 text-white'
                        : 'bg-rose-500/90 text-white'
                    }`}
                  >
                    {feedback === 'hit' && (
                      <span className="flex items-center gap-1.5">
                        <Check className="w-5 h-5 stroke-[3]" /> Target Match Hit!
                      </span>
                    )}
                    {feedback === 'correct-reject' && (
                      <span className="flex items-center gap-1.5">
                        <Check className="w-5 h-5 stroke-[3]" /> Correct Non-Match!
                      </span>
                    )}
                    {feedback === 'false-alarm' && (
                      <span className="flex items-center gap-1.5">
                        <X className="w-5 h-5 stroke-[3]" /> No Match (Mismatch)
                      </span>
                    )}
                    {feedback === 'miss' && (
                      <span className="flex items-center gap-1.5">
                        <X className="w-5 h-5 stroke-[3]" /> Missed Match!
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-6">
              <button
                id="btn-nback-nomatch"
                disabled={hasAnsweredCurrent || trialIndex < nStep}
                onClick={() => handleUserAnswer(false)}
                className="py-3.5 px-4 bg-slate-100 hover:bg-slate-200 active:scale-95 disabled:opacity-30 rounded-2xl text-xs font-black text-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4 stroke-[3]" />
                <span>NO MATCH</span>
              </button>

              <button
                id="btn-nback-match"
                disabled={hasAnsweredCurrent || trialIndex < nStep}
                onClick={() => handleUserAnswer(true)}
                className="py-3.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 active:scale-95 disabled:opacity-30 text-white text-xs font-black rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-500/25"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>MATCH TARGET</span>
              </button>
            </div>
          </div>
        )}

        {phase === 'game-over' && (
          <div className="text-center py-8">
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full mb-3 inline-block">
              Session Finished
            </span>
            <h3 className="font-display text-3xl font-black text-slate-900 mb-1">Trial Complete!</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">Total Score: <strong className="text-blue-600 font-black">{score.toLocaleString()} PTS</strong> &bull; Hits: {hits}</p>
            <div className="flex gap-3 justify-center">
              <button
                id="btn-retry-nback"
                onClick={() => {
                  setScore(0);
                  setStreak(0);
                  setHits(0);
                  setCorrectRejections(0);
                  setMisses(0);
                  setFalseAlarms(0);
                  setReactionTimes([]);
                  setCountdown(3);
                  setPhase('ready');
                }}
                className="py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-blue-500/25 transition-all cursor-pointer"
              >
                Play Again
              </button>
              <button
                id="btn-exit-nback"
                onClick={onExit}
                className="py-3 px-6 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-extrabold rounded-2xl transition-colors cursor-pointer"
              >
                Return to Hub
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer controls */}
      <div className="w-full flex items-center justify-between mt-4 px-2">
        <button
          id="btn-exit-nback-early"
          onClick={onExit}
          className="text-xs font-extrabold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          ← Exit Game
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-slate-400">Difficulty:</span>
          {[1, 2, 3].map(n => (
            <button
              key={n}
              disabled={phase === 'playing'}
              onClick={() => setNStep(n)}
              className={`text-xs px-3 py-1 rounded-xl font-black transition-all cursor-pointer ${
                nStep === n
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {n}-Back
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
