import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchUserGameHistory, getBaselineCalibrationHistory } from '../lib/firebase';
import { GameHistoryEntry, GameType } from '../types';
import { GAME_MODES } from '../data/games';
import {
  TrendingUp,
  Target,
  Clock,
  Zap,
  CheckCircle2,
  Sparkles,
  Flame,
  Activity,
  Filter,
  Search,
  RotateCcw,
  Play,
  Award,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Brain
} from 'lucide-react';

interface ProgressTrackerViewProps {
  onSelectGame?: (gameId: GameType) => void;
}

export const ProgressTrackerView: React.FC<ProgressTrackerViewProps> = ({ onSelectGame }) => {
  const { user, profile, recordGame } = useAuth();
  const [history, setHistory] = useState<GameHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterGame, setFilterGame] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load history from Firebase & local storage
  const loadHistory = async () => {
    setLoading(true);
    try {
      const uid = user?.uid || 'athlete-player';
      const data = await fetchUserGameHistory(uid, 60);
      setHistory(data);
    } catch (err) {
      console.warn('Error fetching game history:', err);
      // Fallback baseline if empty
      setHistory(getBaselineCalibrationHistory());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user, profile?.totalGamesPlayed]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Quick practice session generator for immediate testing
  const handleAddPracticeSession = async () => {
    const sampleGames: GameType[] = [
      'memory-matrix',
      'reaction-drill',
      'color-confusion',
      'n-back',
      'number-recall',
      'matching-cards'
    ];
    const pickedGame = (filterGame !== 'all' && sampleGames.includes(filterGame as GameType))
      ? (filterGame as GameType)
      : sampleGames[Math.floor(Math.random() * sampleGames.length)];

    const prevScore = history[0]?.score || 1200;
    const gain = Math.floor(Math.random() * 120) + 40;
    const score = prevScore + gain;
    const accuracy = Math.min(100, Math.floor(Math.random() * 8) + 92);
    const level = Math.floor(Math.random() * 4) + 6;
    const responseTimeMs = Math.floor(Math.random() * 120) + 320;

    await recordGame({
      gameType: pickedGame,
      gameTitle: GAME_MODES[pickedGame]?.name || pickedGame,
      score,
      accuracy,
      level,
      responseTimeMs
    });

    await loadHistory();
    showToast(`Logged live drill for ${GAME_MODES[pickedGame]?.name || pickedGame}! (+${gain} PTS)`);
  };

  // Reset to default diagnostic baseline runs
  const handleResetBaseline = () => {
    const baseline = getBaselineCalibrationHistory();
    try {
      localStorage.setItem('cortex_local_game_history', JSON.stringify(baseline));
    } catch {
      // ignore
    }
    setHistory(baseline);
    showToast('Reset telemetry to initial diagnostic calibration baseline.');
  };

  // Filter history by game and search term
  const filteredHistory = useMemo(() => {
    return history.filter(entry => {
      // Game dropdown filter
      if (filterGame !== 'all' && entry.gameType !== filterGame) {
        return false;
      }
      // Category pill filter
      if (activeCategory !== 'all') {
        const gameMeta = GAME_MODES[entry.gameType];
        if (gameMeta && gameMeta.category !== activeCategory) {
          return false;
        }
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = entry.gameTitle?.toLowerCase().includes(q) || false;
        const typeMatch = entry.gameType?.toLowerCase().includes(q) || false;
        const scoreMatch = entry.score?.toString().includes(q) || false;
        return titleMatch || typeMatch || scoreMatch;
      }
      return true;
    });
  }, [history, filterGame, activeCategory, searchQuery]);

  // Telemetry metric computations
  const totalSessions = history.length;
  const avgAccuracy = totalSessions > 0
    ? Math.round(history.reduce((a, b) => a + (b.accuracy || 0), 0) / totalSessions)
    : (profile?.peakMemoryAccuracy || 94);

  const avgSpeed = totalSessions > 0
    ? Math.round(history.reduce((a, b) => a + (b.responseTimeMs || 700), 0) / totalSessions)
    : (profile?.peakReactionTimeMs || 482);

  // Prepare chart points (chronological order: oldest to newest, up to 15 points)
  const chartPoints = useMemo(() => {
    const list = [...filteredHistory].reverse();
    return list.slice(-15);
  }, [filteredHistory]);

  // Chart coordinate & curve math
  const chartData = useMemo(() => {
    if (chartPoints.length === 0) return null;

    const SVG_WIDTH = 880;
    const SVG_HEIGHT = 250;
    const PAD_L = 65;
    const PAD_R = 35;
    const PAD_T = 30;
    const PAD_B = 45;

    const chartW = SVG_WIDTH - PAD_L - PAD_R;
    const chartH = SVG_HEIGHT - PAD_T - PAD_B;

    const scores = chartPoints.map(p => p.score);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const range = Math.max(200, maxScore - minScore);

    // Padding headroom on top & bottom so the curve never clips
    const yMin = Math.max(0, Math.floor((minScore - range * 0.2) / 50) * 50);
    const yMax = Math.ceil((maxScore + range * 0.25) / 50) * 50;
    const ySpan = Math.max(100, yMax - yMin);

    const getY = (score: number) => PAD_T + chartH - ((score - yMin) / ySpan) * chartH;
    const getX = (index: number) => {
      if (chartPoints.length <= 1) return PAD_L + chartW / 2;
      return PAD_L + (index / (chartPoints.length - 1)) * chartW;
    };

    const points = chartPoints.map((p, idx) => ({
      x: getX(idx),
      y: getY(p.score),
      entry: p,
      index: idx
    }));

    // Smooth Bezier Curve Path
    let linePath = '';
    let areaPath = '';

    if (points.length === 1) {
      // Single session: show baseline start connecting to first session
      const startX = PAD_L + 40;
      const startY = PAD_T + chartH - 20;
      linePath = `M ${startX},${startY} L ${points[0].x},${points[0].y}`;
      areaPath = `M ${startX},${PAD_T + chartH} L ${startX},${startY} L ${points[0].x},${points[0].y} L ${points[0].x},${PAD_T + chartH} Z`;
    } else {
      linePath = `M ${points[0].x},${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const curr = points[i];
        const next = points[i + 1];
        const cp1x = curr.x + (next.x - curr.x) / 2;
        const cp1y = curr.y;
        const cp2x = curr.x + (next.x - curr.x) / 2;
        const cp2y = next.y;
        linePath += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
      }

      areaPath = `M ${points[0].x},${PAD_T + chartH} L ${points[0].x},${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const curr = points[i];
        const next = points[i + 1];
        const cp1x = curr.x + (next.x - curr.x) / 2;
        const cp1y = curr.y;
        const cp2x = curr.x + (next.x - curr.x) / 2;
        const cp2y = next.y;
        areaPath += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
      }
      areaPath += ` L ${points[points.length - 1].x},${PAD_T + chartH} Z`;
    }

    // Horizontal Y-axis grid ticks
    const yTicks = [
      yMax,
      Math.round(yMin + ySpan * 0.66),
      Math.round(yMin + ySpan * 0.33),
      yMin
    ];

    // Calculate progression velocity delta (latest vs earliest in this chart)
    const firstScore = chartPoints[0].score;
    const lastScore = chartPoints[chartPoints.length - 1].score;
    const scoreDiff = lastScore - firstScore;
    const pctDiff = firstScore > 0 ? Math.round((scoreDiff / firstScore) * 100) : 0;

    return {
      SVG_WIDTH,
      SVG_HEIGHT,
      PAD_L,
      PAD_R,
      PAD_T,
      PAD_B,
      chartW,
      chartH,
      yMin,
      yMax,
      ySpan,
      points,
      linePath,
      areaPath,
      yTicks,
      getY,
      getX,
      minScore,
      maxScore,
      avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      scoreDiff,
      pctDiff
    };
  }, [chartPoints]);

  const getGameBadgeColor = (type: GameType) => {
    switch (type) {
      case 'memory-matrix':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'color-confusion':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'number-recall':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'n-back':
        return 'bg-cyan-50 text-cyan-900 border-cyan-200';
      case 'matching-cards':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'recall-sequence':
        return 'bg-violet-50 text-violet-800 border-violet-200';
      case 'distraction-task':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'logic-puzzles':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'word-games':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'pattern-recognition':
        return 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200';
      case 'guided-meditation':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'breathing-pacer':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      case 'journaling-prompts':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'reaction-drill':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'stretching-dual':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  const activePoint = (hoveredPointIndex !== null && chartData?.points[hoveredPointIndex])
    ? chartData.points[hoveredPointIndex]
    : null;

  return (
    <div id="progress-tracker-view" className="space-y-8 animate-in fade-in duration-300 text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="pb-6 border-b border-slate-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-extrabold tracking-wider uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              <span>Telemetry & Progression Engine</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Synced</span>
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-slate-900">Performance Telemetry</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Real-time score progression trajectory, accuracy curves, and detailed cognitive workout logs.
          </p>
        </div>

        {/* Quick Diagnostic Actions */}
        <div className="flex items-center gap-2">
          <button
            id="btn-add-practice-run"
            type="button"
            onClick={handleAddPracticeSession}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer hover:shadow-md"
            title="Log a practice drill to verify live trajectory update"
          >
            <Sparkles className="w-4 h-4" />
            <span>+ Quick Drill Test</span>
          </button>

          <button
            id="btn-reset-baseline"
            type="button"
            onClick={handleResetBaseline}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
            title="Reset telemetry back to initial calibration runs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Peak Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Brain Power Score */}
        <div className="bg-white border border-blue-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-extrabold uppercase text-blue-700 tracking-wider">Brain Power Score</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-5 h-5 fill-white" />
            </div>
          </div>
          <div>
            <div className="font-display text-4xl font-black text-slate-900">
              {profile?.brainPowerScore ? profile.brainPowerScore.toLocaleString() : (chartData?.avgScore ? Math.round(chartData.avgScore / 10) : 120)}
            </div>
            <div className="text-xs font-semibold text-blue-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Composite Neural Index</span>
            </div>
          </div>
        </div>

        {/* Average Accuracy */}
        <div className="bg-white border border-cyan-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-extrabold uppercase text-cyan-700 tracking-wider">Working Memory</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500 text-white flex items-center justify-center shadow-xs">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-display text-4xl font-black text-slate-900">
              {avgAccuracy}%
            </div>
            <div className="text-xs font-semibold text-cyan-600 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mean Precision Rate</span>
            </div>
          </div>
        </div>

        {/* Reaction Speed */}
        <div className="bg-white border border-orange-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-extrabold uppercase text-orange-700 tracking-wider">Mean Reaction</span>
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-display text-4xl font-black text-slate-900">
              {avgSpeed}ms
            </div>
            <div className="text-xs font-semibold text-orange-600 mt-1 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Response Latency</span>
            </div>
          </div>
        </div>

        {/* Completed Workouts */}
        <div className="bg-white border border-lime-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-extrabold uppercase text-lime-800 tracking-wider">Total Workouts</span>
            <div className="w-9 h-9 rounded-xl bg-lime-500 text-slate-900 flex items-center justify-center shadow-xs">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="font-display text-4xl font-black text-slate-900">
              {totalSessions}
            </div>
            <div className="text-xs font-semibold text-lime-700 mt-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recorded Sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Progression Trajectory Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Controls & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-blue-600 tracking-wider block mb-0.5">
              Kinetic Growth Curve
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900">Score Progression Trajectory</h2>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="analytics-game-filter" className="text-xs font-bold text-slate-500 shrink-0">
              Filter:
            </label>
            <select
              id="analytics-game-filter"
              value={filterGame}
              onChange={(e) => {
                setFilterGame(e.target.value);
                setHoveredPointIndex(null);
              }}
              className="bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-cyan-500 focus:border-cyan-600 rounded-xl px-4 py-2 text-xs text-slate-800 focus:outline-none font-bold tracking-wide cursor-pointer shadow-xs transition-all duration-200"
            >
              <option value="all">All 15 Activities & Games</option>
              <optgroup label="Memory & Attention (7)">
                <option value="memory-matrix">Memory Matrix</option>
                <option value="color-confusion">Color Confusion (Stroop)</option>
                <option value="number-recall">Number Recall</option>
                <option value="n-back">Pattern Match (2-Back)</option>
                <option value="matching-cards">Matching Cards</option>
                <option value="recall-sequence">Recall Sequence (Simon)</option>
                <option value="distraction-task">Distraction Search</option>
              </optgroup>
              <optgroup label="Cognitive & Puzzles (3)">
                <option value="logic-puzzles">Logic Puzzles</option>
                <option value="word-games">Word Games</option>
                <option value="pattern-recognition">Pattern Recognition</option>
              </optgroup>
              <optgroup label="Mindfulness & Relaxation (3)">
                <option value="guided-meditation">Guided Meditation</option>
                <option value="breathing-pacer">Breath Pacer</option>
                <option value="journaling-prompts">Journaling Prompts</option>
              </optgroup>
              <optgroup label="Physical & Reaction (2)">
                <option value="reaction-drill">Reaction Speed Drill</option>
                <option value="stretching-dual">Stretching Dual-Task</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Trajectory Velocity Highlights */}
        {chartData && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-4 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Progression Trend</span>
              <div className="flex items-center gap-1 font-extrabold text-sm mt-0.5">
                {chartData.pctDiff >= 0 ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +{chartData.pctDiff}% Growth
                  </span>
                ) : (
                  <span className="text-blue-600 flex items-center gap-1">
                    <Activity className="w-4 h-4" />
                    {chartData.pctDiff}% Stable
                  </span>
                )}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Trajectory Peak</span>
              <span className="font-mono font-black text-sm text-slate-900 mt-0.5 block">
                {chartData.maxScore.toLocaleString()} PTS
              </span>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Mean Score</span>
              <span className="font-mono font-black text-sm text-slate-900 mt-0.5 block">
                {chartData.avgScore.toLocaleString()} PTS
              </span>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Sessions Analyzed</span>
              <span className="font-black text-sm text-blue-600 mt-0.5 block">
                {chartData.points.length} Workouts
              </span>
            </div>
          </div>
        )}

        {/* Dynamic Responsive SVG Trajectory Chart */}
        {chartData && chartData.points.length > 0 ? (
          <div className="w-full relative pt-2 pb-2">
            {/* Chart SVG Element */}
            <div className="relative w-full aspect-[880/260] min-h-[220px]">
              <svg
                id="svg-progression-trajectory"
                className="w-full h-full overflow-visible select-none"
                viewBox={`0 0 ${chartData.SVG_WIDTH} ${chartData.SVG_HEIGHT}`}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="trajectoryAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.32" />
                    <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>

                  <linearGradient id="trajectoryLineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0284C7" />
                    <stop offset="50%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>

                  <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0284C7" floodOpacity="0.25" />
                  </filter>
                </defs>

                {/* Horizontal Grid lines & Y-axis labels */}
                {chartData.yTicks.map((tick, idx) => {
                  const y = chartData.getY(tick);
                  return (
                    <g key={`ytick_${idx}`}>
                      <line
                        x1={chartData.PAD_L}
                        y1={y}
                        x2={chartData.PAD_L + chartData.chartW}
                        y2={y}
                        stroke="#E2E8F0"
                        strokeDasharray={idx === chartData.yTicks.length - 1 ? '' : '4 4'}
                        strokeWidth="1"
                      />
                      <text
                        x={chartData.PAD_L - 10}
                        y={y + 3.5}
                        textAnchor="end"
                        className="text-[10px] font-mono font-bold fill-slate-400"
                      >
                        {tick.toLocaleString()}
                      </text>
                    </g>
                  );
                })}

                {/* Bottom X axis line */}
                <line
                  x1={chartData.PAD_L}
                  y1={chartData.PAD_T + chartData.chartH}
                  x2={chartData.PAD_L + chartData.chartW}
                  y2={chartData.PAD_T + chartData.chartH}
                  stroke="#CBD5E1"
                  strokeWidth="1.5"
                />

                {/* Shaded Area Fill */}
                <path
                  d={chartData.areaPath}
                  fill="url(#trajectoryAreaGradient)"
                  className="transition-all duration-300"
                />

                {/* Main Trajectory Line Curve */}
                <path
                  d={chartData.linePath}
                  fill="none"
                  stroke="url(#trajectoryLineGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glowEffect)"
                  className="transition-all duration-300"
                />

                {/* Active Hover Crosshair Line */}
                {activePoint && (
                  <line
                    x1={activePoint.x}
                    y1={chartData.PAD_T}
                    x2={activePoint.x}
                    y2={chartData.PAD_T + chartData.chartH}
                    stroke="#0284C7"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    className="animate-in fade-in"
                  />
                )}

                {/* X-axis Session Labels */}
                {chartData.points.map((pt, idx) => {
                  const isHovered = hoveredPointIndex === idx;
                  const label = chartData.points.length <= 8
                    ? (pt.entry.dateStr?.slice(5) || `Run ${idx + 1}`)
                    : (idx % 2 === 0 || idx === chartData.points.length - 1 ? `S${idx + 1}` : '');

                  return (
                    <g key={`x_label_${idx}`}>
                      {label && (
                        <text
                          x={pt.x}
                          y={chartData.PAD_T + chartData.chartH + 18}
                          textAnchor="middle"
                          className={`text-[10px] font-mono font-bold transition-colors ${
                            isHovered ? 'fill-blue-600 font-extrabold' : 'fill-slate-400'
                          }`}
                        >
                          {label}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Interactive Data Node Points */}
                {chartData.points.map((pt, idx) => {
                  const isHovered = hoveredPointIndex === idx;
                  return (
                    <g
                      key={`node_${pt.entry.id || idx}`}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPointIndex(idx)}
                      onMouseLeave={() => setHoveredPointIndex(null)}
                    >
                      {/* Invisible larger hit area */}
                      <circle cx={pt.x} cy={pt.y} r="16" fill="transparent" />

                      {/* Glowing Halo when hovered */}
                      {isHovered && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="12"
                          fill="#06B6D4"
                          fillOpacity="0.25"
                          stroke="#0284C7"
                          strokeWidth="2"
                        />
                      )}

                      {/* Main Center Node */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 6.5 : 4.5}
                        fill="#FFFFFF"
                        stroke={isHovered ? '#0284C7' : '#0EA5E9'}
                        strokeWidth={isHovered ? 3.5 : 2.5}
                        className="transition-all duration-150"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Floating Tooltip Card */}
              {activePoint && (
                <div
                  className="absolute pointer-events-none z-20 transition-all duration-75 transform -translate-x-1/2 -translate-y-full"
                  style={{
                    left: `${(activePoint.x / chartData.SVG_WIDTH) * 100}%`,
                    top: `${(activePoint.y / chartData.SVG_HEIGHT) * 100}%`,
                    marginTop: '-12px'
                  }}
                >
                  <div className="bg-slate-900 text-white rounded-2xl p-3 shadow-xl border border-slate-700 min-w-[170px] text-xs">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-extrabold text-[11px] text-cyan-300 truncate">
                        {activePoint.entry.gameTitle || activePoint.entry.gameType}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {activePoint.entry.dateStr}
                      </span>
                    </div>

                    <div className="font-mono text-base font-black text-white">
                      {activePoint.entry.score.toLocaleString()} <span className="text-xs text-cyan-400 font-normal">PTS</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-slate-800 text-[10px]">
                      <div>
                        <span className="text-slate-400">Accuracy:</span>{' '}
                        <strong className="text-emerald-400 font-bold">{activePoint.entry.accuracy}%</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Speed:</span>{' '}
                        <strong className="text-amber-300 font-bold">{activePoint.entry.responseTimeMs}ms</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Trajectory Axis Footer Legend */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-3 pt-2 border-t border-slate-100 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
                <span>Earlier Calibration Runs</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-600 font-extrabold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Recent Workouts &bull; Live Telemetry Progression</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center p-6">
            <Brain className="w-10 h-10 text-slate-300 mb-2" />
            <h3 className="font-bold text-slate-700 text-sm mb-1">
              No sessions found for this filter
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              Complete a drill in this category or log a quick test to chart your trajectory.
            </p>
            <div className="flex items-center gap-2">
              {filterGame !== 'all' && onSelectGame && (
                <button
                  type="button"
                  onClick={() => onSelectGame(filterGame as GameType)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Launch {GAME_MODES[filterGame as GameType]?.name || filterGame}</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleAddPracticeSession}
                className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs cursor-pointer"
              >
                + Add Practice Run
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Session History Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-extrabold uppercase text-blue-600 tracking-wider">
                Workout Audit Log
              </span>
              <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {filteredHistory.length} Logged Runs
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900">Detailed Session History</h2>
          </div>

          {/* Search & Category Pills */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* Quick Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mb-6 pb-2">
          {[
            { id: 'all', label: 'All Disciplines' },
            { id: 'Memory & Attention', label: 'Memory & Attention' },
            { id: 'Cognitive & Problem-Solving', label: 'Cognitive Puzzles' },
            { id: 'Mindfulness & Mental Fitness', label: 'Mindfulness' },
            { id: 'Physical & Dual-Task Drills', label: 'Reaction Drills' }
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="py-12 flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
            <div className="w-5 h-5 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <span>Retrieving synchronized sessions...</span>
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 pr-4">Activity</th>
                  <th className="pb-3 px-4">Date & Time</th>
                  <th className="pb-3 px-4">Score</th>
                  <th className="pb-3 px-4">Accuracy</th>
                  <th className="pb-3 px-4">Level</th>
                  <th className="pb-3 px-4">Latency</th>
                  <th className="pb-3 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((entry, idx) => {
                  const isHighScore = chartData && entry.score === chartData.maxScore;
                  return (
                    <tr key={entry.id || idx} className="hover:bg-slate-50/80 transition-colors group">
                      {/* Game Badge */}
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${getGameBadgeColor(entry.gameType)}`}>
                            {entry.gameTitle || GAME_MODES[entry.gameType]?.name || entry.gameType}
                          </span>
                          {isHighScore && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                              ⭐ Peak
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 font-medium text-xs whitespace-nowrap">
                        {entry.dateStr || new Date(entry.timestamp).toLocaleDateString()}
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-4 font-mono font-black text-sm text-slate-900 whitespace-nowrap">
                        {entry.score.toLocaleString()}{' '}
                        <span className="text-[10px] font-bold text-slate-400">PTS</span>
                      </td>

                      {/* Accuracy */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          entry.accuracy >= 92
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : entry.accuracy >= 80
                            ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {entry.accuracy}%
                        </span>
                      </td>

                      {/* Level */}
                      <td className="py-3.5 px-4 text-xs font-bold text-slate-600">
                        Level {entry.level || 1}
                      </td>

                      {/* Response Time */}
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-500 font-semibold whitespace-nowrap">
                        {entry.responseTimeMs} ms
                      </td>

                      {/* Direct Play Again Action */}
                      <td className="py-3.5 pl-4 text-right">
                        {onSelectGame && (
                          <button
                            type="button"
                            onClick={() => onSelectGame(entry.gameType)}
                            className="opacity-80 group-hover:opacity-100 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-2.5 py-1 rounded-lg font-extrabold text-[11px] transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>Train</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs font-semibold text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
            No matching sessions found. Adjust your search or filters above.
          </div>
        )}
      </div>
    </div>
  );
};
