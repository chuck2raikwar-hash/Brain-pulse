import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GameType } from '../types';
import {
  Grid3X3,
  Zap,
  Eye,
  Repeat,
  Binary,
  Layers,
  Radio,
  Puzzle,
  SpellCheck,
  Boxes,
  Headphones,
  Wind,
  BookOpen,
  Activity,
  Search,
  Trophy,
  Clock,
  Flame,
  Lock,
  X
} from 'lucide-react';

interface GamesHubViewProps {
  onSelectGame: (gameId: GameType) => void;
}

interface GameCardItem {
  id: GameType;
  title: string;
  categoryTag: string;
  categoryTagColor: string;
  iconBg: string;
  icon: React.ElementType;
  description: string;
  defaultScore: number | string;
  duration: string;
  difficulty: string;
  filterBucket: 'memory' | 'speed' | 'attention' | 'flexibility' | 'logic' | 'calm';
}

const GAMES_LIST: GameCardItem[] = [
  {
    id: 'memory-matrix',
    title: 'Memory Matrix',
    categoryTag: 'Memory',
    categoryTagColor: 'text-blue-600',
    iconBg: 'bg-blue-100 text-blue-600',
    icon: Grid3X3,
    description: 'Memorize flashing pattern grid positions',
    defaultScore: 1250,
    duration: '45s',
    difficulty: 'Moderate',
    filterBucket: 'memory'
  },
  {
    id: 'reaction-drill',
    title: 'Reaction Speed Drill',
    categoryTag: 'Speed',
    categoryTagColor: 'text-amber-600',
    iconBg: 'bg-amber-100 text-amber-600',
    icon: Zap,
    description: 'React instantly when the light turns green',
    defaultScore: 920,
    duration: '30s',
    difficulty: 'Moderate',
    filterBucket: 'speed'
  },
  {
    id: 'color-confusion',
    title: 'Color Confusion (Stroop)',
    categoryTag: 'Attention',
    categoryTagColor: 'text-cyan-600',
    iconBg: 'bg-cyan-100 text-cyan-600',
    icon: Eye,
    description: 'Overcome cognitive Stroop interference',
    defaultScore: 1400,
    duration: '45s',
    difficulty: 'High',
    filterBucket: 'attention'
  },
  {
    id: 'n-back',
    title: 'Pattern Match (2-Back)',
    categoryTag: 'Flexibility',
    categoryTagColor: 'text-purple-600',
    iconBg: 'bg-purple-100 text-purple-600',
    icon: Repeat,
    description: 'Track and recall shapes from 2 steps prior',
    defaultScore: 880,
    duration: '45s',
    difficulty: 'High',
    filterBucket: 'flexibility'
  },
  {
    id: 'number-recall',
    title: 'Number Recall',
    categoryTag: 'Memory',
    categoryTagColor: 'text-blue-600',
    iconBg: 'bg-blue-100 text-blue-600',
    icon: Binary,
    description: 'Hold expanding digit sequences in memory',
    defaultScore: 1100,
    duration: '45s',
    difficulty: 'Progressive',
    filterBucket: 'memory'
  },
  {
    id: 'matching-cards',
    title: 'Matching Cards',
    categoryTag: 'Memory',
    categoryTagColor: 'text-teal-600',
    iconBg: 'bg-teal-100 text-teal-600',
    icon: Layers,
    description: 'Find matching icon pairs in minimum moves',
    defaultScore: 1350,
    duration: '60s',
    difficulty: 'Moderate',
    filterBucket: 'memory'
  },
  {
    id: 'recall-sequence',
    title: 'Recall Sequences (Simon)',
    categoryTag: 'Memory',
    categoryTagColor: 'text-violet-600',
    iconBg: 'bg-violet-100 text-violet-600',
    icon: Radio,
    description: 'Audiovisual harmonic pattern replay',
    defaultScore: 1050,
    duration: '45s',
    difficulty: 'Progressive',
    filterBucket: 'memory'
  },
  {
    id: 'distraction-task',
    title: 'Distraction Search',
    categoryTag: 'Attention',
    categoryTagColor: 'text-rose-600',
    iconBg: 'bg-rose-100 text-rose-600',
    icon: Eye,
    description: 'Spot targets under visual interference & noise',
    defaultScore: 980,
    duration: '45s',
    difficulty: 'High',
    filterBucket: 'attention'
  },
  {
    id: 'logic-puzzles',
    title: 'Logic Puzzles (Sudoku)',
    categoryTag: 'Logic',
    categoryTagColor: 'text-indigo-600',
    iconBg: 'bg-indigo-100 text-indigo-600',
    icon: Puzzle,
    description: 'Mini-Sudoku sprints & deductive grid reasoning',
    defaultScore: 1500,
    duration: '3m',
    difficulty: 'High',
    filterBucket: 'logic'
  },
  {
    id: 'word-games',
    title: 'Word Games (Anagrams)',
    categoryTag: 'Language',
    categoryTagColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100 text-emerald-600',
    icon: SpellCheck,
    description: 'Unscramble anagrams & test vocabulary precision',
    defaultScore: 1200,
    duration: '2m',
    difficulty: 'Adaptive',
    filterBucket: 'logic'
  },
  {
    id: 'pattern-recognition',
    title: 'Pattern Recognition',
    categoryTag: 'Flexibility',
    categoryTagColor: 'text-fuchsia-600',
    iconBg: 'bg-fuchsia-100 text-fuchsia-600',
    icon: Boxes,
    description: 'Find the missing step in progressive sequences',
    defaultScore: 1300,
    duration: '2m',
    difficulty: 'High',
    filterBucket: 'flexibility'
  },
  {
    id: 'guided-meditation',
    title: 'Guided Meditation',
    categoryTag: 'Calm',
    categoryTagColor: 'text-sky-600',
    iconBg: 'bg-sky-100 text-sky-600',
    icon: Headphones,
    description: 'Attentional reset & restorative ambient audio',
    defaultScore: 'Zen',
    duration: '3m',
    difficulty: 'Mindful',
    filterBucket: 'calm'
  },
  {
    id: 'breathing-pacer',
    title: 'Breathing Exercises (Pacer)',
    categoryTag: 'Calm',
    categoryTagColor: 'text-cyan-600',
    iconBg: 'bg-cyan-100 text-cyan-600',
    icon: Wind,
    description: 'Box breathing & vagal resonance orb pacer',
    defaultScore: 'Zen',
    duration: '2m',
    difficulty: 'Mindful',
    filterBucket: 'calm'
  },
  {
    id: 'journaling-prompts',
    title: 'Journaling & Reflection',
    categoryTag: 'Mindset',
    categoryTagColor: 'text-amber-600',
    iconBg: 'bg-amber-100 text-amber-600',
    icon: BookOpen,
    description: 'Metacognitive prompts for mental resilience',
    defaultScore: 'Reflect',
    duration: '3m',
    difficulty: 'Mindful',
    filterBucket: 'calm'
  },
  {
    id: 'stretching-dual',
    title: 'Stretching Dual-Task',
    categoryTag: 'Mind-Body',
    categoryTagColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100 text-emerald-600',
    icon: Activity,
    description: 'Physical poses with simultaneous mental math',
    defaultScore: 'Sync',
    duration: '3m',
    difficulty: 'Adaptive',
    filterBucket: 'speed'
  }
];

export const GamesHubView: React.FC<GamesHubViewProps> = ({ onSelectGame }) => {
  const { profile, canUserPlay, openPaywall } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const access = canUserPlay();
  const isLocked = !access.canPlay;

  const filterChips = [
    { id: 'all', label: `All Games (${GAMES_LIST.length})` },
    { id: 'memory', label: '🧠 Memory' },
    { id: 'speed', label: '⚡ Speed' },
    { id: 'attention', label: '🎯 Attention' },
    { id: 'flexibility', label: '🔄 Flexibility' },
    { id: 'logic', label: '🧩 Logic' },
    { id: 'calm', label: '🧘 Calm' }
  ];

  const filteredGames = GAMES_LIST.filter(game => {
    const matchesFilter = selectedFilter === 'all' || game.filterBucket === selectedFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query ||
      game.title.toLowerCase().includes(query) ||
      game.description.toLowerCase().includes(query) ||
      game.categoryTag.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  return (
    <div id="games-hub-view" className="space-y-4 text-slate-800 max-w-3xl mx-auto pb-6">
      {/* 1. Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <input
          id="games-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search drills, games, exercises..."
          className="w-full pl-11 pr-10 py-3 bg-slate-200/75 hover:bg-slate-200 focus:bg-white text-slate-900 placeholder:text-slate-500 rounded-full text-xs sm:text-sm font-medium border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-300 hover:bg-slate-400 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 2. Horizontal Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5" style={{ scrollbarWidth: 'none' }}>
        {filterChips.map(chip => {
          const isActive = selectedFilter === chip.id;
          return (
            <button
              key={chip.id}
              id={`filter-chip-${chip.id}`}
              onClick={() => setSelectedFilter(chip.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-200/70 hover:bg-slate-200 text-slate-700 font-medium'
              }`}
            >
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Spacious Organized Games List */}
      <div className="space-y-3 pt-1">
        {filteredGames.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200/60 shadow-xs">
            <p className="text-sm font-bold text-slate-700">No activities found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search or category filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredGames.map(game => {
            const IconComponent = game.icon;
            const userScore = profile?.highScores?.[game.id];

            return (
              <div
                key={game.id}
                id={`game-item-${game.id}`}
                onClick={() => {
                  if (isLocked && access.reason === 'trial_expired' && openPaywall) {
                    openPaywall();
                  } else {
                    onSelectGame(game.id);
                  }
                }}
                className="w-full bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-200/70 shadow-2xs hover:shadow-md hover:border-slate-300 active:scale-[0.985] transition-all cursor-pointer flex items-center gap-3.5 sm:gap-4 select-none group"
              >
                {/* Left Icon Container */}
                <div
                  className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl ${game.iconBg} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>

                {/* Center Content */}
                <div className="flex-1 min-w-0">
                  {/* Title & Category Badge Row */}
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-extrabold text-slate-900 text-[15px] sm:text-base leading-tight truncate tracking-tight group-hover:text-blue-600 transition-colors">
                      {game.title}
                    </h3>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isLocked && access.reason === 'trial_expired' && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Pro</span>
                        </span>
                      )}
                      <span className={`text-xs font-bold ${game.categoryTagColor}`}>
                        {game.categoryTag}
                      </span>
                    </div>
                  </div>

                  {/* Subtitle / Description */}
                  <p className="text-xs text-slate-500 font-normal mt-0.5 leading-snug line-clamp-1">
                    {game.description}
                  </p>

                  {/* Metadata Row: Trophy + Score, Clock + Duration, Flame + Difficulty */}
                  <div className="flex items-center gap-3 sm:gap-4 mt-2 text-[11px] text-slate-600 font-medium">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span className="font-semibold text-slate-800 font-mono">
                        {userScore !== undefined
                          ? userScore.toLocaleString()
                          : typeof game.defaultScore === 'number'
                          ? game.defaultScore.toLocaleString()
                          : game.defaultScore}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{game.duration}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-slate-600">{game.difficulty}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
