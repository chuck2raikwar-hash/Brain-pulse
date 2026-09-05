import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GAME_MODES } from '../data/games';
import { GameType } from '../types';
import {
  Brain,
  Flame,
  Trophy,
  Zap,
  Target,
  Clock,
  Sparkles,
  ArrowRight,
  Play,
  Award,
  Swords,
  Users,
  Grid3X3,
  Binary,
  Repeat,
  Compass,
  Activity,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Radio,
  Eye,
  Puzzle,
  SpellCheck,
  Boxes,
  Headphones,
  Wind,
  BookOpen,
  Gauge
} from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardViewProps {
  onSelectGame: (gameId: GameType) => void;
  onNavigateTab: (tab: 'games' | 'pvp' | 'progress' | 'leaderboard') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectGame, onNavigateTab }) => {
  const { profile } = useAuth();

  const getRankTitle = (points: number = 100) => {
    if (points >= 3000) return 'Grandmaster Mind';
    if (points >= 2000) return 'Master Strategist';
    if (points >= 1200) return 'Advanced Athlete';
    if (points >= 600) return 'Focused Thinker';
    if (points >= 300) return 'Rising Brain';
    return 'Brain Explorer';
  };

  const gamesList = Object.values(GAME_MODES);

  const getGameAccent = (gameId: GameType) => {
    switch (gameId) {
      case 'memory-matrix':
        return {
          theme: 'emerald',
          bgLight: 'bg-emerald-50',
          border: 'border-emerald-200 hover:border-emerald-400',
          badgeBg: 'bg-emerald-100 text-emerald-800',
          btnBg: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25',
          iconBg: 'bg-emerald-600 text-white',
          accentText: 'text-emerald-600',
          icon: Grid3X3
        };
      case 'color-confusion':
        return {
          theme: 'amber',
          bgLight: 'bg-amber-50',
          border: 'border-amber-200 hover:border-amber-400',
          badgeBg: 'bg-amber-100 text-amber-800',
          btnBg: 'bg-amber-500 hover:bg-amber-400 text-white shadow-md shadow-amber-500/25',
          iconBg: 'bg-amber-500 text-white',
          accentText: 'text-amber-600',
          icon: Zap
        };
      case 'number-recall':
        return {
          theme: 'indigo',
          bgLight: 'bg-indigo-50',
          border: 'border-indigo-200 hover:border-indigo-400',
          badgeBg: 'bg-indigo-100 text-indigo-800',
          btnBg: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25',
          iconBg: 'bg-indigo-600 text-white',
          accentText: 'text-indigo-600',
          icon: Binary
        };
      case 'n-back':
        return {
          theme: 'cyan',
          bgLight: 'bg-cyan-50',
          border: 'border-cyan-300 hover:border-cyan-500',
          badgeBg: 'bg-cyan-100 text-cyan-900',
          btnBg: 'bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold shadow-md shadow-cyan-500/25',
          iconBg: 'bg-cyan-600 text-white',
          accentText: 'text-cyan-700',
          icon: Repeat
        };
      case 'matching-cards':
        return {
          theme: 'teal',
          bgLight: 'bg-teal-50',
          border: 'border-teal-200 hover:border-teal-400',
          badgeBg: 'bg-teal-100 text-teal-800',
          btnBg: 'bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/25',
          iconBg: 'bg-teal-600 text-white',
          accentText: 'text-teal-600',
          icon: Layers
        };
      case 'recall-sequence':
        return {
          theme: 'violet',
          bgLight: 'bg-violet-50',
          border: 'border-violet-200 hover:border-violet-400',
          badgeBg: 'bg-violet-100 text-violet-800',
          btnBg: 'bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/25',
          iconBg: 'bg-violet-600 text-white',
          accentText: 'text-violet-600',
          icon: Radio
        };
      case 'distraction-task':
        return {
          theme: 'rose',
          bgLight: 'bg-rose-50',
          border: 'border-rose-200 hover:border-rose-400',
          badgeBg: 'bg-rose-100 text-rose-800',
          btnBg: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/25',
          iconBg: 'bg-rose-600 text-white',
          accentText: 'text-rose-600',
          icon: Eye
        };
      case 'logic-puzzles':
        return {
          theme: 'blue',
          bgLight: 'bg-blue-50',
          border: 'border-blue-200 hover:border-blue-400',
          badgeBg: 'bg-blue-100 text-blue-800',
          btnBg: 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25',
          iconBg: 'bg-blue-600 text-white',
          accentText: 'text-blue-600',
          icon: Puzzle
        };
      case 'word-games':
        return {
          theme: 'emerald',
          bgLight: 'bg-emerald-50',
          border: 'border-emerald-200 hover:border-emerald-400',
          badgeBg: 'bg-emerald-100 text-emerald-800',
          btnBg: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25',
          iconBg: 'bg-emerald-600 text-white',
          accentText: 'text-emerald-600',
          icon: SpellCheck
        };
      case 'pattern-recognition':
        return {
          theme: 'fuchsia',
          bgLight: 'bg-fuchsia-50',
          border: 'border-fuchsia-200 hover:border-fuchsia-400',
          badgeBg: 'bg-fuchsia-100 text-fuchsia-800',
          btnBg: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-md shadow-fuchsia-600/25',
          iconBg: 'bg-fuchsia-600 text-white',
          accentText: 'text-fuchsia-600',
          icon: Boxes
        };
      case 'guided-meditation':
        return {
          theme: 'sky',
          bgLight: 'bg-sky-50',
          border: 'border-sky-200 hover:border-sky-400',
          badgeBg: 'bg-sky-100 text-sky-800',
          btnBg: 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/25',
          iconBg: 'bg-sky-600 text-white',
          accentText: 'text-sky-600',
          icon: Headphones
        };
      case 'breathing-pacer':
        return {
          theme: 'cyan',
          bgLight: 'bg-cyan-50',
          border: 'border-cyan-200 hover:border-cyan-400',
          badgeBg: 'bg-cyan-100 text-cyan-800',
          btnBg: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/25',
          iconBg: 'bg-cyan-600 text-white',
          accentText: 'text-cyan-600',
          icon: Wind
        };
      case 'journaling-prompts':
        return {
          theme: 'amber',
          bgLight: 'bg-amber-50',
          border: 'border-amber-200 hover:border-amber-400',
          badgeBg: 'bg-amber-100 text-amber-800',
          btnBg: 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/25',
          iconBg: 'bg-amber-600 text-white',
          accentText: 'text-amber-600',
          icon: BookOpen
        };
      case 'reaction-drill':
        return {
          theme: 'red',
          bgLight: 'bg-red-50',
          border: 'border-red-200 hover:border-red-400',
          badgeBg: 'bg-red-100 text-red-800',
          btnBg: 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/25',
          iconBg: 'bg-red-600 text-white',
          accentText: 'text-red-600',
          icon: Gauge
        };
      case 'stretching-dual':
        return {
          theme: 'teal',
          bgLight: 'bg-teal-50',
          border: 'border-teal-200 hover:border-teal-400',
          badgeBg: 'bg-teal-100 text-teal-800',
          btnBg: 'bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/25',
          iconBg: 'bg-teal-600 text-white',
          accentText: 'text-teal-600',
          icon: Activity
        };
      default:
        return {
          theme: 'blue',
          bgLight: 'bg-blue-50',
          border: 'border-blue-200 hover:border-blue-400',
          badgeBg: 'bg-blue-100 text-blue-800',
          btnBg: 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25',
          iconBg: 'bg-blue-600 text-white',
          accentText: 'text-blue-600',
          icon: Brain
        };
    }
  };

  return (
    <div id="dashboard-hub" className="space-y-10 animate-in fade-in duration-300 text-slate-800">
      {/* Top Split Hero Section */}
      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Standings Block */}
        <aside className="lg:col-span-4 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
          {/* Playful background glow corner */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-cyan-400/20 via-blue-400/10 to-transparent rounded-bl-full pointer-events-none" />

          <section className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                Brain Fitness Index
              </span>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">
                Tier {profile?.brainPowerScore && profile.brainPowerScore > 1000 ? 'Pro' : 'Active'}
              </span>
            </div>

            <div>
              <h1 className="font-display text-5xl sm:text-6xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
                {profile?.brainPowerScore ? profile.brainPowerScore.toLocaleString() : '100'}
                <span className="text-base font-bold text-slate-400 tracking-normal font-sans">PTS</span>
              </h1>
              <div className="text-sm font-bold text-cyan-600 mt-1 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-cyan-500" />
                {getRankTitle(profile?.brainPowerScore)}
              </div>
            </div>

            <div className="mt-8 space-y-4 pt-6 border-t border-slate-100">
              {/* Daily Streak Card */}
              <div className="p-3.5 bg-orange-50/80 border border-orange-200/70 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-sm shadow-orange-500/20">
                    <Flame className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 block">
                      Daily Streak
                    </span>
                    <span className="text-lg font-extrabold text-slate-900">
                      {profile?.dailyStreak || 1} Days Active
                    </span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-orange-700 bg-white px-2.5 py-1 rounded-full border border-orange-200">
                  🔥 On Fire
                </span>
              </div>

              {/* Total Games Played */}
              <div className="p-3.5 bg-cyan-50/80 border border-cyan-200/70 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500 text-white flex items-center justify-center shadow-sm shadow-cyan-500/20">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700 block">
                      Completed Workouts
                    </span>
                    <span className="text-lg font-extrabold text-slate-900">
                      {profile?.totalGamesPlayed || 0} Sessions
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="pt-6 border-t border-slate-100 mt-6 relative z-10">
            <button
              id="btn-quick-play-recommended"
              onClick={() => onSelectGame('memory-matrix')}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-lime-500 hover:opacity-95 active:scale-[0.98] text-white text-xs font-extrabold tracking-wider uppercase rounded-2xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Daily Workout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </footer>
        </aside>

        {/* Right Welcome & Performance Summary */}
        <div className="lg:col-span-8 flex flex-col justify-between gap-6">
          {/* Welcome Letterhead */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
            {/* Playful background gradient ribbon */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-cyan-400 via-lime-400 to-orange-500" />

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-extrabold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
                  Ready to Train ⚡
                </span>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-500" />
                  Synced to Cloud
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                Hey {profile?.displayName || 'Brain Athlete'}! Ready for a quick mental boost?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
                Challenge your working memory, reaction speed, pattern matching, and focus with scientifically-proven micro-games.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 mt-6 border-t border-slate-100">
              <div className="bg-cyan-50/60 p-3.5 rounded-2xl border border-cyan-100 text-center sm:text-left">
                <span className="text-[10px] font-extrabold uppercase text-cyan-700 tracking-wider block">Working Memory</span>
                <span className="font-display text-xl sm:text-2xl font-black text-cyan-900">
                  {profile && profile.totalGamesPlayed > 0
                    ? `${profile.peakMemoryAccuracy || 0}%`
                    : '--'}
                </span>
              </div>
              <div className="bg-orange-50/60 p-3.5 rounded-2xl border border-orange-100 text-center sm:text-left">
                <span className="text-[10px] font-extrabold uppercase text-orange-700 tracking-wider block">Reaction Speed</span>
                <span className="font-display text-xl sm:text-2xl font-black text-orange-900">
                  {profile && profile.totalGamesPlayed > 0 && profile.peakReactionTimeMs
                    ? `${profile.peakReactionTimeMs}ms`
                    : '--'}
                </span>
              </div>
              <div className="bg-lime-50/60 p-3.5 rounded-2xl border border-lime-100 text-center sm:text-left">
                <span className="text-[10px] font-extrabold uppercase text-lime-800 tracking-wider block">Focus Score</span>
                <span className="font-display text-xl sm:text-2xl font-black text-lime-950">
                  {profile && profile.totalGamesPlayed > 0
                    ? profile.peakFocusScore.toLocaleString()
                    : '100 PTS'}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Analytics Preview */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-blue-600 block mb-0.5">
                  Live Stats
                </span>
                <h3 className="font-display text-xl font-black text-slate-900">Activity Overview</h3>
              </div>
              <button
                onClick={() => onNavigateTab('progress')}
                className="text-xs font-extrabold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200/80 flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>Full Telemetry</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Playful Colorful Bar Graph */}
            <div className="flex items-end justify-between h-28 gap-2.5 sm:gap-4 pt-2 px-2 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex-1 flex flex-col items-center gap-1 group h-full justify-end pb-2">
                <div className="w-full bg-cyan-400 rounded-lg h-[45%] group-hover:bg-cyan-500 transition-colors shadow-xs"></div>
                <span className="text-[9px] font-bold text-slate-400">Mon</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 group h-full justify-end pb-2">
                <div className="w-full bg-blue-500 rounded-lg h-[65%] group-hover:bg-blue-600 transition-colors shadow-xs"></div>
                <span className="text-[9px] font-bold text-slate-400">Tue</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 group h-full justify-end pb-2">
                <div className="w-full bg-lime-400 rounded-lg h-[55%] group-hover:bg-lime-500 transition-colors shadow-xs"></div>
                <span className="text-[9px] font-bold text-slate-400">Wed</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 group h-full justify-end pb-2">
                <div className="w-full bg-orange-400 rounded-lg h-[85%] group-hover:bg-orange-500 transition-colors shadow-xs"></div>
                <span className="text-[9px] font-bold text-slate-400">Thu</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 group h-full justify-end pb-2">
                <div className="w-full bg-cyan-400 rounded-lg h-[50%] group-hover:bg-cyan-500 transition-colors shadow-xs"></div>
                <span className="text-[9px] font-bold text-slate-400">Fri</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 group h-full justify-end pb-2">
                <div className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-lg h-[95%] shadow-sm shadow-blue-500/20"></div>
                <span className="text-[9px] font-extrabold text-blue-600">Sat</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 group h-full justify-end pb-2">
                <div className="w-full bg-lime-400 rounded-lg h-[70%] group-hover:bg-lime-500 transition-colors shadow-xs"></div>
                <span className="text-[9px] font-bold text-slate-400">Sun</span>
              </div>
            </div>

            <div className="flex justify-between border-t border-slate-100 pt-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                <span className="font-medium text-slate-600">
                  Accuracy:{' '}
                  <strong className="text-slate-900 font-extrabold">
                    {profile && profile.totalGamesPlayed > 0 && profile.peakMemoryAccuracy
                      ? `${profile.peakMemoryAccuracy}%`
                      : 'Calibrating'}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
                <span className="font-medium text-slate-600">
                  Avg Speed:{' '}
                  <strong className="text-slate-900 font-extrabold">
                    {profile && profile.totalGamesPlayed > 0 && profile.peakReactionTimeMs
                      ? `${profile.peakReactionTimeMs}ms`
                      : '--'}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-lime-500"></span>
                <span className="font-medium text-slate-600">
                  Rank:{' '}
                  <strong className="text-slate-900 font-extrabold">
                    {profile && profile.totalGamesPlayed > 0
                      ? getRankTitle(profile.brainPowerScore)
                      : 'New Athlete'}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PvP Multiplayer Callout Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-black uppercase tracking-wider border border-blue-400/30">
            <Swords className="w-3.5 h-3.5 text-cyan-400" />
            <span>New: Real-Time PvP Battles</span>
          </div>
          <h3 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white">
            Compete in 1v1, 2v2, 3v3, 4v4 &amp; 5v5 Squad Wars
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium">
            Vote on any of the 14 games with players in real-time, then race through a high-stakes 2-minute score sprint.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('pvp')}
          className="relative z-10 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-display font-black text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 cursor-pointer shrink-0"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Enter PvP Arena</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Training Regimen Grid Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-xs font-extrabold tracking-wider uppercase text-cyan-600 block mb-0.5">
              15 Brain-Training Games & Drills
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-900">Featured Regimen</h2>
          </div>
          <button
            onClick={() => onNavigateTab('games')}
            className="text-xs font-extrabold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl border border-blue-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore All 15 Drills</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gamesList.map((game, idx) => {
            const userHighScore = profile?.highScores?.[game.id] || 0;
            const accent = getGameAccent(game.id);
            const IconComponent = accent.icon;

            return (
              <div
                key={game.id}
                onClick={() => onSelectGame(game.id)}
                className={`group cursor-pointer rounded-3xl p-6 sm:p-7 bg-white border ${accent.border} hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between relative overflow-hidden`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl ${accent.iconBg} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${accent.badgeBg} inline-block`}>
                          {game.domain}
                        </span>
                        <div className="text-xs font-bold text-slate-400 mt-0.5">
                          {game.difficulty} &bull; {game.estimatedTime}
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-display text-2xl font-extrabold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {game.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">High Score</span>
                    <span className={`font-mono text-lg font-black ${accent.accentText}`}>
                      {userHighScore.toLocaleString()} PTS
                    </span>
                  </div>

                  <button
                    className={`py-2 px-5 rounded-xl ${accent.btnBg} text-xs font-extrabold tracking-wider uppercase flex items-center gap-1.5 transition-all`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Now</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
