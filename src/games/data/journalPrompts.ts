export interface JournalPromptItem {
  id: number;
  theme: string;
  question: string;
}

export const JOURNAL_PROMPTS_POOL: JournalPromptItem[] = [
  // 1-15: Gratitude & Ease
  { id: 1, theme: 'Gratitude & Ease', question: 'What is one subtle, often-overlooked detail from your day that you feel genuinely grateful for?' },
  { id: 2, theme: 'Gratitude & Ease', question: 'Who is someone whose presence quietly stabilizes you, and what small gesture of theirs do you appreciate?' },
  { id: 3, theme: 'Gratitude & Ease', question: 'What simple physical comfort (a warm sip, soft light, deep breath) brought you momentary peace today?' },
  { id: 4, theme: 'Gratitude & Ease', question: 'Describe a recent moment when something unexpectedly went right, sparing you unnecessary effort.' },
  { id: 5, theme: 'Gratitude & Ease', question: 'What skill or ability did your body or brain perform effortlessly today that you usually take for granted?' },
  { id: 6, theme: 'Gratitude & Ease', question: 'Reflect on a book, song, or idea that recently enriched your perspective. Why did it resonate?' },
  { id: 7, theme: 'Gratitude & Ease', question: 'What is a challenge you faced last year that you are now completely free from?' },
  { id: 8, theme: 'Gratitude & Ease', question: 'What aspect of nature or your physical surroundings made you pause with appreciation today?' },
  { id: 9, theme: 'Gratitude & Ease', question: 'Who made your life slightly easier this week, even through an ordinary everyday interaction?' },
  { id: 10, theme: 'Gratitude & Ease', question: 'What is something you own that provides consistent, quiet utility every single day?' },
  { id: 11, theme: 'Gratitude & Ease', question: 'What form of modern technology or infrastructure are you deeply thankful exists?' },
  { id: 12, theme: 'Gratitude & Ease', question: 'Recall a conversation that left you feeling understood or lighter. What made it special?' },
  { id: 13, theme: 'Gratitude & Ease', question: 'What is a positive boundary you have maintained recently that protected your inner peace?' },
  { id: 14, theme: 'Gratitude & Ease', question: 'What is one lesson from your past mistakes that you are now genuinely grateful to understand?' },
  { id: 15, theme: 'Gratitude & Ease', question: 'Close your eyes for ten seconds. When you open them, what is the first pleasant sensation you notice?' },

  // 16-30: Cognitive Growth & Mental Plasticity
  { id: 16, theme: 'Cognitive Growth', question: 'What friction or mental obstacle did you encounter recently, and what new insight did it reveal?' },
  { id: 17, theme: 'Cognitive Growth', question: 'What belief or assumption have you held for a long time that you recently began questioning?' },
  { id: 18, theme: 'Cognitive Growth', question: 'When did you feel mentally challenged today, and how did your brain adapt to the complexity?' },
  { id: 19, theme: 'Cognitive Growth', question: 'What is one topic you know very little about that sparks your curiosity to investigate?' },
  { id: 20, theme: 'Cognitive Growth', question: 'How has your problem-solving approach matured compared to how you thought three years ago?' },
  { id: 21, theme: 'Cognitive Growth', question: 'What mental habit or cognitive bias do you catch yourself falling into most often?' },
  { id: 22, theme: 'Cognitive Growth', question: 'Describe a moment today when you chose patience or deliberate deliberation over impulsivity.' },
  { id: 23, theme: 'Cognitive Growth', question: 'What feedback have you received recently that stung initially, but ultimately held valuable truth?' },
  { id: 24, theme: 'Cognitive Growth', question: 'If you could master any complex cognitive discipline over the next six months, what would it be?' },
  { id: 25, theme: 'Cognitive Growth', question: 'What does "thinking from first principles" look like for your most pressing current goal?' },
  { id: 26, theme: 'Cognitive Growth', question: 'How do you distinguish between productive mental effort and circular rumination?' },
  { id: 27, theme: 'Cognitive Growth', question: 'What experiment could you run this week to test a personal or professional hypothesis?' },
  { id: 28, theme: 'Cognitive Growth', question: 'In what area of your life would adopting a "beginner’s mind" yield the highest breakthrough?' },
  { id: 29, theme: 'Cognitive Growth', question: 'What intellectual puzzle or strategic decision is currently occupying the back of your mind?' },
  { id: 30, theme: 'Cognitive Growth', question: 'How do you actively signal to your nervous system that a challenging task is an opportunity rather than a threat?' },

  // 31-45: Emotional Processing & Interoception
  { id: 31, theme: 'Emotional Processing', question: 'Name the most persistent feeling you had today. Without judging it, what message was it trying to send you?' },
  { id: 32, theme: 'Emotional Processing', question: 'Where in your physical body (chest, shoulders, jaw) are you holding tension right now?' },
  { id: 33, theme: 'Emotional Processing', question: 'What emotional reaction surprised you today? What underlying value or boundary was touched?' },
  { id: 34, theme: 'Emotional Processing', question: 'If your current dominant emotion could speak three clear words, what would it say?' },
  { id: 35, theme: 'Emotional Processing', question: 'What is an unspoken expectation you held today that caused internal friction or disappointment?' },
  { id: 36, theme: 'Emotional Processing', question: 'How do you comfort or speak to yourself when you experience self-doubt or cognitive fatigue?' },
  { id: 37, theme: 'Emotional Processing', question: 'What emotional weather pattern best describes your mood today: sunny, misty, turbulent, or clear?' },
  { id: 38, theme: 'Emotional Processing', question: 'What would happen if you stopped resisting a feeling of sadness, irritation, or fear and simply let it exist?' },
  { id: 39, theme: 'Emotional Processing', question: 'What vulnerability are you reluctant to admit to others right now?' },
  { id: 40, theme: 'Emotional Processing', question: 'When did you laugh or experience genuine levity today? What sparked that lightness?' },
  { id: 41, theme: 'Emotional Processing', question: 'What forgiveness—toward yourself or another person—would release the most psychological weight right now?' },
  { id: 42, theme: 'Emotional Processing', question: 'How does physical exhaustion alter your emotional perception, and how can you accommodate that today?' },
  { id: 43, theme: 'Emotional Processing', question: 'What is a healthy outlet you can use today to discharge accumulated nervous system arousal?' },
  { id: 44, theme: 'Emotional Processing', question: 'Describe a moment when you felt deep, authentic connection with another human being.' },
  { id: 45, theme: 'Emotional Processing', question: 'What part of yourself needs compassion, patience, and non-judgmental acceptance today?' },

  // 46-60: Attentional Clarity & Deep Work
  { id: 46, theme: 'Attentional Clarity', question: 'Where did your mental energy go today? Did your focus align with what truly matters to you?' },
  { id: 47, theme: 'Attentional Clarity', question: 'What was your single most potent source of distraction today, and how can you add friction to it?' },
  { id: 48, theme: 'Attentional Clarity', question: 'During which hour did you feel the most focused and lucid? What conditions made that possible?' },
  { id: 49, theme: 'Attentional Clarity', question: 'What task have you been procrastinating on, and what tiny micro-step would break the inertia?' },
  { id: 50, theme: 'Attentional Clarity', question: 'If you could only accomplish one meaningful objective tomorrow, what would move the needle most?' },
  { id: 51, theme: 'Attentional Clarity', question: 'How does digital hyper-connectivity affect your baseline attention span and calmness?' },
  { id: 52, theme: 'Attentional Clarity', question: 'What does an ideal ninety-minute deep work session look like in terms of sound, space, and tools?' },
  { id: 53, theme: 'Attentional Clarity', question: 'What pseudo-productive "busywork" are you using to avoid doing your most important creative work?' },
  { id: 54, theme: 'Attentional Clarity', question: 'How quickly do you reach for your phone upon waking, and what would a phone-free first hour feel like?' },
  { id: 55, theme: 'Attentional Clarity', question: 'What environment or workstation layout brings you the greatest sense of calm order?' },
  { id: 56, theme: 'Attentional Clarity', question: 'When you notice your mind drifting during a task, what gentle anchor brings you back to the present?' },
  { id: 57, theme: 'Attentional Clarity', question: 'What is one notification, newsletter, or tab you can permanently close right now to reclaim mental bandwidth?' },
  { id: 58, theme: 'Attentional Clarity', question: 'What is the difference between being reactive to other people’s agendas and setting your own priority?' },
  { id: 59, theme: 'Attentional Clarity', question: 'How does silence feel to you right now: uncomfortable, restorative, or unfamiliar?' },
  { id: 60, theme: 'Attentional Clarity', question: 'What project deserves your undivided, uninterrupted creative devotion this upcoming week?' },

  // 61-75: Tomorrow’s Anchor & Intention Setting
  { id: 61, theme: 'Tomorrow’s Anchor', question: 'If you could set a single intention or feeling for tomorrow morning, what would it be and why?' },
  { id: 62, theme: 'Tomorrow’s Anchor', question: 'What is the very first proactive action you will take tomorrow before checking any external inputs?' },
  { id: 63, theme: 'Tomorrow’s Anchor', question: 'What potential pitfall or stressor might occur tomorrow, and how will you respond with calm composure?' },
  { id: 64, theme: 'Tomorrow’s Anchor', question: 'What boundary will you protect tomorrow to preserve your cognitive stamina?' },
  { id: 65, theme: 'Tomorrow’s Anchor', question: 'How will you fuel and hydrate your body and brain tomorrow to support peak mental functioning?' },
  { id: 66, theme: 'Tomorrow’s Anchor', question: 'What phrase or mantra will serve as your mental compass when situations become chaotic?' },
  { id: 67, theme: 'Tomorrow’s Anchor', question: 'Who will you express appreciation to tomorrow, and what will you say?' },
  { id: 68, theme: 'Tomorrow’s Anchor', question: 'What time will you deliberately shut down your screens tonight to honor your sleep architecture?' },
  { id: 69, theme: 'Tomorrow’s Anchor', question: 'What is one joyful or playful experience you will actively carve out time for tomorrow?' },
  { id: 70, theme: 'Tomorrow’s Anchor', question: 'How do you want to feel when you lay your head on your pillow tomorrow night?' },
  { id: 71, theme: 'Tomorrow’s Anchor', question: 'What decision can you make tonight that eliminates cognitive fatigue for tomorrow morning?' },
  { id: 72, theme: 'Tomorrow’s Anchor', question: 'What physical movement or outdoor time will you guarantee for yourself tomorrow?' },
  { id: 73, theme: 'Tomorrow’s Anchor', question: 'If tomorrow were your ideal productive day, what rhythm between focus and rest would you keep?' },
  { id: 74, theme: 'Tomorrow’s Anchor', question: 'What small win will you celebrate before noon tomorrow?' },
  { id: 75, theme: 'Tomorrow’s Anchor', question: 'What commitment will you make to yourself tomorrow that you refuse to negotiate away?' },

  // 76-90: Resilience & Stoic Perspective
  { id: 76, theme: 'Resilience & Stoic Perspective', question: 'What situation currently outside your direct control can you consciously surrender mental anxiety over?' },
  { id: 77, theme: 'Resilience & Stoic Perspective', question: 'What is fully within your agency and control right now, regardless of external circumstances?' },
  { id: 78, theme: 'Resilience & Stoic Perspective', question: 'How will the current difficulty or friction you are facing look from the perspective of five years from now?' },
  { id: 79, theme: 'Resilience & Stoic Perspective', question: 'What adversity in your life initially felt like a catastrophe but later revealed itself as a turning point?' },
  { id: 80, theme: 'Resilience & Stoic Perspective', question: 'How do you maintain your core values when someone around you is reactive, hostile, or dishonest?' },
  { id: 81, theme: 'Resilience & Stoic Perspective', question: 'What does "amor fati" (the love of one’s fate) look like for your current life circumstances?' },
  { id: 82, theme: 'Resilience & Stoic Perspective', question: 'If you were guaranteed that you could not fail, what bold step would you take without hesitation?' },
  { id: 83, theme: 'Resilience & Stoic Perspective', question: 'What internal muscle (courage, endurance, patience) is being strengthened by your current routine?' },
  { id: 84, theme: 'Resilience & Stoic Perspective', question: 'What comfort zone are you clinging to that is quietly stifling your personal evolution?' },
  { id: 85, theme: 'Resilience & Stoic Perspective', question: 'How do you recharge your psychological reserves when you feel completely drained?' },
  { id: 86, theme: 'Resilience & Stoic Perspective', question: 'What would a wise mentor tell you to let go of right at this moment?' },
  { id: 87, theme: 'Resilience & Stoic Perspective', question: 'How can you reframe an irritating task into an act of service or discipline?' },
  { id: 88, theme: 'Resilience & Stoic Perspective', question: 'What truth are you avoiding because facing it requires uncomfortable changes?' },
  { id: 89, theme: 'Resilience & Stoic Perspective', question: 'When was the last time you felt proud of your inner grit, regardless of external validation?' },
  { id: 90, theme: 'Resilience & Stoic Perspective', question: 'What does living with quiet, unshakable dignity mean to you today?' },

  // 91-100: Habit Architecture & Life Design
  { id: 91, theme: 'Habit Architecture', question: 'What micro-habit takes less than two minutes but yields compounding dividends for your well-being?' },
  { id: 92, theme: 'Habit Architecture', question: 'What cue or trigger consistently initiates your most destructive or draining habit loop?' },
  { id: 93, theme: 'Habit Architecture', question: 'How can you design your physical environment to make good decisions effortless and automatic?' },
  { id: 94, theme: 'Habit Architecture', question: 'What ritual signals to your brain that the workday is officially over and personal recovery begins?' },
  { id: 95, theme: 'Habit Architecture', question: 'What habit stack (connecting a new habit immediately to an established routine) can you deploy this week?' },
  { id: 96, theme: 'Habit Architecture', question: 'What identity statement ("I am the type of person who...") reinforces the future self you are building?' },
  { id: 97, theme: 'Habit Architecture', question: 'What is the cost of staying exactly the same over the next five years if you don’t change this habit?' },
  { id: 98, theme: 'Habit Architecture', question: 'How do you recover and reset when your daily streak is interrupted by unexpected life events?' },
  { id: 99, theme: 'Habit Architecture', question: 'What standard of excellence are you holding yourself to that you take immense pride in?' },
  { id: 100, theme: 'Habit Architecture', question: 'Write down a single sentence of wisdom that you want to carry in your heart throughout the coming days.' }
];

export function getRandomJournalPrompt(): JournalPromptItem {
  const index = Math.floor(Math.random() * JOURNAL_PROMPTS_POOL.length);
  return JOURNAL_PROMPTS_POOL[index];
}

export function getRandomJournalPrompts(count = 10): JournalPromptItem[] {
  const shuffled = [...JOURNAL_PROMPTS_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
