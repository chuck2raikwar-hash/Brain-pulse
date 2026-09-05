import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../lib/audio';
import { GameType } from '../types';
import { Wind, Play, Pause, RotateCcw, Heart, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface BreathingPacerProps {
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

type TechniqueId = 'box' | '478' | 'coherent';

interface Technique {
  id: TechniqueId;
  name: string;
  subtitle: string;
  phases: { name: string; duration: number; soundType: 'inhale' | 'hold' | 'exhale' }[];
  targetCycles: number;
}

const TECHNIQUES: Technique[] = [
  {
    id: 'box',
    name: 'Box Breathing (4-4-4-4)',
    subtitle: 'Navy SEAL protocol for mental poise under pressure.',
    phases: [
      { name: 'Inhale', duration: 4, soundType: 'inhale' },
      { name: 'Hold Full', duration: 4, soundType: 'hold' },
      { name: 'Exhale', duration: 4, soundType: 'exhale' },
      { name: 'Hold Empty', duration: 4, soundType: 'hold' }
    ],
    targetCycles: 4
  },
  {
    id: '478',
    name: '4-7-8 Relaxing Breath',
    subtitle: 'Vagal nerve stimulation for immediate nervous system deceleration.',
    phases: [
      { name: 'Inhale', duration: 4, soundType: 'inhale' },
      { name: 'Hold', duration: 7, soundType: 'hold' },
      { name: 'Exhale', duration: 8, soundType: 'exhale' }
    ],
    targetCycles: 4
  },
  {
    id: 'coherent',
    name: 'Coherent Resonance (5.5s)',
    subtitle: 'Maximizes heart rate variability (HRV) and baroreflex sensitivity.',
    phases: [
      { name: 'Inhale', duration: 5.5, soundType: 'inhale' },
      { name: 'Exhale', duration: 5.5, soundType: 'exhale' }
    ],
    targetCycles: 6
  }
];

export const BreathingPacer: React.FC<BreathingPacerProps> = ({ onGameOver, onExit }) => {
  const [selectedTech, setSelectedTech] = useState<TechniqueId>('box');
  const technique = TECHNIQUES.find(t => t.id === selectedTech) || TECHNIQUES[0];

  const [isActive, setIsActive] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(technique.phases[0].duration);
  const [totalSeconds, setTotalSeconds] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetSession = () => {
    setIsActive(false);
    setCurrentCycle(1);
    setPhaseIndex(0);
    setPhaseTimeLeft(technique.phases[0].duration);
    setTotalSeconds(0);
  };

  useEffect(() => {
    resetSession();
  }, [selectedTech]);

  // Main breathing clock
  useEffect(() => {
    if (!isActive) return;

    timerRef.current = setInterval(() => {
      setTotalSeconds(s => s + 0.5);

      setPhaseTimeLeft(timeLeft => {
        const nextTime = Math.max(0, Number((timeLeft - 0.5).toFixed(1)));
        if (nextTime <= 0) {
          // Transition to next phase
          const nextPhaseIdx = (phaseIndex + 1) % technique.phases.length;
          const nextPhase = technique.phases[nextPhaseIdx];
          sounds.playBreathCue(nextPhase.soundType);

          if (nextPhaseIdx === 0) {
            // Cycle finished
            const nextCycle = currentCycle + 1;
            if (nextCycle > technique.targetCycles) {
              // Completed all cycles
              handleCompletedSession();
              return 0;
            }
            setCurrentCycle(nextCycle);
          }

          setPhaseIndex(nextPhaseIdx);
          return nextPhase.duration;
        }
        return nextTime;
      });
    }, 500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phaseIndex, currentCycle, technique]);

  const handleCompletedSession = () => {
    setIsActive(false);
    sounds.playFanfare();
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });

    setTimeout(() => {
      onGameOver({
        gameType: 'breathing-pacer',
        gameTitle: `Breathing Exercises (${technique.name})`,
        score: 450,
        accuracy: 100,
        level: technique.targetCycles,
        responseTimeMs: 0
      });
    }, 1500);
  };

  const toggleActive = () => {
    if (!isActive) {
      sounds.playBreathCue(technique.phases[phaseIndex].soundType);
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  const currentPhase = technique.phases[phaseIndex];
  const isExhaling = currentPhase.soundType === 'exhale';
  const isInhaling = currentPhase.soundType === 'inhale';

  return (
    <div id="breathing-pacer-activity" className="max-w-4xl mx-auto space-y-6 text-slate-800">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shadow-md">
            <Wind className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                Autonomic Regulation &bull; Breath Pacer
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-black text-slate-900">
              Breathing Exercises
            </h1>
          </div>
        </div>

        {/* Technique Selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {TECHNIQUES.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedTech(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedTech === t.id
                  ? 'bg-white text-cyan-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.name.split(' ')[0]}
            </button>
          ))}
        </div>

        <button
          onClick={onExit}
          className="text-xs font-extrabold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors cursor-pointer"
        >
          Exit
        </button>
      </div>

      {/* Main Visual Breath Pacer Card */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 flex flex-col items-center text-center relative overflow-hidden">
        {/* Cycles Counter */}
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 bg-cyan-950/60 px-4 py-1.5 rounded-full border border-cyan-800/60 mb-4">
          <Heart className="w-3.5 h-3.5 text-cyan-400 fill-current" />
          <span>
            Cycle {currentCycle} of {technique.targetCycles}
          </span>
        </div>

        {/* Visual Expanding / Contracting Orb */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center my-6">
          {/* Animated Glow Aura */}
          <motion.div
            animate={{
              scale: isInhaling ? 1.4 : isExhaling ? 0.9 : 1.2,
              opacity: isInhaling ? 0.45 : isExhaling ? 0.2 : 0.35
            }}
            transition={{ duration: currentPhase.duration, ease: 'easeInOut' }}
            className="absolute inset-0 m-auto w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-cyan-500/30 blur-3xl pointer-events-none"
          />

          {/* Expanding Orb */}
          <motion.div
            animate={{
              scale: isInhaling ? 1.3 : isExhaling ? 0.8 : 1.15
            }}
            transition={{ duration: currentPhase.duration, ease: 'easeInOut' }}
            className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 shadow-2xl flex flex-col items-center justify-center text-white p-4"
          >
            <span className="text-xs font-black uppercase tracking-widest text-cyan-100 opacity-80 mb-1">
              {currentPhase.name}
            </span>
            <span className="font-mono text-3xl sm:text-4xl font-black">
              {Math.ceil(phaseTimeLeft)}s
            </span>
          </motion.div>
        </div>

        {/* Phase Subtitle & Instructions */}
        <div className="max-w-md mb-8">
          <h2 className="font-display text-lg font-black text-white mb-1">
            {technique.name}
          </h2>
          <p className="text-xs text-slate-400">
            {technique.subtitle}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={resetSession}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            id="btn-toggle-breathing"
            onClick={toggleActive}
            className="py-3 px-8 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer active:scale-95"
          >
            {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isActive ? 'Pause Pacer' : 'Begin Breathing'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
