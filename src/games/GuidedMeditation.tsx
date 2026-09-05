import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../lib/audio';
import { GameType } from '../types';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  CloudRain,
  Radio,
  Waves,
  CheckCircle2,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface GuidedMeditationProps {
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

type AmbientType = 'rain' | 'alpha' | 'ocean';

interface MeditationTrack {
  id: string;
  title: string;
  durationSeconds: number;
  description: string;
  steps: { time: number; prompt: string; tip: string }[];
}

const MEDITATION_TRACKS: MeditationTrack[] = [
  {
    id: 'deep-focus',
    title: 'Deep Focus Reset',
    durationSeconds: 120, // 2 minutes
    description: 'Quiet cognitive chatter, release working memory clutter, and center attentional bandwidth.',
    steps: [
      { time: 0, prompt: 'Soften your gaze or close your eyes. Allow your shoulders to drop away from your ears.', tip: 'Physical stillness promotes cognitive poise.' },
      { time: 25, prompt: 'Inhale deeply through your nose for 4 seconds... and exhale slowly through your mouth.', tip: 'Diaphragmatic breathing triggers parasympathetic activation.' },
      { time: 55, prompt: 'Notice the ambient soundscape. Let background audio anchor your present awareness.', tip: 'Continuous sound serves as a non-judgmental anchor.' },
      { time: 85, prompt: 'When distracting thoughts arise, acknowledge them softly and return to the breath.', tip: 'Returning your focus is the rep that builds attentional muscle.' },
      { time: 110, prompt: 'Gently bring your awareness back to the room. Feel clarity and renewed focus.', tip: 'Carry this centered awareness into your next challenge.' }
    ]
  },
  {
    id: 'stress-release',
    title: 'Cortisol & Stress Downregulation',
    durationSeconds: 90,
    description: 'Rapid physical scan and vagal stimulation to reduce heart rate and performance anxiety.',
    steps: [
      { time: 0, prompt: 'Place both feet flat on the floor. Take a long, slow inhalation.', tip: 'Grounding physical contact signals safety to the brainstem.' },
      { time: 20, prompt: 'Unclench your jaw and smooth the forehead muscles between your brows.', tip: 'Facial relaxation directly decreases amygdala hyperactivity.' },
      { time: 45, prompt: 'Lengthen your exhale to be twice as long as your inhale.', tip: 'Extended exhales stimulate acetylcholine release.' },
      { time: 75, prompt: 'Feel the quiet stillness expanding across your mind.', tip: 'Resting state networks are replenishing glucose stores.' }
    ]
  }
];

export const GuidedMeditation: React.FC<GuidedMeditationProps> = ({ onGameOver, onExit }) => {
  const [selectedTrackIdx, setSelectedTrackIdx] = useState(0);
  const track = MEDITATION_TRACKS[selectedTrackIdx];

  const [isPlaying, setIsPlaying] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [soundscape, setSoundscape] = useState<AmbientType>('alpha');
  const [soundMuted, setSoundMuted] = useState(false);
  const [completed, setCompleted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up ambient audio on unmount
  useEffect(() => {
    return () => {
      sounds.stopAmbient();
    };
  }, []);

  // Timer loop
  useEffect(() => {
    if (isPlaying && !completed) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed(s => {
          const next = s + 1;
          // Check if bell chime trigger
          if (next % 30 === 0 || next === track.durationSeconds) {
            sounds.playBowlChime();
          }

          if (next >= track.durationSeconds) {
            handleComplete();
            return track.durationSeconds;
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, completed, track.durationSeconds]);

  // Handle ambient sound playback
  useEffect(() => {
    if (isPlaying && !soundMuted) {
      sounds.startAmbient(soundscape);
    } else {
      sounds.stopAmbient();
    }
  }, [isPlaying, soundscape, soundMuted]);

  const togglePlay = () => {
    if (!isPlaying) {
      sounds.playBowlChime();
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSecondsElapsed(0);
    setCompleted(false);
    sounds.stopAmbient();
  };

  const handleComplete = () => {
    setIsPlaying(false);
    setCompleted(true);
    sounds.stopAmbient();
    sounds.playBowlChime();
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });

    setTimeout(() => {
      onGameOver({
        gameType: 'guided-meditation',
        gameTitle: `Guided Meditation (${track.title})`,
        score: 500,
        accuracy: 100,
        level: 1,
        responseTimeMs: 0
      });
    }, 1800);
  };

  // Find current active step
  const currentStep = track.steps
    .slice()
    .reverse()
    .find(st => secondsElapsed >= st.time) || track.steps[0];

  const progressPercent = Math.min(100, Math.round((secondsElapsed / track.durationSeconds) * 100));

  return (
    <div id="guided-meditation-session" className="max-w-4xl mx-auto space-y-6 text-slate-800">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                Mindfulness &bull; Neural Reset
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-black text-slate-900">
              Guided Meditation
            </h1>
          </div>
        </div>

        {/* Track Picker */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {MEDITATION_TRACKS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => {
                handleReset();
                setSelectedTrackIdx(idx);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                selectedTrackIdx === idx
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.title.split(' ')[0]} ({Math.round(t.durationSeconds / 60)}m)
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            sounds.stopAmbient();
            onExit();
          }}
          className="text-xs font-extrabold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors cursor-pointer"
        >
          Exit
        </button>
      </div>

      {/* Main Meditation Studio Card */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 flex flex-col items-center text-center relative overflow-hidden">
        {/* Animated Radial Pulse Rings */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center my-6">
          <motion.div
            animate={
              isPlaying
                ? { scale: [1, 1.35, 1], opacity: [0.2, 0.45, 0.2] }
                : { scale: 1, opacity: 0.15 }
            }
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 m-auto w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-sky-500/30 blur-2xl pointer-events-none"
          />

          <motion.div
            animate={
              isPlaying
                ? { scale: [1, 1.15, 1], rotate: [0, 180, 360] }
                : { scale: 1 }
            }
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="w-44 h-44 sm:w-52 sm:h-52 rounded-full border-2 border-dashed border-sky-400/40 flex items-center justify-center relative"
          >
            {/* Center Orb */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-sky-600 to-teal-400 shadow-2xl flex flex-col items-center justify-center text-white">
              <span className="font-mono text-xl sm:text-2xl font-black">
                {Math.floor((track.durationSeconds - secondsElapsed) / 60)}:
                {String((track.durationSeconds - secondsElapsed) % 60).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-100">
                {isPlaying ? 'ACTIVE' : 'PAUSED'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Current Prompt Display */}
        <div className="max-w-xl min-h-[90px] flex flex-col items-center justify-center mb-8 px-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep.prompt}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-base sm:text-xl font-display font-medium text-sky-100 leading-relaxed"
            >
              "{currentStep.prompt}"
            </motion.p>
          </AnimatePresence>
          <span className="text-xs text-sky-400/80 mt-2 font-medium">
            {currentStep.tip}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md h-2 bg-slate-800 rounded-full overflow-hidden mb-8 border border-slate-700/50">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-500 to-teal-400"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Media Playback Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            id="btn-toggle-meditation"
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 transition-all cursor-pointer active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-1" />
            )}
          </button>

          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
            title={soundMuted ? 'Unmute Ambient' : 'Mute Ambient'}
          >
            {soundMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Ambient Soundscapes Selector */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-3 flex-wrap justify-center text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            Soundscape:
          </span>
          <button
            onClick={() => setSoundscape('alpha')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              soundscape === 'alpha'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>10Hz Alpha Waves</span>
          </button>
          <button
            onClick={() => setSoundscape('rain')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              soundscape === 'rain'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Gentle Rain</span>
          </button>
          <button
            onClick={() => setSoundscape('ocean')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
              soundscape === 'ocean'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Ocean Tide</span>
          </button>
        </div>
      </div>
    </div>
  );
};
