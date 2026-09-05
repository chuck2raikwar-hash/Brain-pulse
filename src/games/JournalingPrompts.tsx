import React, { useState, useEffect } from 'react';
import { sounds } from '../lib/audio';
import { GameType, JournalEntry } from '../types';
import {
  BookOpen,
  Sparkles,
  Save,
  Clock,
  Heart,
  Smile,
  Zap,
  Calendar,
  CheckCircle2,
  Trash2,
  Shuffle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  JournalPromptItem,
  getRandomJournalPrompts,
  JOURNAL_PROMPTS_POOL
} from './data/journalPrompts';

interface JournalingPromptsProps {
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

const MOODS = ['Focused', 'Calm', 'Grateful', 'Energized', 'Thoughtful', 'Fatigued', 'Anxious'];

export const JournalingPrompts: React.FC<JournalingPromptsProps> = ({ onGameOver, onExit }) => {
  const [prompts, setPrompts] = useState<JournalPromptItem[]>(() => getRandomJournalPrompts(8));
  const [selectedPromptIdx, setSelectedPromptIdx] = useState(0);
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('Grateful');
  const [pastEntries, setPastEntries] = useState<JournalEntry[]>([]);
  const [viewHistory, setViewHistory] = useState(false);

  const prompt = prompts[selectedPromptIdx % prompts.length] || prompts[0];

  const handleShufflePrompts = () => {
    sounds.playCardFlip();
    const newBatch = getRandomJournalPrompts(8);
    setPrompts(newBatch);
    setSelectedPromptIdx(0);
  };

  // Load past entries from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('brainpulse_journal_entries');
      if (saved) {
        setPastEntries(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const handleSaveEntry = () => {
    if (!content.trim()) return;

    sounds.playBowlChime();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

    const newEntry: JournalEntry = {
      id: String(Date.now()),
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      prompt: prompt.question,
      category: prompt.theme,
      content: content.trim(),
      mood: selectedMood,
      wordCount
    };

    const updated = [newEntry, ...pastEntries];
    setPastEntries(updated);
    try {
      localStorage.setItem('brainpulse_journal_entries', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setTimeout(() => {
      onGameOver({
        gameType: 'journaling-prompts',
        gameTitle: 'Journaling & Reflection',
        score: Math.min(600, 300 + wordCount * 5),
        accuracy: 100,
        level: 1,
        responseTimeMs: 0
      });
    }, 1200);
  };

  const handleDeleteEntry = (id: string) => {
    const updated = pastEntries.filter(e => e.id !== id);
    setPastEntries(updated);
    localStorage.setItem('brainpulse_journal_entries', JSON.stringify(updated));
  };

  return (
    <div id="journaling-prompts-activity" className="max-w-4xl mx-auto space-y-6 text-slate-800">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Emotional Processing &bull; Daily Reflection
              </span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-black text-slate-900">
              Journaling & Reflection
            </h1>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewHistory(!viewHistory)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              viewHistory
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {viewHistory ? 'Active Prompt' : `Past Reflections (${pastEntries.length})`}
          </button>
          <button
            onClick={onExit}
            className="text-xs font-extrabold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Exit
          </button>
        </div>
      </div>

      {!viewHistory ? (
        /* Writing Workspace */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
          {/* Prompt Selector Pills & Shuffle */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={handleShufflePrompts}
              title="Draw 8 new random prompts from 100-prompt pool"
              className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer transition-all active:scale-95"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle 100 Prompts</span>
            </button>
            {prompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPromptIdx(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  selectedPromptIdx === idx
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p.theme}
              </button>
            ))}
          </div>

          {/* Prompt Card */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">
                Prompt {selectedPromptIdx + 1} of {prompts.length} &bull; {prompt.theme} (Pool: 100)
              </span>
              <span className="text-[10px] text-amber-600 font-bold bg-amber-100/80 px-2 py-0.5 rounded-full">
                #{prompt.id} of 100
              </span>
            </div>
            <p className="font-display text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              "{prompt.question}"
            </p>
          </div>

          {/* Mood Tag Selector */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 block">
              How is your mind feeling right now?
            </span>
            <div className="flex flex-wrap gap-2">
              {MOODS.map(mood => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedMood === mood
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* Free-form Textarea */}
          <div className="space-y-2">
            <textarea
              id="journal-input-content"
              rows={6}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Reflect freely without judgment or editing. Let your thoughts flow..."
              className="w-full p-4 rounded-2xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-slate-800 text-sm leading-relaxed resize-none transition-all placeholder:text-slate-400"
            />
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{wordCount} words written</span>
              <span>Diaphragmatic pauses help release emotional weight</span>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              id="btn-save-journal"
              onClick={handleSaveEntry}
              disabled={!content.trim()}
              className={`py-3 px-8 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                content.trim()
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/20 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>Save & Complete Reflection</span>
            </button>
          </div>
        </div>
      ) : (
        /* Past Reflections List */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="font-display text-lg font-black text-slate-900">
            Reflection History ({pastEntries.length} entries)
          </h2>

          {pastEntries.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No journal reflections logged yet. Write your first entry above!
            </div>
          ) : (
            <div className="space-y-4">
              {pastEntries.map(entry => (
                <div
                  key={entry.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-amber-700">
                      {entry.dateStr || new Date(entry.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
                        {entry.mood}
                      </span>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        title="Delete reflection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-700 italic">
                    "{entry.prompt}"
                  </p>
                  <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
