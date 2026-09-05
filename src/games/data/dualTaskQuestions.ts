export interface DualTaskItem {
  id: number;
  dualTaskTitle: string;
  dualTaskQuestion: string;
  options: string[];
  correctIndex: number;
}

export const DUAL_TASK_QUESTIONS_POOL: DualTaskItem[] = [
  // 1-25: Serial Math & Working Memory Computation
  {
    id: 1,
    dualTaskTitle: 'Dual Task: Backwards Serial Sevens',
    dualTaskQuestion: 'Compute: 100 minus 7, then minus 7 again:',
    options: ['86', '84', '88', '82'],
    correctIndex: 0
  },
  {
    id: 2,
    dualTaskTitle: 'Dual Task: Mental Arithmetic',
    dualTaskQuestion: 'Compute: (14 × 3) + 18 = ?',
    options: ['56', '60', '62', '58'],
    correctIndex: 1
  },
  {
    id: 3,
    dualTaskTitle: 'Dual Task: Percentage Calculation',
    dualTaskQuestion: 'What is 15% of 240?',
    options: ['36', '32', '38', '34'],
    correctIndex: 0
  },
  {
    id: 4,
    dualTaskTitle: 'Dual Task: Serial Threes',
    dualTaskQuestion: 'Start at 51, subtract 3 four times: 51 - 3 - 3 - 3 - 3 = ?',
    options: ['39', '38', '40', '42'],
    correctIndex: 0
  },
  {
    id: 5,
    dualTaskTitle: 'Dual Task: Multiplicative Power',
    dualTaskQuestion: 'What is 2⁶ minus 14?',
    options: ['50', '48', '52', '46'],
    correctIndex: 0
  },
  {
    id: 6,
    dualTaskTitle: 'Dual Task: Division & Remainder',
    dualTaskQuestion: 'What is the remainder when 87 is divided by 8?',
    options: ['7', '5', '3', '1'],
    correctIndex: 0
  },
  {
    id: 7,
    dualTaskTitle: 'Dual Task: Double Squaring',
    dualTaskQuestion: 'What is 9² minus 7²?',
    options: ['32', '30', '34', '28'],
    correctIndex: 0
  },
  {
    id: 8,
    dualTaskTitle: 'Dual Task: Half & Triple',
    dualTaskQuestion: 'Take half of 68, then multiply by 3:',
    options: ['102', '98', '106', '100'],
    correctIndex: 0
  },
  {
    id: 9,
    dualTaskTitle: 'Dual Task: Mental Summation',
    dualTaskQuestion: 'Sum the numbers: 17 + 23 + 39 + 11 = ?',
    options: ['90', '88', '92', '94'],
    correctIndex: 0
  },
  {
    id: 10,
    dualTaskTitle: 'Dual Task: Rapid Subtraction',
    dualTaskQuestion: 'What is 1000 minus 347?',
    options: ['653', '643', '663', '657'],
    correctIndex: 0
  },
  {
    id: 11,
    dualTaskTitle: 'Dual Task: Average Value',
    dualTaskQuestion: 'What is the arithmetic mean of 12, 18, and 30?',
    options: ['20', '18', '22', '24'],
    correctIndex: 0
  },
  {
    id: 12,
    dualTaskTitle: 'Dual Task: Consecutive Odd Sum',
    dualTaskQuestion: 'What is the sum of 13 + 15 + 17 + 19?',
    options: ['64', '60', '68', '62'],
    correctIndex: 0
  },
  {
    id: 13,
    dualTaskTitle: 'Dual Task: Power of Ten',
    dualTaskQuestion: 'Calculate: (0.4 × 500) - 45 = ?',
    options: ['155', '145', '165', '150'],
    correctIndex: 0
  },
  {
    id: 14,
    dualTaskTitle: 'Dual Task: Fractional Halving',
    dualTaskQuestion: 'What is 3/4 of 120, divided by 3?',
    options: ['30', '25', '35', '40'],
    correctIndex: 0
  },
  {
    id: 15,
    dualTaskTitle: 'Dual Task: Prime Counting',
    dualTaskQuestion: 'How many prime numbers exist between 10 and 20?',
    options: ['4 (11, 13, 17, 19)', '3', '5', '2'],
    correctIndex: 0
  },
  {
    id: 16,
    dualTaskTitle: 'Dual Task: Double Operation',
    dualTaskQuestion: 'Calculate: (25 × 4) - (12 × 5) = ?',
    options: ['40', '35', '45', '50'],
    correctIndex: 0
  },
  {
    id: 17,
    dualTaskTitle: 'Dual Task: Rapid Square Root',
    dualTaskQuestion: 'What is √196 + √64 = ?',
    options: ['22', '20', '24', '18'],
    correctIndex: 0
  },
  {
    id: 18,
    dualTaskTitle: 'Dual Task: Serial Fives',
    dualTaskQuestion: 'Start at 83, subtract 5 three times: 83 - 15 = ?',
    options: ['68', '65', '70', '66'],
    correctIndex: 0
  },
  {
    id: 19,
    dualTaskTitle: 'Dual Task: Cube Arithmetic',
    dualTaskQuestion: 'What is 4³ minus 3³?',
    options: ['37', '35', '39', '31'],
    correctIndex: 0
  },
  {
    id: 20,
    dualTaskTitle: 'Dual Task: Ratio Computation',
    dualTaskQuestion: 'If a recipe requires 3 parts flour to 2 parts water, how much flour for 10 parts water?',
    options: ['15 parts', '12 parts', '18 parts', '20 parts'],
    correctIndex: 0
  },
  {
    id: 21,
    dualTaskTitle: 'Dual Task: Binary Conversion',
    dualTaskQuestion: 'What is the binary number 1011 in decimal?',
    options: ['11', '9', '13', '10'],
    correctIndex: 0
  },
  {
    id: 22,
    dualTaskTitle: 'Dual Task: Percentage Off',
    dualTaskQuestion: 'An item priced at $80 has a 30% discount. What is the final price?',
    options: ['$56', '$54', '$58', '$60'],
    correctIndex: 0
  },
  {
    id: 23,
    dualTaskTitle: 'Dual Task: Elapsed Time',
    dualTaskQuestion: 'If an athlete begins stretching at 8:47 AM and holds for 38 minutes, what time is it?',
    options: ['9:25 AM', '9:23 AM', '9:28 AM', '9:15 AM'],
    correctIndex: 0
  },
  {
    id: 24,
    dualTaskTitle: 'Dual Task: Multiplicative Factor',
    dualTaskQuestion: 'What is 16 × 12 = ?',
    options: ['192', '182', '196', '188'],
    correctIndex: 0
  },
  {
    id: 25,
    dualTaskTitle: 'Dual Task: Integer Difference',
    dualTaskQuestion: 'What is the difference between 512 and 278?',
    options: ['234', '224', '244', '238'],
    correctIndex: 0
  },

  // 26-50: Reverse Orthography & Linguistic Scrambling
  {
    id: 26,
    dualTaskTitle: 'Dual Task: Reverse Orthography',
    dualTaskQuestion: 'What is the word "SYNAPSE" spelled in exact reverse order?',
    options: ['ESPANYS', 'ESPANY S', 'ESPANYC', 'ESPYNAS'],
    correctIndex: 0
  },
  {
    id: 27,
    dualTaskTitle: 'Dual Task: Reverse Orthography',
    dualTaskQuestion: 'Spell "NEURON" in exact reverse order:',
    options: ['NORUEN', 'NORUON', 'NOREUN', 'NORUNE'],
    correctIndex: 0
  },
  {
    id: 28,
    dualTaskTitle: 'Dual Task: Reverse Orthography',
    dualTaskQuestion: 'Spell "MEMORY" in exact reverse order:',
    options: ['YROMEM', 'YROREM', 'YROMEN', 'YORMEM'],
    correctIndex: 0
  },
  {
    id: 29,
    dualTaskTitle: 'Dual Task: Reverse Orthography',
    dualTaskQuestion: 'Spell "CORTEX" in exact reverse order:',
    options: ['XETROC', 'XETORC', 'XATROC', 'XTEROC'],
    correctIndex: 0
  },
  {
    id: 30,
    dualTaskTitle: 'Dual Task: Reverse Orthography',
    dualTaskQuestion: 'Spell "PLASTIC" in exact reverse order:',
    options: ['CITSALP', 'CITSLAP', 'CISPALT', 'CITSALB'],
    correctIndex: 0
  },
  {
    id: 31,
    dualTaskTitle: 'Dual Task: Reverse Orthography',
    dualTaskQuestion: 'Spell "FOCUS" in exact reverse order:',
    options: ['SUCOF', 'SUCFO', 'SOCOF', 'SUCOV'],
    correctIndex: 0
  },
  {
    id: 32,
    dualTaskTitle: 'Dual Task: Reverse Orthography',
    dualTaskQuestion: 'Spell "INSIGHT" in exact reverse order:',
    options: ['THGISNI', 'THGISIN', 'THGSINI', 'TGHSINI'],
    correctIndex: 0
  },
  {
    id: 33,
    dualTaskTitle: 'Dual Task: Reverse Orthography',
    dualTaskQuestion: 'Spell "MYELIN" in exact reverse order:',
    options: ['NILEYM', 'NILEYN', 'NILEMY', 'NILEYU'],
    correctIndex: 0
  },
  {
    id: 34,
    dualTaskTitle: 'Dual Task: Reverse Orthography',
    dualTaskQuestion: 'Spell "RHYTHM" in exact reverse order:',
    options: ['MHTYHR', 'MHTHYR', 'MHTRHY', 'MHYTHR'],
    correctIndex: 0
  },
  {
    id: 35,
    dualTaskTitle: 'Dual Task: Reverse Orthography',
    dualTaskQuestion: 'Spell "CLARITY" in exact reverse order:',
    options: ['YTIRALC', 'YTIRACL', 'YTIRLAC', 'YITRALC'],
    correctIndex: 0
  },
  {
    id: 36,
    dualTaskTitle: 'Dual Task: Anagram Recognition',
    dualTaskQuestion: 'Which word is an exact anagram of "SILENT"?',
    options: ['LISTEN', 'INSECT', 'TINSEL', 'CLIENT'],
    correctIndex: 0
  },
  {
    id: 37,
    dualTaskTitle: 'Dual Task: Anagram Recognition',
    dualTaskQuestion: 'Which word is an exact anagram of "EARTH"?',
    options: ['HEART', 'HASTE', 'THERE', 'HEARD'],
    correctIndex: 0
  },
  {
    id: 38,
    dualTaskTitle: 'Dual Task: Word Vowel Count',
    dualTaskQuestion: 'How many vowels are in the word "NEUROPLASTICITY"?',
    options: ['6 (E, U, O, A, I, I)', '5', '7', '8'],
    correctIndex: 0
  },
  {
    id: 39,
    dualTaskTitle: 'Dual Task: Word Consonant Count',
    dualTaskQuestion: 'How many consonants are in the word "STRENGTH"?',
    options: ['7 (S, T, R, N, G, T, H)', '6', '5', '8'],
    correctIndex: 0
  },
  {
    id: 40,
    dualTaskTitle: 'Dual Task: Alphabetical Midpoint',
    dualTaskQuestion: 'What letter sits exactly at the midpoint of the 26-letter English alphabet?',
    options: ['Between M (13) and N (14)', 'L', 'O', 'P'],
    correctIndex: 0
  },
  {
    id: 41,
    dualTaskTitle: 'Dual Task: Reverse Alphabet Position',
    dualTaskQuestion: 'What is the 3rd letter from the end of the alphabet?',
    options: ['X', 'Y', 'W', 'V'],
    correctIndex: 0
  },
  {
    id: 42,
    dualTaskTitle: 'Dual Task: Palindrome Check',
    dualTaskQuestion: 'Which of the following words is an exact palindrome?',
    options: ['KAYAK', 'TRAIN', 'RHYTHM', 'BRAIN'],
    correctIndex: 0
  },
  {
    id: 43,
    dualTaskTitle: 'Dual Task: Palindrome Check',
    dualTaskQuestion: 'Which of these number sequences reads the same backwards?',
    options: ['48984', '48974', '48982', '49894'],
    correctIndex: 0
  },
  {
    id: 44,
    dualTaskTitle: 'Dual Task: Syllable Counting',
    dualTaskQuestion: 'How many syllables are in the word "CEREBELLUM"?',
    options: ['4 (ce-re-bel-lum)', '3', '5', '2'],
    correctIndex: 0
  },
  {
    id: 45,
    dualTaskTitle: 'Dual Task: Antonym Retrieval',
    dualTaskQuestion: 'What is the direct antonym of "EXPEDITE"?',
    options: ['Delay / Hinder', 'Accelerate', 'Amplify', 'Approve'],
    correctIndex: 0
  },
  {
    id: 46,
    dualTaskTitle: 'Dual Task: Antonym Retrieval',
    dualTaskQuestion: 'What is the opposite of "LUCID"?',
    options: ['Obscure / Muddled', 'Bright', 'Transparent', 'Harmonious'],
    correctIndex: 0
  },
  {
    id: 47,
    dualTaskTitle: 'Dual Task: Word Length Comparison',
    dualTaskQuestion: 'Which word has the greatest letter count?',
    options: ['HIPPOCAMPUS (11)', 'AMYGDALA (8)', 'THALAMUS (8)', 'SYNAPSE (7)'],
    correctIndex: 0
  },
  {
    id: 48,
    dualTaskTitle: 'Dual Task: Alphabet Shift',
    dualTaskQuestion: 'If you shift each letter in "CAT" forward by 1 in the alphabet, what word do you get?',
    options: ['DBU', 'BAT', 'CBU', 'DBT'],
    correctIndex: 0
  },
  {
    id: 49,
    dualTaskTitle: 'Dual Task: Category Odd One Out',
    dualTaskQuestion: 'Which item does not belong with the others?',
    options: ['Pancreas (not a brain lobe)', 'Frontal Lobe', 'Temporal Lobe', 'Occipital Lobe'],
    correctIndex: 0
  },
  {
    id: 50,
    dualTaskTitle: 'Dual Task: Lexical Roots',
    dualTaskQuestion: 'What does the Latin root "somnus" mean?',
    options: ['Sleep', 'Sound', 'Light', 'Blood'],
    correctIndex: 0
  },

  // 51-75: Neuroscience & Physiological Trivia
  {
    id: 51,
    dualTaskTitle: 'Dual Task: Lexical Category Matching',
    dualTaskQuestion: 'Which organ produces melatonin to regulate circadian sleep cycles?',
    options: ['Pineal Gland', 'Thyroid Gland', 'Hippocampus', 'Pancreas'],
    correctIndex: 0
  },
  {
    id: 52,
    dualTaskTitle: 'Dual Task: Neurobiology Trivia',
    dualTaskQuestion: 'Which lobe of the brain processes primary visual information?',
    options: ['Occipital Lobe', 'Temporal Lobe', 'Parietal Lobe', 'Frontal Lobe'],
    correctIndex: 0
  },
  {
    id: 53,
    dualTaskTitle: 'Dual Task: Neurobiology Trivia',
    dualTaskQuestion: 'What percentage of total body resting oxygen does the adult human brain consume?',
    options: ['Approximately 20%', 'Approximately 5%', 'Approximately 35%', 'Approximately 50%'],
    correctIndex: 0
  },
  {
    id: 54,
    dualTaskTitle: 'Dual Task: Neurobiology Trivia',
    dualTaskQuestion: 'Which structure coordinates fine motor control and smooth balance equilibrium?',
    options: ['Cerebellum', 'Corpus Callosum', 'Amygdala', 'Medulla'],
    correctIndex: 0
  },
  {
    id: 55,
    dualTaskTitle: 'Dual Task: Neurobiology Trivia',
    dualTaskQuestion: 'What is the thick nerve bundle connecting the left and right cerebral hemispheres?',
    options: ['Corpus Callosum', 'Fornix', 'Optic Chiasm', 'Spinal Cord'],
    correctIndex: 0
  },
  {
    id: 56,
    dualTaskTitle: 'Dual Task: Neurobiology Trivia',
    dualTaskQuestion: 'Which neurotransmitter is most directly associated with the reward and habit loop?',
    options: ['Dopamine', 'Histamine', 'Substance P', 'Melatonin'],
    correctIndex: 0
  },
  {
    id: 57,
    dualTaskTitle: 'Dual Task: Neurobiology Trivia',
    dualTaskQuestion: 'Where are episodic long-term memories encoded before consolidation in the cortex?',
    options: ['Hippocampus', 'Pituitary Gland', 'Pons', 'Basal Ganglia'],
    correctIndex: 0
  },
  {
    id: 58,
    dualTaskTitle: 'Dual Task: Neurobiology Trivia',
    dualTaskQuestion: 'What is the primary excitatory neurotransmitter in the central nervous system?',
    options: ['Glutamate', 'GABA', 'Glycine', 'Endorphin'],
    correctIndex: 0
  },
  {
    id: 59,
    dualTaskTitle: 'Dual Task: Neurobiology Trivia',
    dualTaskQuestion: 'What is the primary inhibitory neurotransmitter in the mammalian brain?',
    options: ['GABA', 'Adrenaline', 'Cortisol', 'Glutamate'],
    correctIndex: 0
  },
  {
    id: 60,
    dualTaskTitle: 'Dual Task: Physiology Trivia',
    dualTaskQuestion: 'Which nerve innervates the diaphragm muscle, enabling pulmonary breathing?',
    options: ['Phrenic Nerve', 'Vagus Nerve', 'Sciatic Nerve', 'Trigeminal Nerve'],
    correctIndex: 0
  },
  {
    id: 61,
    dualTaskTitle: 'Dual Task: Physiology Trivia',
    dualTaskQuestion: 'What chemical molecule carries energy within biological cells (the energy currency)?',
    options: ['ATP (Adenosine Triphosphate)', 'DNA', 'Hemoglobin', 'Glucose'],
    correctIndex: 0
  },
  {
    id: 62,
    dualTaskTitle: 'Dual Task: Physiology Trivia',
    dualTaskQuestion: 'Which branch of the autonomic nervous system governs "rest and digest"?',
    options: ['Parasympathetic', 'Sympathetic', 'Enteric', 'Somatic'],
    correctIndex: 0
  },
  {
    id: 63,
    dualTaskTitle: 'Dual Task: Neurobiology Trivia',
    dualTaskQuestion: 'What glial cell forms the protective myelin insulation around axons in the central nervous system?',
    options: ['Oligodendrocyte', 'Schwann Cell', 'Microglia', 'Ependymal Cell'],
    correctIndex: 0
  },
  {
    id: 64,
    dualTaskTitle: 'Dual Task: Cognitive Science',
    dualTaskQuestion: 'What is the average human working memory digit capacity according to Miller’s Law?',
    options: ['7 ± 2 items', '3 ± 1 items', '12 ± 2 items', '15 ± 3 items'],
    correctIndex: 0
  },
  {
    id: 65,
    dualTaskTitle: 'Dual Task: Physiology Trivia',
    dualTaskQuestion: 'Which organ produces insulin to regulate blood sugar levels?',
    options: ['Pancreas', 'Liver', 'Gallbladder', 'Kidney'],
    correctIndex: 0
  },
  {
    id: 66,
    dualTaskTitle: 'Dual Task: Neurobiology Trivia',
    dualTaskQuestion: 'Which brain region acts as the emotional alarm center, triggering fear responses?',
    options: ['Amygdala', 'Cerebellum', 'Thalamus', 'Occipital Lobe'],
    correctIndex: 0
  },
  {
    id: 67,
    dualTaskTitle: 'Dual Task: Sleep Architecture',
    dualTaskQuestion: 'During which phase of sleep do high-frequency, vivid dreams predominantly occur?',
    options: ['REM (Rapid Eye Movement)', 'Stage 1 Light', 'Stage 3 Slow-Wave', 'Sleep Onset'],
    correctIndex: 0
  },
  {
    id: 68,
    dualTaskTitle: 'Dual Task: Circadian Rhythm',
    dualTaskQuestion: 'Which master circadian pacemaker nucleus resides directly in the hypothalamus?',
    options: ['Suprachiasmatic Nucleus (SCN)', 'Red Nucleus', 'Substantia Nigra', 'Caudate Nucleus'],
    correctIndex: 0
  },
  {
    id: 69,
    dualTaskTitle: 'Dual Task: Cellular Neuroscience',
    dualTaskQuestion: 'What is the resting electrical membrane potential of a typical mammalian neuron?',
    options: ['Approximately -70 mV', '+40 mV', '0 mV', '-200 mV'],
    correctIndex: 0
  },
  {
    id: 70,
    dualTaskTitle: 'Dual Task: Vision & Perception',
    dualTaskQuestion: 'Which retinal photoreceptor cells are responsible for photopic color vision?',
    options: ['Cones', 'Rods', 'Ganglion Cells', 'Bipolar Cells'],
    correctIndex: 0
  },
  {
    id: 71,
    dualTaskTitle: 'Dual Task: Vision & Perception',
    dualTaskQuestion: 'Which retinal photoreceptors function primarily in scotopic (low-light/night) vision?',
    options: ['Rods', 'Cones', 'Horizontal Cells', 'Amacrine Cells'],
    correctIndex: 0
  },
  {
    id: 72,
    dualTaskTitle: 'Dual Task: Neurovascular Health',
    dualTaskQuestion: 'What semipermeable cellular barrier prevents toxins and pathogens from entering brain tissue?',
    options: ['Blood-Brain Barrier (BBB)', 'Dura Mater', 'Pia Mater', 'Peritoneum'],
    correctIndex: 0
  },
  {
    id: 73,
    dualTaskTitle: 'Dual Task: Neurobiology Trivia',
    dualTaskQuestion: 'In Parkinson’s pathology, which dopaminergic midbrain region undergoes marked neurodegeneration?',
    options: ['Substantia Nigra', 'Superior Colliculus', 'Mammillary Bodies', 'Pineal Gland'],
    correctIndex: 0
  },
  {
    id: 74,
    dualTaskTitle: 'Dual Task: Sensory Processing',
    dualTaskQuestion: 'Which sense bypasses the thalamus relay hub and projects directly to the cortex and limbic system?',
    options: ['Olfaction (Smell)', 'Vision', 'Audition (Hearing)', 'Gustation (Taste)'],
    correctIndex: 0
  },
  {
    id: 75,
    dualTaskTitle: 'Dual Task: Cognitive Psychology',
    dualTaskQuestion: 'What is the Stroop effect a demonstration of?',
    options: ['Cognitive interference in reaction times', 'Auditory pitch discrimination', 'Visual illusion of depth', 'Memory loss under stress'],
    correctIndex: 0
  },

  // 76-100: Executive Logic & Cognitive Riddles
  {
    id: 76,
    dualTaskTitle: 'Dual Task: Logical Deduction',
    dualTaskQuestion: 'All neurons have axons. Cell X has no axon. Is Cell X a neuron?',
    options: ['No, definitively not', 'Yes, definitely', 'Possibly a specialized neuron', 'Insufficient data'],
    correctIndex: 0
  },
  {
    id: 77,
    dualTaskTitle: 'Dual Task: Cognitive Riddle',
    dualTaskQuestion: 'If it takes 5 minutes for 5 machines to make 5 widgets, how many minutes for 100 machines to make 100 widgets?',
    options: ['5 minutes', '100 minutes', '20 minutes', '1 minute'],
    correctIndex: 0
  },
  {
    id: 78,
    dualTaskTitle: 'Dual Task: Spatial Orientation',
    dualTaskQuestion: 'If you are facing North, turn 90° right, then 180° around, which direction are you facing?',
    options: ['West', 'East', 'South', 'North'],
    correctIndex: 0
  },
  {
    id: 79,
    dualTaskTitle: 'Dual Task: Spatial Orientation',
    dualTaskQuestion: 'If you look in a mirror and raise your left hand, which hand appears raised in the mirror image?',
    options: ['The image’s right hand', 'The image’s left hand', 'Both hands', 'Neither hand'],
    correctIndex: 0
  },
  {
    id: 80,
    dualTaskTitle: 'Dual Task: Transitive Logic',
    dualTaskQuestion: 'If A is faster than B, and B is faster than C, who finishes last in a sprint?',
    options: ['C', 'A', 'B', 'Cannot be determined'],
    correctIndex: 0
  },
  {
    id: 81,
    dualTaskTitle: 'Dual Task: Temporal Calculation',
    dualTaskQuestion: 'The day before yesterday was Thursday. What day will tomorrow be?',
    options: ['Sunday', 'Saturday', 'Monday', 'Friday'],
    correctIndex: 0
  },
  {
    id: 82,
    dualTaskTitle: 'Dual Task: Logical Negation',
    dualTaskQuestion: 'What is the logical negation of the statement: "Every cat is brown"?',
    options: ['At least one cat is not brown', 'All cats are black', 'No cats are brown', 'Every dog is brown'],
    correctIndex: 0
  },
  {
    id: 83,
    dualTaskTitle: 'Dual Task: Probability & Odds',
    dualTaskQuestion: 'What is the probability of rolling a sum of 7 with two fair 6-sided dice?',
    options: ['6/36 (1 in 6)', '1/12', '1/36', '1/18'],
    correctIndex: 0
  },
  {
    id: 84,
    dualTaskTitle: 'Dual Task: Speed & Velocity',
    dualTaskQuestion: 'A train travels at 60 mph for 45 minutes. How many miles does it travel?',
    options: ['45 miles', '40 miles', '50 miles', '60 miles'],
    correctIndex: 0
  },
  {
    id: 85,
    dualTaskTitle: 'Dual Task: Syllogistic Deduction',
    dualTaskQuestion: 'Some roses are flowers. All flowers need sunlight. Therefore:',
    options: ['Some roses need sunlight', 'All roses need sunlight', 'No flowers are roses', 'Sunlight creates roses'],
    correctIndex: 0
  },
  {
    id: 86,
    dualTaskTitle: 'Dual Task: Set Theory',
    dualTaskQuestion: 'If Set A has 5 elements and Set B has 4 elements with 2 elements in common, how many are in A ∪ B?',
    options: ['7 elements (5 + 4 - 2)', '9 elements', '6 elements', '8 elements'],
    correctIndex: 0
  },
  {
    id: 87,
    dualTaskTitle: 'Dual Task: Cognitive Flexibility',
    dualTaskQuestion: 'Which number is spelled with letters in alphabetical order?',
    options: ['FORTY (F-O-R-T-Y)', 'EIGHT', 'THREE', 'SEVEN'],
    correctIndex: 0
  },
  {
    id: 88,
    dualTaskTitle: 'Dual Task: Mental Calendar',
    dualTaskQuestion: 'How many days are in July and August combined?',
    options: ['62 days (31 + 31)', '60 days', '61 days', '63 days'],
    correctIndex: 0
  },
  {
    id: 89,
    dualTaskTitle: 'Dual Task: Leap Year Rule',
    dualTaskQuestion: 'Which of the following years is a leap year under Gregorian rules?',
    options: ['2000 (divisible by 400)', '1900', '2100', '1800'],
    correctIndex: 0
  },
  {
    id: 90,
    dualTaskTitle: 'Dual Task: Order of Operations',
    dualTaskQuestion: 'Evaluate: 6 ÷ 2(1 + 2) = ?',
    options: ['9', '1', '6', '3'],
    correctIndex: 0
  },
  {
    id: 91,
    dualTaskTitle: 'Dual Task: Number Base Math',
    dualTaskQuestion: 'In base 8 (octal), what is 7 + 1?',
    options: ['10', '8', '11', '0'],
    correctIndex: 0
  },
  {
    id: 92,
    dualTaskTitle: 'Dual Task: Analogical Reasoning',
    dualTaskQuestion: 'Neuron is to Brain as Hepatocyte is to:',
    options: ['Liver', 'Heart', 'Kidney', 'Lung'],
    correctIndex: 0
  },
  {
    id: 93,
    dualTaskTitle: 'Dual Task: Analogical Reasoning',
    dualTaskQuestion: 'Retina is to Eye as Cochlea is to:',
    options: ['Ear', 'Nose', 'Tongue', 'Skin'],
    correctIndex: 0
  },
  {
    id: 94,
    dualTaskTitle: 'Dual Task: Working Memory Anchor',
    dualTaskQuestion: 'Remember the sequence: [7, 4, 9, 2]. What was the second number?',
    options: ['4', '7', '9', '2'],
    correctIndex: 0
  },
  {
    id: 95,
    dualTaskTitle: 'Dual Task: Working Memory Anchor',
    dualTaskQuestion: 'Remember the sequence: [B, K, R, M]. What was the letter immediately before M?',
    options: ['R', 'K', 'B', 'M'],
    correctIndex: 0
  },
  {
    id: 96,
    dualTaskTitle: 'Dual Task: Coin Counting',
    dualTaskQuestion: '3 quarters, 4 dimes, and 2 nickels equal how many cents?',
    options: ['125 cents ($1.25)', '115 cents', '135 cents', '120 cents'],
    correctIndex: 0
  },
  {
    id: 97,
    dualTaskTitle: 'Dual Task: Roman Numeral Decoding',
    dualTaskQuestion: 'What decimal number is represented by Roman numeral XLVII?',
    options: ['47', '67', '57', '37'],
    correctIndex: 0
  },
  {
    id: 98,
    dualTaskTitle: 'Dual Task: Unit Conversion',
    dualTaskQuestion: 'How many fluid ounces are in one standard US pint?',
    options: ['16 fluid ounces', '12 fluid ounces', '20 fluid ounces', '8 fluid ounces'],
    correctIndex: 0
  },
  {
    id: 99,
    dualTaskTitle: 'Dual Task: Temperature Conversion',
    dualTaskQuestion: 'What is 100 degrees Celsius in Fahrenheit (the boiling point of water)?',
    options: ['212°F', '200°F', '220°F', '180°F'],
    correctIndex: 0
  },
  {
    id: 100,
    dualTaskTitle: 'Dual Task: Final Mental Agility',
    dualTaskQuestion: 'Take 50, multiply by 2, add 17, subtract 27, divide by 3:',
    options: ['30', '28', '32', '35'],
    correctIndex: 0
  }
];

export function getRandomDualTaskQuestion(): DualTaskItem {
  const index = Math.floor(Math.random() * DUAL_TASK_QUESTIONS_POOL.length);
  return DUAL_TASK_QUESTIONS_POOL[index];
}

export function getRandomDualTaskQuestions(count = 10): DualTaskItem[] {
  const shuffled = [...DUAL_TASK_QUESTIONS_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
