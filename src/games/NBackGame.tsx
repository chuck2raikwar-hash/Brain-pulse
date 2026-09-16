import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sounds } from '../lib/audio';
import { GameType } from '../types';
import {
  Repeat,
  Check,
  X,
  Trophy,
  RefreshCw,
  Zap,
  Sparkles,
  Circle,
  Square,
  Triangle,
  Diamond,
  Hexagon,
  Star,
  ArrowRight,
  Flame,
  Clock,
  Eye,
  EyeOff,
  HelpCircle
} from 'lucide-react';
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
  onScoreUpdate?: (pointsDelta: number, isCorrect?: boolean) => void;
}

type ShapeType = 'circle' | 'square' | 'triangle' | 'diamond' | 'hexagon' | 'star';
type ColorName = 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'purple';

interface StimulusCard {
  id: string;
  shape: ShapeType;
  color: ColorName;
  hex: string;
  isMatchTarget: boolean; // Ground truth: matches card from nStep ago
}

const SHAPES: ShapeType[] = ['circle', 'square', 'triangle', 'diamond', 'hexagon', 'star'];
const COLOR_CONFIGS: { name: ColorName; hex: string; bg: string }[] = [
  { name: 'indigo', hex: '#6366f1', bg: 'bg-indigo-50 border-indigo-200' },
  { name: 'emerald', hex: '#10b981', bg: 'bg-emerald-50 border-emerald-200' },
  { name: 'amber', hex: '#f59e0b', bg: 'bg-amber-50 border-amber-200' },
  { name: 'rose', hex: '#f43f5e', bg: 'bg-rose-50 border-rose-200' },
  { name: 'cyan', hex: '#06b6d4', bg: 'bg-cyan-50 border-cyan-200' },
  { name: 'purple', hex: '#a855f7', bg: 'bg-purple-50 border-purple-200' }
];

const BASE_TRIAL_TIMEOUT_MS = 4500; // 4.5 seconds per testing card initially, gradually reducing
const PRIMING_DURATION_MS = 2400; // 2.4 seconds per priming card

export const NBackGame: React.FC<NBackGameProps> = ({ onGameOver, onExit, onScoreUpdate }) => {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'game-over'>('ready');
  const [countdown, setCountdown] = useState(3);
  const [nStep, setNStep] = useState<number>(1); // Starts at 1-Back for gentle start, steps up slowly
  const [trialIndex, setTrialIndex] = useState(0);
  const totalTrials = 20;

  // Deck / Stimulus history
  const [history, setHistory] = useState<StimulusCard[]>([]);
  const [currentCard, setCurrentCard] = useState<StimulusCard | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [hits, setHits] = useState(0);
  const [correctRejections, setCorrectRejections] = useState(0);
  const [misses, setMisses] = useState(0);
  const [falseAlarms, setFalseAlarms] = useState(0);

  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);
  const [trialStartTime, setTrialStartTime] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'hit' | 'miss' | 'correct-reject' | 'false-alarm' | 'timeout' | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  // Optional visual memory assist (Memory Aid showing ghost trail)
  const [showMemoryAid, setShowMemoryAid] = useState<boolean>(true);

  // Dynamic timeout that decreases slowly question by question
  const getTrialTimeout = useCallback((idx: number) => {
    return Math.max(3200, BASE_TRIAL_TIMEOUT_MS - idx * 55);
  }, []);

  // Time remaining in current trial (for progress bar)
  const [timeRemainingMs, setTimeRemainingMs] = useState<number>(BASE_TRIAL_TIMEOUT_MS);

  const trialTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasEndedRef = useRef(false);
  const onGameOverRef = useRef(onGameOver);
  onGameOverRef.current = onGameOver;

  // Helper to generate next stimulus card with clean target probability
  const createNextStimulus = useCallback((currentHistory: StimulusCard[], nextIndex: number, currentN: number): StimulusCard => {
    const isPriming = nextIndex < currentN;
    const targetCard = !isPriming && currentHistory.length >= currentN
      ? currentHistory[currentHistory.length - currentN]
      : null;

    // 40% probability of a target match during active testing
    const shouldBeMatch = Boolean(targetCard && Math.random() < 0.40);

    let shape: ShapeType;
    let colorConfig: { name: ColorName; hex: string; bg: string };

    if (shouldBeMatch && targetCard) {
      shape = targetCard.shape;
      colorConfig = COLOR_CONFIGS.find(c => c.name === targetCard.color) || COLOR_CONFIGS[0];
    } else {
      shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      colorConfig = COLOR_CONFIGS[Math.floor(Math.random() * COLOR_CONFIGS.length)];

      // Prevent accidental match if we didn't want a match
      if (targetCard && shape === targetCard.shape && colorConfig.name === targetCard.color) {
        // Shift shape to guarantee no match
        shape = SHAPES.find(s => s !== targetCard.shape) || 'hexagon';
      }
    }

    const isMatch = Boolean(targetCard && shape === targetCard.shape && colorConfig.name === targetCard.color);

    return {
      id: `card-${nextIndex}-${shape}-${colorConfig.name}-${Date.now()}`,
      shape,
      color: colorConfig.name,
      hex: colorConfig.hex,
      isMatchTarget: isMatch
    };
  }, []);

  // Clear timers cleanly
  const clearTimers = useCallback(() => {
    if (trialTimerRef.current) {
      clearTimeout(trialTimerRef.current);
      trialTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Forward trial progression with gradual difficulty step-up
  const advanceToNextTrial = useCallback(() => {
    clearTimers();

    setTrialIndex(prevIdx => {
      const nextIdx = prevIdx + 1;

      if (nextIdx >= totalTrials) {
        setPhase('game-over');
        return prevIdx;
      }

      // Step up difficulty slowly: trials 0-5 are 1-Back, trials 6+ become 2-Back
      const activeN = nextIdx >= 6 ? 2 : 1;
      if (activeN !== nStep) {
        setNStep(activeN);
      }

      setHistory(currentHistory => {
        const nextCard = createNextStimulus(currentHistory, nextIdx, activeN);
        setCurrentCard(nextCard);
        setHasAnsweredCurrent(false);
        setFeedback(null);
        setFeedbackMessage('');
        const now = Date.now();
        setTrialStartTime(now);
        setTimeRemainingMs(nextIdx < activeN ? PRIMING_DURATION_MS : getTrialTimeout(nextIdx));
        sounds.playTick();
        return [...currentHistory, nextCard];
      });

      return nextIdx;
    });
  }, [clearTimers, createNextStimulus, getTrialTimeout, nStep, totalTrials]);

  // Handle timeout when user does not respond within trial duration
  const handleTrialTimeout = useCallback(() => {
    if (hasAnsweredCurrent || !currentCard) return;

    setHasAnsweredCurrent(true);
    setStreak(0);

    if (currentCard.isMatchTarget) {
      // Missed match!
      setMisses(m => m + 1);
      sounds.playMistake();
      setFeedback('miss');
      setFeedbackMessage(`Target Missed! (Card was identical to ${nStep} step${nStep > 1 ? 's' : ''} ago)`);
    } else {
      // Non-match timeout
      sounds.playTick();
      setFeedback('timeout');
      setFeedbackMessage('Time expired - staying sharp!');
    }

    trialTimerRef.current = setTimeout(() => {
      advanceToNextTrial();
    }, 650);
  }, [hasAnsweredCurrent, currentCard, nStep, advanceToNextTrial]);

  // Start trial timer whenever a new card is presented in 'playing' phase
  useEffect(() => {
    if (phase !== 'playing' || !currentCard || hasAnsweredCurrent) return;

    clearTimers();

    const isPriming = trialIndex < nStep;
    const duration = isPriming ? PRIMING_DURATION_MS : getTrialTimeout(trialIndex);
    setTimeRemainingMs(duration);

    const start = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, duration - elapsed);
      setTimeRemainingMs(remaining);
    }, 50);

    trialTimerRef.current = setTimeout(() => {
      if (isPriming) {
        // Automatically advance priming cards
        advanceToNextTrial();
      } else {
        // Testing card expired
        handleTrialTimeout();
      }
    }, duration);

    return () => clearTimers();
  }, [phase, trialIndex, currentCard, nStep, hasAnsweredCurrent, advanceToNextTrial, handleTrialTimeout, clearTimers, getTrialTimeout]);

  // Ready countdown
  useEffect(() => {
    if (phase === 'ready') {
      if (countdown > 0) {
        sounds.playTick();
        const t = setTimeout(() => setCountdown(c => c - 1), 700);
        return () => clearTimeout(t);
      } else {
        setPhase('playing');
        hasEndedRef.current = false;
        const firstCard = createNextStimulus([], 0, nStep);
        setCurrentCard(firstCard);
        setHistory([firstCard]);
        setTrialIndex(0);
        setHasAnsweredCurrent(false);
        setFeedback(null);
        setTrialStartTime(Date.now());
        setTimeRemainingMs(PRIMING_DURATION_MS);
      }
    }
  }, [phase, countdown, nStep, createNextStimulus]);

  // Handle user response (Match or No Match)
  const handleUserAnswer = useCallback((userClaimedMatch: boolean) => {
    if (phase !== 'playing' || hasAnsweredCurrent || !currentCard) return;

    // During priming cards, buttons shouldn't register comparison answers
    if (trialIndex < nStep) {
      advanceToNextTrial();
      return;
    }

    clearTimers();
    setHasAnsweredCurrent(true);

    const reaction = Date.now() - trialStartTime;
    setReactionTimes(prev => [...prev, reaction]);

    const isActualMatch = currentCard.isMatchTarget;

    if (userClaimedMatch && isActualMatch) {
      // HIT (Correct Match)
      setHits(h => h + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(m => Math.max(m, newStreak));
      sounds.playCorrect(newStreak);
      const speedBonus = reaction < 1500 ? 15 : reaction < 2500 ? 10 : 0;
      const streakBonus = Math.min(15, newStreak * 2);
      const points = 100 + speedBonus + streakBonus;
      setScore(s => s + points);
      setFeedback('hit');
      setFeedbackMessage(`Target Hit! (+${points} PTS)`);
      onScoreUpdate?.(points, true);
    } else if (!userClaimedMatch && !isActualMatch) {
      // CORRECT REJECTION (Correct Non-Match)
      setCorrectRejections(r => r + 1);
      sounds.playCorrect(1);
      const speedBonus = reaction < 1800 ? 10 : 0;
      const points = 100 + speedBonus;
      setScore(s => s + points);
      setFeedback('correct-reject');
      setFeedbackMessage(`Correct Rejection! (+${points} PTS)`);
      onScoreUpdate?.(points, true);
    } else if (userClaimedMatch && !isActualMatch) {
      // FALSE ALARM (User said match, but cards differed)
      setFalseAlarms(f => f + 1);
      setStreak(0);
      sounds.playMistake();
      setFeedback('false-alarm');
      setFeedbackMessage(`False Alarm! Card from ${nStep} turns ago was different.`);
      onScoreUpdate?.(0, false);
    } else {
      // MISS (User said no match, but cards were identical)
      setMisses(m => m + 1);
      setStreak(0);
      sounds.playMistake();
      setFeedback('miss');
      setFeedbackMessage(`Missed Match! This card matched the one ${nStep} turns ago.`);
      onScoreUpdate?.(0, false);
    }

    // Advance after brief feedback flash
    trialTimerRef.current = setTimeout(() => {
      advanceToNextTrial();
    }, 600);
  }, [phase, hasAnsweredCurrent, currentCard, trialIndex, nStep, clearTimers, trialStartTime, streak, advanceToNextTrial]);

  // Keyboard navigation
  useEffect(() => {
    if (phase !== 'playing' || hasAnsweredCurrent) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (trialIndex < nStep) {
        // In priming phase: Space, Enter, or Right advances to next card immediately
        if (e.code === 'Space' || e.key === 'Enter' || e.key === 'ArrowRight') {
          e.preventDefault();
          advanceToNextTrial();
        }
        return;
      }

      // In testing phase:
      if (e.code === 'Space' || e.key === 'ArrowRight' || e.key === 'm' || e.key === 'M' || e.key === 'Enter') {
        e.preventDefault();
        handleUserAnswer(true);
      } else if (e.key === 'ArrowLeft' || e.key === 'n' || e.key === 'N' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleUserAnswer(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, hasAnsweredCurrent, trialIndex, nStep, advanceToNextTrial, handleUserAnswer]);

  // Handle Game Over
  useEffect(() => {
    if (phase === 'game-over' && !hasEndedRef.current) {
      hasEndedRef.current = true;
      clearTimers();
      sounds.playFanfare();
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });

      const avgReaction = reactionTimes.length > 0
        ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
        : 750;

      const totalDecisions = hits + correctRejections + misses + falseAlarms;
      const accuracyPct = totalDecisions > 0
        ? Math.min(100, Math.round(((hits + correctRejections) / totalDecisions) * 100))
        : 85;

      onGameOverRef.current({
        gameType: 'n-back',
        gameTitle: `Pattern Match (${nStep}-Back)`,
        score,
        accuracy: accuracyPct,
        level: nStep,
        responseTimeMs: avgReaction
      });
    }
  }, [phase, score, hits, correctRejections, misses, falseAlarms, reactionTimes, nStep, clearTimers]);

  const restartGame = () => {
    clearTimers();
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setHits(0);
    setCorrectRejections(0);
    setMisses(0);
    setFalseAlarms(0);
    setReactionTimes([]);
    setCountdown(3);
    hasEndedRef.current = false;
    setPhase('ready');
  };

  const renderShapeIcon = (shape: ShapeType, hex: string, sizeClass = "w-20 h-20 sm:w-24 sm:h-24") => {
    const props = { className: sizeClass, style: { color: hex, fill: hex } };
    switch (shape) {
      case 'circle': return <Circle {...props} />;
      case 'square': return <Square {...props} />;
      case 'triangle': return <Triangle {...props} />;
      case 'diamond': return <Diamond {...props} />;
      case 'hexagon': return <Hexagon {...props} />;
      case 'star': return <Star {...props} />;
    }
  };

  const isPriming = trialIndex < nStep;
  const currentDuration = isPriming ? PRIMING_DURATION_MS : getTrialTimeout(trialIndex);
  const progressPct = Math.max(0, Math.min(100, (timeRemainingMs / currentDuration) * 100));

  // Past card targets for Memory Aid
  const pastTargetCard = trialIndex >= nStep && history.length > nStep
    ? history[history.length - 1 - nStep]
    : null;
  const immediatePriorCard = trialIndex >= 1 && history.length > 1
    ? history[history.length - 2]
    : null;

  return (
    <div id="nback-game" className="max-w-2xl mx-auto p-3 sm:p-6 flex flex-col items-center select-none text-slate-800">
      {/* Top Status Bar */}
      <div className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 mb-4 sm:mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-100 border border-cyan-300 text-cyan-800 rounded-2xl flex items-center justify-center font-black text-sm shadow-xs">
            <Repeat className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-600">Working Memory Task</div>
            <div className="font-display text-base sm:text-lg font-black text-slate-900">Pattern Match ({nStep}-Back)</div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          {/* Streak Indicator */}
          {streak > 1 && (
            <div className="hidden sm:flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-xl text-xs font-black animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{streak}x</span>
            </div>
          )}

          <div className="text-right">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Score</div>
            <div className="font-mono text-lg sm:text-xl font-black text-cyan-600">{score.toLocaleString()} PTS</div>
          </div>

          <div className="text-xs font-extrabold text-cyan-900 bg-cyan-50 px-3 py-1.5 rounded-2xl border border-cyan-200">
            <span className="font-black text-cyan-700">{Math.min(trialIndex + 1, totalTrials)}</span>/{totalTrials}
          </div>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="w-full bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 flex flex-col items-center justify-center shadow-md relative min-h-[460px]">
        {/* Phase: Ready Countdown */}
        {phase === 'ready' && (
          <div className="text-center py-8 sm:py-12 flex flex-col items-center">
            <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-700 bg-cyan-50 border border-cyan-200 px-3.5 py-1 rounded-full mb-4 inline-flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5" />
              <span>Fluid Intelligence Challenge</span>
            </span>

            <div className="font-display text-7xl sm:text-8xl font-black text-slate-900 my-3 animate-bounce">
              {countdown}
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-sm mt-2">
              Compare each symbol with the card shown <strong className="text-cyan-600 font-extrabold">{nStep} steps</strong> prior.
            </p>

            <button
              id="btn-nback-start-now"
              onClick={() => setCountdown(0)}
              className="mt-6 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-2"
            >
              <span>Start Instantly</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Phase: Playing */}
        {phase === 'playing' && currentCard && (
          <div className="w-full flex flex-col items-center">
            {/* Top Instruction Banner */}
            <div className="mb-4 text-center">
              {isPriming ? (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-black shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span>Memorizing Initial Pattern: Card {trialIndex + 1} of {nStep}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 text-cyan-950 border border-cyan-200 text-xs font-black shadow-xs">
                  <span>Does this match Card #{trialIndex - nStep + 1} ({nStep} turns ago)?</span>
                </div>
              )}
            </div>

            {/* Trial Timer Bar */}
            <div className="w-48 sm:w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden mb-5 border border-slate-200">
              <div
                className={`h-full transition-all duration-75 ${
                  isPriming
                    ? 'bg-amber-500'
                    : progressPct > 35
                    ? 'bg-cyan-500'
                    : 'bg-rose-500 animate-pulse'
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Stimulus Card */}
            <motion.div
              key={currentCard.id}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.16 }}
              className="w-48 h-52 sm:w-56 sm:h-60 bg-gradient-to-b from-white to-slate-50/80 rounded-3xl border-2 border-slate-200/90 shadow-lg flex flex-col items-center justify-center relative overflow-hidden"
            >
              {renderShapeIcon(currentCard.shape, currentCard.hex)}
              <span className="mt-4 text-xs font-black uppercase tracking-wider text-slate-700 bg-slate-100/90 px-3 py-1 rounded-full border border-slate-200/80">
                {currentCard.color} {currentCard.shape}
              </span>

              {/* Feedback Overlay */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 flex flex-col items-center justify-center p-3 text-center font-black ${
                      feedback === 'hit' || feedback === 'correct-reject'
                        ? 'bg-emerald-600/95 text-white'
                        : feedback === 'timeout'
                        ? 'bg-amber-600/95 text-white'
                        : 'bg-rose-600/95 text-white'
                    }`}
                  >
                    {feedback === 'hit' && (
                      <>
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-1.5">
                          <Check className="w-7 h-7 stroke-[3]" />
                        </div>
                        <span className="text-base sm:text-lg">Target Match Hit!</span>
                        <span className="text-xs text-emerald-100 font-bold mt-0.5">{feedbackMessage}</span>
                      </>
                    )}
                    {feedback === 'correct-reject' && (
                      <>
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-1.5">
                          <Check className="w-7 h-7 stroke-[3]" />
                        </div>
                        <span className="text-base sm:text-lg">Correct Non-Match!</span>
                        <span className="text-xs text-emerald-100 font-bold mt-0.5">{feedbackMessage}</span>
                      </>
                    )}
                    {feedback === 'false-alarm' && (
                      <>
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-1.5">
                          <X className="w-7 h-7 stroke-[3]" />
                        </div>
                        <span className="text-base sm:text-lg">False Alarm!</span>
                        <span className="text-xs text-rose-100 font-bold mt-0.5">{feedbackMessage}</span>
                      </>
                    )}
                    {feedback === 'miss' && (
                      <>
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-1.5">
                          <X className="w-7 h-7 stroke-[3]" />
                        </div>
                        <span className="text-base sm:text-lg">Missed Target!</span>
                        <span className="text-xs text-rose-100 font-bold mt-0.5">{feedbackMessage}</span>
                      </>
                    )}
                    {feedback === 'timeout' && (
                      <>
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-1.5">
                          <Clock className="w-7 h-7 stroke-[3]" />
                        </div>
                        <span className="text-base sm:text-lg">Time Expired</span>
                        <span className="text-xs text-amber-100 font-bold mt-0.5">{feedbackMessage}</span>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Action Buttons: Priming vs Active Testing */}
            {isPriming ? (
              <div className="w-full max-w-sm mt-6 flex flex-col items-center gap-2">
                <button
                  id="btn-nback-priming-continue"
                  onClick={() => advanceToNextTrial()}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <span>Memorized &bull; Next Card</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-slate-400 font-semibold">
                  (Auto-advances in {Math.ceil(timeRemainingMs / 1000)}s or press Space)
                </span>
              </div>
            ) : (
              <div className="w-full max-w-sm mt-6">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
                  <button
                    id="btn-nback-nomatch"
                    disabled={hasAnsweredCurrent}
                    onClick={() => handleUserAnswer(false)}
                    className="py-3.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 active:scale-95 disabled:opacity-50 rounded-2xl text-xs sm:text-sm font-black text-slate-800 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center gap-1.5">
                      <X className="w-4 h-4 text-rose-500 stroke-[3]" />
                      <span>NO MATCH</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">[N] or [←]</span>
                  </button>

                  <button
                    id="btn-nback-match"
                    disabled={hasAnsweredCurrent}
                    onClick={() => handleUserAnswer(true)}
                    className="py-3.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95 disabled:opacity-50 text-white text-xs sm:text-sm font-black rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-md shadow-cyan-500/25"
                  >
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-lime-300 stroke-[3]" />
                      <span>MATCH TARGET</span>
                    </div>
                    <span className="text-[10px] text-cyan-200 font-bold uppercase tracking-wider">[M] or [→]</span>
                  </button>
                </div>
              </div>
            )}

            {/* Working Memory Buffer Assist HUD */}
            <div className="w-full max-w-md mt-6 pt-4 border-t border-slate-100 flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2 px-1">
                <span className="flex items-center gap-1">
                  <Repeat className="w-3 h-3 text-cyan-600" />
                  <span>Mental Buffer Slots:</span>
                </span>
                <button
                  id="btn-toggle-memory-aid"
                  onClick={() => setShowMemoryAid(prev => !prev)}
                  className="flex items-center gap-1 text-cyan-700 hover:text-cyan-900 cursor-pointer font-bold"
                >
                  {showMemoryAid ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{showMemoryAid ? 'Visual Aid: On' : 'Visual Aid: Off'}</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full">
                {/* 2-Back Target Slot */}
                <div className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center ${
                  trialIndex >= nStep
                    ? 'bg-cyan-50/70 border-cyan-300 text-cyan-950 ring-2 ring-cyan-400/40'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <span className="text-[9px] font-black uppercase text-cyan-800">
                    {nStep}-Back (Target)
                  </span>
                  {showMemoryAid && pastTargetCard ? (
                    <div className="mt-1 flex items-center gap-1">
                      {renderShapeIcon(pastTargetCard.shape, pastTargetCard.hex, "w-4 h-4")}
                      <span className="text-[10px] font-bold capitalize">{pastTargetCard.shape}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold mt-1 text-slate-400">
                      {trialIndex >= nStep ? 'Active Target' : 'Empty'}
                    </span>
                  )}
                </div>

                {/* 1-Back Prior Slot */}
                <div className="p-2 rounded-xl border bg-slate-50 border-slate-200 text-slate-600 flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] font-black uppercase text-slate-500">1-Back (Prior)</span>
                  {showMemoryAid && immediatePriorCard ? (
                    <div className="mt-1 flex items-center gap-1">
                      {renderShapeIcon(immediatePriorCard.shape, immediatePriorCard.hex, "w-4 h-4")}
                      <span className="text-[10px] font-bold capitalize">{immediatePriorCard.shape}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold mt-1 text-slate-400">
                      {trialIndex >= 1 ? 'Stored' : 'Empty'}
                    </span>
                  )}
                </div>

                {/* Current Slot */}
                <div className="p-2 rounded-xl border bg-slate-900 border-slate-800 text-white flex flex-col items-center justify-center text-center shadow-xs">
                  <span className="text-[9px] font-black uppercase text-cyan-300">Current</span>
                  <div className="mt-1 flex items-center gap-1">
                    {renderShapeIcon(currentCard.shape, currentCard.hex, "w-4 h-4")}
                    <span className="text-[10px] font-bold capitalize text-slate-200">{currentCard.shape}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase: Game Over */}
        {phase === 'game-over' && (
          <div className="text-center py-6 sm:py-8 flex flex-col items-center w-full max-w-md">
            <div className="w-16 h-16 rounded-3xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-4 shadow-sm">
              <Trophy className="w-8 h-8" />
            </div>

            <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full mb-2 inline-block">
              Session Completed!
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-slate-900 mb-1">Pattern Match Trial Over</h3>
            <p className="text-xs text-slate-500 mb-6">Continuous working memory assessment metrics recorded.</p>

            {/* Score & Stats Grid */}
            <div className="grid grid-cols-3 gap-3 w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 text-center">
              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400">Final Score</div>
                <div className="text-base sm:text-lg font-black text-cyan-700">{score.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400">Hits / Targets</div>
                <div className="text-base sm:text-lg font-black text-emerald-600">{hits} Hits</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400">Max Streak</div>
                <div className="text-base sm:text-lg font-black text-amber-600">{maxStreak}x</div>
              </div>
            </div>

            <div className="flex gap-3 w-full justify-center">
              <button
                id="btn-retry-nback"
                onClick={restartGame}
                className="flex-1 py-3 px-5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-95 active:scale-95 text-white font-black text-xs rounded-2xl shadow-md shadow-cyan-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Train Again</span>
              </button>
              <button
                id="btn-exit-nback"
                onClick={onExit}
                className="flex-1 py-3 px-5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-black rounded-2xl transition-colors cursor-pointer"
              >
                Return to Hub
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer difficulty & exit controls */}
      <div className="w-full flex items-center justify-between mt-4 px-2">
        <button
          id="btn-exit-nback-early"
          onClick={onExit}
          className="text-xs font-black text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          &larr; Exit to Hub
        </button>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-400 mr-1 hidden sm:inline">Difficulty:</span>
          {[1, 2, 3].map(n => (
            <button
              key={n}
              id={`btn-difficulty-${n}back`}
              disabled={phase === 'playing'}
              onClick={() => {
                setNStep(n);
                restartGame();
              }}
              className={`text-xs px-2.5 py-1 rounded-xl font-black transition-all cursor-pointer ${
                nStep === n
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 disabled:opacity-40'
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

