import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../lib/audio';
import { GameType } from '../types';
import {
  Brain,
  Flame,
  Zap,
  Trophy,
  Heart,
  Sparkles,
  Gem,
  Rocket,
  Sun,
  Compass,
  RefreshCw,
  ArrowRight,
  Clock,
  Layers,
  Award,
  Moon,
  Star,
  Key,
  Shield,
  Bell,
  Anchor,
  Coffee,
  Crown,
  Music,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface MatchingCardsProps {
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

interface CardItem {
  id: number;
  pairId: number;
  iconName: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const AVAILABLE_ICONS = [
  { name: 'Brain', icon: Brain, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { name: 'Flame', icon: Flame, color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { name: 'Zap', icon: Zap, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { name: 'Trophy', icon: Trophy, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  { name: 'Heart', icon: Heart, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { name: 'Sparkles', icon: Sparkles, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
  { name: 'Gem', icon: Gem, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { name: 'Rocket', icon: Rocket, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { name: 'Sun', icon: Sun, color: 'text-amber-500 bg-amber-50 border-amber-200' },
  { name: 'Compass', icon: Compass, color: 'text-teal-600 bg-teal-50 border-teal-200' },
  { name: 'Moon', icon: Moon, color: 'text-indigo-500 bg-indigo-50 border-indigo-200' },
  { name: 'Star', icon: Star, color: 'text-yellow-500 bg-yellow-50 border-yellow-200' },
  { name: 'Key', icon: Key, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { name: 'Shield', icon: Shield, color: 'text-slate-700 bg-slate-100 border-slate-300' },
  { name: 'Bell', icon: Bell, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  { name: 'Anchor', icon: Anchor, color: 'text-sky-700 bg-sky-50 border-sky-200' },
  { name: 'Coffee', icon: Coffee, color: 'text-stone-700 bg-stone-50 border-stone-200' },
  { name: 'Crown', icon: Crown, color: 'text-amber-500 bg-amber-50 border-amber-200' },
  { name: 'Music', icon: Music, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { name: 'Target', icon: Target, color: 'text-rose-600 bg-rose-50 border-rose-200' }
];

export const MatchingCards: React.FC<MatchingCardsProps> = ({ onGameOver, onExit }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [totalPairs, setTotalPairs] = useState(8);
  const [isLocked, setIsLocked] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [gameEnded, setGameEnded] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize deck for current level
  const initBoard = (currentLevel = level) => {
    // Level 1: 6 pairs (12 cards, 4x3)
    // Level 2: 8 pairs (16 cards, 4x4)
    // Level 3: 10 pairs (20 cards, 5x4)
    const pairCount = currentLevel === 1 ? 6 : currentLevel === 2 ? 8 : 10;
    setTotalPairs(pairCount);
    setMatchedPairs(0);
    setMoves(0);
    setFlippedIndices([]);
    setIsLocked(false);
    setSeconds(0);
    setIsActive(true);
    setGameEnded(false);

    const shuffledIcons = [...AVAILABLE_ICONS].sort(() => Math.random() - 0.5);
    const selectedIcons = shuffledIcons.slice(0, pairCount);
    const deck: CardItem[] = [];

    selectedIcons.forEach((item, idx) => {
      deck.push({
        id: idx * 2,
        pairId: idx,
        iconName: item.name,
        isFlipped: false,
        isMatched: false
      });
      deck.push({
        id: idx * 2 + 1,
        pairId: idx,
        iconName: item.name,
        isFlipped: false,
        isMatched: false
      });
    });

    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
  };

  useEffect(() => {
    initBoard(level);
  }, [level]);

  // Game timer
  useEffect(() => {
    if (isActive && !gameEnded) {
      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, gameEnded]);

  const handleCardClick = (index: number) => {
    if (isLocked) return;
    const clickedCard = cards[index];
    if (clickedCard.isFlipped || clickedCard.isMatched) return;

    sounds.playCardFlip();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsLocked(true);

      const [firstIdx, secondIdx] = newFlipped;
      const card1 = newCards[firstIdx];
      const card2 = newCards[secondIdx];

      if (card1.pairId === card2.pairId) {
        // MATCH!
        sounds.playCorrect(2);
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[firstIdx].isMatched = true;
            updated[secondIdx].isMatched = true;
            return updated;
          });
          setFlippedIndices([]);
          setIsLocked(false);
          setMatchedPairs(p => {
            const nextP = p + 1;
            if (nextP === totalPairs) {
              handleRoundComplete();
            }
            return nextP;
          });
          setScore(s => s + 150 + Math.max(0, 50 - seconds));
        }, 400);
      } else {
        // MISMATCH
        sounds.playMistake();
        setTimeout(() => {
          setCards(prev => {
            const updated = [...prev];
            updated[firstIdx].isFlipped = false;
            updated[secondIdx].isFlipped = false;
            return updated;
          });
          setFlippedIndices([]);
          setIsLocked(false);
        }, 900);
      }
    }
  };

  const handleRoundComplete = () => {
    setIsActive(false);
    sounds.playFanfare();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    const roundAccuracy = Math.min(100, Math.round((totalPairs / Math.max(moves + 1, totalPairs)) * 100));
    const bonus = Math.max(0, (totalPairs * 15 - seconds) * 10);
    const finalRoundScore = score + 500 + bonus;
    setScore(finalRoundScore);

    if (level < 3) {
      setTimeout(() => {
        setLevel(l => l + 1);
      }, 1600);
    } else {
      setGameEnded(true);
      setTimeout(() => {
        onGameOver({
          gameType: 'matching-cards',
          gameTitle: 'Matching Cards',
          score: finalRoundScore,
          accuracy: roundAccuracy,
          level: 3,
          responseTimeMs: Math.round((seconds / Math.max(moves, 1)) * 1000)
        });
      }, 1200);
    }
  };

  const getCardIcon = (iconName: string) => {
    const found = AVAILABLE_ICONS.find(i => i.name === iconName);
    if (!found) return { Component: Brain, color: 'text-blue-600 bg-blue-50 border-blue-200' };
    return { Component: found.icon, color: found.color };
  };

  return (
    <div id="matching-cards-game" className="max-w-4xl mx-auto space-y-6 text-slate-800">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center shadow-md">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                Working Memory &bull; Level {level}/3
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-black text-slate-900">Matching Cards</h1>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-4 sm:gap-6 text-center">
          <div className="bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Pairs</span>
            <span className="font-mono text-base font-black text-teal-600">
              {matchedPairs} / {totalPairs}
            </span>
          </div>

          <div className="bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Moves</span>
            <span className="font-mono text-base font-black text-slate-700">{moves}</span>
          </div>

          <div className="bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Time</span>
            <span className="font-mono text-base font-black text-slate-700 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
            </span>
          </div>

          <div className="bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Score</span>
            <span className="font-mono text-base font-black text-blue-600">{score}</span>
          </div>
        </div>

        {/* Exit Button */}
        <button
          id="btn-exit-matching"
          onClick={onExit}
          className="text-xs font-extrabold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors cursor-pointer"
        >
          Exit Game
        </button>
      </div>

      {/* Main Cards Grid */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div
          className={`grid gap-3 sm:gap-4 max-w-2xl mx-auto ${
            totalPairs === 6
              ? 'grid-cols-3 sm:grid-cols-4'
              : totalPairs === 8
              ? 'grid-cols-4'
              : 'grid-cols-4 sm:grid-cols-5'
          }`}
        >
          {cards.map((card, idx) => {
            const { Component: IconC, color } = getCardIcon(card.iconName);
            const isVisible = card.isFlipped || card.isMatched;

            return (
              <motion.button
                key={card.id}
                id={`card-tile-${idx}`}
                whileHover={!isVisible ? { scale: 1.04 } : {}}
                whileTap={!isVisible ? { scale: 0.96 } : {}}
                onClick={() => handleCardClick(idx)}
                disabled={isVisible || isLocked}
                className={`aspect-square rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 relative select-none shadow-sm ${
                  card.isMatched
                    ? 'bg-emerald-50 border-2 border-emerald-400 opacity-90 scale-95'
                    : isVisible
                    ? 'bg-white border-2 border-blue-400 shadow-md'
                    : 'bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 hover:border-teal-400 hover:shadow-md'
                }`}
              >
                {isVisible ? (
                  <motion.div
                    initial={{ rotateY: 90, scale: 0.8 }}
                    animate={{ rotateY: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`w-11 h-11 sm:w-13 sm:h-13 rounded-xl flex items-center justify-center border ${color}`}
                  >
                    <IconC className="w-6 h-6 sm:w-7 sm:h-7" />
                  </motion.div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-slate-700/60 flex items-center justify-center text-teal-400/80">
                    <span className="font-mono text-xs font-black">?</span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Hint Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-teal-500" />
            <span>Fewer moves & faster completion time reward maximum Brain Power.</span>
          </div>
          <button
            id="btn-restart-matching"
            onClick={() => initBoard(level)}
            className="text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Shuffle & Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
