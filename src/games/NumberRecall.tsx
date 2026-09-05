import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../lib/audio';
import { GameResult, GameType } from '../types';
import { Binary, Heart, ArrowLeftRight, Delete, Check, RefreshCw, Trophy, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface NumberRecallProps {
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

export const NumberRecall: React.FC<NumberRecallProps> = ({ onGameOver, onExit }) => {
  const [phase, setPhase] = useState<'ready' | 'flashing' | 'input' | 'round-result' | 'game-over'>('ready');
  const [countdown, setCountdown] = useState(3);
  const [level, setLevel] = useState(1);
  const [digitLength, setDigitLength] = useState(4); // starts at 4 digits
  const [isReverseMode, setIsReverseMode] = useState(false); // Hard mode: recall backward
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);

  // Active sequence
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentDisplayDigit, setCurrentDisplayDigit] = useState<number | null>(null);
  const [currentDisplayIndex, setCurrentDisplayIndex] = useState<number>(-1);
  const [userInput, setUserInput] = useState<string>('');
  
  // Metrics
  const [inputStartTime, setInputStartTime] = useState<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [roundsWon, setRoundsWon] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate new sequence
  const startNewSequence = (len = digitLength) => {
    const seq: number[] = [];
    for (let i = 0; i < len; i++) {
      seq.push(Math.floor(Math.random() * 10));
    }
    setSequence(seq);
    setUserInput('');
    setCurrentDisplayIndex(-1);
    setCurrentDisplayDigit(null);
    setPhase('flashing');

    // Stream digits sequentially
    let idx = 0;
    const streamInterval = setInterval(() => {
      if (idx < seq.length) {
        setCurrentDisplayDigit(seq[idx]);
        setCurrentDisplayIndex(idx);
        sounds.playDigitFlash();
        idx++;
      } else {
        clearInterval(streamInterval);
        setCurrentDisplayDigit(null);
        setCurrentDisplayIndex(-1);
        setPhase('input');
        setInputStartTime(Date.now());
      }
    }, 750); // 750ms per digit flash
  };

  // Ready countdown
  useEffect(() => {
    if (phase === 'ready') {
      if (countdown > 0) {
        sounds.playTick();
        const t = setTimeout(() => setCountdown(c => c - 1), 700);
        return () => clearTimeout(t);
      } else {
        startNewSequence(4);
      }
    }
  }, [phase, countdown]);

  const handleInputDigit = (digit: string) => {
    if (phase !== 'input') return;
    if (userInput.length < sequence.length) {
      sounds.playTick();
      setUserInput(prev => prev + digit);
    }
  };

  const handleDeleteDigit = () => {
    if (phase !== 'input') return;
    sounds.playTick();
    setUserInput(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (phase !== 'input') return;
    setUserInput('');
  };

  const handleSubmit = () => {
    if (phase !== 'input' || userInput.length !== sequence.length) return;

    const reaction = Date.now() - inputStartTime;
    setReactionTimes(prev => [...prev, reaction]);
    setTotalRounds(r => r + 1);

    const expected = isReverseMode
      ? [...sequence].reverse().join('')
      : sequence.join('');

    const isCorrect = userInput === expected;

    if (isCorrect) {
      sounds.playCorrect();
      sounds.playLevelUp();
      setRoundsWon(w => w + 1);
      
      const roundScore = (digitLength * 150) + (isReverseMode ? 200 : 0) + Math.max(0, 3000 - reaction);
      setScore(s => s + Math.max(100, Math.round(roundScore)));

      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.6 }
      });

      // Increase level & length
      setTimeout(() => {
        setLevel(l => l + 1);
        setDigitLength(d => {
          const next = d + 1;
          startNewSequence(next);
          return next;
        });
      }, 1000);
    } else {
      sounds.playMistake();
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        setPhase('game-over');
        endGame();
      } else {
        // Retry sequence or move on
        setTimeout(() => {
          startNewSequence(digitLength);
        }, 1200);
      }
    }
  };

  // Keyboard input listener
  useEffect(() => {
    if (phase !== 'input') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleInputDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDeleteDigit();
      } else if (e.key === 'Enter') {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, userInput, sequence, isReverseMode]);

  const endGame = () => {
    const avgReaction = reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 1200;
    const accuracyPct = totalRounds > 0
      ? Math.min(100, Math.round((roundsWon / totalRounds) * 100))
      : 0;

    onGameOver({
      gameType: 'number-recall',
      gameTitle: 'Number Recall',
      score,
      accuracy: accuracyPct,
      level,
      responseTimeMs: avgReaction
    });
  };

  return (
    <div id="number-recall-game" className="max-w-xl mx-auto p-4 sm:p-6 flex flex-col items-center">
      {/* Top Status Bar */}
      <div className="w-full flex items-center justify-between bg-white border border-orange-200 rounded-3xl p-5 mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 border border-orange-300 text-orange-800 rounded-2xl flex items-center justify-center font-black text-sm shadow-xs">
            123
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-orange-600">Digit Span</div>
            <div className="font-display text-base sm:text-lg font-black text-slate-900">{digitLength} Digits {isReverseMode ? '(Reverse Mode)' : ''}</div>
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
      <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-8 flex flex-col items-center justify-center shadow-md relative min-h-[440px]">
        {phase === 'ready' && (
          <div className="text-center py-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full mb-3 inline-block">
              Working Memory Span 🔢
            </span>
            <div className="font-display text-7xl font-black text-slate-900 my-2 animate-bounce">
              {countdown}
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-2">Memorize each numeral sequentially as presented.</p>
          </div>
        )}

        {phase === 'flashing' && (
          <div className="flex flex-col items-center py-8">
            <div className="text-xs font-extrabold text-orange-700 bg-orange-50 px-4 py-1.5 rounded-full border border-orange-200 mb-6">
              Flashing Digits ({currentDisplayIndex + 1}/{digitLength})
            </div>

            <div className="w-32 h-36 bg-gradient-to-br from-orange-400 to-amber-500 text-white rounded-3xl shadow-xl shadow-orange-500/25 flex items-center justify-center animate-pop">
              <span className="font-display text-6xl font-black">
                {currentDisplayDigit !== null ? currentDisplayDigit : '•'}
              </span>
            </div>

            {/* Sequence progress dots */}
            <div className="flex gap-2.5 mt-8">
              {sequence.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${
                    i <= currentDisplayIndex ? 'bg-orange-500 scale-110' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {phase === 'input' && (
          <div className="w-full flex flex-col items-center">
            <div className="text-xs font-extrabold text-slate-600 mb-4 flex items-center gap-2">
              <span>Enter Digits {isReverseMode ? 'in REVERSE ORDER 🔁' : 'in FORWARD ORDER ➡️'}</span>
            </div>

            {/* User Input Slots */}
            <div className="flex gap-2 mb-6">
              {Array.from({ length: digitLength }).map((_, i) => {
                const char = userInput[i];
                return (
                  <div
                    key={i}
                    className={`w-11 h-14 sm:w-12 sm:h-14 rounded-2xl border-2 flex items-center justify-center font-display text-2xl font-black transition-all ${
                      char !== undefined
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                        : i === userInput.length
                        ? 'bg-white border-orange-400 shadow-sm animate-pulse'
                        : 'bg-slate-50 border-slate-200 text-slate-300'
                    }`}
                  >
                    {char || ''}
                  </div>
                );
              })}
            </div>

            {/* On-Screen Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2.5 w-full max-w-[280px]">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  id={`numpad-btn-${num}`}
                  onClick={() => handleInputDigit(num)}
                  className="py-3.5 bg-white hover:bg-slate-50 active:scale-95 border-2 border-slate-200 rounded-2xl font-display text-lg font-black text-slate-800 transition-all shadow-xs cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button
                id="numpad-btn-backspace"
                onClick={handleDeleteDigit}
                className="py-3.5 bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 rounded-2xl flex items-center justify-center text-slate-600 transition-all shadow-xs cursor-pointer"
                title="Backspace"
              >
                <Delete className="w-5 h-5" />
              </button>
              <button
                id="numpad-btn-0"
                onClick={() => handleInputDigit('0')}
                className="py-3.5 bg-white hover:bg-slate-50 active:scale-95 border-2 border-slate-200 rounded-2xl font-display text-lg font-black text-slate-800 transition-all shadow-xs cursor-pointer"
              >
                0
              </button>
              <button
                id="numpad-btn-submit"
                disabled={userInput.length !== sequence.length}
                onClick={handleSubmit}
                className="py-3.5 bg-gradient-to-r from-lime-500 to-emerald-500 hover:opacity-90 disabled:opacity-30 text-slate-950 font-black rounded-2xl flex items-center justify-center transition-all shadow-md shadow-lime-500/20 cursor-pointer"
                title="Submit Sequence"
              >
                <Check className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {phase === 'game-over' && (
          <div className="text-center py-8">
            <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full mb-3 inline-block">
              Session Finished
            </span>
            <h3 className="font-display text-3xl font-black text-slate-900 mb-1">Workout Complete!</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">Max Span: <strong className="text-orange-600 font-black">{digitLength - 1} Digits</strong> &bull; Score: <strong className="text-blue-600 font-black">{score.toLocaleString()} PTS</strong></p>
            <div className="flex gap-3 justify-center">
              <button
                id="btn-retry-number"
                onClick={() => {
                  setLevel(1);
                  setDigitLength(4);
                  setScore(0);
                  setLives(3);
                  setRoundsWon(0);
                  setTotalRounds(0);
                  setReactionTimes([]);
                  setCountdown(3);
                  setPhase('ready');
                }}
                className="py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 text-white font-extrabold text-xs rounded-2xl shadow-md shadow-orange-500/25 transition-all cursor-pointer"
              >
                Play Again
              </button>
              <button
                id="btn-exit-number"
                onClick={onExit}
                className="py-3 px-6 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-extrabold rounded-2xl transition-colors cursor-pointer"
              >
                Return to Hub
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mode toggle and footer */}
      <div className="w-full flex items-center justify-between mt-4 px-2">
        <button
          id="btn-exit-number-early"
          onClick={onExit}
          className="text-xs font-extrabold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          ← Exit Game
        </button>
        <button
          id="btn-toggle-reverse"
          onClick={() => setIsReverseMode(!isReverseMode)}
          disabled={phase === 'flashing' || phase === 'input'}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-extrabold transition-all cursor-pointer ${
            isReverseMode
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>{isReverseMode ? 'Reverse Mode (Active)' : 'Reverse Mode (Off)'}</span>
        </button>
      </div>
    </div>
  );
};
