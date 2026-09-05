import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../lib/audio';
import { GameType } from '../types';
import { Radio, Heart, Sparkles, RefreshCw, Trophy, ArrowRight, Play, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface RecallSequenceProps {
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

const PADS = [
  {
    id: 0,
    label: 'Cyan (1)',
    baseColor: 'bg-cyan-500 hover:bg-cyan-400',
    activeColor: 'bg-cyan-300 ring-8 ring-cyan-400/50 shadow-2xl shadow-cyan-400',
    borderColor: 'border-cyan-400',
    key: '1',
    noteName: 'C4'
  },
  {
    id: 1,
    label: 'Emerald (2)',
    baseColor: 'bg-emerald-500 hover:bg-emerald-400',
    activeColor: 'bg-emerald-300 ring-8 ring-emerald-400/50 shadow-2xl shadow-emerald-400',
    borderColor: 'border-emerald-400',
    key: '2',
    noteName: 'E4'
  },
  {
    id: 2,
    label: 'Amber (3)',
    baseColor: 'bg-amber-500 hover:bg-amber-400',
    activeColor: 'bg-amber-300 ring-8 ring-amber-400/50 shadow-2xl shadow-amber-400',
    borderColor: 'border-amber-400',
    key: '3',
    noteName: 'G4'
  },
  {
    id: 3,
    label: 'Rose (4)',
    baseColor: 'bg-rose-500 hover:bg-rose-400',
    activeColor: 'bg-rose-300 ring-8 ring-rose-400/50 shadow-2xl shadow-rose-400',
    borderColor: 'border-rose-400',
    key: '4',
    noteName: 'C5'
  }
];

export const RecallSequence: React.FC<RecallSequenceProps> = ({ onGameOver, onExit }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userStep, setUserStep] = useState(0);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing-sequence' | 'user-turn' | 'round-won' | 'game-over'>('idle');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(2);
  const [startTime, setStartTime] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'user-turn') return;
      if (e.key === '1') handlePadClick(0);
      else if (e.key === '2') handlePadClick(1);
      else if (e.key === '3') handlePadClick(2);
      else if (e.key === '4') handlePadClick(3);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, userStep, sequence]);

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setLives(2);
    setReactionTimes([]);
    const initialSeq = [Math.floor(Math.random() * 4)];
    setSequence(initialSeq);
    setUserStep(0);
    playSequence(initialSeq);
  };

  const playSequence = async (seq: number[]) => {
    setGameState('playing-sequence');
    setActivePad(null);

    // Initial pause
    await new Promise(r => setTimeout(r, 600));

    // Playback speed increases with level
    const displayDuration = Math.max(260, 500 - seq.length * 20);
    const pauseDuration = Math.max(120, 200 - seq.length * 10);

    for (let i = 0; i < seq.length; i++) {
      const padIdx = seq[i];
      setActivePad(padIdx);
      sounds.playSimonNote(padIdx);
      await new Promise(r => setTimeout(r, displayDuration));
      setActivePad(null);
      await new Promise(r => setTimeout(r, pauseDuration));
    }

    setGameState('user-turn');
    setUserStep(0);
    setStartTime(Date.now());
  };

  const handlePadClick = (padIndex: number) => {
    if (gameState !== 'user-turn') return;

    // Flash clicked pad
    setActivePad(padIndex);
    sounds.playSimonNote(padIndex);
    setTimeout(() => setActivePad(null), 250);

    // Track latency
    const tapLatency = Date.now() - startTime;
    setReactionTimes(prev => [...prev, tapLatency]);
    setStartTime(Date.now());

    // Check if match
    if (padIndex === sequence[userStep]) {
      const nextStep = userStep + 1;
      setUserStep(nextStep);
      setScore(s => s + 50 * level);

      // Completed full sequence
      if (nextStep === sequence.length) {
        setGameState('round-won');
        sounds.playCorrect(3);
        const newLevel = level + 1;
        setLevel(newLevel);

        if (newLevel % 3 === 0) {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        }

        setTimeout(() => {
          const nextSeq = [...sequence, Math.floor(Math.random() * 4)];
          setSequence(nextSeq);
          playSequence(nextSeq);
        }, 1000);
      }
    } else {
      // Mistake!
      sounds.playMistake();
      const nextLives = lives - 1;
      setLives(nextLives);

      if (nextLives > 0) {
        setGameState('idle');
        setTimeout(() => {
          playSequence(sequence);
        }, 1200);
      } else {
        // Game Over
        setGameState('game-over');
        const avgReaction = reactionTimes.length > 0
          ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
          : 600;

        setTimeout(() => {
          onGameOver({
            gameType: 'recall-sequence',
            gameTitle: 'Recall Sequences (Simon)',
            score: score,
            accuracy: Math.round(((sequence.length - 1) / Math.max(sequence.length, 1)) * 100),
            level: sequence.length,
            responseTimeMs: avgReaction
          });
        }, 1200);
      }
    }
  };

  return (
    <div id="recall-sequence-game" className="max-w-3xl mx-auto space-y-6 text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-violet-500 text-white flex items-center justify-center shadow-md">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
                Working Memory Span &bull; Level {level}
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-black text-slate-900">Recall Sequences (Simon)</h1>
          </div>
        </div>

        {/* Counters */}
        <div className="flex items-center gap-4 text-center">
          <div className="bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Sequence</span>
            <span className="font-mono text-base font-black text-violet-600">
              {sequence.length} steps
            </span>
          </div>

          <div className="bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Lives</span>
            <div className="flex items-center justify-center gap-1 text-rose-500 font-bold">
              {[...Array(2)].map((_, i) => (
                <Heart key={i} className={`w-4 h-4 ${i < lives ? 'fill-rose-500' : 'text-slate-200'}`} />
              ))}
            </div>
          </div>

          <div className="bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Score</span>
            <span className="font-mono text-base font-black text-blue-600">{score}</span>
          </div>
        </div>

        <button
          id="btn-exit-simon"
          onClick={onExit}
          className="text-xs font-extrabold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors cursor-pointer"
        >
          Exit
        </button>
      </div>

      {/* Main Game Console */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col items-center justify-center text-center">
        {/* Status Callout */}
        <div className="mb-6">
          {gameState === 'idle' && (
            <div className="text-sm font-extrabold text-slate-600 bg-slate-100 px-5 py-2 rounded-full">
              Press "Start Round" to observe the audio-visual sequence
            </div>
          )}
          {gameState === 'playing-sequence' && (
            <div className="text-sm font-extrabold text-violet-600 bg-violet-50 px-5 py-2 rounded-full border border-violet-200 animate-pulse flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              <span>Observe the glowing pads & musical tones...</span>
            </div>
          )}
          {gameState === 'user-turn' && (
            <div className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Your turn! Tap the sequence ({userStep}/{sequence.length})</span>
            </div>
          )}
          {gameState === 'round-won' && (
            <div className="text-sm font-extrabold text-blue-700 bg-blue-50 px-5 py-2 rounded-full border border-blue-200">
              Sequence Matched! Escalating buffer...
            </div>
          )}
          {gameState === 'game-over' && (
            <div className="text-sm font-extrabold text-rose-700 bg-rose-50 px-5 py-2 rounded-full border border-rose-200">
              Incorrect note! Memory span: {sequence.length - 1} steps
            </div>
          )}
        </div>

        {/* 4 Simon Quadrant Pads */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 grid grid-cols-2 gap-4 p-4 bg-slate-900 rounded-full shadow-2xl border-4 border-slate-800 select-none">
          {PADS.map((pad) => {
            const isFlashing = activePad === pad.id;
            return (
              <motion.button
                key={pad.id}
                id={`simon-pad-${pad.id}`}
                whileTap={gameState === 'user-turn' ? { scale: 0.94 } : {}}
                onClick={() => handlePadClick(pad.id)}
                disabled={gameState !== 'user-turn'}
                className={`w-full h-full rounded-2xl sm:rounded-3xl transition-all duration-150 cursor-pointer flex flex-col items-center justify-center text-white ${
                  isFlashing ? pad.activeColor : pad.baseColor
                }`}
              >
                <span className="font-mono text-xl sm:text-2xl font-black drop-shadow-md">
                  {pad.key}
                </span>
                <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">
                  {pad.noteName}
                </span>
              </motion.button>
            );
          })}

          {/* Center Hub Badge */}
          <div className="absolute inset-0 m-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-950 border-4 border-slate-800 flex flex-col items-center justify-center text-white pointer-events-none shadow-inner">
            <span className="text-[9px] font-black uppercase text-violet-400 tracking-wider">SIMON</span>
            <span className="font-mono text-base font-black text-slate-100">
              {level > 1 ? `L${level}` : 'SPAN'}
            </span>
          </div>
        </div>

        {/* Start Button when idle */}
        {gameState === 'idle' && sequence.length === 0 && (
          <div className="mt-8">
            <button
              id="btn-start-simon"
              onClick={startGame}
              className="py-3 px-8 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-black tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-lg shadow-violet-500/25 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Challenge</span>
            </button>
          </div>
        )}

        {/* Keyboard Instructions */}
        <div className="mt-8 text-xs text-slate-400 flex items-center gap-2">
          <span>Pro Tip: You can also use keyboard keys <strong>1</strong>, <strong>2</strong>, <strong>3</strong>, and <strong>4</strong>.</span>
        </div>
      </div>
    </div>
  );
};
