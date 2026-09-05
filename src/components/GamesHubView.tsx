import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GAME_MODES } from '../data/games';
import { GameType, ActivityCategory } from '../types';
import {
  Brain,
  Grid3X3,
  Zap,
  Binary,
  Repeat,
  Layers,
  Radio,
  Eye,
  Puzzle,
  SpellCheck,
  Boxes,
  Headphones,
  Wind,
  BookOpen,
  Gauge,
  Activity,
  Play,
  Clock,
  CheckCircle2,
  Lightbulb,
  Trophy,
  Filter,
  Sparkles,
  ArrowRight,
  Lock,
  Crown
} from 'lucide-react';
import { motion } from 'motion/react';

interface GamesHubViewProps {
  onSelectGame: (gameId: GameType) => void;
}

export const GamesHubView: React.FC<GamesHubViewProps> = ({ onSelectGame }) => {
  const { profile, user, canUserPlay } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const access = canUserPlay();
  const isLocked = !access.canPlay;

  const gamesList = Object.values(GAME_MODES);

  const filteredGames = selectedCategory === 'all'
    ? gamesList
    : gamesList.filter(g => g.activityCategory === selectedCategory);

  const categories: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'All Activities', count: gamesList.length },
    {
      id: 'Cognitive & Puzzles',
      label: 'Cognitive & Puzzles',
      count: gamesList.filter(g => g.activityCategory === 'Cognitive & Puzzles').length
    },
    {
      id: 'Memory & Attention',
      label: 'Memory & Attention',
      count: gamesList.filter(g => g.activityCategory === 'Memory & Attention').length
    },
    {
      id: 'Mindfulness & Relaxation',
      label: 'Mindfulness & Relaxation',
      count: gamesList.filter(g => g.activityCategory === 'Mindfulness & Relaxation').length
    },
    {
      id: 'Physical & Dual-Task',
      label: 'Physical & Dual-Task',
      count: gamesList.filter(g => g.activityCategory === 'Physical & Dual-Task').length
    }
  ];

  const getGameAccent = (gameId: GameType) => {
    switch (gameId) {
      case 'memory-matrix':
        return {
          border: 'border-emerald-200',
          bgLight: 'bg-emerald-50/70',
          badgeBg: 'bg-emerald-100 text-emerald-800',
          btnBg: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25',
          iconBg: 'bg-emerald-600 text-white',
          accentText: 'text-emerald-600',
          tipBg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          icon: Grid3X3
        };
      case 'color-confusion':
        return {
          border: 'border-amber-200',
          bgLight: 'bg-amber-50/70',
          badgeBg: 'bg-amber-100 text-amber-800',
          btnBg: 'bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-500/25',
          iconBg: 'bg-amber-500 text-white',
          accentText: 'text-amber-600',
          tipBg: 'bg-amber-50 border-amber-200 text-amber-900',
          icon: Zap
        };
      case 'number-recall':
        return {
          border: 'border-indigo-200',
          bgLight: 'bg-indigo-50/70',
          badgeBg: 'bg-indigo-100 text-indigo-800',
          btnBg: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25',
          iconBg: 'bg-indigo-600 text-white',
          accentText: 'text-indigo-600',
          tipBg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
          icon: Binary
        };
      case 'n-back':
        return {
          border: 'border-cyan-200',
          bgLight: 'bg-cyan-50/70',
          badgeBg: 'bg-cyan-100 text-cyan-900',
          btnBg: 'bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold shadow-lg shadow-cyan-500/25',
          iconBg: 'bg-cyan-600 text-white',
          accentText: 'text-cyan-700',
          tipBg: 'bg-cyan-50 border-cyan-200 text-cyan-950',
          icon: Repeat
        };
      case 'matching-cards':
        return {
          border: 'border-teal-200',
          bgLight: 'bg-teal-50/70',
          badgeBg: 'bg-teal-100 text-teal-800',
          btnBg: 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/25',
          iconBg: 'bg-teal-600 text-white',
          accentText: 'text-teal-600',
          tipBg: 'bg-teal-50 border-teal-200 text-teal-900',
          icon: Layers
        };
      case 'recall-sequence':
        return {
          border: 'border-violet-200',
          bgLight: 'bg-violet-50/70',
          badgeBg: 'bg-violet-100 text-violet-800',
          btnBg: 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/25',
          iconBg: 'bg-violet-600 text-white',
          accentText: 'text-violet-600',
          tipBg: 'bg-violet-50 border-violet-200 text-violet-900',
          icon: Radio
        };
      case 'distraction-task':
        return {
          border: 'border-rose-200',
          bgLight: 'bg-rose-50/70',
          badgeBg: 'bg-rose-100 text-rose-800',
          btnBg: 'bg-rose-500 hover:bg-rose-400 text-white shadow-lg shadow-rose-500/25',
          iconBg: 'bg-rose-500 text-white',
          accentText: 'text-rose-600',
          tipBg: 'bg-rose-50 border-rose-200 text-rose-900',
          icon: Eye
        };
      case 'logic-puzzles':
        return {
          border: 'border-blue-200',
          bgLight: 'bg-blue-50/70',
          badgeBg: 'bg-blue-100 text-blue-800',
          btnBg: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25',
          iconBg: 'bg-blue-600 text-white',
          accentText: 'text-blue-600',
          tipBg: 'bg-blue-50 border-blue-200 text-blue-900',
          icon: Puzzle
        };
      case 'word-games':
        return {
          border: 'border-emerald-200',
          bgLight: 'bg-emerald-50/70',
          badgeBg: 'bg-emerald-100 text-emerald-800',
          btnBg: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25',
          iconBg: 'bg-emerald-600 text-white',
          accentText: 'text-emerald-600',
          tipBg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          icon: SpellCheck
        };
      case 'pattern-recognition':
        return {
          border: 'border-fuchsia-200',
          bgLight: 'bg-fuchsia-50/70',
          badgeBg: 'bg-fuchsia-100 text-fuchsia-800',
          btnBg: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-600/25',
          iconBg: 'bg-fuchsia-600 text-white',
          accentText: 'text-fuchsia-600',
          tipBg: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-900',
          icon: Boxes
        };
      case 'guided-meditation':
        return {
          border: 'border-sky-200',
          bgLight: 'bg-sky-50/70',
          badgeBg: 'bg-sky-100 text-sky-800',
          btnBg: 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/25',
          iconBg: 'bg-sky-600 text-white',
          accentText: 'text-sky-600',
          tipBg: 'bg-sky-50 border-sky-200 text-sky-900',
          icon: Headphones
        };
      case 'breathing-pacer':
        return {
          border: 'border-cyan-200',
          bgLight: 'bg-cyan-50/70',
          badgeBg: 'bg-cyan-100 text-cyan-800',
          btnBg: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/25',
          iconBg: 'bg-cyan-600 text-white',
          accentText: 'text-cyan-600',
          tipBg: 'bg-cyan-50 border-cyan-200 text-cyan-900',
          icon: Wind
        };
      case 'journaling-prompts':
        return {
          border: 'border-amber-200',
          bgLight: 'bg-amber-50/70',
          badgeBg: 'bg-amber-100 text-amber-800',
          btnBg: 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/25',
          iconBg: 'bg-amber-600 text-white',
          accentText: 'text-amber-600',
          tipBg: 'bg-amber-50 border-amber-200 text-amber-900',
          icon: BookOpen
        };
      case 'reaction-drill':
        return {
          border: 'border-red-200',
          bgLight: 'bg-red-50/70',
          badgeBg: 'bg-red-100 text-red-800',
          btnBg: 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/25',
          iconBg: 'bg-red-600 text-white',
          accentText: 'text-red-600',
          tipBg: 'bg-red-50 border-red-200 text-red-900',
          icon: Gauge
        };
      case 'stretching-dual':
      default:
        return {
          border: 'border-emerald-200',
          bgLight: 'bg-emerald-50/70',
          badgeBg: 'bg-emerald-100 text-emerald-800',
          btnBg: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25',
          iconBg: 'bg-emerald-600 text-white',
          accentText: 'text-emerald-600',
          tipBg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          icon: Activity
        };
    }
  };

  return (
    <div id="games-hub-view" className="space-y-8 animate-in fade-in duration-300 text-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-extrabold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1">
              <Brain className="w-3.5 h-3.5" />
              <span>BrainPulse Cognitive & Wellness Suite</span>
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900">
            Brain Activities & Drills
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Choose from science-backed cognitive workouts, deductive puzzles, mindfulness audio resets, and dual-task neuromuscular drills.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span>{c.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                selectedCategory === c.id ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-500'
              }`}>
                {c.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Games Cards Detailed Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGames.map((game) => {
          const highScore = profile?.highScores?.[game.id] || 0;
          const plays = profile?.gamesPlayedCount?.[game.id] || 0;
          const accent = getGameAccent(game.id);
          const IconComponent = accent.icon;

          return (
            <div
              key={game.id}
              className={`bg-white border ${accent.border} rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all relative overflow-hidden`}
            >
              <div>
                {/* Title & Difficulty Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${accent.iconBg} flex items-center justify-center shadow-md shrink-0`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${accent.badgeBg}`}>
                          {game.domain}
                        </span>
                        {isLocked && access.reason === 'trial_expired' && (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            <span>Pro</span>
                          </span>
                        )}
                        {!user && (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            7d Trial
                          </span>
                        )}
                      </div>
                      <h2 className="font-display text-lg sm:text-xl font-black text-slate-900 mt-1 leading-tight">
                        {game.name}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-extrabold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    {game.difficulty}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    &bull; {game.estimatedTime}
                  </span>
                  {game.activityCategory && (
                    <span className="text-[10px] font-medium text-slate-400">
                      &bull; {game.activityCategory}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2">
                  {game.description}
                </p>

                {/* Protocol Rules Checklist */}
                <div className={`${accent.bgLight} rounded-2xl border ${accent.border} p-3.5 mb-3 space-y-1.5`}>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">How It Works</div>
                  {game.rules.slice(0, 2).map((rule, rIdx) => (
                    <div key={rIdx} className="flex items-start gap-1.5 text-xs text-slate-700">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${accent.accentText} mt-0.5`} />
                      <span className="leading-snug text-[11px]">{rule}</span>
                    </div>
                  ))}
                </div>

                {/* Cognitive Strategy Tip */}
                <div className={`p-2.5 rounded-xl border ${accent.tipBg} text-[11px] flex items-start gap-1.5 mb-4`}>
                  <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <div className="line-clamp-2">
                    <strong className="font-bold">Tip: </strong>
                    <span>{game.tips}</span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-[9px] font-bold uppercase text-slate-400 block">Best</span>
                    <span className={`font-mono text-sm font-extrabold ${accent.accentText}`}>
                      {highScore.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase text-slate-400 block">Sessions</span>
                    <span className="font-mono text-sm font-extrabold text-slate-700">{plays}</span>
                  </div>
                </div>

                <button
                  id={`hub-play-${game.id}`}
                  onClick={() => onSelectGame(game.id)}
                  className={`py-2.5 px-5 rounded-2xl ${
                    isLocked && access.reason === 'trial_expired'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20'
                      : !user
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white shadow-md shadow-blue-500/20'
                      : accent.btnBg
                  } text-xs font-extrabold tracking-wider uppercase flex items-center gap-1.5 cursor-pointer transition-all active:scale-95`}
                >
                  {isLocked && access.reason === 'trial_expired' ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock</span>
                    </>
                  ) : !user ? (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play (Trial)</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

