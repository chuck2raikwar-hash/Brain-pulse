import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchLeaderboardRecords } from '../lib/firebase';
import { LeaderboardEntry, GameType } from '../types';
import { GAME_MODES } from '../data/games';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Sparkles,
  Flame,
  User as UserIcon,
  RefreshCw,
  Zap,
  Target
} from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeCategory, setActiveCategory] = useState<GameType | 'overall'>('overall');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLeaderboard = async (cat: GameType | 'overall') => {
    setLoading(true);
    try {
      const records = await fetchLeaderboardRecords(cat, 30);
      setEntries(records);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard(activeCategory);
  }, [activeCategory]);

  const categories = [
    { id: 'overall' as const, label: 'Overall Brain Power' },
    ...Object.values(GAME_MODES).map(g => ({
      id: g.id as GameType,
      label: g.name
    }))
  ];

  const top3 = entries.slice(0, 3);

  return (
    <div id="leaderboard-view" className="space-y-8 animate-in fade-in duration-300 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-extrabold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Global Rankings 🏆
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900">Leaderboards & High Scores</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Compete with cognitive athletes worldwide for the highest Brain Power scores.
          </p>
        </div>

        <button
          id="btn-refresh-leaderboard"
          onClick={() => loadLeaderboard(activeCategory)}
          disabled={loading}
          className="self-start sm:self-auto py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 text-xs font-extrabold rounded-2xl shadow-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          <span>Sync Rankings</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`leaderboard-tab-${cat.id}`}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Playful Podium Display (Top 3) */}
      {top3.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 items-end">
          {/* Silver #2 */}
          <div className="flex flex-col items-center">
            {top3[1] && (
              <div className="w-full bg-white border-2 border-cyan-200 rounded-3xl p-4 sm:p-6 flex flex-col items-center text-center shadow-md relative hover:-translate-y-1 transition-transform">
                <div className="absolute -top-3.5 bg-cyan-500 text-white text-[10px] font-black px-3 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                  🥈 #2 Silver
                </div>
                <div className="w-12 h-12 bg-cyan-100 border-2 border-cyan-300 rounded-2xl flex items-center justify-center text-cyan-800 font-extrabold text-lg mt-2 mb-2 shadow-xs">
                  {top3[1].displayName.charAt(0).toUpperCase()}
                </div>
                <div className="font-display font-bold text-sm sm:text-base text-slate-900 truncate max-w-full">
                  {top3[1].displayName}
                </div>
                <div className="font-mono text-xl sm:text-2xl font-black text-cyan-600 mt-1">
                  {top3[1].score.toLocaleString()}
                </div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Points</span>
              </div>
            )}
          </div>

          {/* Gold #1 (Hero Champion) */}
          <div className="flex flex-col items-center -mt-4 sm:-mt-6">
            {top3[0] && (
              <div className="w-full bg-gradient-to-br from-blue-600 via-cyan-500 to-lime-500 text-white rounded-3xl p-5 sm:p-8 flex flex-col items-center text-center shadow-xl shadow-cyan-500/25 relative hover:-translate-y-1 transition-transform">
                <div className="absolute -top-4 bg-lime-400 text-slate-900 text-xs font-black px-4 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 fill-slate-900" />
                  <span>#1 Champion</span>
                </div>
                <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl mt-2 mb-2 shadow-lg">
                  {top3[0].displayName.charAt(0).toUpperCase()}
                </div>
                <div className="font-display font-black text-base sm:text-xl truncate max-w-full text-white">
                  {top3[0].displayName}
                </div>
                <div className="font-mono text-2xl sm:text-3xl font-black text-white mt-1 drop-shadow-xs">
                  {top3[0].score.toLocaleString()}
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-100">Top Brain Score</span>
              </div>
            )}
          </div>

          {/* Bronze #3 */}
          <div className="flex flex-col items-center">
            {top3[2] && (
              <div className="w-full bg-white border-2 border-orange-200 rounded-3xl p-4 sm:p-6 flex flex-col items-center text-center shadow-md relative hover:-translate-y-1 transition-transform">
                <div className="absolute -top-3.5 bg-orange-500 text-white text-[10px] font-black px-3 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                  🥉 #3 Bronze
                </div>
                <div className="w-12 h-12 bg-orange-100 border-2 border-orange-300 rounded-2xl flex items-center justify-center text-orange-800 font-extrabold text-lg mt-2 mb-2 shadow-xs">
                  {top3[2].displayName.charAt(0).toUpperCase()}
                </div>
                <div className="font-display font-bold text-sm sm:text-base text-slate-900 truncate max-w-full">
                  {top3[2].displayName}
                </div>
                <div className="font-mono text-xl sm:text-2xl font-black text-orange-600 mt-1">
                  {top3[2].score.toLocaleString()}
                </div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Points</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-blue-600 tracking-wider block mb-0.5">
              Live Roster
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900">
              {activeCategory === 'overall' ? 'Cumulative Brain Power Rankings' : `${GAME_MODES[activeCategory]?.name} High Scores`}
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
            {entries.length} Athletes Logged
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
            <div className="w-5 h-5 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span>Fetching real-time rankings...</span>
          </div>
        ) : entries.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {entries.map((entry, idx) => {
              const isCurrentUser = user && entry.userId === user.uid;
              const rank = idx + 1;

              return (
                <div
                  key={entry.id || idx}
                  className={`py-3.5 px-4 rounded-2xl flex items-center justify-between transition-colors ${
                    isCurrentUser ? 'bg-cyan-50/80 border border-cyan-200' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-8 text-center font-mono font-black text-xs sm:text-sm ${
                      rank === 1 ? 'text-blue-600' : rank === 2 ? 'text-cyan-600' : rank === 3 ? 'text-orange-500' : 'text-slate-400'
                    }`}>
                      #{rank.toString().padStart(2, '0')}
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center text-xs font-black shadow-xs">
                      {entry.displayName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="text-xs font-bold flex items-center gap-2 text-slate-900">
                        <span className="font-display text-sm font-extrabold">{entry.displayName}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-black">YOU</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-semibold">
                        {entry.level ? `Level ${entry.level}` : 'Active Athlete'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-base sm:text-lg font-black text-slate-900">
                      {entry.score.toLocaleString()}
                    </div>
                    <div className="text-[10px] font-bold uppercase text-slate-400">
                      {activeCategory === 'overall' ? 'PTS Total' : 'Score'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-xs font-semibold text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
            No scores submitted for this category yet. Be the first to claim #1!
          </div>
        )}
      </div>
    </div>
  );
};
