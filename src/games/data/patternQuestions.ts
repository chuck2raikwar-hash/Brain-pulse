export interface PatternQuestion {
  id: number;
  domain: string;
  questionText: string;
  sequenceVisuals: { label: string; sub?: string }[];
  options: { label: string; sub?: string }[];
  correctIndex: number;
  explanation: string;
}

export const PATTERN_QUESTIONS_POOL: PatternQuestion[] = [
  // 1-10: Geometric & Vertices
  {
    id: 1,
    domain: 'Geometric Vertex Progression',
    questionText: 'Which geometric shape logically completes the sequence?',
    sequenceVisuals: [
      { label: '▲', sub: '3 sides' },
      { label: '■', sub: '4 sides' },
      { label: '⬟', sub: '5 sides' },
      { label: '?', sub: 'Missing' }
    ],
    options: [
      { label: '⬢', sub: '6 sides (Hexagon)' },
      { label: '●', sub: 'Infinite (Circle)' },
      { label: '◆', sub: '4 sides (Rhombus)' },
      { label: '▼', sub: '3 sides (Triangle)' }
    ],
    correctIndex: 0,
    explanation: 'Polygon vertices increment by +1 sequentially: 3 (Triangle) → 4 (Square) → 5 (Pentagon) → 6 (Hexagon).'
  },
  {
    id: 2,
    domain: 'Exponential Growth',
    questionText: 'Determine the missing number in this progressive matrix sequence:',
    sequenceVisuals: [
      { label: '3', sub: 'Step 1' },
      { label: '9', sub: 'Step 2' },
      { label: '27', sub: 'Step 3' },
      { label: '?', sub: 'Step 4' }
    ],
    options: [
      { label: '54', sub: 'Option A' },
      { label: '81', sub: 'Option B' },
      { label: '64', sub: 'Option C' },
      { label: '72', sub: 'Option D' }
    ],
    correctIndex: 1,
    explanation: 'Each subsequent term is multiplied by 3 (Powers of 3: 3¹=3, 3²=9, 3³=27, 3⁴=81).'
  },
  {
    id: 3,
    domain: 'Rotational Symmetry',
    questionText: 'Observe the clock-face rotational angle of the arrow:',
    sequenceVisuals: [
      { label: '⬆', sub: '12:00 (0°)' },
      { label: '➡', sub: '3:00 (90°)' },
      { label: '⬇', sub: '6:00 (180°)' },
      { label: '?', sub: '9:00 (?)' }
    ],
    options: [
      { label: '⬅', sub: '270° Clockwise' },
      { label: '↗', sub: '45° Clockwise' },
      { label: '⬆', sub: '360° Reset' },
      { label: '↘', sub: '135° Clockwise' }
    ],
    correctIndex: 0,
    explanation: 'The arrow rotates +90° clockwise at each transformation step. Next is pointing Left (270°).'
  },
  {
    id: 4,
    domain: 'Fibonacci Sequence',
    questionText: 'Find the next integer in the canonical recursive summation series:',
    sequenceVisuals: [
      { label: '1', sub: 'F(1)' },
      { label: '2', sub: 'F(2)' },
      { label: '3', sub: 'F(3)' },
      { label: '5', sub: 'F(4)' },
      { label: '8', sub: 'F(5)' },
      { label: '?', sub: 'F(6)' }
    ],
    options: [
      { label: '12', sub: 'Option A' },
      { label: '13', sub: 'Option B' },
      { label: '15', sub: 'Option C' },
      { label: '16', sub: 'Option D' }
    ],
    correctIndex: 1,
    explanation: 'Each term equals the sum of the two preceding terms (5 + 8 = 13).'
  },
  {
    id: 5,
    domain: 'Alternating Operations',
    questionText: 'Identify the governing rule: Multiply by 2, then subtract 3:',
    sequenceVisuals: [
      { label: '4', sub: 'Start' },
      { label: '8', sub: '4 × 2' },
      { label: '5', sub: '8 - 3' },
      { label: '10', sub: '5 × 2' },
      { label: '7', sub: '10 - 3' },
      { label: '?', sub: 'Next' }
    ],
    options: [
      { label: '11', sub: 'Option A' },
      { label: '14', sub: 'Option B' },
      { label: '12', sub: 'Option C' },
      { label: '9', sub: 'Option D' }
    ],
    correctIndex: 1,
    explanation: 'The sequence follows an alternating operator rule: (×2, -3, ×2, -3). The next step is 7 × 2 = 14.'
  },
  {
    id: 6,
    domain: 'Color Temperature Spectrum',
    questionText: 'What is the missing step in this optical wavelength progression?',
    sequenceVisuals: [
      { label: '🔴', sub: 'Red (700nm)' },
      { label: '🟡', sub: 'Yellow (580nm)' },
      { label: '🟢', sub: 'Green (530nm)' },
      { label: '?', sub: 'Missing' }
    ],
    options: [
      { label: '🔵', sub: 'Blue (470nm)' },
      { label: '⚪', sub: 'White (Broad)' },
      { label: '⚫', sub: 'Black (Absorption)' },
      { label: '🟤', sub: 'Brown (Composite)' }
    ],
    correctIndex: 0,
    explanation: 'Following the natural visible light spectrum (ROYGBIV) from longer to shorter wavelengths: Red → Yellow → Green → Blue.'
  },
  {
    id: 7,
    domain: 'Square Numbers Progression',
    questionText: 'What is the missing square number in this quadratic sequence?',
    sequenceVisuals: [
      { label: '4', sub: '2²' },
      { label: '9', sub: '3²' },
      { label: '16', sub: '4²' },
      { label: '25', sub: '5²' },
      { label: '?', sub: '6²' }
    ],
    options: [
      { label: '30', sub: 'Option A' },
      { label: '36', sub: 'Option B' },
      { label: '49', sub: 'Option C' },
      { label: '32', sub: 'Option D' }
    ],
    correctIndex: 1,
    explanation: 'Consecutive integer squares: 2²=4, 3²=9, 4²=16, 5²=25, 6²=36.'
  },
  {
    id: 8,
    domain: 'Cube Numbers',
    questionText: 'Find the next term in the sequence of cubic numbers:',
    sequenceVisuals: [
      { label: '1', sub: '1³' },
      { label: '8', sub: '2³' },
      { label: '27', sub: '3³' },
      { label: '?', sub: '4³' }
    ],
    options: [
      { label: '54', sub: 'Option A' },
      { label: '64', sub: 'Option B' },
      { label: '81', sub: 'Option C' },
      { label: '100', sub: 'Option D' }
    ],
    correctIndex: 1,
    explanation: '1³ = 1, 2³ = 8, 3³ = 27, 4³ = 64.'
  },
  {
    id: 9,
    domain: 'Prime Numbers',
    questionText: 'Which prime number logically succeeds 19?',
    sequenceVisuals: [
      { label: '7', sub: 'Prime 4' },
      { label: '11', sub: 'Prime 5' },
      { label: '13', sub: 'Prime 6' },
      { label: '17', sub: 'Prime 7' },
      { label: '19', sub: 'Prime 8' },
      { label: '?', sub: 'Prime 9' }
    ],
    options: [
      { label: '21', sub: '3 × 7' },
      { label: '23', sub: 'Prime' },
      { label: '25', sub: '5 × 5' },
      { label: '27', sub: '3 × 9' }
    ],
    correctIndex: 1,
    explanation: '23 is the smallest prime number greater than 19 (21 and 25 are composite).'
  },
  {
    id: 10,
    domain: 'Binary Powers',
    questionText: 'Identify the next power of 2 in digital byte progression:',
    sequenceVisuals: [
      { label: '32', sub: '2⁵' },
      { label: '64', sub: '2⁶' },
      { label: '128', sub: '2⁷' },
      { label: '?', sub: '2⁸' }
    ],
    options: [
      { label: '192', sub: 'Option A' },
      { label: '256', sub: 'Option B' },
      { label: '512', sub: 'Option C' },
      { label: '240', sub: 'Option D' }
    ],
    correctIndex: 1,
    explanation: 'Each step doubles the preceding value: 128 × 2 = 256 (2⁸).'
  },

  // 11-20: Diagonal & Matrix Trajectories
  {
    id: 11,
    domain: 'Clockwise Diagonal Shift',
    questionText: 'Predict the position of the dot across this 4-quadrant cycle:',
    sequenceVisuals: [
      { label: '⌜', sub: 'Top-Left' },
      { label: '⌝', sub: 'Top-Right' },
      { label: '⌟', sub: 'Bottom-Right' },
      { label: '?', sub: 'Next Quadrant' }
    ],
    options: [
      { label: '⌞', sub: 'Bottom-Left' },
      { label: '⌜', sub: 'Top-Left' },
      { label: '•', sub: 'Center' },
      { label: '⌝', sub: 'Top-Right' }
    ],
    correctIndex: 0,
    explanation: 'The marker moves clockwise through the 4 corners: Top-Left → Top-Right → Bottom-Right → Bottom-Left.'
  },
  {
    id: 12,
    domain: 'Triangular Numbers',
    questionText: 'Find the next triangular number (sum of consecutive integers):',
    sequenceVisuals: [
      { label: '1', sub: 'T(1)' },
      { label: '3', sub: '1+2' },
      { label: '6', sub: '1+2+3' },
      { label: '10', sub: '1+2+3+4' },
      { label: '?', sub: '1+2+3+4+5' }
    ],
    options: [
      { label: '12', sub: 'Option A' },
      { label: '14', sub: 'Option B' },
      { label: '15', sub: 'Option C' },
      { label: '16', sub: 'Option D' }
    ],
    correctIndex: 2,
    explanation: 'Triangular numbers increment by n: 1 (+2) → 3 (+3) → 6 (+4) → 10 (+5) → 15.'
  },
  {
    id: 13,
    domain: 'Alphabet Jump Progression',
    questionText: 'What letter continues this skipping alphabet sequence?',
    sequenceVisuals: [
      { label: 'A', sub: 'Pos 1' },
      { label: 'C', sub: 'Pos 3 (+2)' },
      { label: 'F', sub: 'Pos 6 (+3)' },
      { label: 'J', sub: 'Pos 10 (+4)' },
      { label: '?', sub: 'Pos 15 (+5)' }
    ],
    options: [
      { label: 'M', sub: 'Pos 13' },
      { label: 'N', sub: 'Pos 14' },
      { label: 'O', sub: 'Pos 15' },
      { label: 'P', sub: 'Pos 16' }
    ],
    correctIndex: 2,
    explanation: 'The alphabet positions increment by +2, +3, +4, +5. Position 10 (J) + 5 = Position 15 (O).'
  },
  {
    id: 14,
    domain: 'Roman Numerals Addition',
    questionText: 'What is the next Roman numeral in this step-by-five series?',
    sequenceVisuals: [
      { label: 'V', sub: '5' },
      { label: 'X', sub: '10' },
      { label: 'XV', sub: '15' },
      { label: 'XX', sub: '20' },
      { label: '?', sub: '25' }
    ],
    options: [
      { label: 'XXV', sub: '25' },
      { label: 'XXX', sub: '30' },
      { label: 'XL', sub: '40' },
      { label: 'XVV', sub: 'Invalid' }
    ],
    correctIndex: 0,
    explanation: 'The sequence increments by 5: V (5) → X (10) → XV (15) → XX (20) → XXV (25).'
  },
  {
    id: 15,
    domain: 'Fractional Halving',
    questionText: 'Determine the subsequent fraction in this geometric decay pattern:',
    sequenceVisuals: [
      { label: '1', sub: '1/1' },
      { label: '1/2', sub: 'Half' },
      { label: '1/4', sub: 'Quarter' },
      { label: '1/8', sub: 'Eighth' },
      { label: '?', sub: 'Next' }
    ],
    options: [
      { label: '1/12', sub: 'Option A' },
      { label: '1/16', sub: 'Option B' },
      { label: '1/32', sub: 'Option C' },
      { label: '1/10', sub: 'Option D' }
    ],
    correctIndex: 1,
    explanation: 'The denominator doubles at each step (multiplication by 1/2): 1/8 × 1/2 = 1/16.'
  },
  {
    id: 16,
    domain: 'Negative Alternation',
    questionText: 'Find the missing number in this alternating sign sequence:',
    sequenceVisuals: [
      { label: '2', sub: 'Positive' },
      { label: '-4', sub: 'Negative' },
      { label: '8', sub: 'Positive' },
      { label: '-16', sub: 'Negative' },
      { label: '?', sub: 'Next' }
    ],
    options: [
      { label: '-32', sub: 'Option A' },
      { label: '32', sub: 'Option B' },
      { label: '24', sub: 'Option C' },
      { label: '-24', sub: 'Option D' }
    ],
    correctIndex: 1,
    explanation: 'Each term is multiplied by -2: (-16) × (-2) = +32.'
  },
  {
    id: 17,
    domain: 'Symbol Inversion',
    questionText: 'Which symbol maintains the alternating horizontal reflection?',
    sequenceVisuals: [
      { label: '▲', sub: 'Pointing Up' },
      { label: '▼', sub: 'Pointing Down' },
      { label: '▲', sub: 'Pointing Up' },
      { label: '▼', sub: 'Pointing Down' },
      { label: '?', sub: 'Next' }
    ],
    options: [
      { label: '▲', sub: 'Pointing Up' },
      { label: '◀', sub: 'Pointing Left' },
      { label: '▶', sub: 'Pointing Right' },
      { label: '◆', sub: 'Diamond' }
    ],
    correctIndex: 0,
    explanation: 'A simple period-2 alternating toggle between Up and Down. The 5th element is Up (▲).'
  },
  {
    id: 18,
    domain: 'Consecutive Difference Expansion',
    questionText: 'Analyze the gap between consecutive terms: +1, +2, +3, +4, +5:',
    sequenceVisuals: [
      { label: '2', sub: 'Base' },
      { label: '3', sub: '+1' },
      { label: '5', sub: '+2' },
      { label: '8', sub: '+3' },
      { label: '12', sub: '+4' },
      { label: '?', sub: '+5' }
    ],
    options: [
      { label: '15', sub: 'Option A' },
      { label: '16', sub: 'Option B' },
      { label: '17', sub: 'Option C' },
      { label: '18', sub: 'Option D' }
    ],
    correctIndex: 2,
    explanation: 'The difference between terms increments by 1: 12 + 5 = 17.'
  },
  {
    id: 19,
    domain: 'Dice Pip Symmetry',
    questionText: 'Opposite faces of a standard six-sided die always sum to 7. Which pair is missing?',
    sequenceVisuals: [
      { label: '1 ↔ 6', sub: 'Sum = 7' },
      { label: '2 ↔ 5', sub: 'Sum = 7' },
      { label: '3 ↔ ?', sub: 'Sum = 7' }
    ],
    options: [
      { label: '4', sub: 'Option A' },
      { label: '3', sub: 'Option B' },
      { label: '5', sub: 'Option C' },
      { label: '6', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: 'Opposite faces sum to 7: 7 - 3 = 4.'
  },
  {
    id: 20,
    domain: 'Factorial Sequence',
    questionText: 'What is 5! in this factorial sequence (n!)?',
    sequenceVisuals: [
      { label: '1', sub: '1!' },
      { label: '2', sub: '2!' },
      { label: '6', sub: '3!' },
      { label: '24', sub: '4!' },
      { label: '?', sub: '5!' }
    ],
    options: [
      { label: '96', sub: 'Option A' },
      { label: '100', sub: 'Option B' },
      { label: '120', sub: 'Option C' },
      { label: '144', sub: 'Option D' }
    ],
    correctIndex: 2,
    explanation: '5! = 5 × 4 × 3 × 2 × 1 = 120.'
  },

  // 21-40: Spatial, Clock, & Algebra Patterns
  {
    id: 21,
    domain: 'Counter-Clockwise Shift',
    questionText: 'Determine the next arrow direction in this counter-clockwise rotation (-90°):',
    sequenceVisuals: [
      { label: '⬆', sub: 'North' },
      { label: '⬅', sub: 'West' },
      { label: '⬇', sub: 'South' },
      { label: '?', sub: 'Next' }
    ],
    options: [
      { label: '➡', sub: 'East' },
      { label: '⬆', sub: 'North' },
      { label: '↖', sub: 'North-West' },
      { label: '↙', sub: 'South-West' }
    ],
    correctIndex: 0,
    explanation: 'Rotating counter-clockwise by 90°: North → West → South → East (➡).'
  },
  {
    id: 22,
    domain: 'Arithmetic Differences',
    questionText: 'Find the constant difference term:',
    sequenceVisuals: [
      { label: '14', sub: 'Term 1' },
      { label: '21', sub: '+7' },
      { label: '28', sub: '+7' },
      { label: '35', sub: '+7' },
      { label: '?', sub: '+7' }
    ],
    options: [
      { label: '40', sub: 'Option A' },
      { label: '42', sub: 'Option B' },
      { label: '45', sub: 'Option C' },
      { label: '49', sub: 'Option D' }
    ],
    correctIndex: 1,
    explanation: 'Constant arithmetic progression with step +7: 35 + 7 = 42.'
  },
  {
    id: 23,
    domain: 'Shaded Segment Fraction',
    questionText: 'What fraction comes next in the circle shading progression?',
    sequenceVisuals: [
      { label: '◔', sub: '1/4 Shaded' },
      { label: '◑', sub: '2/4 Shaded' },
      { label: '◕', sub: '3/4 Shaded' },
      { label: '?', sub: 'Next' }
    ],
    options: [
      { label: '●', sub: '4/4 (Full)' },
      { label: '○', sub: '0/4 (Empty)' },
      { label: '◐', sub: 'Inverse' },
      { label: '⊙', sub: 'Target' }
    ],
    correctIndex: 0,
    explanation: 'The circle adds 1/4 fill each step: 1/4 → 2/4 → 3/4 → 4/4 (Fully shaded solid circle ●).'
  },
  {
    id: 24,
    domain: 'Lucas Numbers',
    questionText: 'Lucas numbers follow L(n) = L(n-1) + L(n-2) starting with 2, 1. What is the next term?',
    sequenceVisuals: [
      { label: '2', sub: 'L(0)' },
      { label: '1', sub: 'L(1)' },
      { label: '3', sub: 'L(2)' },
      { label: '4', sub: 'L(3)' },
      { label: '7', sub: 'L(4)' },
      { label: '?', sub: 'L(5)' }
    ],
    options: [
      { label: '10', sub: 'Option A' },
      { label: '11', sub: 'Option B' },
      { label: '12', sub: 'Option C' },
      { label: '13', sub: 'Option D' }
    ],
    correctIndex: 1,
    explanation: 'In Lucas series, each term is the sum of the previous two: 4 + 7 = 11.'
  },
  {
    id: 25,
    domain: 'Double-Step Multiplication',
    questionText: 'What is the missing value in this exponential sequence?',
    sequenceVisuals: [
      { label: '5', sub: 'Base' },
      { label: '10', sub: '×2' },
      { label: '20', sub: '×2' },
      { label: '40', sub: '×2' },
      { label: '?', sub: '×2' }
    ],
    options: [
      { label: '60', sub: 'Option A' },
      { label: '75', sub: 'Option B' },
      { label: '80', sub: 'Option C' },
      { label: '90', sub: 'Option D' }
    ],
    correctIndex: 2,
    explanation: 'Geometric sequence with common ratio r = 2: 40 × 2 = 80.'
  },
  {
    id: 26,
    domain: 'Alphabet Reverse Skip',
    questionText: 'What letter completes this backwards step-down sequence?',
    sequenceVisuals: [
      { label: 'Z', sub: '26' },
      { label: 'X', sub: '24 (-2)' },
      { label: 'V', sub: '22 (-2)' },
      { label: 'T', sub: '20 (-2)' },
      { label: '?', sub: '18 (-2)' }
    ],
    options: [
      { label: 'R', sub: '18' },
      { label: 'S', sub: '19' },
      { label: 'Q', sub: '17' },
      { label: 'P', sub: '16' }
    ],
    correctIndex: 0,
    explanation: 'Decrementing letter positions by 2: T (20) - 2 = R (18).'
  },
  {
    id: 27,
    domain: 'Nested Concentric Rings',
    questionText: 'Which symbol logically represents the addition of a concentric ring?',
    sequenceVisuals: [
      { label: '○', sub: '1 Ring' },
      { label: '◎', sub: '2 Rings' },
      { label: '?', sub: '3 Rings' }
    ],
    options: [
      { label: '🞊', sub: '3 Nested Rings' },
      { label: '●', sub: 'Solid' },
      { label: '▲', sub: 'Triangle' },
      { label: '◌', sub: 'Dotted' }
    ],
    correctIndex: 0,
    explanation: 'Ring count increments by 1 at each step.'
  },
  {
    id: 28,
    domain: 'Modulo Cycle',
    questionText: 'Identify the repeating residue pattern mod 4: (1, 2, 3, 0, 1, 2, 3, ?)',
    sequenceVisuals: [
      { label: '1', sub: 'rem 1' },
      { label: '2', sub: 'rem 2' },
      { label: '3', sub: 'rem 3' },
      { label: '0', sub: 'rem 0' },
      { label: '1', sub: 'rem 1' },
      { label: '?', sub: 'Next' }
    ],
    options: [
      { label: '2', sub: 'Option A' },
      { label: '3', sub: 'Option B' },
      { label: '0', sub: 'Option C' },
      { label: '4', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: 'The residue cycle repeats 1, 2, 3, 0, 1, 2... Next is 2.'
  },
  {
    id: 29,
    domain: 'Digit Sum Invariance',
    questionText: 'All numbers in this sequence have digits summing to 9: 18, 27, 36, 45, ?',
    sequenceVisuals: [
      { label: '18', sub: '1+8=9' },
      { label: '27', sub: '2+7=9' },
      { label: '36', sub: '3+6=9' },
      { label: '45', sub: '4+5=9' },
      { label: '?', sub: '5+?=9' }
    ],
    options: [
      { label: '54', sub: '5+4=9' },
      { label: '55', sub: '5+5=10' },
      { label: '63', sub: '6+3=9' },
      { label: '52', sub: '5+2=7' }
    ],
    correctIndex: 0,
    explanation: 'The tens digit increments by 1 and the units digit decrements by 1: 54.'
  },
  {
    id: 30,
    domain: 'Angle Subtended',
    questionText: 'What is the next internal angle sum for regular polygons: Triangle(180°), Quad(360°), Pent(540°)?',
    sequenceVisuals: [
      { label: '180°', sub: 'Triangle' },
      { label: '360°', sub: 'Quadrilateral' },
      { label: '540°', sub: 'Pentagon' },
      { label: '?', sub: 'Hexagon' }
    ],
    options: [
      { label: '600°', sub: 'Option A' },
      { label: '720°', sub: 'Option B' },
      { label: '750°', sub: 'Option C' },
      { label: '900°', sub: 'Option D' }
    ],
    correctIndex: 1,
    explanation: 'Internal angles formula (n-2) × 180°: For hexagon (n=6), 4 × 180° = 720°.'
  },

  // 31-50: Symbolic, Logical, & Computational Patterns
  {
    id: 31,
    domain: 'Power of 10 Order',
    questionText: 'Determine the missing metric prefix multiplier: Kilo(10³), Mega(10⁶), Giga(10⁹), ?',
    sequenceVisuals: [
      { label: '10³', sub: 'Kilo' },
      { label: '10⁶', sub: 'Mega' },
      { label: '10⁹', sub: 'Giga' },
      { label: '?', sub: 'Next SI' }
    ],
    options: [
      { label: '10¹⁰', sub: 'Option A' },
      { label: '10¹²', sub: 'Tera' },
      { label: '10¹⁵', sub: 'Peta' },
      { label: '10¹⁸', sub: 'Exa' }
    ],
    correctIndex: 1,
    explanation: 'SI standard prefixes step by powers of 10³: Giga (10⁹) is followed by Tera (10¹²).'
  },
  {
    id: 32,
    domain: 'Vowel Progression',
    questionText: 'Identify the next vowel in standard English phonetic ordering:',
    sequenceVisuals: [
      { label: 'A', sub: '1st' },
      { label: 'E', sub: '2nd' },
      { label: 'I', sub: '3rd' },
      { label: 'O', sub: '4th' },
      { label: '?', sub: '5th' }
    ],
    options: [
      { label: 'U', sub: '5th Vowel' },
      { label: 'Y', sub: 'Semivowel' },
      { label: 'W', sub: 'Consonant' },
      { label: 'Z', sub: 'Final' }
    ],
    correctIndex: 0,
    explanation: 'The foundational vowels are A, E, I, O, U.'
  },
  {
    id: 33,
    domain: 'Complementary Binary Inversion',
    questionText: 'Bitwise NOT flips 1 to 0 and 0 to 1. Find the NOT of [1, 0, 1, 1]:',
    sequenceVisuals: [
      { label: '1 0 1 1', sub: 'Input Nibble' },
      { label: 'NOT', sub: 'Bitwise Gate' },
      { label: '?', sub: 'Output Nibble' }
    ],
    options: [
      { label: '0 1 0 0', sub: 'Option A' },
      { label: '1 1 0 0', sub: 'Option B' },
      { label: '0 0 1 1', sub: 'Option C' },
      { label: '1 0 1 0', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: 'Every bit is inverted: 1→0, 0→1, 1→0, 1→0 giving 0 1 0 0.'
  },
  {
    id: 34,
    domain: 'Odd Numbers Squares',
    questionText: 'Squares of odd integers: 1²=1, 3²=9, 5²=25, 7²=49. What comes next?',
    sequenceVisuals: [
      { label: '1', sub: '1²' },
      { label: '9', sub: '3²' },
      { label: '25', sub: '5²' },
      { label: '49', sub: '7²' },
      { label: '?', sub: '9²' }
    ],
    options: [
      { label: '64', sub: '8²' },
      { label: '81', sub: '9²' },
      { label: '100', sub: '10²' },
      { label: '121', sub: '11²' }
    ],
    correctIndex: 1,
    explanation: 'The next odd number is 9, and 9² = 81.'
  },
  {
    id: 35,
    domain: 'Hexadecimal Counting',
    questionText: 'What hex digit follows 9 in base-16 numeral notation?',
    sequenceVisuals: [
      { label: '7', sub: 'Dec 7' },
      { label: '8', sub: 'Dec 8' },
      { label: '9', sub: 'Dec 9' },
      { label: '?', sub: 'Dec 10' }
    ],
    options: [
      { label: 'A', sub: 'Hex 10' },
      { label: 'B', sub: 'Hex 11' },
      { label: '10', sub: 'Hex 16' },
      { label: 'F', sub: 'Hex 15' }
    ],
    correctIndex: 0,
    explanation: 'In hexadecimal (base 16), decimal 10 is represented by letter A.'
  },
  {
    id: 36,
    domain: 'Harmonic Series Denominators',
    questionText: 'What term continues this unit fraction progression: 1/1, 1/2, 1/3, 1/4, ?',
    sequenceVisuals: [
      { label: '1/1', sub: 'n=1' },
      { label: '1/2', sub: 'n=2' },
      { label: '1/3', sub: 'n=3' },
      { label: '1/4', sub: 'n=4' },
      { label: '?', sub: 'n=5' }
    ],
    options: [
      { label: '1/5', sub: 'Harmonic term' },
      { label: '1/6', sub: 'Option B' },
      { label: '1/8', sub: 'Option C' },
      { label: '2/5', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: 'Harmonic series terms are 1/n. For n=5, the term is 1/5.'
  },
  {
    id: 37,
    domain: 'Card Suits Hierarchy',
    questionText: 'In bridge bidding ranking (Clubs ♣, Diamonds ♦, Hearts ♥, ?):',
    sequenceVisuals: [
      { label: '♣', sub: 'Lowest' },
      { label: '♦', sub: 'Rank 2' },
      { label: '♥', sub: 'Rank 3' },
      { label: '?', sub: 'Highest Suit' }
    ],
    options: [
      { label: '♠', sub: 'Spades' },
      { label: '★', sub: 'Star' },
      { label: '◆', sub: 'Diamond' },
      { label: '▲', sub: 'Triangle' }
    ],
    correctIndex: 0,
    explanation: 'The standard bridge alphabetical suit ranking is Clubs (♣), Diamonds (♦), Hearts (♥), Spades (♠).'
  },
  {
    id: 38,
    domain: 'Geometric Step Multiplication',
    questionText: 'What is the missing product in this geometric progression (×4)?',
    sequenceVisuals: [
      { label: '2', sub: 'Start' },
      { label: '8', sub: '×4' },
      { label: '32', sub: '×4' },
      { label: '?', sub: '×4' }
    ],
    options: [
      { label: '96', sub: 'Option A' },
      { label: '128', sub: 'Option B' },
      { label: '144', sub: 'Option C' },
      { label: '256', sub: 'Option D' }
    ],
    correctIndex: 1,
    explanation: 'Each step is multiplied by 4: 32 × 4 = 128.'
  },
  {
    id: 39,
    domain: 'Angle Bisector',
    questionText: 'Successive binary angle bisectors: 360°, 180°, 90°, 45°, ?',
    sequenceVisuals: [
      { label: '360°', sub: 'Full' },
      { label: '180°', sub: 'Straight' },
      { label: '90°', sub: 'Right' },
      { label: '45°', sub: 'Acute' },
      { label: '?', sub: 'Half of 45°' }
    ],
    options: [
      { label: '22.5°', sub: 'Option A' },
      { label: '20°', sub: 'Option B' },
      { label: '30°', sub: 'Option C' },
      { label: '15°', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: 'Halving each angle: 45° ÷ 2 = 22.5°.'
  },
  {
    id: 40,
    domain: 'Square Difference Steps',
    questionText: 'Consecutive squares difference formula: 1 to 4 (+3), 4 to 9 (+5), 9 to 16 (+7), 16 to ? (+9):',
    sequenceVisuals: [
      { label: '1', sub: '1²' },
      { label: '4', sub: '+3' },
      { label: '9', sub: '+5' },
      { label: '16', sub: '+7' },
      { label: '?', sub: '+9' }
    ],
    options: [
      { label: '23', sub: 'Option A' },
      { label: '25', sub: 'Option B' },
      { label: '27', sub: 'Option C' },
      { label: '30', sub: 'Option D' }
    ],
    correctIndex: 1,
    explanation: 'The difference between consecutive squares increases by consecutive odd numbers: 16 + 9 = 25 (5²).'
  },

  // 41-60: Visual Matrices & Symbolic Logic
  {
    id: 41,
    domain: 'Cardinals & Intercardinals',
    questionText: 'Find the compass needle stepping clockwise by 45 degrees:',
    sequenceVisuals: [
      { label: 'N', sub: '0°' },
      { label: 'NE', sub: '45°' },
      { label: 'E', sub: '90°' },
      { label: 'SE', sub: '135°' },
      { label: '?', sub: '180°' }
    ],
    options: [
      { label: 'S', sub: 'South (180°)' },
      { label: 'SW', sub: 'South-West' },
      { label: 'W', sub: 'West' },
      { label: 'NW', sub: 'North-West' }
    ],
    correctIndex: 0,
    explanation: 'Adding 45° to SE (135°) gives South (180°).'
  },
  {
    id: 42,
    domain: 'Polygon Diagonals Count',
    questionText: 'Number of diagonals in polygons: Triangle(0), Quadrilateral(2), Pentagon(5), Hexagon(?):',
    sequenceVisuals: [
      { label: '0', sub: 'Triangle (3 sides)' },
      { label: '2', sub: 'Quad (4 sides)' },
      { label: '5', sub: 'Pentagon (5 sides)' },
      { label: '?', sub: 'Hexagon (6 sides)' }
    ],
    options: [
      { label: '7', sub: 'Option A' },
      { label: '8', sub: 'Option B' },
      { label: '9', sub: 'Option C' },
      { label: '10', sub: 'Option D' }
    ],
    correctIndex: 2,
    explanation: 'Formula for polygon diagonals is n(n-3)/2. For n=6: 6 × 3 / 2 = 9.'
  },
  {
    id: 43,
    domain: 'Alphabet Mirroring',
    questionText: 'Which letter possesses vertical bilateral symmetry like A, M, T, V?',
    sequenceVisuals: [
      { label: 'A', sub: 'Vertical Axis' },
      { label: 'M', sub: 'Vertical Axis' },
      { label: 'T', sub: 'Vertical Axis' },
      { label: 'V', sub: 'Vertical Axis' },
      { label: '?', sub: 'Symmetric' }
    ],
    options: [
      { label: 'W', sub: 'Vertical Axis' },
      { label: 'B', sub: 'Horizontal' },
      { label: 'E', sub: 'Horizontal' },
      { label: 'F', sub: 'Asymmetric' }
    ],
    correctIndex: 0,
    explanation: 'W has exact vertical reflective symmetry down its middle axis, just like A, M, T, and V.'
  },
  {
    id: 44,
    domain: 'Additive Series Shift',
    questionText: 'Add 11, then add 12, then add 13: 10 → 21 → 33 → ?',
    sequenceVisuals: [
      { label: '10', sub: 'Start' },
      { label: '21', sub: '+11' },
      { label: '33', sub: '+12' },
      { label: '?', sub: '+13' }
    ],
    options: [
      { label: '44', sub: 'Option A' },
      { label: '46', sub: 'Option B' },
      { label: '48', sub: 'Option C' },
      { label: '50', sub: 'Option D' }
    ],
    correctIndex: 1,
    explanation: 'Add 13 to 33: 33 + 13 = 46.'
  },
  {
    id: 45,
    domain: 'Binary Clock Shift',
    questionText: 'Look at the binary counter: 001, 010, 011, 100, ?',
    sequenceVisuals: [
      { label: '001', sub: '1 in base-2' },
      { label: '010', sub: '2 in base-2' },
      { label: '011', sub: '3 in base-2' },
      { label: '100', sub: '4 in base-2' },
      { label: '?', sub: '5 in base-2' }
    ],
    options: [
      { label: '101', sub: '5' },
      { label: '110', sub: '6' },
      { label: '111', sub: '7' },
      { label: '011', sub: '3' }
    ],
    correctIndex: 0,
    explanation: 'Decimal 5 in 3-bit binary notation is 101.'
  },
  {
    id: 46,
    domain: 'Alternating Operations II',
    questionText: 'Rule: Add 10, then divide by 2: 14 → 24 → 12 → 22 → 11 → ?',
    sequenceVisuals: [
      { label: '14', sub: 'Base' },
      { label: '24', sub: '+10' },
      { label: '12', sub: '÷2' },
      { label: '22', sub: '+10' },
      { label: '11', sub: '÷2' },
      { label: '?', sub: '+10' }
    ],
    options: [
      { label: '21', sub: 'Option A' },
      { label: '22', sub: 'Option B' },
      { label: '24', sub: 'Option C' },
      { label: '16', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: 'Following the alternating pattern (+10, ÷2): Next is 11 + 10 = 21.'
  },
  {
    id: 47,
    domain: 'Moon Phases Progression',
    questionText: 'Astronomical lunar phase sequence: New Moon 🌑 → Waxing Crescent 🌒 → First Quarter 🌓 → ?',
    sequenceVisuals: [
      { label: '🌑', sub: 'New Moon' },
      { label: '🌒', sub: 'Waxing Crescent' },
      { label: '🌓', sub: 'First Quarter' },
      { label: '?', sub: 'Next Phase' }
    ],
    options: [
      { label: '🌔', sub: 'Waxing Gibbous' },
      { label: '🌕', sub: 'Full Moon' },
      { label: '🌘', sub: 'Waning Crescent' },
      { label: '🌗', sub: 'Third Quarter' }
    ],
    correctIndex: 0,
    explanation: 'Following First Quarter (🌓), the illuminated area grows into Waxing Gibbous (🌔) before Full Moon.'
  },
  {
    id: 48,
    domain: 'Prime Twins Difference',
    questionText: 'First element of twin prime pairs: (3,5), (5,7), (11,13), (17,19), (?,?)',
    sequenceVisuals: [
      { label: '3', sub: 'Twin pair (3,5)' },
      { label: '5', sub: 'Twin pair (5,7)' },
      { label: '11', sub: 'Twin pair (11,13)' },
      { label: '17', sub: 'Twin pair (17,19)' },
      { label: '?', sub: 'Next Twin Pair' }
    ],
    options: [
      { label: '29', sub: 'Twin pair (29,31)' },
      { label: '23', sub: '23 has no twin' },
      { label: '31', sub: 'Second of pair' },
      { label: '27', sub: 'Composite' }
    ],
    correctIndex: 0,
    explanation: 'The next pair of twin primes is (29, 31), so the starting prime is 29.'
  },
  {
    id: 49,
    domain: 'Subtractive Countdown',
    questionText: 'Decreasing difference progression: 100 (-15) = 85, 85 (-13) = 72, 72 (-11) = 61, 61 (-9) = ?',
    sequenceVisuals: [
      { label: '100', sub: 'Start' },
      { label: '85', sub: '-15' },
      { label: '72', sub: '-13' },
      { label: '61', sub: '-11' },
      { label: '?', sub: '-9' }
    ],
    options: [
      { label: '50', sub: 'Option A' },
      { label: '52', sub: 'Option B' },
      { label: '54', sub: 'Option C' },
      { label: '51', sub: 'Option D' }
    ],
    correctIndex: 1,
    explanation: 'The subtractive amount decreases by 2 each time: 61 - 9 = 52.'
  },
  {
    id: 50,
    domain: 'Geometric Tessellation Angles',
    questionText: 'Which regular polygon vertex angle cannot tile the plane alone without gaps?',
    sequenceVisuals: [
      { label: '60°', sub: 'Triangle (Tessellates)' },
      { label: '90°', sub: 'Square (Tessellates)' },
      { label: '120°', sub: 'Hexagon (Tessellates)' },
      { label: '?', sub: 'Cannot Tessellate' }
    ],
    options: [
      { label: '108°', sub: 'Regular Pentagon' },
      { label: '120°', sub: 'Hexagon' },
      { label: '90°', sub: 'Square' },
      { label: '60°', sub: 'Triangle' }
    ],
    correctIndex: 0,
    explanation: 'Regular pentagons have internal angles of 108°. Since 360 is not divisible by 108, regular pentagons cannot tessellate a 2D plane alone.'
  },

  // 51-70: Cognitive Logic, Grids & Progressions
  {
    id: 51,
    domain: 'Double-Step Arithmetic',
    questionText: 'Determine the missing number: 2, 3, 5, 8, 12, 17, ?',
    sequenceVisuals: [
      { label: '2', sub: '+1' },
      { label: '3', sub: '+2' },
      { label: '5', sub: '+3' },
      { label: '8', sub: '+4' },
      { label: '12', sub: '+5' },
      { label: '17', sub: '+6' },
      { label: '?', sub: 'Next' }
    ],
    options: [
      { label: '23', sub: 'Option A' },
      { label: '24', sub: 'Option B' },
      { label: '25', sub: 'Option C' },
      { label: '22', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: 'The difference increases by 1 each step: 17 + 6 = 23.'
  },
  {
    id: 52,
    domain: 'Power of 3 Countdown',
    questionText: 'Exponential division: 243, 81, 27, 9, ?',
    sequenceVisuals: [
      { label: '243', sub: '3⁵' },
      { label: '81', sub: '3⁴' },
      { label: '27', sub: '3³' },
      { label: '9', sub: '3²' },
      { label: '?', sub: '3¹' }
    ],
    options: [
      { label: '1', sub: 'Option A' },
      { label: '3', sub: 'Option B' },
      { label: '6', sub: 'Option C' },
      { label: '0', sub: 'Option D' }
    ],
    correctIndex: 1,
    explanation: 'Each number is divided by 3: 9 ÷ 3 = 3.'
  },
  {
    id: 53,
    domain: 'Clock Hour Complement',
    questionText: '12-hour clock face: 2:00, 5:00 (+3h), 8:00 (+3h), 11:00 (+3h), ?',
    sequenceVisuals: [
      { label: '2:00', sub: 'Start' },
      { label: '5:00', sub: '+3h' },
      { label: '8:00', sub: '+3h' },
      { label: '11:00', sub: '+3h' },
      { label: '?', sub: '+3h' }
    ],
    options: [
      { label: '1:00', sub: 'Option A' },
      { label: '2:00', sub: 'Option B' },
      { label: '3:00', sub: 'Option C' },
      { label: '12:00', sub: 'Option D' }
    ],
    correctIndex: 1,
    explanation: 'Adding 3 hours to 11:00 wraps around the 12-hour clock to 2:00.'
  },
  {
    id: 54,
    domain: 'Alphabet Triangular Gaps',
    questionText: 'Gaps: +1 letter, +2 letters, +3 letters: B (+1) D (+2) G (+3) K (+4) ?',
    sequenceVisuals: [
      { label: 'B', sub: 'Pos 2' },
      { label: 'D', sub: 'Pos 4 (+2)' },
      { label: 'G', sub: 'Pos 7 (+3)' },
      { label: 'K', sub: 'Pos 11 (+4)' },
      { label: '?', sub: 'Pos 16 (+5)' }
    ],
    options: [
      { label: 'P', sub: 'Pos 16' },
      { label: 'O', sub: 'Pos 15' },
      { label: 'Q', sub: 'Pos 17' },
      { label: 'R', sub: 'Pos 18' }
    ],
    correctIndex: 0,
    explanation: 'Letter position steps: 11 + 5 = 16, which is letter P.'
  },
  {
    id: 55,
    domain: 'Interlocking Interleaved Sequences',
    questionText: 'Two interleaved sequences: [1, 10, 2, 20, 3, 30, 4, ?]',
    sequenceVisuals: [
      { label: '1', sub: 'Odd seq' },
      { label: '10', sub: 'Even seq' },
      { label: '2', sub: 'Odd seq' },
      { label: '20', sub: 'Even seq' },
      { label: '3', sub: 'Odd seq' },
      { label: '30', sub: 'Even seq' },
      { label: '4', sub: 'Odd seq' },
      { label: '?', sub: 'Even seq' }
    ],
    options: [
      { label: '40', sub: 'Option A' },
      { label: '50', sub: 'Option B' },
      { label: '35', sub: 'Option C' },
      { label: '5', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: 'The even terms are multiples of 10: 10, 20, 30, 40.'
  },
  {
    id: 56,
    domain: 'Perfect Cubes Difference',
    questionText: 'Cube differences: 1³=1, 2³=8, 3³=27, 4³=64, 5³=?',
    sequenceVisuals: [
      { label: '1', sub: '1³' },
      { label: '8', sub: '2³' },
      { label: '27', sub: '3³' },
      { label: '64', sub: '4³' },
      { label: '?', sub: '5³' }
    ],
    options: [
      { label: '125', sub: 'Option A' },
      { label: '100', sub: 'Option B' },
      { label: '150', sub: 'Option C' },
      { label: '216', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: '5³ = 5 × 5 × 5 = 125.'
  },
  {
    id: 57,
    domain: 'Quadratic Growth',
    questionText: 'Equation n² + 1: for n = 1, 2, 3, 4, 5: [2, 5, 10, 17, ?]',
    sequenceVisuals: [
      { label: '2', sub: '1²+1' },
      { label: '5', sub: '2²+1' },
      { label: '10', sub: '3²+1' },
      { label: '17', sub: '4²+1' },
      { label: '?', sub: '5²+1' }
    ],
    options: [
      { label: '24', sub: 'Option A' },
      { label: '26', sub: 'Option B' },
      { label: '25', sub: 'Option C' },
      { label: '28', sub: 'Option D' }
    ],
    correctIndex: 1,
    explanation: '5² + 1 = 25 + 1 = 26.'
  },
  {
    id: 58,
    domain: 'Mirror Flip Symmetry',
    questionText: 'Vertical flip toggle: L ↰ ↲ ↰ ?',
    sequenceVisuals: [
      { label: '↰', sub: 'Up-Left' },
      { label: '↲', sub: 'Down-Left' },
      { label: '↰', sub: 'Up-Left' },
      { label: '?', sub: 'Next' }
    ],
    options: [
      { label: '↲', sub: 'Down-Left' },
      { label: '↱', sub: 'Up-Right' },
      { label: '↳', sub: 'Down-Right' },
      { label: '⬆', sub: 'Up' }
    ],
    correctIndex: 0,
    explanation: 'Alternates between Up-Left (↰) and Down-Left (↲). Next is Down-Left (↲).'
  },
  {
    id: 59,
    domain: 'Arithmetic Multiples of 6',
    questionText: 'Find the missing multiple of 6: 12, 18, 24, 30, 36, ?',
    sequenceVisuals: [
      { label: '12', sub: '6×2' },
      { label: '18', sub: '6×3' },
      { label: '24', sub: '6×4' },
      { label: '30', sub: '6×5' },
      { label: '36', sub: '6×6' },
      { label: '?', sub: '6×7' }
    ],
    options: [
      { label: '40', sub: 'Option A' },
      { label: '42', sub: 'Option B' },
      { label: '44', sub: 'Option C' },
      { label: '48', sub: 'Option D' }
    ],
    correctIndex: 1,
    explanation: '6 × 7 = 42.'
  },
  {
    id: 60,
    domain: 'Fractional Multiplication',
    questionText: 'Multiplying by 3/2: 4 → 6 → 9 → 13.5 → ?',
    sequenceVisuals: [
      { label: '4', sub: 'Start' },
      { label: '6', sub: '4 × 1.5' },
      { label: '9', sub: '6 × 1.5' },
      { label: '13.5', sub: '9 × 1.5' },
      { label: '?', sub: '13.5 × 1.5' }
    ],
    options: [
      { label: '20.25', sub: 'Option A' },
      { label: '18.5', sub: 'Option B' },
      { label: '19.75', sub: 'Option C' },
      { label: '21.0', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: '13.5 × 1.5 = 20.25.'
  },

  // 61-80: Abstract Symbolism & Numeric Systems
  {
    id: 61,
    domain: 'Binary Digit Parity',
    questionText: 'Even parity check: which 4-bit word has an even count of 1s?',
    sequenceVisuals: [
      { label: '1001', sub: '2 ones (Even)' },
      { label: '0110', sub: '2 ones (Even)' },
      { label: '1111', sub: '4 ones (Even)' },
      { label: '?', sub: 'Must be Even' }
    ],
    options: [
      { label: '1010', sub: '2 ones (Even)' },
      { label: '1110', sub: '3 ones (Odd)' },
      { label: '0001', sub: '1 one (Odd)' },
      { label: '1011', sub: '3 ones (Odd)' }
    ],
    correctIndex: 0,
    explanation: '1010 has exactly two 1s, which is an even parity.'
  },
  {
    id: 62,
    domain: 'Prime Factor Multipliers',
    questionText: 'Products of 2 and 3: 6, 12, 18, 24, 30, ?',
    sequenceVisuals: [
      { label: '6', sub: '6×1' },
      { label: '12', sub: '6×2' },
      { label: '18', sub: '6×3' },
      { label: '24', sub: '6×4' },
      { label: '30', sub: '6×5' },
      { label: '?', sub: '6×6' }
    ],
    options: [
      { label: '36', sub: 'Option A' },
      { label: '34', sub: 'Option B' },
      { label: '38', sub: 'Option C' },
      { label: '40', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: 'The progression adds 6 each time: 30 + 6 = 36.'
  },
  {
    id: 63,
    domain: 'Dot Matrix Shift',
    questionText: 'Dot moves across a 1x4 array: [•○○○] → [○•○○] → [○○•○] → ?',
    sequenceVisuals: [
      { label: '•○○○', sub: 'Col 1' },
      { label: '○•○○', sub: 'Col 2' },
      { label: '○○•○', sub: 'Col 3' },
      { label: '?', sub: 'Col 4' }
    ],
    options: [
      { label: '○○○•', sub: 'Col 4' },
      { label: '•○○○', sub: 'Col 1' },
      { label: '○○••', sub: 'Cols 3-4' },
      { label: '••••', sub: 'All' }
    ],
    correctIndex: 0,
    explanation: 'The dot steps one position to the right in each iteration.'
  },
  {
    id: 64,
    domain: 'Alternating Plus and Minus',
    questionText: 'Compute the next step: +5, -2, +5, -2: 10 → 15 → 13 → 18 → 16 → ?',
    sequenceVisuals: [
      { label: '10', sub: 'Start' },
      { label: '15', sub: '+5' },
      { label: '13', sub: '-2' },
      { label: '18', sub: '+5' },
      { label: '16', sub: '-2' },
      { label: '?', sub: '+5' }
    ],
    options: [
      { label: '21', sub: 'Option A' },
      { label: '20', sub: 'Option B' },
      { label: '22', sub: 'Option C' },
      { label: '19', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: '16 + 5 = 21.'
  },
  {
    id: 65,
    domain: 'Pythagorean Triples',
    questionText: 'Famous primitive Pythagorean triples: (3,4,5), (5,12,13), (7,24,25), (8,15,?)',
    sequenceVisuals: [
      { label: '(3,4,5)', sub: '3²+4²=5²' },
      { label: '(5,12,13)', sub: '5²+12²=13²' },
      { label: '(7,24,25)', sub: '7²+24²=25²' },
      { label: '(8,15,?)', sub: '8²+15²=?²' }
    ],
    options: [
      { label: '17', sub: '64+225=289=17²' },
      { label: '16', sub: 'Option B' },
      { label: '18', sub: 'Option C' },
      { label: '19', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: '8² + 15² = 64 + 225 = 289 = 17².'
  },
  {
    id: 66,
    domain: 'Triangular Area Scaling',
    questionText: 'If linear scale factor k doubles (k=1, 2, 3, 4), area scales as k² (1, 4, 9, ?):',
    sequenceVisuals: [
      { label: '1', sub: '1²' },
      { label: '4', sub: '2²' },
      { label: '9', sub: '3²' },
      { label: '?', sub: '4²' }
    ],
    options: [
      { label: '12', sub: 'Option A' },
      { label: '16', sub: 'Option B' },
      { label: '20', sub: 'Option C' },
      { label: '25', sub: 'Option D' }
    ],
    correctIndex: 1,
    explanation: 'Area scales with the square of the scale factor: 4² = 16.'
  },
  {
    id: 67,
    domain: 'Letter Shift Cipher (+3)',
    questionText: 'Caesar Cipher key +3: A→D, B→E, C→F, D→?',
    sequenceVisuals: [
      { label: 'A → D', sub: '+3' },
      { label: 'B → E', sub: '+3' },
      { label: 'C → F', sub: '+3' },
      { label: 'D → ?', sub: '+3' }
    ],
    options: [
      { label: 'G', sub: 'Letter 7' },
      { label: 'H', sub: 'Letter 8' },
      { label: 'I', sub: 'Letter 9' },
      { label: 'F', sub: 'Letter 6' }
    ],
    correctIndex: 0,
    explanation: 'Letter D (4) + 3 = Letter G (7).'
  },
  {
    id: 68,
    domain: 'Powers of 5',
    questionText: 'What is 5⁴ in the powers of 5 progression: 5, 25, 125, ?',
    sequenceVisuals: [
      { label: '5', sub: '5¹' },
      { label: '25', sub: '5²' },
      { label: '125', sub: '5³' },
      { label: '?', sub: '5⁴' }
    ],
    options: [
      { label: '500', sub: 'Option A' },
      { label: '625', sub: 'Option B' },
      { label: '550', sub: 'Option C' },
      { label: '725', sub: 'Option D' }
    ],
    correctIndex: 1,
    explanation: '125 × 5 = 625.'
  },
  {
    id: 69,
    domain: 'Clockwise Edge Traversal',
    questionText: 'Edge traversal around a square: Top ▔ → Right ▕ → Bottom   → ?',
    sequenceVisuals: [
      { label: '▔', sub: 'Top' },
      { label: '▕', sub: 'Right' },
      { label: ' ', sub: 'Bottom' },
      { label: '?', sub: 'Next Edge' }
    ],
    options: [
      { label: '▏', sub: 'Left' },
      { label: '▔', sub: 'Top' },
      { label: '┼', sub: 'Center' },
      { label: '╳', sub: 'Diagonals' }
    ],
    correctIndex: 0,
    explanation: 'Moving clockwise around the perimeter of a quadrilateral: Top → Right → Bottom → Left (▏).'
  },
  {
    id: 70,
    domain: 'Digital Logic NAND Table',
    questionText: 'NAND outputs 0 only when both inputs are 1. What is NAND(1, 1)?',
    sequenceVisuals: [
      { label: 'NAND(0, 0)', sub: '1' },
      { label: 'NAND(0, 1)', sub: '1' },
      { label: 'NAND(1, 0)', sub: '1' },
      { label: 'NAND(1, 1)', sub: '?' }
    ],
    options: [
      { label: '0', sub: 'Option A' },
      { label: '1', sub: 'Option B' },
      { label: 'X', sub: 'High-Z' },
      { label: '-1', sub: 'Invalid' }
    ],
    correctIndex: 0,
    explanation: 'The logical NAND of 1 and 1 is 0 (NOT AND).'
  },

  // 71-90: High-Level Geometric & Mathematical Sequences
  {
    id: 71,
    domain: 'Arithmetic Mean Middle',
    questionText: 'Identify the arithmetic midpoint between 14 and 28:',
    sequenceVisuals: [
      { label: '14', sub: 'Lower' },
      { label: '?', sub: 'Midpoint' },
      { label: '28', sub: 'Upper' }
    ],
    options: [
      { label: '21', sub: '(14+28)/2' },
      { label: '20', sub: 'Option B' },
      { label: '22', sub: 'Option C' },
      { label: '19', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: '(14 + 28) / 2 = 42 / 2 = 21.'
  },
  {
    id: 72,
    domain: 'Harmonic Oscillation Signs',
    questionText: 'Cosine at 0, π/2, π, 3π/2, 2π: [1, 0, -1, 0, ?]',
    sequenceVisuals: [
      { label: '1', sub: 'cos(0)' },
      { label: '0', sub: 'cos(π/2)' },
      { label: '-1', sub: 'cos(π)' },
      { label: '0', sub: 'cos(3π/2)' },
      { label: '?', sub: 'cos(2π)' }
    ],
    options: [
      { label: '1', sub: 'cos(2π)' },
      { label: '-1', sub: 'Option B' },
      { label: '0', sub: 'Option C' },
      { label: '0.5', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: 'The cosine wave completes one full period at 2π, returning to its peak value of 1.'
  },
  {
    id: 73,
    domain: 'Difference of Squares',
    questionText: 'Sequence formula n² - 1 for n = 2, 3, 4, 5, 6: [3, 8, 15, 24, ?]',
    sequenceVisuals: [
      { label: '3', sub: '2²-1' },
      { label: '8', sub: '3²-1' },
      { label: '15', sub: '4²-1' },
      { label: '24', sub: '5²-1' },
      { label: '?', sub: '6²-1' }
    ],
    options: [
      { label: '35', sub: '36-1' },
      { label: '32', sub: 'Option B' },
      { label: '36', sub: 'Option C' },
      { label: '40', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: '6² - 1 = 36 - 1 = 35.'
  },
  {
    id: 74,
    domain: 'Primes Between 30 and 40',
    questionText: 'Prime numbers in the thirties: 31, ?',
    sequenceVisuals: [
      { label: '31', sub: 'Prime' },
      { label: '?', sub: 'Next Prime < 40' }
    ],
    options: [
      { label: '37', sub: 'Prime' },
      { label: '33', sub: '3 × 11' },
      { label: '35', sub: '5 × 7' },
      { label: '39', sub: '3 × 13' }
    ],
    correctIndex: 0,
    explanation: '37 is the only other prime number between 30 and 40.'
  },
  {
    id: 75,
    domain: 'Geometric Decay by 10',
    questionText: 'Powers of 0.1: 1000, 100, 10, 1, ?',
    sequenceVisuals: [
      { label: '1000', sub: '10³' },
      { label: '100', sub: '10²' },
      { label: '10', sub: '10¹' },
      { label: '1', sub: '10⁰' },
      { label: '?', sub: '10⁻¹' }
    ],
    options: [
      { label: '0.1', sub: '1/10' },
      { label: '0.01', sub: '1/100' },
      { label: '0', sub: 'Zero' },
      { label: '-1', sub: 'Negative' }
    ],
    correctIndex: 0,
    explanation: '10⁰ ÷ 10 = 10⁻¹ = 0.1.'
  },
  {
    id: 76,
    domain: 'Geometric Symmetry Rotation',
    questionText: 'Cross rotation by 45°: ✚ (0°) → ✖ (45°) → ✚ (90°) → ?',
    sequenceVisuals: [
      { label: '✚', sub: '0°' },
      { label: '✖', sub: '45°' },
      { label: '✚', sub: '90°' },
      { label: '?', sub: '135°' }
    ],
    options: [
      { label: '✖', sub: '45° offset' },
      { label: '✚', sub: 'Orthogonal' },
      { label: '●', sub: 'Circle' },
      { label: '▲', sub: 'Triangle' }
    ],
    correctIndex: 0,
    explanation: 'Rotates back and forth between orthogonal cross (✚) and diagonal cross (✖).'
  },
  {
    id: 77,
    domain: 'Alphabet Skipping by 3',
    questionText: 'Letter sequence skipping 3 positions: A (1) → D (4) → G (7) → J (10) → ?',
    sequenceVisuals: [
      { label: 'A', sub: 'Pos 1' },
      { label: 'D', sub: '+3' },
      { label: 'G', sub: '+3' },
      { label: 'J', sub: '+3' },
      { label: '?', sub: '+3' }
    ],
    options: [
      { label: 'M', sub: 'Pos 13' },
      { label: 'L', sub: 'Pos 12' },
      { label: 'N', sub: 'Pos 14' },
      { label: 'K', sub: 'Pos 11' }
    ],
    correctIndex: 0,
    explanation: 'Letter J (10) + 3 = Letter M (13).'
  },
  {
    id: 78,
    domain: 'Cumulative Addition',
    questionText: 'Compute the running cumulative sum: 1, 3 (1+2), 6 (3+3), 10 (6+4), 15 (10+5), ?',
    sequenceVisuals: [
      { label: '1', sub: 'Base' },
      { label: '3', sub: '+2' },
      { label: '6', sub: '+3' },
      { label: '10', sub: '+4' },
      { label: '15', sub: '+5' },
      { label: '?', sub: '+6' }
    ],
    options: [
      { label: '21', sub: 'Option A' },
      { label: '20', sub: 'Option B' },
      { label: '22', sub: 'Option C' },
      { label: '25', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: '15 + 6 = 21.'
  },
  {
    id: 79,
    domain: 'Cardinals Opposite Axis',
    questionText: 'Opposite compass directions: N ↔ S, E ↔ W, NE ↔ ?',
    sequenceVisuals: [
      { label: 'N ↔ S', sub: 'Opposites' },
      { label: 'E ↔ W', sub: 'Opposites' },
      { label: 'NE ↔ ?', sub: 'Opposites' }
    ],
    options: [
      { label: 'SW', sub: 'South-West' },
      { label: 'NW', sub: 'North-West' },
      { label: 'SE', sub: 'South-East' },
      { label: 'S', sub: 'South' }
    ],
    correctIndex: 0,
    explanation: 'The opposite of North-East (45°) is South-West (225°).'
  },
  {
    id: 80,
    domain: 'Number of Vertices in 3D Solids',
    questionText: 'Platonic solids vertices: Tetrahedron(4), Cube(8), Octahedron(6), Dodecahedron(20), Icosahedron(?):',
    sequenceVisuals: [
      { label: '4', sub: 'Tetrahedron' },
      { label: '8', sub: 'Cube' },
      { label: '6', sub: 'Octahedron' },
      { label: '20', sub: 'Dodecahedron' },
      { label: '?', sub: 'Icosahedron' }
    ],
    options: [
      { label: '12', sub: '12 Vertices' },
      { label: '14', sub: 'Option B' },
      { label: '16', sub: 'Option C' },
      { label: '18', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: 'A regular icosahedron has 20 triangular faces, 30 edges, and exactly 12 vertices.'
  },

  // 81-100: Complex Sequences & Cognitive Logic
  {
    id: 81,
    domain: 'Golden Ratio Multiplicative Step',
    questionText: 'Consecutive Fibonacci ratios approach phi (1.618): 1/1, 2/1, 3/2, 5/3, 8/5, ?',
    sequenceVisuals: [
      { label: '1.00', sub: '1/1' },
      { label: '2.00', sub: '2/1' },
      { label: '1.50', sub: '3/2' },
      { label: '1.67', sub: '5/3' },
      { label: '1.60', sub: '8/5' },
      { label: '?', sub: '13/8' }
    ],
    options: [
      { label: '1.625', sub: '13/8' },
      { label: '1.750', sub: 'Option B' },
      { label: '1.555', sub: 'Option C' },
      { label: '1.600', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: 'The ratio 13 / 8 = 1.625.'
  },
  {
    id: 82,
    domain: 'Quadratic Decrement',
    questionText: 'Sequence with decreasing differences: 50 (-2) = 48, 48 (-4) = 44, 44 (-6) = 38, 38 (-8) = ?',
    sequenceVisuals: [
      { label: '50', sub: 'Start' },
      { label: '48', sub: '-2' },
      { label: '44', sub: '-4' },
      { label: '38', sub: '-6' },
      { label: '?', sub: '-8' }
    ],
    options: [
      { label: '30', sub: 'Option A' },
      { label: '28', sub: 'Option B' },
      { label: '32', sub: 'Option C' },
      { label: '34', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: '38 - 8 = 30.'
  },
  {
    id: 83,
    domain: 'Binary Shifting to the Left',
    questionText: 'Bit shift left (multiply by 2): 0001 (1) → 0010 (2) → 0100 (4) → ?',
    sequenceVisuals: [
      { label: '0001', sub: '1' },
      { label: '0010', sub: '2' },
      { label: '0100', sub: '4' },
      { label: '?', sub: '8' }
    ],
    options: [
      { label: '1000', sub: '8' },
      { label: '1001', sub: '9' },
      { label: '0110', sub: '6' },
      { label: '0011', sub: '3' }
    ],
    correctIndex: 0,
    explanation: 'Shifting bit left gives 1000 in binary, which is decimal 8.'
  },
  {
    id: 84,
    domain: 'Powers of 4',
    questionText: 'Exponential progression: 4, 16, 64, ?',
    sequenceVisuals: [
      { label: '4', sub: '4¹' },
      { label: '16', sub: '4²' },
      { label: '64', sub: '4³' },
      { label: '?', sub: '4⁴' }
    ],
    options: [
      { label: '256', sub: 'Option A' },
      { label: '128', sub: 'Option B' },
      { label: '512', sub: 'Option C' },
      { label: '196', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: '64 × 4 = 256.'
  },
  {
    id: 85,
    domain: 'Fractional Multiplication by 2/3',
    questionText: 'Term multiplication: 81 (×2/3) = 54, 54 (×2/3) = 36, 36 (×2/3) = 24, 24 (×2/3) = ?',
    sequenceVisuals: [
      { label: '81', sub: 'Start' },
      { label: '54', sub: '81 × 2/3' },
      { label: '36', sub: '54 × 2/3' },
      { label: '24', sub: '36 × 2/3' },
      { label: '?', sub: '24 × 2/3' }
    ],
    options: [
      { label: '16', sub: 'Option A' },
      { label: '18', sub: 'Option B' },
      { label: '12', sub: 'Option C' },
      { label: '15', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: '24 × (2/3) = 16.'
  },
  {
    id: 86,
    domain: 'Modular Clock Arithmetic',
    questionText: 'Mod 7 weekdays: Day 1 (Mon), Day 2 (Tue) ... Day 6 (Sat), Day 0 (Sun). What is 15 mod 7?',
    sequenceVisuals: [
      { label: '7 mod 7', sub: '0 (Sun)' },
      { label: '14 mod 7', sub: '0 (Sun)' },
      { label: '15 mod 7', sub: '?' }
    ],
    options: [
      { label: '1', sub: '1 (Mon)' },
      { label: '2', sub: '2 (Tue)' },
      { label: '3', sub: '3 (Wed)' },
      { label: '0', sub: '0 (Sun)' }
    ],
    correctIndex: 0,
    explanation: '15 = 2 × 7 + 1, so the remainder is 1.'
  },
  {
    id: 87,
    domain: 'Rotational Step by 120°',
    questionText: 'Equilateral triangle rotation by +120°: Apex Top ▲ → Apex Bottom-Right ◢ → Apex Bottom-Left ◣ → ?',
    sequenceVisuals: [
      { label: '▲', sub: '0°' },
      { label: '◢', sub: '120°' },
      { label: '◣', sub: '240°' },
      { label: '?', sub: '360° Reset' }
    ],
    options: [
      { label: '▲', sub: 'Apex Top' },
      { label: '▼', sub: 'Inverted' },
      { label: '◀', sub: 'Pointing Left' },
      { label: '▶', sub: 'Pointing Right' }
    ],
    correctIndex: 0,
    explanation: 'Rotating 360° completes a full rotation, returning to Apex Top (▲).'
  },
  {
    id: 88,
    domain: 'Sum of Consecutive Integers',
    questionText: 'Formula n(n+1)/2: for n=1 (1), n=2 (3), n=3 (6), n=4 (10), n=5 (15), n=6 (?):',
    sequenceVisuals: [
      { label: '1', sub: 'n=1' },
      { label: '3', sub: 'n=2' },
      { label: '6', sub: 'n=3' },
      { label: '10', sub: 'n=4' },
      { label: '15', sub: 'n=5' },
      { label: '?', sub: 'n=6' }
    ],
    options: [
      { label: '21', sub: '6×7/2' },
      { label: '20', sub: 'Option B' },
      { label: '24', sub: 'Option C' },
      { label: '28', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: '6 × 7 / 2 = 21.'
  },
  {
    id: 89,
    domain: 'Alphabet Symmetric Pairing',
    questionText: 'Opposite ends of alphabet: A ↔ Z, B ↔ Y, C ↔ X, D ↔ ?',
    sequenceVisuals: [
      { label: 'A ↔ Z', sub: '1st & 26th' },
      { label: 'B ↔ Y', sub: '2nd & 25th' },
      { label: 'C ↔ X', sub: '3rd & 24th' },
      { label: 'D ↔ ?', sub: '4th & 23rd' }
    ],
    options: [
      { label: 'W', sub: '23rd letter' },
      { label: 'V', sub: '22nd letter' },
      { label: 'U', sub: '21st letter' },
      { label: 'T', sub: '20th letter' }
    ],
    correctIndex: 0,
    explanation: 'Letter D is 4th from start; letter W is 4th from the end (26 - 4 + 1 = 23).'
  },
  {
    id: 90,
    domain: 'Powers of 2 Subtraction',
    questionText: 'Pattern 2ⁿ - 1 (Mersenne progression): 1, 3, 7, 15, 31, ?',
    sequenceVisuals: [
      { label: '1', sub: '2¹-1' },
      { label: '3', sub: '2²-1' },
      { label: '7', sub: '2³-1' },
      { label: '15', sub: '2⁴-1' },
      { label: '31', sub: '2⁵-1' },
      { label: '?', sub: '2⁶-1' }
    ],
    options: [
      { label: '63', sub: '64-1' },
      { label: '61', sub: 'Option B' },
      { label: '57', sub: 'Option C' },
      { label: '65', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: '2⁶ - 1 = 64 - 1 = 63.'
  },
  {
    id: 91,
    domain: 'Additive Constant Step (+15)',
    questionText: 'Arithmetic series: 15, 30, 45, 60, ?',
    sequenceVisuals: [
      { label: '15', sub: 'Step 1' },
      { label: '30', sub: '+15' },
      { label: '45', sub: '+15' },
      { label: '60', sub: '+15' },
      { label: '?', sub: '+15' }
    ],
    options: [
      { label: '75', sub: 'Option A' },
      { label: '70', sub: 'Option B' },
      { label: '80', sub: 'Option C' },
      { label: '85', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: '60 + 15 = 75.'
  },
  {
    id: 92,
    domain: 'Odd Multiples of 3',
    questionText: 'Pattern of odd multiples of 3: 3 (3×1), 9 (3×3), 15 (3×5), 21 (3×7), ?',
    sequenceVisuals: [
      { label: '3', sub: '3×1' },
      { label: '9', sub: '3×3' },
      { label: '15', sub: '3×5' },
      { label: '21', sub: '3×7' },
      { label: '?', sub: '3×9' }
    ],
    options: [
      { label: '27', sub: '3×9' },
      { label: '24', sub: 'Even' },
      { label: '30', sub: 'Even' },
      { label: '33', sub: '3×11' }
    ],
    correctIndex: 0,
    explanation: '3 × 9 = 27.'
  },
  {
    id: 93,
    domain: 'Angle of Regular Octagon',
    questionText: 'Internal angle of regular polygons: Triangle(60°), Square(90°), Pentagon(108°), Hexagon(120°), Octagon(?):',
    sequenceVisuals: [
      { label: '60°', sub: 'Triangle' },
      { label: '90°', sub: 'Square' },
      { label: '108°', sub: 'Pentagon' },
      { label: '120°', sub: 'Hexagon' },
      { label: '?', sub: 'Octagon' }
    ],
    options: [
      { label: '135°', sub: 'Option A' },
      { label: '140°', sub: 'Option B' },
      { label: '130°', sub: 'Option C' },
      { label: '144°', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: 'Interior angle formula: (n-2) × 180° / n. For n=8: 6 × 180° / 8 = 135°.'
  },
  {
    id: 94,
    domain: 'Prime Number Squares',
    questionText: 'Squares of prime numbers: 2²=4, 3²=9, 5²=25, 7²=49, 11²=?',
    sequenceVisuals: [
      { label: '4', sub: '2²' },
      { label: '9', sub: '3²' },
      { label: '25', sub: '5²' },
      { label: '49', sub: '7²' },
      { label: '?', sub: '11²' }
    ],
    options: [
      { label: '121', sub: '11²' },
      { label: '100', sub: '10²' },
      { label: '144', sub: '12²' },
      { label: '169', sub: '13²' }
    ],
    correctIndex: 0,
    explanation: '11 is the next prime number, and 11² = 121.'
  },
  {
    id: 95,
    domain: 'Alternating Triple and Halve',
    questionText: 'Sequence operations: 6 (×3)=18, 18 (÷2)=9, 9 (×3)=27, 27 (÷2)=13.5, 13.5 (×3)=?',
    sequenceVisuals: [
      { label: '6', sub: 'Base' },
      { label: '18', sub: '×3' },
      { label: '9', sub: '÷2' },
      { label: '27', sub: '×3' },
      { label: '13.5', sub: '÷2' },
      { label: '?', sub: '×3' }
    ],
    options: [
      { label: '40.5', sub: 'Option A' },
      { label: '39.5', sub: 'Option B' },
      { label: '42.0', sub: 'Option C' },
      { label: '36.5', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: '13.5 × 3 = 40.5.'
  },
  {
    id: 96,
    domain: 'Cube Root Sequence',
    questionText: 'Integer cube roots: ∛1=1, ∛8=2, ∛27=3, ∛64=4, ∛125=?',
    sequenceVisuals: [
      { label: '1', sub: '∛1' },
      { label: '2', sub: '∛8' },
      { label: '3', sub: '∛27' },
      { label: '4', sub: '∛64' },
      { label: '?', sub: '∛125' }
    ],
    options: [
      { label: '5', sub: 'Option A' },
      { label: '6', sub: 'Option B' },
      { label: '7', sub: 'Option C' },
      { label: '4.5', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: '∛125 = 5 because 5³ = 125.'
  },
  {
    id: 97,
    domain: 'Roman Numerals Powers of 10',
    questionText: 'Roman numerals for base-10 positions: I (1), X (10), C (100), ? (1000)',
    sequenceVisuals: [
      { label: 'I', sub: '1' },
      { label: 'X', sub: '10' },
      { label: 'C', sub: '100' },
      { label: '?', sub: '1000' }
    ],
    options: [
      { label: 'M', sub: '1000' },
      { label: 'D', sub: '500' },
      { label: 'L', sub: '50' },
      { label: 'V', sub: '5' }
    ],
    correctIndex: 0,
    explanation: 'M represents 1000 in Roman numeral system.'
  },
  {
    id: 98,
    domain: 'Triangular Numbers Difference',
    questionText: 'Triangular differences: T(n) - T(n-1) = n. For T(7) - T(6), what is the difference?',
    sequenceVisuals: [
      { label: 'T(4)-T(3)', sub: '4' },
      { label: 'T(5)-T(4)', sub: '5' },
      { label: 'T(6)-T(5)', sub: '6' },
      { label: 'T(7)-T(6)', sub: '?' }
    ],
    options: [
      { label: '7', sub: 'Option A' },
      { label: '8', sub: 'Option B' },
      { label: '6', sub: 'Option C' },
      { label: '9', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: 'The difference between consecutive triangular numbers T(n) and T(n-1) is n: for n=7, the difference is 7.'
  },
  {
    id: 99,
    domain: 'Powers of 2 Reciprocal',
    questionText: 'Binary fractions: 1/2, 1/4, 1/8, 1/16, 1/32, ?',
    sequenceVisuals: [
      { label: '1/2', sub: '2⁻¹' },
      { label: '1/4', sub: '2⁻²' },
      { label: '1/8', sub: '2⁻³' },
      { label: '1/16', sub: '2⁻⁴' },
      { label: '1/32', sub: '2⁻⁵' },
      { label: '?', sub: '2⁻⁶' }
    ],
    options: [
      { label: '1/64', sub: 'Option A' },
      { label: '1/48', sub: 'Option B' },
      { label: '1/128', sub: 'Option C' },
      { label: '1/36', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: '1/32 × 1/2 = 1/64.'
  },
  {
    id: 100,
    domain: 'Collatz Conjecture Step',
    questionText: 'Collatz rule: If even, divide by 2; if odd, multiply by 3 and add 1. Starting at 13 (odd): 13 → ?',
    sequenceVisuals: [
      { label: '13', sub: 'Odd number' },
      { label: '3n + 1', sub: 'Transformation' },
      { label: '?', sub: 'Result' }
    ],
    options: [
      { label: '40', sub: '3×13 + 1 = 40' },
      { label: '39', sub: '3×13' },
      { label: '26', sub: '2×13' },
      { label: '42', sub: 'Option D' }
    ],
    correctIndex: 0,
    explanation: 'For odd 13: (3 × 13) + 1 = 39 + 1 = 40.'
  }
];

// Helper to get random shuffled questions without repeats
export function getRandomPatternQuestions(count = 10): PatternQuestion[] {
  const shuffled = [...PATTERN_QUESTIONS_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
