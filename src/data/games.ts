import { GameModeInfo } from '../types';

export const GAME_MODES: Record<string, GameModeInfo> = {
  // --- Memory & Attention ---
  'memory-matrix': {
    id: 'memory-matrix',
    name: 'Memory Matrix',
    category: 'Spatial Memory',
    activityCategory: 'Memory & Attention',
    domain: 'Working Memory',
    description: 'Dynamic grid expanding from 4x4 to 6x6. Memorize flashing illuminated tiles and recreate the exact pattern.',
    difficulty: 'Adaptive',
    badgeColor: 'bg-emerald-500/20 text-emerald-700 border-emerald-500/40',
    accentColor: '#10b981',
    iconName: 'Grid3X3',
    estimatedTime: '2-3 min',
    rules: [
      'Observe the highlighted pattern flashed on the matrix grid.',
      'Recall and click the active tiles in any order.',
      'Grid expands to 5x5 and 6x6 as your level increases.',
      'Maintain combos to boost your cognitive brain power multiplier.'
    ],
    tips: 'Try chunking tiles into geometric sub-shapes rather than individual coordinates.'
  },
  'color-confusion': {
    id: 'color-confusion',
    name: 'Color Confusion (Stroop)',
    category: 'Selective Attention',
    activityCategory: 'Memory & Attention',
    domain: 'Selective Attention',
    description: 'High-speed cognitive interference test. Fast decisions matching either the written word or the text ink color.',
    difficulty: 'Fast-Paced',
    badgeColor: 'bg-amber-500/20 text-amber-700 border-amber-500/40',
    accentColor: '#f59e0b',
    iconName: 'Zap',
    estimatedTime: '60 sec',
    rules: [
      'Pay close attention to the prompt at the top ("INK COLOR" vs "WRITTEN WORD").',
      'Select the correct answer button as fast as possible before the timer decays.',
      'Speed and consecutive accuracy yield massive streak bonuses.',
      'Tests executive inhibition and mental processing speed.'
    ],
    tips: 'Suppress the automatic urge to read the word when asked for ink color.'
  },
  'number-recall': {
    id: 'number-recall',
    name: 'Number Recall',
    category: 'Numerical Memory',
    activityCategory: 'Memory & Attention',
    domain: 'Short-Term Memory',
    description: 'Multi-digit sequence memory challenge. Recall digit series forward or backward under increasing length.',
    difficulty: 'Progressive',
    badgeColor: 'bg-indigo-500/20 text-indigo-700 border-indigo-500/40',
    accentColor: '#6366f1',
    iconName: 'Binary',
    estimatedTime: '2-3 min',
    rules: [
      'Watch the number stream presented digit-by-digit.',
      'Input the complete sequence using on-screen numpad or your keyboard.',
      'Toggle Reverse Mode for advanced working memory load (backward recall).',
      'Digits increase with each successful round.'
    ],
    tips: 'Auditory repetition (subvocalizing pairs of numbers) helps hold digits in short-term buffer.'
  },
  'n-back': {
    id: 'n-back',
    name: 'Pattern Match (2-Back)',
    category: 'Fluid Intelligence',
    activityCategory: 'Memory & Attention',
    domain: 'Fluid Intelligence',
    description: 'The premier scientific cognitive task. Compare the current shape & color card with the item shown 2 turns ago.',
    difficulty: 'High Focus',
    badgeColor: 'bg-cyan-500/20 text-cyan-700 border-cyan-500/40',
    accentColor: '#06b6d4',
    iconName: 'Repeat',
    estimatedTime: '2 min',
    rules: [
      'A continuous sequence of colored geometric cards will be displayed.',
      'For each card, judge if it MATCHES the card shown exactly 2 steps before.',
      'Press "MATCH" (or Space/Right Arrow) if identical; "NO MATCH" (or Left Arrow) if different.',
      'Keep track of the rolling 2-item history window in your mind.'
    ],
    tips: 'Maintain a 2-slot mental queue: update position 1 and position 2 sequentially with every new card.'
  },
  'matching-cards': {
    id: 'matching-cards',
    name: 'Matching Cards',
    category: 'Visual Association',
    activityCategory: 'Memory & Attention',
    domain: 'Working Memory',
    description: 'Classic memory-match grid. Flip hidden card pairs to locate matching brain icons while minimizing moves and time.',
    difficulty: 'Adaptive',
    badgeColor: 'bg-teal-500/20 text-teal-700 border-teal-500/40',
    accentColor: '#14b8a6',
    iconName: 'Layers',
    estimatedTime: '2 min',
    rules: [
      'Click or tap any two hidden cards to flip them over.',
      'If the symbols match, they lock in place and boost your score.',
      'If they mismatch, they turn back over—remember their locations!',
      'Clear all pairs in as few flips as possible for maximum stars.'
    ],
    tips: 'Anchor your scan order: memorize cards row-by-row or cluster nearby icons.'
  },
  'recall-sequence': {
    id: 'recall-sequence',
    name: 'Recall Sequences (Simon)',
    category: 'Sensory Working Memory',
    activityCategory: 'Memory & Attention',
    domain: 'Working Memory',
    description: 'Classic Simon-style audiovisual sequence test. Watch vibrant colored pads light up with harmonic tones and repeat the exact chain.',
    difficulty: 'Progressive',
    badgeColor: 'bg-violet-500/20 text-violet-700 border-violet-500/40',
    accentColor: '#8b5cf6',
    iconName: 'Radio',
    estimatedTime: '2-3 min',
    rules: [
      'Observe the sequence of glowing quadrant pads and note the musical tones.',
      'Replay the sequence accurately in order by tapping the pads.',
      'Each round extends the sequence length by +1 item.',
      'A single mistake ends the trial and measures your exact memory span.'
    ],
    tips: 'Associate the sounds or numbers (1-4) with spatial directions (Top, Right, Bottom, Left).'
  },
  'distraction-task': {
    id: 'distraction-task',
    name: 'Distraction Search',
    category: 'Visual Search & Inhibit',
    activityCategory: 'Memory & Attention',
    domain: 'Selective Attention',
    description: 'Spot target objects in a dense visual field of moving and static distractors under intense time pressure.',
    difficulty: 'Fast-Paced',
    badgeColor: 'bg-rose-500/20 text-rose-700 border-rose-500/40',
    accentColor: '#f43f5e',
    iconName: 'Eye',
    estimatedTime: '90 sec',
    rules: [
      'Identify the designated target item displayed at the top bar.',
      'Scan the crowded visual grid to locate and tap the target among similar distractors.',
      'Distractor density and visual noise escalate every round.',
      'Rapid identification awards time bonuses and streak multipliers.'
    ],
    tips: 'Use peripheral vision to filter out common colors before focusing foveal attention on shape differences.'
  },

  // --- Cognitive and Puzzle Activities ---
  'logic-puzzles': {
    id: 'logic-puzzles',
    name: 'Logic Puzzles (Sudoku & Nonograms)',
    category: 'Deductive Logic',
    activityCategory: 'Cognitive & Puzzles',
    domain: 'Spatial Reasoning',
    description: 'Grid-based deductive reasoning challenges. Solve Mini-Sudoku number sprints and Nonogram pixel reveal puzzles.',
    difficulty: 'High Focus',
    badgeColor: 'bg-blue-500/20 text-blue-700 border-blue-500/40',
    accentColor: '#3b82f6',
    iconName: 'Puzzle',
    estimatedTime: '3-5 min',
    rules: [
      'Sudoku Sprint: Place digits so no row, column, or subgrid contains duplicate numbers.',
      'Nonogram Mode: Shade grid cells matching the row and column numerical clues.',
      'Pencil notes and error verification assist your deductive process.',
      'Completing grids without hints yields maximum brain power points.'
    ],
    tips: 'Use process of elimination: find cells with only one possible candidate remaining.'
  },
  'word-games': {
    id: 'word-games',
    name: 'Word Games (Anagrams & Vocab)',
    category: 'Lexical Processing',
    activityCategory: 'Cognitive & Puzzles',
    domain: 'Language Processing',
    description: 'Linguistic stimulation challenges. Unscramble anagrams, solve word chains, and test rapid vocabulary recognition.',
    difficulty: 'Adaptive',
    badgeColor: 'bg-emerald-500/20 text-emerald-700 border-emerald-500/40',
    accentColor: '#059669',
    iconName: 'SpellCheck',
    estimatedTime: '2-3 min',
    rules: [
      'Rearrange jumbled letter tiles into valid dictionary words.',
      'Use semantic clues and prefix/suffix recognition to crack tough words.',
      'Quick vocabulary rounds challenge synonym and antonym precision.',
      'Solve multiple words within the countdown window for streak multipliers.'
    ],
    tips: 'Group common consonant blends (ST, TR, CH) and vowel digraphs (EA, OU) first.'
  },
  'pattern-recognition': {
    id: 'pattern-recognition',
    name: 'Pattern Recognition',
    category: 'Abstract Reasoning',
    activityCategory: 'Cognitive & Puzzles',
    domain: 'Fluid Intelligence',
    description: 'Find the missing step in progressive sequences of shapes, colors, rotations, and number matrices.',
    difficulty: 'High Focus',
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-700 border-fuchsia-500/40',
    accentColor: '#d946ef',
    iconName: 'Boxes',
    estimatedTime: '2-4 min',
    rules: [
      'Examine the sequential series of symbols or numerical transformations.',
      'Identify the underlying logical rule (rotational angle, count, symmetry, or math).',
      'Select the exact element that logically completes the pattern sequence.',
      'Detailed rule breakdowns explain each solution upon submission.'
    ],
    tips: 'Track one variable at a time: analyze shape changes first, then color shifts, then rotational steps.'
  },

  // --- Mindfulness and Relaxation ---
  'guided-meditation': {
    id: 'guided-meditation',
    name: 'Guided Meditation',
    category: 'Attentional Reset',
    activityCategory: 'Mindfulness & Relaxation',
    domain: 'Mindfulness & Calm',
    description: 'Short audio sessions and ambient soundscapes to lower cortisol, quiet neural noise, and sharpen cognitive focus.',
    difficulty: 'Mindful',
    badgeColor: 'bg-sky-500/20 text-sky-700 border-sky-500/40',
    accentColor: '#0284c7',
    iconName: 'Headphones',
    estimatedTime: '3-5 min',
    rules: [
      'Select a focus theme: Deep Focus Reset, Clarity Scan, or Pre-Challenge Grounding.',
      'Toggle synthesized ambient soundscapes (Gentle Rain, 10Hz Alpha Waves, Ocean Swell).',
      'Follow step-by-step mindful prompts and resonant Tibetan singing bowl cues.',
      'Rest your working memory buffer for optimal cognitive performance.'
    ],
    tips: 'When your mind wanders, acknowledge the thought without judgment and return attention to the ambient sound.'
  },
  'breathing-pacer': {
    id: 'breathing-pacer',
    name: 'Breathing Exercises (Breath Pacer)',
    category: 'Vagal Regulation',
    activityCategory: 'Mindfulness & Relaxation',
    domain: 'Mindfulness & Calm',
    description: 'Visual breath-pacer animations with Box Breathing, 4-7-8 Calm, and Coherent Resonance to regulate heart-rate variability.',
    difficulty: 'Mindful',
    badgeColor: 'bg-cyan-500/20 text-cyan-700 border-cyan-500/40',
    accentColor: '#0891b2',
    iconName: 'Wind',
    estimatedTime: '2-4 min',
    rules: [
      'Choose a breathing protocol: Box (4-4-4-4), Relaxing (4-7-8), or Coherent (5.5s-5.5s).',
      'Synchronize your breath with the expanding and contracting visual orb.',
      'Harmonic audio chimes guide your inhalation, hold, and exhalation phases.',
      'Complete recommended cycles to restore executive cognitive control.'
    ],
    tips: 'Breathe deeply from the diaphragm rather than shallow chest breathing for maximum vagal nerve stimulation.'
  },
  'journaling-prompts': {
    id: 'journaling-prompts',
    name: 'Journaling & Reflection',
    category: 'Emotional Processing',
    activityCategory: 'Mindfulness & Relaxation',
    domain: 'Mindfulness & Calm',
    description: 'Daily gratitude, cognitive reflection, and emotional processing prompts to build metacognition and psychological resilience.',
    difficulty: 'Mindful',
    badgeColor: 'bg-amber-500/20 text-amber-700 border-amber-500/40',
    accentColor: '#d97706',
    iconName: 'BookOpen',
    estimatedTime: '3-5 min',
    rules: [
      'Choose from Gratitude, Mindset Growth, Cognitive Wins, or Self-Reflection prompts.',
      'Record your current mental state using the emotion and energy tags.',
      'Free-write your thoughts in the distraction-free reflection workspace.',
      'Entries are stored in your private athlete profile to track your mental journey.'
    ],
    tips: 'Be specific about small details—identifying concrete gratitude triggers activates dopaminergic reward pathways.'
  },

  // --- Physical and Dual-Task Challenges ---
  'reaction-drill': {
    id: 'reaction-drill',
    name: 'Quick-Reaction Drill',
    category: 'Neuromuscular Velocity',
    activityCategory: 'Physical & Dual-Task',
    domain: 'Processing Speed',
    description: 'High-precision visual stimulus response speed test. Measure processing latency down to the millisecond with false-start detection.',
    difficulty: 'Reflexive',
    badgeColor: 'bg-red-500/20 text-red-700 border-red-500/40',
    accentColor: '#ef4444',
    iconName: 'Gauge',
    estimatedTime: '60 sec',
    rules: [
      'Wait patiently while the large indicator pad is RED ("WAIT FOR GREEN").',
      'The moment the screen turns ELECTRIC GREEN, tap, click, or hit Spacebar instantly!',
      'Premature clicks trigger a false-start penalty—stay poised.',
      'Complete 5 rapid trials to compute your average latency and reflex tier.'
    ],
    tips: 'Rest your finger lightly on the trigger key and keep your eye relaxed on the center field.'
  },
  'stretching-dual': {
    id: 'stretching-dual',
    name: 'Stretching & Dual-Task Drills',
    category: 'Mind-Body Integration',
    activityCategory: 'Physical & Dual-Task',
    domain: 'Mind-Body Coordination',
    description: 'Physical ergonomic stretching poses paired with simultaneous mental arithmetic and cognitive verbal challenges.',
    difficulty: 'Adaptive',
    badgeColor: 'bg-emerald-500/20 text-emerald-700 border-emerald-500/40',
    accentColor: '#10b981',
    iconName: 'Activity',
    estimatedTime: '3-5 min',
    rules: [
      'Adopt the instructed physical stretch (neck release, shoulder opener, twist, forward fold).',
      'Hold the physical stretch pose for the 30-second visual countdown.',
      'Simultaneously solve the active cognitive challenge (backward spelling, mental math, verbal recall).',
      'Reinforces neuroplastic mind-body connection and posture hygiene.'
    ],
    tips: 'Maintain continuous, deep breaths while holding the physical pose and computing the mental task.'
  }
};

