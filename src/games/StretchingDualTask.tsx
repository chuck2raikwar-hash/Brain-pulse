import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../lib/audio';
import { GameType } from '../types';
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Heart,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface StretchingDualTaskProps {
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

import { DualTaskItem, getRandomDualTaskQuestions } from './data/dualTaskQuestions';

interface StretchPose {
  title: string;
  targetArea: string;
  instructions: string;
}

const PHYSICAL_STRETCHES: StretchPose[] = [
  {
    title: 'Cervical Spine & Neck Lateral Release',
    targetArea: 'Upper Trapezius & Neck',
    instructions: 'Lower your right ear toward your right shoulder. Hold gently without forcing. Breathe rhythmically into the left side of your neck.'
  },
  {
    title: 'Shoulder & Pectoral Doorway Opener',
    targetArea: 'Chest & Postural Hygiene',
    instructions: 'Interlace your fingers behind your lower back or place elbows wide. Gently lift your knuckles and roll your shoulder blades together and downward.'
  },
  {
    title: 'Seated Thoracic Spine Twist',
    targetArea: 'Spinal Mobility & Ribcage',
    instructions: 'Sit tall. Place your right hand on your left knee and gently rotate your ribcage to the left. Look softly over your left shoulder.'
  },
  {
    title: 'Wrist Extensor & Forearm Release',
    targetArea: 'Wrists & Typing Relief',
    instructions: 'Extend your right arm straight out with palm down. Gently pull your fingers backward with your other hand to stretch forearm flexors.'
  },
  {
    title: 'Overhead Triceps & Lat Opener',
    targetArea: 'Triceps & Upper Back',
    instructions: 'Reach your right elbow up to the ceiling, bending the arm behind your head. Use your left hand to gently guide the elbow back.'
  },
  {
    title: 'Seated Hamstring & Sciatic Glide',
    targetArea: 'Hamstrings & Posterior Chain',
    instructions: 'Extend one leg forward with heel on the floor, toes pointing up. Hinge at your hips keeping a neutral spine until you feel a comfortable stretch.'
  },
  {
    title: 'Figure-4 Seated Piriformis Stretch',
    targetArea: 'Glutes & Hip Rotators',
    instructions: 'Cross your right ankle over your left knee in a figure-4 position. Sit tall and gently hinge forward from the hips with a flat back.'
  },
  {
    title: 'Eagle Arms Scapular Decompression',
    targetArea: 'Rhomboids & Scapula',
    instructions: 'Cross your right elbow under your left elbow, wrap your forearms, and press palms together. Lift elbows to shoulder height and breathe deep.'
  }
];

export const StretchingDualTask: React.FC<StretchingDualTaskProps> = ({ onGameOver, onExit }) => {
  const [dualQuestions] = useState<DualTaskItem[]>(() => getRandomDualTaskQuestions(10));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [taskScore, setTaskScore] = useState(0);
  const [completedStretches, setCompletedStretches] = useState<number[]>([]);

  const stretchPose = PHYSICAL_STRETCHES[currentIdx % PHYSICAL_STRETCHES.length];
  const dualTask = dualQuestions[currentIdx % dualQuestions.length];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSecondsLeft(30);
    setIsTimerActive(false);
    setSelectedOpt(null);
  }, [currentIdx]);

  useEffect(() => {
    if (!isTimerActive) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          sounds.playBowlChime();
          setIsTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive]);

  const handleOptionSelect = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);

    if (idx === dualTask.correctIndex) {
      sounds.playCorrect(3);
      setTaskScore(s => s + 150);
    } else {
      sounds.playMistake();
    }
  };

  const handleNextRoutine = () => {
    const nextCompleted = [...completedStretches, currentIdx];
    setCompletedStretches(nextCompleted);

    if (currentIdx + 1 < dualQuestions.length) {
      setCurrentIdx(c => c + 1);
    } else {
      sounds.playFanfare();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      onGameOver({
        gameType: 'stretching-dual',
        gameTitle: 'Stretching & Dual-Task Drills',
        score: taskScore + 400,
        accuracy: 100,
        level: dualQuestions.length,
        responseTimeMs: 0
      });
    }
  };

  return (
    <div id="stretching-dual-activity" className="max-w-4xl mx-auto space-y-6 text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Mind-Body Synchronization &bull; Routine {currentIdx + 1}/{dualQuestions.length} (Pool: 100 Tasks)
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-black text-slate-900">
              Stretching & Dual-Task Drills
            </h1>
          </div>
        </div>

        {/* Stretch Timer Display */}
        <div className="flex items-center gap-4 text-center">
          <div className="bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Stretch Hold</span>
            <span className="font-mono text-base font-black text-emerald-600 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {secondsLeft}s
            </span>
          </div>

          <button
            onClick={onExit}
            className="text-xs font-extrabold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Routine Detail Box */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column: Physical Stretch Pose */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Target: {stretchPose.targetArea}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                30s Hold
              </span>
            </div>

            <h2 className="font-display text-xl font-black text-slate-900">
              {stretchPose.title}
            </h2>

            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 text-xs text-slate-700 leading-relaxed space-y-2">
              <strong className="text-emerald-900 block font-bold">Posture Instructions:</strong>
              <p>{stretchPose.instructions}</p>
            </div>
          </div>

          {/* Timer Trigger */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                if (!isTimerActive) sounds.playBreathCue('inhale');
                setIsTimerActive(!isTimerActive);
              }}
              className="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
            >
              {isTimerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isTimerActive ? 'Pause Hold' : 'Start 30s Hold'}</span>
            </button>

            {secondsLeft === 0 && (
              <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Hold Complete!
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Simultaneous Dual Mental Challenge */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 inline-block">
              {dualTask.dualTaskTitle}
            </span>

            <h3 className="font-display text-base sm:text-lg font-black text-slate-900">
              {dualTask.dualTaskQuestion}
            </h3>
            <p className="text-xs text-slate-500">
              Solve this cognitive question while holding the physical posture steadily.
            </p>

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {dualTask.options.map((opt, i) => {
                const isSelected = selectedOpt === i;
                const isCorrect = i === dualTask.correctIndex;

                let btnStyle = 'bg-slate-50 border border-slate-200 hover:border-indigo-400 text-slate-800';
                if (selectedOpt !== null) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-500 border-emerald-600 text-white shadow-md';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-500 border-rose-600 text-white';
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(i)}
                    disabled={selectedOpt !== null}
                    className={`p-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer text-center ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Next Button */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleNextRoutine}
              className="py-3 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <span>{currentIdx + 1 < dualQuestions.length ? 'Next Pose' : 'Finish Routine'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
