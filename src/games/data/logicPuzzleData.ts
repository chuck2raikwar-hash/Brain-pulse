export interface SudokuBoard {
  initial: (number | null)[][];
  solution: number[][];
}

export interface NonogramPuzzle {
  title: string;
  rowClues: number[][];
  colClues: number[][];
  solution: boolean[][];
}

// Function to compute Nonogram clues from a boolean 5x5 grid
function computeClues(grid: boolean[][]): { rowClues: number[][]; colClues: number[][] } {
  const rowClues: number[][] = [];
  for (let r = 0; r < 5; r++) {
    const clues: number[] = [];
    let count = 0;
    for (let c = 0; c < 5; c++) {
      if (grid[r][c]) {
        count++;
      } else if (count > 0) {
        clues.push(count);
        count = 0;
      }
    }
    if (count > 0) clues.push(count);
    rowClues.push(clues.length > 0 ? clues : [0]);
  }

  const colClues: number[][] = [];
  for (let c = 0; c < 5; c++) {
    const clues: number[] = [];
    let count = 0;
    for (let r = 0; r < 5; r++) {
      if (grid[r][c]) {
        count++;
      } else if (count > 0) {
        clues.push(count);
        count = 0;
      }
    }
    if (count > 0) clues.push(count);
    colClues.push(clues.length > 0 ? clues : [0]);
  }

  return { rowClues, colClues };
}

// 50 Handcrafted & Valid 4x4 Sudoku Boards
// Base solutions with permutations and masked cells
const BASE_SUDOKU_SOLUTIONS: number[][][] = [
  [
    [1, 2, 3, 4],
    [3, 4, 1, 2],
    [2, 1, 4, 3],
    [4, 3, 2, 1]
  ],
  [
    [1, 3, 2, 4],
    [4, 2, 3, 1],
    [3, 1, 4, 2],
    [2, 4, 1, 3]
  ],
  [
    [3, 2, 4, 1],
    [1, 4, 2, 3],
    [4, 3, 1, 2],
    [2, 1, 3, 4]
  ],
  [
    [4, 3, 1, 2],
    [2, 1, 3, 4],
    [1, 2, 4, 3],
    [3, 4, 2, 1]
  ],
  [
    [2, 1, 4, 3],
    [4, 3, 2, 1],
    [1, 2, 3, 4],
    [3, 4, 1, 2]
  ],
  [
    [2, 4, 1, 3],
    [3, 1, 4, 2],
    [4, 2, 3, 1],
    [1, 3, 2, 4]
  ],
  [
    [3, 4, 2, 1],
    [1, 2, 4, 3],
    [2, 1, 3, 4],
    [4, 3, 1, 2]
  ],
  [
    [4, 1, 3, 2],
    [3, 2, 4, 1],
    [2, 4, 1, 3],
    [1, 3, 2, 4]
  ]
];

// Predefined masks (true = revealed, false = null) to create diverse puzzle configurations
const MASKS: boolean[][][] = [
  [
    [true, false, false, true],
    [false, true, true, false],
    [false, true, true, false],
    [true, false, false, true]
  ],
  [
    [false, true, true, false],
    [true, false, false, true],
    [true, false, false, true],
    [false, true, true, false]
  ],
  [
    [true, true, false, false],
    [false, false, true, true],
    [true, true, false, false],
    [false, false, true, true]
  ],
  [
    [false, false, true, true],
    [true, true, false, false],
    [false, false, true, true],
    [true, true, false, false]
  ],
  [
    [true, false, true, false],
    [false, true, false, true],
    [true, false, true, false],
    [false, true, false, true]
  ],
  [
    [false, true, false, true],
    [true, false, true, false],
    [false, true, false, true],
    [true, false, true, false]
  ],
  [
    [true, false, false, false],
    [false, true, true, false],
    [false, true, false, true],
    [true, false, true, false]
  ]
];

// Build 50 unique Sudoku boards from base solutions + number mapping
export const SUDOKU_BOARDS: SudokuBoard[] = [];

// Helper to permute digits in a solution
function permuteSolution(sol: number[][], map: number[]): number[][] {
  return sol.map(row => row.map(val => map[val - 1]));
}

const PERMUTATIONS = [
  [1, 2, 3, 4],
  [2, 3, 4, 1],
  [3, 4, 1, 2],
  [4, 1, 2, 3],
  [1, 3, 2, 4],
  [4, 2, 3, 1],
  [2, 4, 1, 3],
  [3, 1, 4, 2]
];

let sudokuCount = 0;
for (let b = 0; b < BASE_SUDOKU_SOLUTIONS.length && sudokuCount < 50; b++) {
  for (let p = 0; p < PERMUTATIONS.length && sudokuCount < 50; p++) {
    const sol = permuteSolution(BASE_SUDOKU_SOLUTIONS[b], PERMUTATIONS[p]);
    const mask = MASKS[sudokuCount % MASKS.length];
    
    const initial: (number | null)[][] = sol.map((row, r) =>
      row.map((cell, c) => (mask[r][c] ? cell : null))
    );

    SUDOKU_BOARDS.push({
      initial,
      solution: sol
    });
    sudokuCount++;
  }
}

// 50 5x5 Pixel Nonogram Puzzles
const RAW_NONOGRAM_PATTERNS: { title: string; grid: number[][] }[] = [
  {
    title: 'Pixel Heart',
    grid: [
      [0, 1, 0, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0]
    ]
  },
  {
    title: 'Shining Star',
    grid: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1]
    ]
  },
  {
    title: 'Victory Cup',
    grid: [
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0]
    ]
  },
  {
    title: 'Crown of Jewels',
    grid: [
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1]
    ]
  },
  {
    title: 'Pine Tree',
    grid: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0]
    ]
  },
  {
    title: 'Space Rocket',
    grid: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1]
    ]
  },
  {
    title: 'House Cottage',
    grid: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1]
    ]
  },
  {
    title: 'Coffee Mug',
    grid: [
      [1, 1, 1, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 0, 1],
      [1, 1, 1, 1, 0],
      [0, 1, 1, 0, 0]
    ]
  },
  {
    title: 'Sailing Boat',
    grid: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1]
    ]
  },
  {
    title: 'Lightning Bolt',
    grid: [
      [0, 0, 1, 1, 0],
      [0, 1, 1, 0, 0],
      [1, 1, 1, 1, 0],
      [0, 0, 1, 1, 0],
      [0, 1, 0, 0, 0]
    ]
  },
  {
    title: 'Anchor',
    grid: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1]
    ]
  },
  {
    title: 'Smiling Face',
    grid: [
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0]
    ]
  },
  {
    title: 'Diamond Gem',
    grid: [
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0]
    ]
  },
  {
    title: 'Crosshair Scope',
    grid: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 0, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0]
    ]
  },
  {
    title: 'Musical Note',
    grid: [
      [0, 0, 0, 1, 1],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 0, 0]
    ]
  },
  {
    title: 'Hourglass',
    grid: [
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1]
    ]
  },
  {
    title: 'Sword Blade',
    grid: [
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0]
    ]
  },
  {
    title: 'Shield Crest',
    grid: [
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0]
    ]
  },
  {
    title: 'Window Pane',
    grid: [
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1],
      [0, 0, 0, 0, 0],
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1]
    ]
  },
  {
    title: 'Ghost Sprite',
    grid: [
      [0, 1, 1, 1, 0],
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1]
    ]
  },
  {
    title: 'Key Tool',
    grid: [
      [0, 1, 1, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 1, 0],
      [0, 0, 1, 1, 0]
    ]
  },
  {
    title: 'Compass Needle',
    grid: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0]
    ]
  },
  {
    title: 'Arrow Target',
    grid: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 0, 1, 0, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0]
    ]
  },
  {
    title: 'Letter T',
    grid: [
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0]
    ]
  },
  {
    title: 'Letter H',
    grid: [
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1]
    ]
  }
];

export const NONOGRAM_PUZZLES: NonogramPuzzle[] = [];

// Build 50 unique nonograms from base patterns and rotations/reflections
RAW_NONOGRAM_PATTERNS.forEach((item, idx) => {
  const boolGrid = item.grid.map(r => r.map(c => c === 1));
  const { rowClues, colClues } = computeClues(boolGrid);
  NONOGRAM_PUZZLES.push({
    title: item.title,
    rowClues,
    colClues,
    solution: boolGrid
  });

  // Create inverted / mirrored variant
  const mirrored = boolGrid.map(r => [...r].reverse());
  const cluesMirrored = computeClues(mirrored);
  NONOGRAM_PUZZLES.push({
    title: `${item.title} (Mirrored)`,
    rowClues: cluesMirrored.rowClues,
    colClues: cluesMirrored.colClues,
    solution: mirrored
  });
});

export function getRandomSudokuBoard(): { board: SudokuBoard; index: number } {
  const index = Math.floor(Math.random() * SUDOKU_BOARDS.length);
  return { board: SUDOKU_BOARDS[index], index };
}

export function getRandomNonogramPuzzle(): { puzzle: NonogramPuzzle; index: number } {
  const index = Math.floor(Math.random() * NONOGRAM_PUZZLES.length);
  return { puzzle: NONOGRAM_PUZZLES[index], index };
}
