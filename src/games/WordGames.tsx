import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../lib/audio';
import { GameType } from '../types';
import {
  SpellCheck,
  Sparkles,
  RefreshCw,
  Clock,
  Lightbulb,
  CheckCircle2,
  Trophy,
  ArrowRight,
  BookOpen,
  Shuffle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface WordGamesProps {
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
  AnagramPuzzle,
  VocabQuestion,
  getRandomAnagrams,
  getRandomVocabQuestions
} from './data/wordGameData';

export const WordGames: React.FC<WordGamesProps> = ({ onGameOver, onExit }) => {
  const [mode, setMode] = useState<'anagram' | 'vocab'>('anagram');
  const [anagrams, setAnagrams] = useState<AnagramPuzzle[]>(() => getRandomAnagrams(10));
  const [vocabList, setVocabList] = useState<VocabQuestion[]>(() => getRandomVocabQuestions(10));
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Anagram state
  const currentAnagram = anagrams[roundIdx % anagrams.length] || anagrams[0];
  const [availableLetters, setAvailableLetters] = useState<{ id: number; char: string; used: boolean }[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<{ id: number; char: string }[]>([]);
  const [showClue, setShowClue] = useState(false);

  // Vocab state
  const [vocabIdx, setVocabIdx] = useState(0);
  const currentVocab = vocabList[vocabIdx % vocabList.length] || vocabList[0];
  const [selectedVocabOpt, setSelectedVocabOpt] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reshuffle helper if mode changes or restarts
  const handleModeChange = (newMode: 'anagram' | 'vocab') => {
    setMode(newMode);
    if (newMode === 'anagram') {
      setAnagrams(getRandomAnagrams(10));
      setRoundIdx(0);
    } else {
      setVocabList(getRandomVocabQuestions(10));
      setVocabIdx(0);
    }
  };

  // Init anagram round
  useEffect(() => {
    if (mode === 'anagram' && currentAnagram) {
      const letters = currentAnagram.scrambled.map((c, i) => ({
        id: i,
        char: c,
        used: false
      }));
      setAvailableLetters(letters);
      setSelectedLetters([]);
      setShowClue(false);
    }
  }, [roundIdx, mode, currentAnagram]);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle letter click in bank -> moves to input
  const handleBankLetterClick = (letter: { id: number; char: string; used: boolean }) => {
    if (letter.used) return;
    sounds.playCardFlip();

    setAvailableLetters(prev =>
      prev.map(l => (l.id === letter.id ? { ...l, used: true } : l))
    );
    const newSelected = [...selectedLetters, { id: letter.id, char: letter.char }];
    setSelectedLetters(newSelected);

    // Check if full word formed
    if (newSelected.length === currentAnagram.word.length) {
      const constructedWord = newSelected.map(l => l.char).join('');
      if (constructedWord === currentAnagram.word) {
        sounds.playCorrect(3);
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        const roundScore = 250 + Math.max(0, 50 - seconds * 2);
        setScore(s => s + roundScore);

        if (roundIdx + 1 < anagrams.length) {
          setTimeout(() => setRoundIdx(r => r + 1), 900);
        } else {
          sounds.playFanfare();
          setTimeout(() => {
            onGameOver({
              gameType: 'word-games',
              gameTitle: 'Word Games (Anagrams)',
              score: score + roundScore,
              accuracy: Math.max(70, 100 - hintsUsed * 10),
              level: roundIdx + 1,
              responseTimeMs: Math.round((seconds / Math.max(roundIdx + 1, 1)) * 1000)
            });
          }, 1100);
        }
      } else {
        sounds.playMistake();
      }
    }
  };

  // Handle click in selected slot -> returns back to bank
  const handleSlotLetterClick = (slotIndex: number) => {
    sounds.playTick();
    const removed = selectedLetters[slotIndex];
    const newSelected = selectedLetters.filter((_, idx) => idx !== slotIndex);
    setSelectedLetters(newSelected);

    setAvailableLetters(prev =>
      prev.map(l => (l.id === removed.id ? { ...l, used: false } : l))
    );
  };

  // Vocab Answer Selection
  const handleVocabAnswer = (optIndex: number) => {
    if (selectedVocabOpt !== null) return;
    setSelectedVocabOpt(optIndex);

    if (optIndex === currentVocab.correctIndex) {
      sounds.playCorrect(2);
      setScore(s => s + 200);
    } else {
      sounds.playMistake();
    }

    setTimeout(() => {
      setSelectedVocabOpt(null);
      if (vocabIdx + 1 < vocabList.length) {
        setVocabIdx(v => v + 1);
      } else {
        sounds.playFanfare();
        onGameOver({
          gameType: 'word-games',
          gameTitle: 'Word Games (Vocabulary Sprint)',
          score: score + 200,
          accuracy: 85,
          level: vocabList.length,
          responseTimeMs: Math.round((seconds / vocabList.length) * 1000)
        });
      }
    }, 1200);
  };

  return (
    <div id="word-games-activity" className="max-w-4xl mx-auto space-y-6 text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
            <SpellCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Language Processing &bull; Lexical Access
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-black text-slate-900">
              Word Games
            </h1>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => handleModeChange('anagram')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              mode === 'anagram'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Anagram Unscramble
          </button>
          <button
            onClick={() => handleModeChange('vocab')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              mode === 'vocab'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Vocabulary Sprint
          </button>
        </div>

        {/* Metric & Exit */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-100 font-mono text-xs font-bold text-slate-700 flex items-center gap-1">
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

      {/* Mode 1: Anagrams */}
      {mode === 'anagram' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col items-center">
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 uppercase bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200 mb-2">
            <span>Puzzle {roundIdx + 1} of {anagrams.length} (Pool: 100)</span>
            <span>&bull;</span>
            <span>{currentAnagram.category}</span>
          </div>

          <h2 className="font-display text-2xl font-black text-slate-900 mb-2">
            Unscramble the Word
          </h2>
          <p className="text-xs text-slate-500 max-w-md text-center mb-8">
            Click letters in the bank to spell the correct term. Click placed letters to return them.
          </p>

          {/* Word Construction Answer Slots */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
            {Array.from({ length: currentAnagram.word.length }).map((_, idx) => {
              const letterObj = selectedLetters[idx];
              return (
                <button
                  key={idx}
                  id={`anagram-slot-${idx}`}
                  onClick={() => letterObj && handleSlotLetterClick(idx)}
                  className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-2 font-mono text-xl sm:text-2xl font-black flex items-center justify-center transition-all cursor-pointer ${
                    letterObj
                      ? 'bg-emerald-600 border-emerald-700 text-white shadow-md'
                      : 'bg-slate-50 border-dashed border-slate-300 text-transparent'
                  }`}
                >
                  {letterObj?.char || ''}
                </button>
              );
            })}
          </div>

          {/* Letter Bank */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-8 flex-wrap">
            {availableLetters.map(letter => (
              <button
                key={letter.id}
                id={`letter-tile-${letter.id}`}
                onClick={() => handleBankLetterClick(letter)}
                disabled={letter.used}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl font-mono text-xl font-black flex items-center justify-center transition-all cursor-pointer ${
                  letter.used
                    ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed scale-90'
                    : 'bg-white border-2 border-emerald-400 hover:border-emerald-600 text-slate-800 shadow-sm hover:scale-105 active:scale-95'
                }`}
              >
                {letter.char}
              </button>
            ))}
          </div>

          {/* Clue Section */}
          <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center">
            {showClue ? (
              <div className="text-xs text-slate-700 leading-relaxed animate-in fade-in">
                <strong className="text-emerald-700">Semantic Clue: </strong>
                {currentAnagram.clue}
              </div>
            ) : (
              <button
                onClick={() => {
                  setShowClue(true);
                  setHintsUsed(h => h + 1);
                }}
                className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer"
              >
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Reveal Clue (-25 pts)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Vocab Sprint */}
      {mode === 'vocab' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col items-center">
          <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 mb-3">
            Question {vocabIdx + 1} of {vocabList.length} (Pool: 100)
          </span>

          <h2 className="font-mono text-3xl font-black tracking-wider text-slate-900 mb-2">
            {currentVocab.word}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg text-center mb-8 italic">
            "{currentVocab.definition}"
          </p>

          <div className="grid sm:grid-cols-2 gap-3 w-full max-w-xl">
            {currentVocab.options.map((opt, i) => {
              const isSelected = selectedVocabOpt === i;
              const isCorrect = i === currentVocab.correctIndex;
              let btnStyle = 'bg-white border border-slate-200 hover:border-emerald-400 text-slate-800';

              if (selectedVocabOpt !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500 border-emerald-600 text-white shadow-md';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500 border-rose-600 text-white';
                }
              }

              return (
                <button
                  key={i}
                  id={`vocab-opt-${i}`}
                  onClick={() => handleVocabAnswer(i)}
                  disabled={selectedVocabOpt !== null}
                  className={`p-4 rounded-2xl text-xs sm:text-sm font-bold text-left transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {selectedVocabOpt !== null && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
