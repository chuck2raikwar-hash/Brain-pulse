export interface TargetChallenge {
  id: number;
  targetSymbol: string;
  targetColor: string;
  targetName: string;
  distractors: { symbol: string; color: string }[];
  itemCount: number;
}

export const DISTRACTION_CHALLENGES_POOL: TargetChallenge[] = [
  // 1-20: Shapes & Geometric Symbols
  {
    id: 1,
    targetSymbol: '●',
    targetColor: 'text-rose-500',
    targetName: 'Red Circle',
    distractors: [
      { symbol: '●', color: 'text-blue-500' },
      { symbol: '■', color: 'text-rose-500' },
      { symbol: '■', color: 'text-blue-500' }
    ],
    itemCount: 28
  },
  {
    id: 2,
    targetSymbol: '▲',
    targetColor: 'text-amber-500',
    targetName: 'Gold Up-Triangle',
    distractors: [
      { symbol: '▼', color: 'text-amber-500' },
      { symbol: '▲', color: 'text-teal-500' },
      { symbol: '▼', color: 'text-teal-500' }
    ],
    itemCount: 32
  },
  {
    id: 3,
    targetSymbol: '✦',
    targetColor: 'text-cyan-500',
    targetName: 'Cyan 4-Point Star',
    distractors: [
      { symbol: '★', color: 'text-cyan-500' },
      { symbol: '✦', color: 'text-indigo-500' },
      { symbol: '✶', color: 'text-cyan-500' },
      { symbol: '★', color: 'text-indigo-500' }
    ],
    itemCount: 36
  },
  {
    id: 4,
    targetSymbol: '◆',
    targetColor: 'text-emerald-500',
    targetName: 'Emerald Diamond',
    distractors: [
      { symbol: '◇', color: 'text-emerald-500' },
      { symbol: '◆', color: 'text-purple-500' },
      { symbol: '■', color: 'text-emerald-500' }
    ],
    itemCount: 36
  },
  {
    id: 5,
    targetSymbol: '⬟',
    targetColor: 'text-violet-500',
    targetName: 'Violet Pentagon',
    distractors: [
      { symbol: '⬢', color: 'text-violet-500' },
      { symbol: '⬟', color: 'text-rose-500' },
      { symbol: '⬢', color: 'text-slate-400' }
    ],
    itemCount: 40
  },
  {
    id: 6,
    targetSymbol: '⬢',
    targetColor: 'text-amber-600',
    targetName: 'Amber Hexagon',
    distractors: [
      { symbol: '⬡', color: 'text-amber-600' },
      { symbol: '⬢', color: 'text-blue-500' },
      { symbol: '●', color: 'text-amber-600' }
    ],
    itemCount: 42
  },
  {
    id: 7,
    targetSymbol: '■',
    targetColor: 'text-indigo-600',
    targetName: 'Indigo Solid Square',
    distractors: [
      { symbol: '□', color: 'text-indigo-600' },
      { symbol: '■', color: 'text-teal-500' },
      { symbol: '▲', color: 'text-indigo-600' }
    ],
    itemCount: 38
  },
  {
    id: 8,
    targetSymbol: '★',
    targetColor: 'text-yellow-500',
    targetName: 'Yellow 5-Point Star',
    distractors: [
      { symbol: '☆', color: 'text-yellow-500' },
      { symbol: '★', color: 'text-amber-700' },
      { symbol: '✦', color: 'text-yellow-500' }
    ],
    itemCount: 40
  },
  {
    id: 9,
    targetSymbol: '◎',
    targetColor: 'text-rose-600',
    targetName: 'Double Target Ring',
    distractors: [
      { symbol: '○', color: 'text-rose-600' },
      { symbol: '●', color: 'text-rose-600' },
      { symbol: '◎', color: 'text-cyan-500' }
    ],
    itemCount: 42
  },
  {
    id: 10,
    targetSymbol: '◖',
    targetColor: 'text-sky-500',
    targetName: 'Left Half Circle',
    distractors: [
      { symbol: '◗', color: 'text-sky-500' },
      { symbol: '◖', color: 'text-indigo-600' },
      { symbol: '●', color: 'text-sky-500' }
    ],
    itemCount: 44
  },
  {
    id: 11,
    targetSymbol: '◢',
    targetColor: 'text-fuchsia-500',
    targetName: 'Bottom-Right Wedge',
    distractors: [
      { symbol: '◣', color: 'text-fuchsia-500' },
      { symbol: '◤', color: 'text-fuchsia-500' },
      { symbol: '◥', color: 'text-fuchsia-500' }
    ],
    itemCount: 40
  },
  {
    id: 12,
    targetSymbol: '◬',
    targetColor: 'text-teal-600',
    targetName: 'Triangle with Dot',
    distractors: [
      { symbol: '▲', color: 'text-teal-600' },
      { symbol: '△', color: 'text-teal-600' },
      { symbol: '◬', color: 'text-emerald-500' }
    ],
    itemCount: 42
  },
  {
    id: 13,
    targetSymbol: '◈',
    targetColor: 'text-orange-500',
    targetName: 'Framed Diamond',
    distractors: [
      { symbol: '◇', color: 'text-orange-500' },
      { symbol: '◆', color: 'text-orange-500' },
      { symbol: '◈', color: 'text-amber-500' }
    ],
    itemCount: 44
  },
  {
    id: 14,
    targetSymbol: '◉',
    targetColor: 'text-blue-600',
    targetName: 'Bullseye Dot',
    distractors: [
      { symbol: '◎', color: 'text-blue-600' },
      { symbol: '●', color: 'text-blue-600' },
      { symbol: '○', color: 'text-blue-600' }
    ],
    itemCount: 45
  },
  {
    id: 15,
    targetSymbol: '◮',
    targetColor: 'text-purple-600',
    targetName: 'Diagonal Shaded Circle',
    distractors: [
      { symbol: '◐', color: 'text-purple-600' },
      { symbol: '◑', color: 'text-purple-600' },
      { symbol: '◭', color: 'text-purple-600' }
    ],
    itemCount: 42
  },
  {
    id: 16,
    targetSymbol: '▰',
    targetColor: 'text-lime-600',
    targetName: 'Black Parallelogram',
    distractors: [
      { symbol: '▱', color: 'text-lime-600' },
      { symbol: '■', color: 'text-lime-600' },
      { symbol: '▰', color: 'text-emerald-600' }
    ],
    itemCount: 40
  },
  {
    id: 17,
    targetSymbol: '⬟',
    targetColor: 'text-rose-500',
    targetName: 'Rose Pentagon',
    distractors: [
      { symbol: '⬢', color: 'text-rose-500' },
      { symbol: '⬟', color: 'text-orange-500' },
      { symbol: '▲', color: 'text-rose-500' }
    ],
    itemCount: 42
  },
  {
    id: 18,
    targetSymbol: '✸',
    targetColor: 'text-amber-500',
    targetName: 'Multi-Point Sunburst',
    distractors: [
      { symbol: '✹', color: 'text-amber-500' },
      { symbol: '✶', color: 'text-amber-500' },
      { symbol: '✸', color: 'text-yellow-400' }
    ],
    itemCount: 44
  },
  {
    id: 19,
    targetSymbol: '⯁',
    targetColor: 'text-cyan-600',
    targetName: 'Cyan Square Diamond',
    distractors: [
      { symbol: '◆', color: 'text-cyan-600' },
      { symbol: '■', color: 'text-cyan-600' },
      { symbol: '⯁', color: 'text-teal-600' }
    ],
    itemCount: 42
  },
  {
    id: 20,
    targetSymbol: '⯃',
    targetColor: 'text-indigo-500',
    targetName: 'Indigo Corner Square',
    distractors: [
      { symbol: '■', color: 'text-indigo-500' },
      { symbol: '⯄', color: 'text-indigo-500' },
      { symbol: '⯃', color: 'text-blue-500' }
    ],
    itemCount: 40
  },

  // 21-40: Letters & Alphanumeric Distractions
  {
    id: 21,
    targetSymbol: 'Q',
    targetColor: 'text-slate-800',
    targetName: 'Letter Q',
    distractors: [
      { symbol: 'O', color: 'text-slate-800' },
      { symbol: 'C', color: 'text-slate-800' },
      { symbol: 'D', color: 'text-slate-800' }
    ],
    itemCount: 36
  },
  {
    id: 22,
    targetSymbol: 'E',
    targetColor: 'text-emerald-600',
    targetName: 'Letter E',
    distractors: [
      { symbol: 'F', color: 'text-emerald-600' },
      { symbol: 'L', color: 'text-emerald-600' },
      { symbol: 'B', color: 'text-emerald-600' },
      { symbol: 'E', color: 'text-slate-400' }
    ],
    itemCount: 48
  },
  {
    id: 23,
    targetSymbol: 'P',
    targetColor: 'text-blue-600',
    targetName: 'Letter P',
    distractors: [
      { symbol: 'R', color: 'text-blue-600' },
      { symbol: 'B', color: 'text-blue-600' },
      { symbol: 'D', color: 'text-blue-600' }
    ],
    itemCount: 40
  },
  {
    id: 24,
    targetSymbol: 'M',
    targetColor: 'text-indigo-600',
    targetName: 'Letter M',
    distractors: [
      { symbol: 'W', color: 'text-indigo-600' },
      { symbol: 'N', color: 'text-indigo-600' },
      { symbol: 'V', color: 'text-indigo-600' }
    ],
    itemCount: 42
  },
  {
    id: 25,
    targetSymbol: '8',
    targetColor: 'text-rose-600',
    targetName: 'Numeral 8',
    distractors: [
      { symbol: 'B', color: 'text-rose-600' },
      { symbol: '3', color: 'text-rose-600' },
      { symbol: '0', color: 'text-rose-600' }
    ],
    itemCount: 44
  },
  {
    id: 26,
    targetSymbol: '5',
    targetColor: 'text-amber-600',
    targetName: 'Numeral 5',
    distractors: [
      { symbol: 'S', color: 'text-amber-600' },
      { symbol: '6', color: 'text-amber-600' },
      { symbol: '2', color: 'text-amber-600' }
    ],
    itemCount: 42
  },
  {
    id: 27,
    targetSymbol: '6',
    targetColor: 'text-teal-600',
    targetName: 'Numeral 6',
    distractors: [
      { symbol: '9', color: 'text-teal-600' },
      { symbol: 'G', color: 'text-teal-600' },
      { symbol: 'b', color: 'text-teal-600' }
    ],
    itemCount: 40
  },
  {
    id: 28,
    targetSymbol: '1',
    targetColor: 'text-sky-600',
    targetName: 'Numeral 1',
    distractors: [
      { symbol: 'I', color: 'text-sky-600' },
      { symbol: 'l', color: 'text-sky-600' },
      { symbol: '|', color: 'text-sky-600' }
    ],
    itemCount: 46
  },
  {
    id: 29,
    targetSymbol: 'Z',
    targetColor: 'text-purple-600',
    targetName: 'Letter Z',
    distractors: [
      { symbol: 'N', color: 'text-purple-600' },
      { symbol: '7', color: 'text-purple-600' },
      { symbol: '2', color: 'text-purple-600' }
    ],
    itemCount: 40
  },
  {
    id: 30,
    targetSymbol: 'X',
    targetColor: 'text-red-600',
    targetName: 'Letter X',
    distractors: [
      { symbol: 'K', color: 'text-red-600' },
      { symbol: 'Y', color: 'text-red-600' },
      { symbol: 'χ', color: 'text-red-600' }
    ],
    itemCount: 42
  },
  {
    id: 31,
    targetSymbol: 'C',
    targetColor: 'text-cyan-600',
    targetName: 'Letter C',
    distractors: [
      { symbol: 'G', color: 'text-cyan-600' },
      { symbol: 'O', color: 'text-cyan-600' },
      { symbol: 'U', color: 'text-cyan-600' }
    ],
    itemCount: 44
  },
  {
    id: 32,
    targetSymbol: 'V',
    targetColor: 'text-emerald-500',
    targetName: 'Letter V',
    distractors: [
      { symbol: 'U', color: 'text-emerald-500' },
      { symbol: 'Y', color: 'text-emerald-500' },
      { symbol: 'W', color: 'text-emerald-500' }
    ],
    itemCount: 40
  },
  {
    id: 33,
    targetSymbol: 'H',
    targetColor: 'text-violet-600',
    targetName: 'Letter H',
    distractors: [
      { symbol: 'N', color: 'text-violet-600' },
      { symbol: 'M', color: 'text-violet-600' },
      { symbol: 'A', color: 'text-violet-600' }
    ],
    itemCount: 42
  },
  {
    id: 34,
    targetSymbol: 'T',
    targetColor: 'text-amber-500',
    targetName: 'Letter T',
    distractors: [
      { symbol: 'I', color: 'text-amber-500' },
      { symbol: 'F', color: 'text-amber-500' },
      { symbol: 'J', color: 'text-amber-500' }
    ],
    itemCount: 40
  },
  {
    id: 35,
    targetSymbol: 'K',
    targetColor: 'text-rose-500',
    targetName: 'Letter K',
    distractors: [
      { symbol: 'X', color: 'text-rose-500' },
      { symbol: 'R', color: 'text-rose-500' },
      { symbol: 'H', color: 'text-rose-500' }
    ],
    itemCount: 42
  },
  {
    id: 36,
    targetSymbol: 'B',
    targetColor: 'text-blue-500',
    targetName: 'Letter B',
    distractors: [
      { symbol: '8', color: 'text-blue-500' },
      { symbol: 'P', color: 'text-blue-500' },
      { symbol: 'R', color: 'text-blue-500' }
    ],
    itemCount: 44
  },
  {
    id: 37,
    targetSymbol: 'J',
    targetColor: 'text-lime-600',
    targetName: 'Letter J',
    distractors: [
      { symbol: 'I', color: 'text-lime-600' },
      { symbol: 'L', color: 'text-lime-600' },
      { symbol: 'U', color: 'text-lime-600' }
    ],
    itemCount: 38
  },
  {
    id: 38,
    targetSymbol: 'G',
    targetColor: 'text-fuchsia-600',
    targetName: 'Letter G',
    distractors: [
      { symbol: 'C', color: 'text-fuchsia-600' },
      { symbol: '6', color: 'text-fuchsia-600' },
      { symbol: 'O', color: 'text-fuchsia-600' }
    ],
    itemCount: 42
  },
  {
    id: 39,
    targetSymbol: 'Y',
    targetColor: 'text-teal-500',
    targetName: 'Letter Y',
    distractors: [
      { symbol: 'V', color: 'text-teal-500' },
      { symbol: 'T', color: 'text-teal-500' },
      { symbol: 'X', color: 'text-teal-500' }
    ],
    itemCount: 40
  },
  {
    id: 40,
    targetSymbol: 'A',
    targetColor: 'text-orange-600',
    targetName: 'Letter A',
    distractors: [
      { symbol: '4', color: 'text-orange-600' },
      { symbol: 'H', color: 'text-orange-600' },
      { symbol: 'Δ', color: 'text-orange-600' }
    ],
    itemCount: 42
  },

  // 41-60: Directional Arrows & Navigation Symbols
  {
    id: 41,
    targetSymbol: '⬆',
    targetColor: 'text-sky-600',
    targetName: 'Arrow Up',
    distractors: [
      { symbol: '⬇', color: 'text-sky-600' },
      { symbol: '⬅', color: 'text-sky-600' },
      { symbol: '➡', color: 'text-sky-600' }
    ],
    itemCount: 36
  },
  {
    id: 42,
    targetSymbol: '↗',
    targetColor: 'text-emerald-600',
    targetName: 'Arrow Up-Right',
    distractors: [
      { symbol: '↖', color: 'text-emerald-600' },
      { symbol: '↘', color: 'text-emerald-600' },
      { symbol: '↙', color: 'text-emerald-600' }
    ],
    itemCount: 40
  },
  {
    id: 43,
    targetSymbol: '⇦',
    targetColor: 'text-indigo-600',
    targetName: 'Thick Left Arrow',
    distractors: [
      { symbol: '⇨', color: 'text-indigo-600' },
      { symbol: '⇧', color: 'text-indigo-600' },
      { symbol: '⇩', color: 'text-indigo-600' }
    ],
    itemCount: 42
  },
  {
    id: 44,
    targetSymbol: '➔',
    targetColor: 'text-rose-500',
    targetName: 'Right Pointing Dart',
    distractors: [
      { symbol: '➜', color: 'text-rose-500' },
      { symbol: '➝', color: 'text-rose-500' },
      { symbol: '➞', color: 'text-rose-500' }
    ],
    itemCount: 44
  },
  {
    id: 45,
    targetSymbol: '↻',
    targetColor: 'text-amber-500',
    targetName: 'Clockwise Circle Arrow',
    distractors: [
      { symbol: '↺', color: 'text-amber-500' },
      { symbol: '⇄', color: 'text-amber-500' },
      { symbol: '⇅', color: 'text-amber-500' }
    ],
    itemCount: 38
  },
  {
    id: 46,
    targetSymbol: '⇄',
    targetColor: 'text-purple-600',
    targetName: 'Horizontal Opposite Arrows',
    distractors: [
      { symbol: '⇅', color: 'text-purple-600' },
      { symbol: '⇆', color: 'text-purple-600' },
      { symbol: '⇋', color: 'text-purple-600' }
    ],
    itemCount: 40
  },
  {
    id: 47,
    targetSymbol: '▲',
    targetColor: 'text-teal-600',
    targetName: 'Up Pointer',
    distractors: [
      { symbol: '◀', color: 'text-teal-600' },
      { symbol: '▶', color: 'text-teal-600' },
      { symbol: '▼', color: 'text-teal-600' }
    ],
    itemCount: 42
  },
  {
    id: 48,
    targetSymbol: '↰',
    targetColor: 'text-cyan-600',
    targetName: 'Corner Arrow Up-Left',
    distractors: [
      { symbol: '↱', color: 'text-cyan-600' },
      { symbol: '↲', color: 'text-cyan-600' },
      { symbol: '↳', color: 'text-cyan-600' }
    ],
    itemCount: 40
  },
  {
    id: 49,
    targetSymbol: '➢',
    targetColor: 'text-orange-500',
    targetName: 'Right Speartip Arrow',
    distractors: [
      { symbol: '➣', color: 'text-orange-500' },
      { symbol: '➤', color: 'text-orange-500' },
      { symbol: '➡', color: 'text-orange-500' }
    ],
    itemCount: 42
  },
  {
    id: 50,
    targetSymbol: '⇪',
    targetColor: 'text-blue-500',
    targetName: 'Caps Lock Arrow',
    distractors: [
      { symbol: '⇧', color: 'text-blue-500' },
      { symbol: '⇑', color: 'text-blue-500' },
      { symbol: '↑', color: 'text-blue-500' }
    ],
    itemCount: 40
  },
  {
    id: 51,
    targetSymbol: '⇘',
    targetColor: 'text-lime-600',
    targetName: 'Double Diagonal SE Arrow',
    distractors: [
      { symbol: '⇗', color: 'text-lime-600' },
      { symbol: '⇖', color: 'text-lime-600' },
      { symbol: '⇙', color: 'text-lime-600' }
    ],
    itemCount: 42
  },
  {
    id: 52,
    targetSymbol: '⏩',
    targetColor: 'text-fuchsia-500',
    targetName: 'Fast Forward Arrows',
    distractors: [
      { symbol: '⏪', color: 'text-fuchsia-500' },
      { symbol: '▶', color: 'text-fuchsia-500' },
      { symbol: '◀', color: 'text-fuchsia-500' }
    ],
    itemCount: 38
  },
  {
    id: 53,
    targetSymbol: '⤿',
    targetColor: 'text-amber-600',
    targetName: 'Curved Right Arc',
    distractors: [
      { symbol: '⤾', color: 'text-amber-600' },
      { symbol: '⤵', color: 'text-amber-600' },
      { symbol: '⤴', color: 'text-amber-600' }
    ],
    itemCount: 40
  },
  {
    id: 54,
    targetSymbol: '⮑',
    targetColor: 'text-violet-500',
    targetName: 'Return Branch Arrow',
    distractors: [
      { symbol: '⮐', color: 'text-violet-500' },
      { symbol: '⮒', color: 'text-violet-500' },
      { symbol: '⮓', color: 'text-violet-500' }
    ],
    itemCount: 42
  },
  {
    id: 55,
    targetSymbol: '▲',
    targetColor: 'text-red-500',
    targetName: 'Red Arrowhead',
    distractors: [
      { symbol: '▲', color: 'text-orange-500' },
      { symbol: '▲', color: 'text-amber-500' },
      { symbol: '▼', color: 'text-red-500' }
    ],
    itemCount: 44
  },
  {
    id: 56,
    targetSymbol: '⮞',
    targetColor: 'text-emerald-500',
    targetName: 'Black Shaded Dart Right',
    distractors: [
      { symbol: '⮜', color: 'text-emerald-500' },
      { symbol: '⮝', color: 'text-emerald-500' },
      { symbol: '⮟', color: 'text-emerald-500' }
    ],
    itemCount: 40
  },
  {
    id: 57,
    targetSymbol: '↹',
    targetColor: 'text-sky-500',
    targetName: 'Tab Left-Right Stop',
    distractors: [
      { symbol: '⇄', color: 'text-sky-500' },
      { symbol: '⇋', color: 'text-sky-500' },
      { symbol: '⇆', color: 'text-sky-500' }
    ],
    itemCount: 38
  },
  {
    id: 58,
    targetSymbol: '↥',
    targetColor: 'text-teal-600',
    targetName: 'Up Arrow to Bar',
    distractors: [
      { symbol: '↧', color: 'text-teal-600' },
      { symbol: '↦', color: 'text-teal-600' },
      { symbol: '↤', color: 'text-teal-600' }
    ],
    itemCount: 40
  },
  {
    id: 59,
    targetSymbol: '⤤',
    targetColor: 'text-indigo-600',
    targetName: 'Up-Right Double Bend',
    distractors: [
      { symbol: '⤥', color: 'text-indigo-600' },
      { symbol: '⤦', color: 'text-indigo-600' },
      { symbol: '<ctrl42>', color: 'text-indigo-600' }
    ],
    itemCount: 42
  },
  {
    id: 60,
    targetSymbol: '➔',
    targetColor: 'text-yellow-600',
    targetName: 'Yellow Bold Pointer',
    distractors: [
      { symbol: '➔', color: 'text-amber-500' },
      { symbol: '➔', color: 'text-orange-500' },
      { symbol: '⬅', color: 'text-yellow-600' }
    ],
    itemCount: 44
  },

  // 61-80: Math, Physics, & Greek Letter Patterns
  {
    id: 61,
    targetSymbol: 'Ω',
    targetColor: 'text-blue-600',
    targetName: 'Greek Omega',
    distractors: [
      { symbol: 'ω', color: 'text-blue-600' },
      { symbol: 'O', color: 'text-blue-600' },
      { symbol: '℧', color: 'text-blue-600' }
    ],
    itemCount: 40
  },
  {
    id: 62,
    targetSymbol: 'Σ',
    targetColor: 'text-rose-600',
    targetName: 'Greek Sigma',
    distractors: [
      { symbol: 'E', color: 'text-rose-600' },
      { symbol: 'M', color: 'text-rose-600' },
      { symbol: 'σ', color: 'text-rose-600' }
    ],
    itemCount: 42
  },
  {
    id: 63,
    targetSymbol: 'π',
    targetColor: 'text-amber-600',
    targetName: 'Greek Pi',
    distractors: [
      { symbol: 'n', color: 'text-amber-600' },
      { symbol: 'Π', color: 'text-amber-600' },
      { symbol: 'μ', color: 'text-amber-600' }
    ],
    itemCount: 44
  },
  {
    id: 64,
    targetSymbol: 'Δ',
    targetColor: 'text-teal-600',
    targetName: 'Greek Delta',
    distractors: [
      { symbol: '▲', color: 'text-teal-600' },
      { symbol: 'A', color: 'text-teal-600' },
      { symbol: '∇', color: 'text-teal-600' }
    ],
    itemCount: 40
  },
  {
    id: 65,
    targetSymbol: 'λ',
    targetColor: 'text-emerald-600',
    targetName: 'Greek Lambda',
    distractors: [
      { symbol: 'y', color: 'text-emerald-600' },
      { symbol: '人', color: 'text-emerald-600' },
      { symbol: 'x', color: 'text-emerald-600' }
    ],
    itemCount: 42
  },
  {
    id: 66,
    targetSymbol: 'θ',
    targetColor: 'text-indigo-600',
    targetName: 'Greek Theta',
    distractors: [
      { symbol: 'o', color: 'text-indigo-600' },
      { symbol: '0', color: 'text-indigo-600' },
      { symbol: 'Φ', color: 'text-indigo-600' }
    ],
    itemCount: 44
  },
  {
    id: 67,
    targetSymbol: '∞',
    targetColor: 'text-fuchsia-600',
    targetName: 'Infinity Symbol',
    distractors: [
      { symbol: '8', color: 'text-fuchsia-600' },
      { symbol: '%', color: 'text-fuchsia-600' },
      { symbol: '∝', color: 'text-fuchsia-600' }
    ],
    itemCount: 42
  },
  {
    id: 68,
    targetSymbol: '√',
    targetColor: 'text-sky-600',
    targetName: 'Square Root Radical',
    distractors: [
      { symbol: 'v', color: 'text-sky-600' },
      { symbol: '✓', color: 'text-sky-600' },
      { symbol: 'r', color: 'text-sky-600' }
    ],
    itemCount: 40
  },
  {
    id: 69,
    targetSymbol: '∫',
    targetColor: 'text-violet-600',
    targetName: 'Integral Sign',
    distractors: [
      { symbol: 'f', color: 'text-violet-600' },
      { symbol: 's', color: 'text-violet-600' },
      { symbol: '§', color: 'text-violet-600' }
    ],
    itemCount: 42
  },
  {
    id: 70,
    targetSymbol: '≈',
    targetColor: 'text-amber-500',
    targetName: 'Approximately Equals',
    distractors: [
      { symbol: '=', color: 'text-amber-500' },
      { symbol: '≡', color: 'text-amber-500' },
      { symbol: '~', color: 'text-amber-500' }
    ],
    itemCount: 44
  },
  {
    id: 71,
    targetSymbol: '≠',
    targetColor: 'text-rose-500',
    targetName: 'Not Equals Sign',
    distractors: [
      { symbol: '=', color: 'text-rose-500' },
      { symbol: '±', color: 'text-rose-500' },
      { symbol: '≢', color: 'text-rose-500' }
    ],
    itemCount: 40
  },
  {
    id: 72,
    targetSymbol: '±',
    targetColor: 'text-teal-500',
    targetName: 'Plus-Minus Symbol',
    distractors: [
      { symbol: '+', color: 'text-teal-500' },
      { symbol: '-', color: 'text-teal-500' },
      { symbol: '∓', color: 'text-teal-500' }
    ],
    itemCount: 42
  },
  {
    id: 73,
    targetSymbol: '∈',
    targetColor: 'text-blue-500',
    targetName: 'Element Of',
    distractors: [
      { symbol: 'E', color: 'text-blue-500' },
      { symbol: 'e', color: 'text-blue-500' },
      { symbol: '∉', color: 'text-blue-500' }
    ],
    itemCount: 40
  },
  {
    id: 74,
    targetSymbol: '⊆',
    targetColor: 'text-cyan-500',
    targetName: 'Subset Equals',
    distractors: [
      { symbol: '⊂', color: 'text-cyan-500' },
      { symbol: 'C', color: 'text-cyan-500' },
      { symbol: '⊇', color: 'text-cyan-500' }
    ],
    itemCount: 42
  },
  {
    id: 75,
    targetSymbol: 'Ψ',
    targetColor: 'text-purple-500',
    targetName: 'Greek Psi (Trident)',
    distractors: [
      { symbol: 'Y', color: 'text-purple-500' },
      { symbol: 'ψ', color: 'text-purple-500' },
      { symbol: 'Φ', color: 'text-purple-500' }
    ],
    itemCount: 44
  },
  {
    id: 76,
    targetSymbol: '∇',
    targetColor: 'text-emerald-500',
    targetName: 'Nabla Del Operator',
    distractors: [
      { symbol: 'Δ', color: 'text-emerald-500' },
      { symbol: '▼', color: 'text-emerald-500' },
      { symbol: 'V', color: 'text-emerald-500' }
    ],
    itemCount: 40
  },
  {
    id: 77,
    targetSymbol: '∂',
    targetColor: 'text-orange-500',
    targetName: 'Partial Derivative',
    distractors: [
      { symbol: 'd', color: 'text-orange-500' },
      { symbol: 'δ', color: 'text-orange-500' },
      { symbol: '6', color: 'text-orange-500' }
    ],
    itemCount: 42
  },
  {
    id: 78,
    targetSymbol: '∩',
    targetColor: 'text-lime-600',
    targetName: 'Intersection Cap',
    distractors: [
      { symbol: '∪', color: 'text-lime-600' },
      { symbol: 'n', color: 'text-lime-600' },
      { symbol: 'u', color: 'text-lime-600' }
    ],
    itemCount: 44
  },
  {
    id: 79,
    targetSymbol: '∧',
    targetColor: 'text-rose-600',
    targetName: 'Logical Conjunction (AND)',
    distractors: [
      { symbol: '∨', color: 'text-rose-600' },
      { symbol: '^', color: 'text-rose-600' },
      { symbol: 'A', color: 'text-rose-600' }
    ],
    itemCount: 40
  },
  {
    id: 80,
    targetSymbol: '⊕',
    targetColor: 'text-indigo-500',
    targetName: 'Direct Sum / XOR',
    distractors: [
      { symbol: '⊗', color: 'text-indigo-500' },
      { symbol: '⊙', color: 'text-indigo-500' },
      { symbol: '⊘', color: 'text-indigo-500' }
    ],
    itemCount: 42
  },

  // 81-100: Complex Distractor Arrays & Tactical Icons
  {
    id: 81,
    targetSymbol: '♞',
    targetColor: 'text-slate-800',
    targetName: 'Chess Knight',
    distractors: [
      { symbol: '♝', color: 'text-slate-800' },
      { symbol: '♜', color: 'text-slate-800' },
      { symbol: '♟', color: 'text-slate-800' }
    ],
    itemCount: 38
  },
  {
    id: 82,
    targetSymbol: '♛',
    targetColor: 'text-amber-600',
    targetName: 'Chess Queen',
    distractors: [
      { symbol: '♚', color: 'text-amber-600' },
      { symbol: '♝', color: 'text-amber-600' },
      { symbol: '♛', color: 'text-slate-400' }
    ],
    itemCount: 40
  },
  {
    id: 83,
    targetSymbol: '⚑',
    targetColor: 'text-rose-600',
    targetName: 'Waving Flag',
    distractors: [
      { symbol: '⚐', color: 'text-rose-600' },
      { symbol: '⚑', color: 'text-slate-400' },
      { symbol: 'P', color: 'text-rose-600' }
    ],
    itemCount: 42
  },
  {
    id: 84,
    targetSymbol: '⚓',
    targetColor: 'text-sky-600',
    targetName: 'Nautical Anchor',
    distractors: [
      { symbol: '⚓', color: 'text-slate-400' },
      { symbol: '⛯', color: 'text-sky-600' },
      { symbol: '☍', color: 'text-sky-600' }
    ],
    itemCount: 40
  },
  {
    id: 85,
    targetSymbol: '⚡',
    targetColor: 'text-yellow-500',
    targetName: 'High Voltage Bolt',
    distractors: [
      { symbol: '⚡', color: 'text-amber-600' },
      { symbol: '⚡', color: 'text-slate-400' },
      { symbol: 'N', color: 'text-yellow-500' }
    ],
    itemCount: 44
  },
  {
    id: 86,
    targetSymbol: '☀',
    targetColor: 'text-orange-500',
    targetName: 'Radiant Sun',
    distractors: [
      { symbol: '☼', color: 'text-orange-500' },
      { symbol: '☀', color: 'text-yellow-500' },
      { symbol: '●', color: 'text-orange-500' }
    ],
    itemCount: 42
  },
  {
    id: 87,
    targetSymbol: '☽',
    targetColor: 'text-indigo-500',
    targetName: 'Crescent Moon',
    distractors: [
      { symbol: '☾', color: 'text-indigo-500' },
      { symbol: '☽', color: 'text-slate-400' },
      { symbol: 'C', color: 'text-indigo-500' }
    ],
    itemCount: 40
  },
  {
    id: 88,
    targetSymbol: '☁',
    targetColor: 'text-cyan-600',
    targetName: 'Cumulus Cloud',
    distractors: [
      { symbol: '⛅', color: 'text-cyan-600' },
      { symbol: '☁', color: 'text-blue-400' },
      { symbol: '☁', color: 'text-slate-400' }
    ],
    itemCount: 38
  },
  {
    id: 89,
    targetSymbol: '♫',
    targetColor: 'text-purple-600',
    targetName: 'Eighth Notes Pair',
    distractors: [
      { symbol: '♪', color: 'text-purple-600' },
      { symbol: '♬', color: 'text-purple-600' },
      { symbol: '♫', color: 'text-rose-500' }
    ],
    itemCount: 44
  },
  {
    id: 90,
    targetSymbol: '♥',
    targetColor: 'text-rose-600',
    targetName: 'Solid Heart Suit',
    distractors: [
      { symbol: '♡', color: 'text-rose-600' },
      { symbol: '♥', color: 'text-purple-600' },
      { symbol: '♦', color: 'text-rose-600' }
    ],
    itemCount: 42
  },
  {
    id: 91,
    targetSymbol: '♠',
    targetColor: 'text-slate-900',
    targetName: 'Solid Spade Suit',
    distractors: [
      { symbol: '♤', color: 'text-slate-900' },
      { symbol: '♣', color: 'text-slate-900' },
      { symbol: '▲', color: 'text-slate-900' }
    ],
    itemCount: 40
  },
  {
    id: 92,
    targetSymbol: '♦',
    targetColor: 'text-red-500',
    targetName: 'Solid Diamond Suit',
    distractors: [
      { symbol: '♢', color: 'text-red-500' },
      { symbol: '♦', color: 'text-amber-500' },
      { symbol: '◆', color: 'text-red-500' }
    ],
    itemCount: 42
  },
  {
    id: 93,
    targetSymbol: '♣',
    targetColor: 'text-emerald-700',
    targetName: 'Solid Club Suit',
    distractors: [
      { symbol: '♧', color: 'text-emerald-700' },
      { symbol: '♣', color: 'text-slate-800' },
      { symbol: '♠', color: 'text-emerald-700' }
    ],
    itemCount: 40
  },
  {
    id: 94,
    targetSymbol: '⚖',
    targetColor: 'text-amber-600',
    targetName: 'Scales of Balance',
    distractors: [
      { symbol: '⚖', color: 'text-slate-400' },
      { symbol: '⚑', color: 'text-amber-600' },
      { symbol: '⚓', color: 'text-amber-600' }
    ],
    itemCount: 38
  },
  {
    id: 95,
    targetSymbol: '⚙',
    targetColor: 'text-teal-600',
    targetName: 'Mechanical Cog Gear',
    distractors: [
      { symbol: '⚙', color: 'text-slate-400' },
      { symbol: '☼', color: 'text-teal-600' },
      { symbol: '✸', color: 'text-teal-600' }
    ],
    itemCount: 42
  },
  {
    id: 96,
    targetSymbol: '✿',
    targetColor: 'text-pink-500',
    targetName: 'Cherry Blossom Petal',
    distractors: [
      { symbol: '❀', color: 'text-pink-500' },
      { symbol: '❁', color: 'text-pink-500' },
      { symbol: '✿', color: 'text-purple-400' }
    ],
    itemCount: 40
  },
  {
    id: 97,
    targetSymbol: '❆',
    targetColor: 'text-cyan-500',
    targetName: 'Intricate Snowflake',
    distractors: [
      { symbol: '❅', color: 'text-cyan-500' },
      { symbol: '❄', color: 'text-cyan-500' },
      { symbol: '❆', color: 'text-blue-300' }
    ],
    itemCount: 44
  },
  {
    id: 98,
    targetSymbol: '☕',
    targetColor: 'text-amber-800',
    targetName: 'Steaming Cup',
    distractors: [
      { symbol: '☕', color: 'text-slate-400' },
      { symbol: '♨', color: 'text-amber-800' },
      { symbol: '⛾', color: 'text-amber-800' }
    ],
    itemCount: 38
  },
  {
    id: 99,
    targetSymbol: '✈',
    targetColor: 'text-blue-600',
    targetName: 'Airplane Silhouette',
    distractors: [
      { symbol: '✈', color: 'text-slate-400' },
      { symbol: '↑', color: 'text-blue-600' },
      { symbol: '➶', color: 'text-blue-600' }
    ],
    itemCount: 40
  },
  {
    id: 100,
    targetSymbol: '✔',
    targetColor: 'text-emerald-600',
    targetName: 'Bold Checkmark',
    distractors: [
      { symbol: '✓', color: 'text-emerald-600' },
      { symbol: '✕', color: 'text-emerald-600' },
      { symbol: '✔', color: 'text-slate-400' }
    ],
    itemCount: 42
  }
];

export function getRandomDistractionChallenges(count = 10): TargetChallenge[] {
  const shuffled = [...DISTRACTION_CHALLENGES_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
