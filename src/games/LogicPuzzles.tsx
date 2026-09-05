import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../lib/audio';
import { GameType } from '../types';
import {
  Puzzle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  Clock,
  Sparkles,
  Trophy,
  Grid,
  Paintbrush,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface LogicPuzzlesProps {
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

import {
  SudokuBoard,
  NonogramPuzzle,
  SUDOKU_BOARDS,
  NONOGRAM_PUZZLES
} from './data/logicPuzzleData';

type PuzzleMode = 'sudoku' | 'nonogram';

export const LogicPuzzles: React.FC<LogicPuzzlesProps> = ({ onGameOver, onExit }) => {
  const [activeMode, setActiveMode] = useState<PuzzleMode>('sudoku');
  const [boardIndex, setBoardIndex] = useState(() => Math.floor(Math.random() * SUDOKU_BOARDS.length));
  const [seconds, setSeconds] = useState(0);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  // Sudoku state
  const currentSudoku = SUDOKU_BOARDS[boardIndex % SUDOKU_BOARDS.length];
  const [grid, setGrid] = useState<(number | null)[][]>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);

  // Nonogram state
  const currentNonogram = NONOGRAM_PUZZLES[boardIndex % NONOGRAM_PUZZLES.length];
  const [nonogramGrid, setNonogramGrid] = useState<('empty' | 'filled' | 'crossed')[][]>([]);
  const [paintMode, setPaintMode] = useState<'fill' | 'cross'>('fill');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset Sudoku Board
  const resetSudoku = (idx = boardIndex) => {
    const b = SUDOKU_BOARDS[idx % SUDOKU_BOARDS.length];
    setGrid(b.initial.map(row => [...row]));
    setSelectedCell(null);
  };

  // Reset Nonogram Board
  const resetNonogram = (idx = boardIndex) => {
    const blank: ('empty' | 'filled' | 'crossed')[][] = Array(5)
      .fill(null)
      .map(() => Array(5).fill('empty'));
    setNonogramGrid(blank);
  };

  useEffect(() => {
    resetSudoku(boardIndex);
    resetNonogram(boardIndex);
    setSeconds(0);
  }, [boardIndex, activeMode]);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle Sudoku Number Input
  const handleSudokuInput = (num: number | null) => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    if (currentSudoku.initial[r][c] !== null) return; // Immutable prefilled

    sounds.playReactionClick();
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = num;
    setGrid(newGrid);

    // Check conflict against solution
    if (num !== null && num !== currentSudoku.solution[r][c]) {
      sounds.playMistake();
      setMistakes(m => m + 1);
    } else if (num !== null) {
      sounds.playTick();
    }

    // Check complete
    let isFull = true;
    let isCorrect = true;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (newGrid[i][j] === null) isFull = false;
        if (newGrid[i][j] !== currentSudoku.solution[i][j]) isCorrect = false;
      }
    }

    if (isFull && isCorrect) {
      handleSudokuVictory();
    }
  };

  const handleSudokuVictory = () => {
    sounds.playFanfare();
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    const earned = Math.max(100, 500 - seconds * 3 - mistakes * 40 - hintsUsed * 50);
    setScore(s => s + earned);

    setTimeout(() => {
      onGameOver({
        gameType: 'logic-puzzles',
        gameTitle: 'Logic Puzzles (Sudoku Sprint)',
        score: earned,
        accuracy: Math.max(20, 100 - mistakes * 10),
        level: boardIndex + 1,
        responseTimeMs: Math.round((seconds / 16) * 1000)
      });
    }, 1200);
  };

  const handleSudokuHint = () => {
    if (!selectedCell) return;
    const [r, c] = selectedCell;
    if (currentSudoku.initial[r][c] !== null) return;

    sounds.playCorrect();
    setHintsUsed(h => h + 1);
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = currentSudoku.solution[r][c];
    setGrid(newGrid);
  };

  // Handle Nonogram Cell Click
  const handleNonogramClick = (r: number, c: number) => {
    sounds.playCardFlip();
    const newGrid = nonogramGrid.map(row => [...row]);
    const currentVal = newGrid[r][c];

    if (paintMode === 'fill') {
      newGrid[r][c] = currentVal === 'filled' ? 'empty' : 'filled';
    } else {
      newGrid[r][c] = currentVal === 'crossed' ? 'empty' : 'crossed';
    }
    setNonogramGrid(newGrid);

    // Verify nonogram solution
    let solved = true;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        const shouldBeFilled = currentNonogram.solution[i][j];
        const isFilled = newGrid[i][j] === 'filled';
        if (shouldBeFilled !== isFilled) {
          solved = false;
          break;
        }
      }
      if (!solved) break;
    }

    if (solved) {
      sounds.playFanfare();
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
      const earned = Math.max(150, 450 - seconds * 2);
      setScore(s => s + earned);

      setTimeout(() => {
        onGameOver({
          gameType: 'logic-puzzles',
          gameTitle: `Logic Puzzles (${currentNonogram.title})`,
          score: earned,
          accuracy: 100,
          level: boardIndex + 1,
          responseTimeMs: Math.round((seconds / 25) * 1000)
        });
      }, 1400);
    }
  };

  return (
    <div id="logic-puzzles-game" className="max-w-4xl mx-auto space-y-6 text-slate-800">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Puzzle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Spatial Reasoning &bull; Deductive Logic
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-black text-slate-900">
              Logic Puzzles
            </h1>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveMode('sudoku')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeMode === 'sudoku'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sudoku Sprint
          </button>
          <button
            onClick={() => setActiveMode('nonogram')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeMode === 'nonogram'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Nonogram (Picross)
          </button>
        </div>

        {/* Metrics & Exit */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
          </div>
          <button
            onClick={onExit}
            className="text-xs font-extrabold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Mode 1: Sudoku Sprint */}
      {activeMode === 'sudoku' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center">
          <div className="mb-4 text-center">
            <h2 className="font-display text-lg font-black text-slate-900">
              4x4 Sudoku Sprint #{(boardIndex % SUDOKU_BOARDS.length) + 1} of {SUDOKU_BOARDS.length}
            </h2>
            <p className="text-xs text-slate-500">Every row, column, and 2x2 quadrant must contain digits 1, 2, 3, and 4 exactly once.</p>
          </div>

          {/* Sudoku 4x4 Grid */}
          <div className="grid grid-cols-4 gap-2 bg-slate-800 p-3 rounded-2xl shadow-lg border-2 border-slate-700 max-w-xs w-full">
            {grid.map((row, r) =>
              row.map((val, c) => {
                const isInitial = currentSudoku.initial[r][c] !== null;
                const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
                const isError = val !== null && !isInitial && val !== currentSudoku.solution[r][c];

                return (
                  <button
                    key={`${r}-${c}`}
                    id={`sudoku-cell-${r}-${c}`}
                    onClick={() => setSelectedCell([r, c])}
                    className={`aspect-square rounded-xl font-mono text-xl sm:text-2xl font-black flex items-center justify-center transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-cyan-400 text-slate-950 ring-4 ring-cyan-300'
                        : isError
                        ? 'bg-rose-500 text-white'
                        : isInitial
                        ? 'bg-slate-900 text-slate-200 font-extrabold'
                        : val !== null
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-400'
                    }`}
                  >
                    {val || ''}
                  </button>
                );
              })
            )}
          </div>

          {/* Number Pad Input Bar */}
          <div className="mt-6 flex items-center gap-2">
            {[1, 2, 3, 4].map(num => (
              <button
                key={num}
                id={`btn-numpad-${num}`}
                onClick={() => handleSudokuInput(num)}
                className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 hover:bg-blue-600 hover:text-white text-blue-800 font-mono text-lg font-black transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handleSudokuInput(null)}
              className="px-3.5 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
            <button
              onClick={handleSudokuHint}
              className="px-3.5 h-12 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Hint</span>
            </button>
          </div>

          <div className="mt-6 flex items-center gap-4 text-xs text-slate-400">
            <span>Mistakes: <strong className="text-rose-600">{mistakes}</strong></span>
            <span>Hints: <strong className="text-amber-600">{hintsUsed}</strong></span>
            <button
              onClick={() => setBoardIndex(Math.floor(Math.random() * SUDOKU_BOARDS.length))}
              className="text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Random Puzzle &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Nonogram Picross */}
      {activeMode === 'nonogram' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center">
          <div className="mb-4 text-center">
            <h2 className="font-display text-lg font-black text-slate-900">
              Nonogram: {currentNonogram.title} (#{(boardIndex % NONOGRAM_PUZZLES.length) + 1} of {NONOGRAM_PUZZLES.length})
            </h2>
            <p className="text-xs text-slate-500">
              Shade cells according to row and column numerical clues to reveal the hidden pixel art.
            </p>
          </div>

          {/* Paint Mode Toggle */}
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => setPaintMode('fill')}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
                paintMode === 'fill'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Paintbrush className="w-3.5 h-3.5" />
              <span>Shade (Fill)</span>
            </button>
            <button
              onClick={() => setPaintMode('cross')}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
                paintMode === 'cross'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <X className="w-3.5 h-3.5" />
              <span>Cross-Out (X)</span>
            </button>
          </div>

          {/* Nonogram Grid with Clues */}
          <div className="flex flex-col items-center select-none">
            {/* Top Column Clues */}
            <div className="flex ml-14 mb-2">
              {currentNonogram.colClues.map((clues, cIdx) => (
                <div
                  key={cIdx}
                  className="w-10 sm:w-12 flex flex-col items-center justify-end text-[11px] font-mono font-black text-blue-700 h-14"
                >
                  {clues.map((n, i) => (
                    <span key={i}>{n}</span>
                  ))}
                </div>
              ))}
            </div>

            {/* Rows with Clues */}
            <div className="space-y-1">
              {nonogramGrid.map((row, r) => (
                <div key={r} className="flex items-center">
                  {/* Row Clue */}
                  <div className="w-14 text-right pr-3 font-mono text-[11px] font-black text-blue-700 flex justify-end gap-1">
                    {currentNonogram.rowClues[r].map((n, i) => (
                      <span key={i}>{n}</span>
                    ))}
                  </div>

                  {/* 5 Cells in Row */}
                  <div className="flex gap-1">
                    {row.map((cellState, c) => (
                      <button
                        key={c}
                        id={`nonogram-cell-${r}-${c}`}
                        onClick={() => handleNonogramClick(r, c)}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center text-sm font-black transition-all cursor-pointer ${
                          cellState === 'filled'
                            ? 'bg-blue-600 border-blue-700 text-white shadow-xs'
                            : cellState === 'crossed'
                            ? 'bg-slate-100 border-slate-300 text-rose-500'
                            : 'bg-white border-slate-300 hover:bg-blue-50'
                        }`}
                      >
                        {cellState === 'crossed' && '✕'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4 text-xs text-slate-400">
            <span>Solve all 5 rows to reveal pixel art</span>
            <button
              onClick={() => setBoardIndex(Math.floor(Math.random() * NONOGRAM_PUZZLES.length))}
              className="text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Try Random Nonogram &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
