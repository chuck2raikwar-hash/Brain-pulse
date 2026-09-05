export interface AnagramPuzzle {
  word: string;
  scrambled: string[];
  clue: string;
  category: string;
}

export interface VocabQuestion {
  word: string;
  definition: string;
  options: string[];
  correctIndex: number;
  clue: string;
}

// 100 Rich Anagram Puzzles
export const ANAGRAM_PUZZLES_POOL: AnagramPuzzle[] = [
  { word: 'NEURON', scrambled: ['R', 'O', 'N', 'E', 'U', 'N'], clue: 'An electrically excitable cell communicating via synapses.', category: 'Neuroscience' },
  { word: 'CORTEX', scrambled: ['T', 'E', 'X', 'C', 'O', 'R'], clue: 'The outer layer of neural tissue in the cerebrum.', category: 'Anatomy' },
  { word: 'SYNAPSE', scrambled: ['P', 'A', 'S', 'S', 'E', 'N', 'Y'], clue: 'The microscopic junction through which nervous impulses pass.', category: 'Biology' },
  { word: 'MEMORY', scrambled: ['M', 'Y', 'E', 'R', 'M', 'O'], clue: 'The cognitive faculty of encoding, storing, and retrieving information.', category: 'Psychology' },
  { word: 'PLASTIC', scrambled: ['C', 'I', 'T', 'S', 'A', 'L', 'P'], clue: 'The remarkable ability of neural networks to rewire and adapt.', category: 'Learning' },
  { word: 'INSIGHT', scrambled: ['T', 'I', 'H', 'G', 'S', 'N', 'I'], clue: 'A sudden intuitive understanding of a complex problem.', category: 'Cognition' },
  { word: 'AXON', scrambled: ['X', 'O', 'A', 'N'], clue: 'The long, slender projection of a nerve cell conducting impulses.', category: 'Neuroscience' },
  { word: 'DENDRITE', scrambled: ['E', 'D', 'N', 'T', 'I', 'R', 'E', 'D'], clue: 'Branched tree-like projections of a neuron receiving signals.', category: 'Neuroscience' },
  { word: 'MYELIN', scrambled: ['L', 'I', 'N', 'E', 'M', 'Y'], clue: 'The lipid-rich insulating sheath wrapping around nerve fibers.', category: 'Biology' },
  { word: 'SOMA', scrambled: ['M', 'A', 'S', 'O'], clue: 'The spherical cell body of a neuron containing the nucleus.', category: 'Anatomy' },
  { word: 'GLIA', scrambled: ['A', 'I', 'L', 'G'], clue: 'Non-neuronal brain cells providing support and protection.', category: 'Neuroscience' },
  { word: 'DOPAMINE', scrambled: ['M', 'A', 'P', 'O', 'D', 'E', 'I', 'N'], clue: 'Neurotransmitter crucial for motivation, reward, and motor control.', category: 'Biochemistry' },
  { word: 'SEROTONIN', scrambled: ['N', 'I', 'N', 'O', 'T', 'O', 'R', 'E', 'S'], clue: 'Monoamine neurotransmitter stabilizing mood, happiness, and sleep.', category: 'Biochemistry' },
  { word: 'GABA', scrambled: ['B', 'A', 'A', 'G'], clue: 'The primary inhibitory neurotransmitter in the mammalian CNS.', category: 'Biochemistry' },
  { word: 'AMYGDALA', scrambled: ['L', 'A', 'D', 'A', 'Y', 'M', 'A', 'G'], clue: 'Almond-shaped brain structure key to emotion and fear processing.', category: 'Anatomy' },
  { word: 'THALAMUS', scrambled: ['M', 'A', 'T', 'H', 'A', 'L', 'U', 'S'], clue: 'The brain relay hub routing sensory information to the cortex.', category: 'Anatomy' },
  { word: 'HYPOTHALAMUS', scrambled: ['H', 'P', 'O', 'T', 'H', 'A', 'L', 'A', 'M', 'U', 'S', 'Y'], clue: 'Limbic region maintaining homeostatic balance, hormones, and temperature.', category: 'Anatomy' },
  { word: 'STRIATUM', scrambled: ['T', 'R', 'I', 'U', 'M', 'A', 'T', 'S'], clue: 'Critical basal ganglia input nuclei coordinating reward and movement.', category: 'Anatomy' },
  { word: 'INSULA', scrambled: ['S', 'U', 'L', 'A', 'N', 'I'], clue: 'Deep cortical structure involved in interoception and body awareness.', category: 'Anatomy' },
  { word: 'PUTAMEN', scrambled: ['T', 'E', 'M', 'A', 'P', 'U', 'N'], clue: 'Round basal structure that regulates motor movements and learned skills.', category: 'Anatomy' },
  { word: 'MEDULLA', scrambled: ['L', 'L', 'U', 'D', 'E', 'M', 'A'], clue: 'Lower brainstem structure regulating autonomous cardiac and breathing cycles.', category: 'Anatomy' },
  { word: 'PONS', scrambled: ['S', 'N', 'O', 'P'], clue: 'Brainstem relay bridge linking cortex and cerebellum.', category: 'Anatomy' },
  { word: 'BRAIN', scrambled: ['R', 'A', 'B', 'N', 'I'], clue: 'The central biological organ of intellect and perception.', category: 'Anatomy' },
  { word: 'CRANIUM', scrambled: ['M', 'U', 'I', 'N', 'A', 'R', 'C'], clue: 'The bony vault enclosing and protecting the brain tissue.', category: 'Anatomy' },
  { word: 'OPTIC', scrambled: ['C', 'I', 'T', 'P', 'O'], clue: 'The cranial nerve transmitting visual impulses from retina to brain.', category: 'Sensory' },
  { word: 'VAGUS', scrambled: ['S', 'U', 'G', 'A', 'V'], clue: 'The 10th cranial nerve modulating heart rate and parasympathetic rest.', category: 'Physiology' },
  { word: 'RETINA', scrambled: ['T', 'I', 'A', 'N', 'E', 'R'], clue: 'Light-sensitive neurological tissue layer coating the inner eye.', category: 'Sensory' },
  { word: 'COCHLEA', scrambled: ['L', 'A', 'E', 'H', 'C', 'O', 'C'], clue: 'Spiral spiral-shaped inner ear cavity converting sound waves into nerve impulses.', category: 'Sensory' },
  { word: 'FOCUS', scrambled: ['C', 'O', 'F', 'S', 'U'], clue: 'The selective concentration of mental attention on a distinct stimulus.', category: 'Cognition' },
  { word: 'LOGIC', scrambled: ['G', 'C', 'I', 'O', 'L'], clue: 'Reasoning conducted according to strict principles of validity.', category: 'Cognition' },
  { word: 'RECALL', scrambled: ['L', 'A', 'C', 'L', 'E', 'R'], clue: 'The retrieval of previously encoded events or facts from memory.', category: 'Memory' },
  { word: 'REFLEX', scrambled: ['X', 'E', 'R', 'F', 'E', 'L'], clue: 'An involuntary, instantaneous muscular movement to a sensory prompt.', category: 'Physiology' },
  { word: 'RHYTHM', scrambled: ['M', 'H', 'Y', 'R', 'T', 'H'], clue: 'A recurring pattern of harmonious movement, sound, or biological cycles.', category: 'Circadian' },
  { word: 'OXYGEN', scrambled: ['G', 'E', 'N', 'X', 'O', 'Y'], clue: 'Vital molecule delivered by cerebral blood flow to synthesize ATP.', category: 'Metabolism' },
  { word: 'GLUCOSE', scrambled: ['E', 'S', 'O', 'U', 'C', 'L', 'G'], clue: 'The primary carbohydrate fuel utilized by active neurons.', category: 'Metabolism' },
  { word: 'ADAPT', scrambled: ['P', 'T', 'A', 'D', 'A'], clue: 'To adjust structure or behavior in response to changing environments.', category: 'Evolution' },
  { word: 'CLARITY', scrambled: ['T', 'Y', 'A', 'R', 'I', 'L', 'C'], clue: 'A state of lucid, unobstructed perception and clear thinking.', category: 'Mindfulness' },
  { word: 'STREAK', scrambled: ['K', 'E', 'R', 'T', 'S', 'A'], clue: 'An unbroken, continuous run of daily achievements or training sessions.', category: 'Habits' },
  { word: 'HABIT', scrambled: ['B', 'I', 'A', 'T', 'H'], clue: 'An automatic routine of behavior practiced repeatedly over time.', category: 'Behavior' },
  { word: 'CIRCUIT', scrambled: ['T', 'I', 'C', 'U', 'C', 'I', 'R'], clue: 'A dedicated network of interconnected neurons carrying biological signals.', category: 'Neuroscience' },
  { word: 'PATHWAY', scrambled: ['Y', 'A', 'W', 'T', 'A', 'P', 'H'], clue: 'A tract of nerve fibers connecting two distinct neurological regions.', category: 'Neuroscience' },
  { word: 'SIGNAL', scrambled: ['G', 'A', 'L', 'S', 'I', 'N'], clue: 'An electrical action potential propagated across a neural transmission line.', category: 'Biophysics' },
  { word: 'IMPULSE', scrambled: ['P', 'L', 'U', 'S', 'M', 'I', 'E'], clue: 'A surge of electrochemical current moving down a polarized axon.', category: 'Biophysics' },
  { word: 'VESICLE', scrambled: ['E', 'C', 'L', 'I', 'S', 'E', 'V'], clue: 'Tiny membrane-bound sac storing neurotransmitters at presynaptic terminals.', category: 'Cellular' },
  { word: 'CHANNEL', scrambled: ['L', 'E', 'N', 'N', 'A', 'H', 'C'], clue: 'Transmembrane protein pore permitting specific ion flow across membranes.', category: 'Biophysics' },
  { word: 'SODIUM', scrambled: ['D', 'U', 'I', 'M', 'O', 'S'], clue: 'Cation whose rapid cellular influx depolarizes the neuronal membrane.', category: 'Biochemistry' },
  { word: 'CALCIUM', scrambled: ['C', 'U', 'L', 'I', 'M', 'A', 'C'], clue: 'Divalent ion triggering neurotransmitter exocytosis at the axon terminal.', category: 'Biochemistry' },
  { word: 'ENERGY', scrambled: ['Y', 'E', 'R', 'G', 'E', 'N'], clue: 'The capacity for doing mental work, generated by mitochondrial respiration.', category: 'Physiology' },
  { word: 'SLEEP', scrambled: ['E', 'L', 'P', 'S', 'E'], clue: 'Essential restorative physiological state facilitating glymphatic waste clearance.', category: 'Wellness' },
  { word: 'DREAM', scrambled: ['R', 'E', 'A', 'M', 'D'], clue: 'Vivid sensory imagery occurring predominantly during REM sleep phases.', category: 'Cognition' },
  { word: 'LUCID', scrambled: ['C', 'I', 'D', 'U', 'L'], clue: 'Awareness of dreaming while in the dream state, or having total cognitive clarity.', category: 'Cognition' },
  { word: 'PUZZLE', scrambled: ['Z', 'Z', 'E', 'L', 'U', 'P'], clue: 'A cognitive problem testing ingenuity, pattern recognition, and knowledge.', category: 'Gaming' },
  { word: 'ENIGMA', scrambled: ['G', 'A', 'M', 'I', 'N', 'E'], clue: 'A puzzling or inexplicable occurrence or mysterious problem.', category: 'Logic' },
  { word: 'CIPHER', scrambled: ['R', 'E', 'P', 'H', 'I', 'C'], clue: 'A secret or disguised algorithm for writing and encrypting messages.', category: 'Cryptography' },
  { word: 'MATRIX', scrambled: ['T', 'R', 'I', 'X', 'A', 'M'], clue: 'A rectangular array of numbers, symbols, or expressions arranged in rows and columns.', category: 'Mathematics' },
  { word: 'VECTOR', scrambled: ['T', 'O', 'R', 'V', 'E', 'C'], clue: 'A mathematical quantity possessing both magnitude and spatial direction.', category: 'Mathematics' },
  { word: 'TENSOR', scrambled: ['R', 'O', 'S', 'E', 'N', 'T'], clue: 'A generalized geometric entity describing linear physical relations.', category: 'Physics' },
  { word: 'SCHEMA', scrambled: ['M', 'A', 'E', 'H', 'C', 'S'], clue: 'A cognitive framework helping organize and interpret incoming information.', category: 'Psychology' },
  { word: 'PRIMING', scrambled: ['M', 'I', 'N', 'G', 'I', 'R', 'P'], clue: 'Exposure to one stimulus subtly influencing the response to a subsequent one.', category: 'Psychology' },
  { word: 'STROOP', scrambled: ['P', 'O', 'O', 'T', 'R', 'S'], clue: 'Cognitive effect demonstrating delayed reaction time to incongruent color words.', category: 'Psychology' },
  { word: 'FLOW', scrambled: ['O', 'L', 'F', 'W'], clue: 'Optimal psychological state of deep absorption and effortless performance.', category: 'Psychology' },
  { word: 'GRIT', scrambled: ['R', 'T', 'I', 'G'], clue: 'Perseverance and passion for long-term goals despite setbacks.', category: 'Psychology' },
  { word: 'ZEAL', scrambled: ['L', 'A', 'E', 'Z'], clue: 'Enthusiastic devotion and high spirited energy toward a mental endeavor.', category: 'Mindset' },
  { word: 'GENIUS', scrambled: ['S', 'I', 'U', 'N', 'E', 'G'], clue: 'Exceptional intellectual or creative capacity and originality.', category: 'Intellect' },
  { word: 'TALENT', scrambled: ['T', 'N', 'E', 'L', 'A', 'T'], clue: 'Natural aptitude or skill refined through deliberate repetition.', category: 'Skill' },
  { word: 'MENTOR', scrambled: ['T', 'E', 'N', 'O', 'R', 'M'], clue: 'An experienced and trusted adviser guiding cognitive development.', category: 'Growth' },
  { word: 'WISDOM', scrambled: ['S', 'I', 'D', 'W', 'O', 'M'], clue: 'The quality of having knowledge, deep understanding, and sound judgment.', category: 'Philosophy' },
  { word: 'REASON', scrambled: ['S', 'O', 'N', 'E', 'R', 'A'], clue: 'The power of the mind to think, understand, and form judgments logically.', category: 'Philosophy' },
  { word: 'ETHICS', scrambled: ['T', 'H', 'I', 'E', 'C', 'S'], clue: 'Moral principles governing an individual or group behavior.', category: 'Philosophy' },
  { word: 'AWARE', scrambled: ['W', 'R', 'A', 'E', 'A'], clue: 'Having knowledge or conscious perception of a situation or fact.', category: 'Mindfulness' },
  { word: 'SERENE', scrambled: ['N', 'E', 'E', 'E', 'R', 'S'], clue: 'Calm, peaceful, and untroubled psychological equilibrium.', category: 'Wellness' },
  { word: 'TRANQUIL', scrambled: ['Q', 'U', 'I', 'L', 'T', 'R', 'A', 'N'], clue: 'Free from disturbance and characterized by quiet emotional stillness.', category: 'Wellness' },
  { word: 'BREATH', scrambled: ['E', 'A', 'T', 'H', 'R', 'B'], clue: 'The rhythmic air inhaled and exhaled during pulmonary respiration.', category: 'Physiology' },
  { word: 'CHROME', scrambled: ['M', 'E', 'R', 'O', 'H', 'C'], clue: 'Relating to optical color, vivid saturation, or pigment hues.', category: 'Visual' },
  { word: 'PRISM', scrambled: ['R', 'M', 'S', 'I', 'P'], clue: 'Transparent optical element with flat polished surfaces that refract light.', category: 'Optics' },
  { word: 'LUMEN', scrambled: ['N', 'E', 'M', 'U', 'L'], clue: 'The SI unit of luminous flux, measuring visible light power.', category: 'Optics' },
  { word: 'PHOTON', scrambled: ['N', 'O', 'T', 'O', 'P', 'H'], clue: 'The fundamental quantum packet of electromagnetic radiation.', category: 'Physics' },
  { word: 'CANDELA', scrambled: ['N', 'A', 'L', 'E', 'D', 'A', 'C'], clue: 'SI base unit measuring luminous intensity of a light source.', category: 'Physics' },
  { word: 'QUANTA', scrambled: ['T', 'A', 'N', 'A', 'Q', 'U'], clue: 'The minimum discrete amount of any physical entity involved in an interaction.', category: 'Physics' },
  { word: 'ATLAS', scrambled: ['T', 'A', 'L', 'S', 'A'], clue: 'A bound collection of maps, or the topmost cervical vertebra supporting skull.', category: 'Anatomy' },
  { word: 'AXIS', scrambled: ['X', 'A', 'S', 'I'], clue: 'The imaginary line around which a body rotates, or the 2nd cervical vertebra.', category: 'Anatomy' },
  { word: 'OCCIPITAL', scrambled: ['T', 'I', 'L', 'A', 'P', 'I', 'C', 'O', 'C'], clue: 'Posterior cerebral lobe dedicated to processing visual input.', category: 'Anatomy' },
  { word: 'PARIETAL', scrambled: ['T', 'A', 'L', 'I', 'E', 'R', 'A', 'P'], clue: 'Lobe integrating sensory information including touch, taste, and spatial sense.', category: 'Anatomy' },
  { word: 'FRONTAL', scrambled: ['R', 'O', 'N', 'L', 'T', 'A', 'F'], clue: 'Lobe mediating executive function, working memory, and impulse suppression.', category: 'Anatomy' },
  { word: 'TEMPORAL', scrambled: ['M', 'P', 'O', 'R', 'T', 'E', 'A', 'L'], clue: 'Lobe processing auditory sensation and housing hippocampus memory structures.', category: 'Anatomy' },
  { word: 'LIMBIC', scrambled: ['M', 'I', 'B', 'L', 'I', 'C'], clue: 'A complex system of nerves in the brain controlling emotions and fundamental drives.', category: 'Anatomy' },
  { word: 'STIMULUS', scrambled: ['M', 'U', 'L', 'U', 'T', 'I', 'S', 'S'], clue: 'Any detectable change in the physical or internal environment evoking reaction.', category: 'Physiology' },
  { word: 'RECEPTOR', scrambled: ['P', 'T', 'O', 'R', 'C', 'E', 'R', 'E'], clue: 'Cellular protein binding specific signaling molecules to induce cellular responses.', category: 'Cellular' },
  { word: 'LIGAND', scrambled: ['G', 'N', 'A', 'D', 'I', 'L'], clue: 'A molecule that binds specifically to another molecule, usually a receptor.', category: 'Biochemistry' },
  { word: 'PEPTIDE', scrambled: ['T', 'I', 'P', 'D', 'E', 'E', 'P'], clue: 'Short chain of amino acids linked together by peptide bonds.', category: 'Biochemistry' },
  { word: 'PROTEIN', scrambled: ['R', 'O', 'T', 'E', 'I', 'P', 'N'], clue: 'Macromolecule essential for biological structural integrity and enzymatic catalysis.', category: 'Biochemistry' },
  { word: 'ENZYME', scrambled: ['Z', 'E', 'M', 'Y', 'E', 'N'], clue: 'Biological catalyst accelerating specific metabolic biochemical reactions.', category: 'Biochemistry' },
  { word: 'METABOLIC', scrambled: ['L', 'I', 'C', 'B', 'O', 'M', 'A', 'T', 'E'], clue: 'Relating to chemical processes occurring within a living organism to sustain life.', category: 'Physiology' },
  { word: 'CATALYST', scrambled: ['T', 'A', 'L', 'A', 'S', 'C', 'Y', 'T'], clue: 'Substance speeding up a chemical reaction without undergoing permanent change.', category: 'Chemistry' },
  { word: 'EQUILIBRIUM', scrambled: ['L', 'I', 'M', 'B', 'U', 'I', 'R', 'I', 'Q', 'E', 'U'], clue: 'A state in which opposing forces or biochemical reactions are balanced.', category: 'Science' },
  { word: 'OSMOSIS', scrambled: ['M', 'O', 'S', 'I', 'S', 'O', 'S'], clue: 'Diffusion of fluid through a semipermeable membrane from low to high concentration.', category: 'Cellular' },
  { word: 'DIALYSIS', scrambled: ['Y', 'S', 'I', 'S', 'D', 'A', 'L', 'I'], clue: 'Separation of particles in a liquid based on differences in their ability to pass through membrane.', category: 'Cellular' },
  { word: 'GENOME', scrambled: ['O', 'N', 'E', 'G', 'E', 'M'], clue: 'The complete set of genes or genetic material present in an organism.', category: 'Genetics' },
  { word: 'CHROMOSOME', scrambled: ['M', 'E', 'R', 'O', 'S', 'O', 'C', 'H', 'M', 'O'], clue: 'Thread-like structure of nucleic acids carrying genetic hereditary information.', category: 'Genetics' },
  { word: 'MUTATION', scrambled: ['T', 'A', 'T', 'I', 'O', 'N', 'U', 'M'], clue: 'The changing of the structure of a gene, resulting in a variant form.', category: 'Genetics' }
];

// 100 Rich Vocabulary Questions
export const VOCAB_QUESTIONS_POOL: VocabQuestion[] = [
  {
    word: 'MNEMONIC',
    definition: 'A technique, system, or device used to enhance memory retention and recall.',
    options: ['Memory aid technique', 'Sleep rhythm disorder', 'Involuntary spinal reflex', 'Auditory brain wave'],
    correctIndex: 0,
    clue: 'Derived from Mnemosyne, the ancient Greek titaness of memory.'
  },
  {
    word: 'HEURISTIC',
    definition: 'A practical problem-solving shortcut that reduces cognitive load.',
    options: ['Strict mathematical theorem', 'Rule-of-thumb mental shortcut', 'Microscopic genetic mutation', 'Automated machine code'],
    correctIndex: 1,
    clue: 'Enables quick decision making without exhaustive computation.'
  },
  {
    word: 'NEUROGENESIS',
    definition: 'The biological process by which new neurons are generated in the brain.',
    options: ['Cellular apoptosis', 'Formation of new neurons', 'Hardening of arterial walls', 'Degradation of myelin sheath'],
    correctIndex: 1,
    clue: 'Occurs actively in the subgranular zone of the dentate gyrus.'
  },
  {
    word: 'COGNITION',
    definition: 'The mental action or process of acquiring knowledge and understanding through thought and sensation.',
    options: ['Muscular reflex', 'Thought & understanding process', 'Cardiac rhythm', 'Hormonal imbalance'],
    correctIndex: 1,
    clue: 'Encompasses perception, memory, reasoning, and judgment.'
  },
  {
    word: 'PROPRIOCEPTION',
    definition: 'The unconscious sensory perception of movement and spatial orientation of one’s own body.',
    options: ['Sense of body position', 'Visual color acuity', 'Ability to smell odors', 'Perception of temperature'],
    correctIndex: 0,
    clue: 'Receptors located in muscle spindles, tendons, and joint capsules.'
  },
  {
    word: 'HOMEOSTASIS',
    definition: 'The tendency toward a relatively stable psychological and physiological equilibrium.',
    options: ['Rapid cellular decay', 'Internal biological equilibrium', 'Sudden burst of adrenaline', 'Inability to fall asleep'],
    correctIndex: 1,
    clue: 'Maintained by feedback loops mediated through the hypothalamus.'
  },
  {
    word: 'NEUROPLASTICITY',
    definition: 'The ability of the nervous system to adapt its structure and function to learning or experience.',
    options: ['Brain adaptive rewiring', 'Rigid neuronal death', 'Cranial bone fusion', 'Loss of peripheral vision'],
    correctIndex: 0,
    clue: 'Neurons that fire together, wire together (Hebbian theory).'
  },
  {
    word: 'INTEROCEPTION',
    definition: 'The sensory perception of sensations arising from within internal visceral organs.',
    options: ['Perception of internal bodily states', 'Remote spatial echolocation', 'Microscopic magnification', 'Detection of seismic vibrations'],
    correctIndex: 0,
    clue: 'Governed heavily by the posterior and anterior insular cortices.'
  },
  {
    word: 'AMNESIA',
    definition: 'A partial or total loss of memory caused by brain injury, shock, or disease.',
    options: ['Memory deficit condition', 'Enhanced dream recall', 'Elevated auditory sensitivity', 'Involuntary muscle twitch'],
    correctIndex: 0,
    clue: 'Can be retrograde (past memories) or anterograde (new encoding).'
  },
  {
    word: 'ALLOSTASIS',
    definition: 'The process by which the body achieves stability through physiological or behavioral change.',
    options: ['Stability through adaptive change', 'Total biological shutdown', 'Immediate muscular paralysis', 'Irreversible cellular atrophy'],
    correctIndex: 0,
    clue: 'Addresses the wear-and-tear concept known as allostatic load.'
  },
  {
    word: 'SYNESTHESIA',
    definition: 'A perceptual phenomenon where stimulation of one sensory pathway leads to involuntary experiences in another.',
    options: ['Cross-sensory perceptual blending', 'Loss of depth perception', 'Inability to taste sweet flavors', 'Severe photophobia'],
    correctIndex: 0,
    clue: 'For example, hearing sounds produces vivid colors or shapes.'
  },
  {
    word: 'APHASIA',
    definition: 'Loss of ability to understand or express speech, typically caused by damage to cortical language centers.',
    options: ['Acquired speech impairment', 'Difficulty recognizing faces', 'Total hearing loss', 'Inability to coordinate balance'],
    correctIndex: 0,
    clue: 'Commonly localized to Broca’s or Wernicke’s areas.'
  },
  {
    word: 'AGNOSIA',
    definition: 'Inability to interpret sensations and recognize things that should be familiar, despite intact sensory organs.',
    options: ['Recognition deficit', 'Muscular rigidity', 'Sleep apnea', 'Olfactory hypersensitivity'],
    correctIndex: 0,
    clue: 'Visual agnosia patients see objects clearly but cannot name or identify them.'
  },
  {
    word: 'APRAXIA',
    definition: 'Difficulty with skilled, purposeful motor movements despite physical capacity and desire to perform them.',
    options: ['Motor planning disorder', 'Involuntary trembling', 'Sensory numbness', 'Chronic lethargy'],
    correctIndex: 0,
    clue: 'Arises from parietal lobe dysfunction disrupting learned motor schemas.'
  },
  {
    word: 'CIRCADIAN',
    definition: 'Recurring naturally on a twenty-four-hour cycle, even in the absence of external cues.',
    options: ['24-hour biological cycle', 'Monthly hormonal rhythm', 'Seasonal migratory pattern', 'Multi-year lifecycle'],
    correctIndex: 0,
    clue: 'Synchronized by the suprachiasmatic nucleus via retinal light reception.'
  },
  {
    word: 'ACETYLCHOLINE',
    definition: 'Neurotransmitter essential for voluntary muscle contraction, attention, and memory consolidation.',
    options: ['Neurotransmitter for memory & muscle', 'Primary stress hormone', 'Fat-soluble vitamin', 'Pancreatic enzyme'],
    correctIndex: 0,
    clue: 'Deficiencies in cholinergic pathways correlate with Alzheimer’s pathology.'
  },
  {
    word: 'ANHEDONIA',
    definition: 'The inability to feel pleasure in normally pleasurable activities.',
    options: ['Inability to experience pleasure', 'Hypersensitivity to touch', 'Excessive euphoria', 'Sleep deprivation'],
    correctIndex: 0,
    clue: 'Associated with disrupted mesolimbic dopamine signaling.'
  },
  {
    word: 'METASTABILITY',
    definition: 'A state in brain dynamics where neural assemblies transition dynamically between integrated and segregated states.',
    options: ['Dynamic transient brain coordination', 'Permanent coma state', 'Severe epileptic seizure', 'Rigid reflex loop'],
    correctIndex: 0,
    clue: 'Balances cognitive flexibility with sustained informational stability.'
  },
  {
    word: 'EIDETIC',
    definition: 'Relating to or marked by extraordinarily detailed, vivid, and accurate visual recall (photographic memory).',
    options: ['Photographic visual recall', 'Auditory hallucination', 'Dream recollection', 'Spatial disorientation'],
    correctIndex: 0,
    clue: 'Often observed in a small fraction of children, declining with age.'
  },
  {
    word: 'ALEXITHYMIA',
    definition: 'A personality trait characterized by an inability to identify, describe, and express emotions.',
    options: ['Difficulty identifying emotions', 'Total absence of empathy', 'Chronic panic attacks', 'Extreme mood swings'],
    correctIndex: 0,
    clue: 'Greek roots meaning "no words for feelings".'
  },
  {
    word: 'EPIGENETICS',
    definition: 'The study of changes in gene expression caused by modification of DNA expression rather than alteration of the genetic code itself.',
    options: ['Regulation of gene expression', 'Direct gene editing', 'Bacterial cloning', 'Viral replication'],
    correctIndex: 0,
    clue: 'Influenced by diet, stress, exercise, and environmental factors.'
  },
  {
    word: 'METILATION',
    definition: 'An epigenetic mechanism where methyl groups are added to DNA molecules, repressing gene transcription.',
    options: ['Epigenetic DNA modification', 'Protein denaturation', 'Cellular oxidation', 'Lipid breakdown'],
    correctIndex: 0,
    clue: 'Critical for developmental cell differentiation and genomic imprinting.'
  },
  {
    word: 'HABITUATION',
    definition: 'The diminishing of a physiological or emotional response to a frequently repeated stimulus.',
    options: ['Diminished response to repeated stimuli', 'Sensory overload', 'Immediate shock reaction', 'Permanent conditioning'],
    correctIndex: 0,
    clue: 'A fundamental, non-associative form of biological learning.'
  },
  {
    word: 'POTENTIATION',
    definition: 'Long-term potentiation (LTP) is a persistent strengthening of synapses based on recent patterns of activity.',
    options: ['Synaptic strengthening mechanism', 'Rapid axon degradation', 'Immediate muscle fatigue', 'Vascular constriction'],
    correctIndex: 0,
    clue: 'Universally regarded as the major cellular foundation for learning and memory.'
  },
  {
    word: 'ENDOCANNABINOID',
    definition: 'Endogenous lipid retrograde neurotransmitters that regulate memory, pain-sensation, mood, and sleep.',
    options: ['Retrograde neural lipid system', 'External pharmaceutical toxin', 'Blood platelet factor', 'Digestive hormone'],
    correctIndex: 0,
    clue: 'Includes anandamide and 2-arachidonoylglycerol (2-AG).'
  },
  {
    word: 'DYSLEXIA',
    definition: 'A neurodevelopmental learning condition characterized by difficulty in fluent word recognition and phonological decoding.',
    options: ['Reading & phonological challenge', 'Inability to recognize faces', 'Severe hearing loss', 'Motor tic syndrome'],
    correctIndex: 0,
    clue: 'Does not reflect low intelligence, but distinct brain wiring for phonemes.'
  },
  {
    word: 'DYSCALCULIA',
    definition: 'A specific learning disability affecting the normal acquisition of arithmetic and quantitative skills.',
    options: ['Math & arithmetic processing challenge', 'Difficulty spelling words', 'Color blindness', 'Balance disorder'],
    correctIndex: 0,
    clue: 'Often associated with atypical activation in the intraparietal sulcus.'
  },
  {
    word: 'TELOMERE',
    definition: 'A compound structure at the end of a chromosome that protects DNA integrity during replication.',
    options: ['Protective chromosome cap', 'Cellular power station', 'Nuclear pore channel', 'Ribosomal protein'],
    correctIndex: 0,
    clue: 'Shortening of telomeres is linked with cellular aging and stress.'
  },
  {
    word: 'TELOMERASE',
    definition: 'An enzyme that adds nucleotides to telomeres, preserving chromosome length in specific dividing cells.',
    options: ['Telomere-extending enzyme', 'DNA destructive acid', 'Stomach digestive enzyme', 'Blood clotting factor'],
    correctIndex: 0,
    clue: 'Discovered by Elizabeth Blackburn and Carol Greider, winning the Nobel Prize.'
  },
  {
    word: 'APOPTOSIS',
    definition: 'The programmed, orderly death of cells occurring as a normal and controlled part of an organism’s growth.',
    options: ['Programmed cellular death', 'Uncontrolled necrosis', 'Cell division process', 'Bacterial invasion'],
    correctIndex: 0,
    clue: 'Essential for sculpting neural circuits during embryonic development.'
  },
  {
    word: 'GLYMPHATIC',
    definition: 'A macroscopic waste clearance system in the vertebrate CNS utilizing perivascular channels, active mostly in sleep.',
    options: ['Cerebral waste clearance system', 'Lymphatic vessel in the liver', 'Immune cell in the skin', 'Digestive tract membrane'],
    correctIndex: 0,
    clue: 'Facilitates the clearance of amyloid-beta and tau proteins during slow-wave sleep.'
  },
  {
    word: 'MICROGLIA',
    definition: 'Specialized glial cells functioning as the resident macrophages and immune defense of the central nervous system.',
    options: ['Resident brain immune cells', 'Insulating myelin layers', 'Excitatory nerve fibers', 'Sensory hair cells'],
    correctIndex: 0,
    clue: 'Prunes surplus synapses during synaptic refinement and clears cellular debris.'
  },
  {
    word: 'ASTROCYTE',
    definition: 'Star-shaped glial cell providing biochemical support to endothelial cells of the blood–brain barrier.',
    options: ['Star-shaped supportive glial cell', 'Primary motor neuron', 'Retinal cone cell', 'Spinal interneuron'],
    correctIndex: 0,
    clue: 'Regulates extracellular potassium, recycles glutamate, and nourishes neurons.'
  },
  {
    word: 'OLIGODENDROCYTE',
    definition: 'Glial cell whose main functions are to support and insulate axons in the central nervous system with myelin.',
    options: ['CNS myelinating glial cell', 'Peripheral pain receptor', 'Bone marrow precursor', 'Cardiac muscle cell'],
    correctIndex: 0,
    clue: 'A single oligodendrocyte can extend processes to insulate up to 50 axonal segments.'
  },
  {
    word: 'SCHWANN',
    definition: 'Schwann cells are the principal glia of the peripheral nervous system, producing the myelin sheath for peripheral nerves.',
    options: ['PNS myelinating cell', 'Central brainstem neuron', 'Retinal rod cell', 'Thyroid secretory cell'],
    correctIndex: 0,
    clue: 'Unlike oligodendrocytes, each myelinating Schwann cell covers only one axon segment.'
  },
  {
    word: 'REFRACTORY',
    definition: 'The period immediately following stimulation during which a nerve fiber is unresponsive to further stimulation.',
    options: ['Unresponsive recovery interval', 'Peak excitation point', 'Spontaneous firing rate', 'Resting potential baseline'],
    correctIndex: 0,
    clue: 'Divided into absolute and relative refractory phases governed by sodium channel inactivation.'
  },
  {
    word: 'DEPOLARIZATION',
    definition: 'A change within a cell where electrical charge shifts toward less negative, triggering an action potential if threshold is met.',
    options: ['Shift toward positive membrane voltage', 'Increase in negative interior charge', 'Total cessation of ion movement', 'Breakdown of cell wall'],
    correctIndex: 0,
    clue: 'Driven by the rapid opening of voltage-gated sodium channels.'
  },
  {
    word: 'HYPERPOLARIZATION',
    definition: 'A change in a cell’s membrane potential that makes it more negative, inhibiting action potential generation.',
    options: ['Shift toward more negative membrane voltage', 'Sudden spike of electrical voltage', 'Immediate vesicle release', 'Cellular swell with water'],
    correctIndex: 0,
    clue: 'Often caused by potassium efflux or chloride influx following inhibitory neurotransmission.'
  },
  {
    word: 'CINGULATE',
    definition: 'The cingulate cortex is an integral part of the limbic system involved in emotion processing, learning, and conflict monitoring.',
    options: ['Conflict & emotion monitoring cortex', 'Visual primary center', 'Auditory cochlear tract', 'Cerebellar equilibrium lobe'],
    correctIndex: 0,
    clue: 'The anterior cingulate cortex (ACC) lights up during the Stroop color confusion task.'
  },
  {
    word: 'SALIENT',
    definition: 'Most noticeable, prominent, or important in capturing attentional focus.',
    options: ['Noticeable & attention-capturing', 'Completely invisible', 'Repetitive and boring', 'Biochemically inert'],
    correctIndex: 0,
    clue: 'The brain has a dedicated "Salience Network" anchored by the insula and anterior cingulate.'
  },
  {
    word: 'CORTISOL',
    definition: 'A glucocorticoid hormone released by adrenal glands in response to stress and low blood-glucose concentration.',
    options: ['Primary glucocorticoid stress hormone', 'Sleep-inducing indolamine', 'Digestive gastric juice', 'Bone mineral density protein'],
    correctIndex: 0,
    clue: 'Follows a natural diurnal curve with a morning surge (Cortisol Awakening Response).'
  },
  {
    word: 'ENDORPHIN',
    definition: 'Endogenous opioid peptides produced in the central nervous system that inhibit pain signaling and induce euphoria.',
    options: ['Endogenous natural pain reliever', 'Excitatory seizure toxin', 'Inflammatory histamine compound', 'Blood sugar elevating factor'],
    correctIndex: 0,
    clue: 'Binds to mu-opioid receptors, producing the well-known "runner’s high".'
  },
  {
    word: 'OXYTOCIN',
    definition: 'A peptide hormone and neuropeptide playing a crucial role in social bonding, trust, empathy, and maternal care.',
    options: ['Neuropeptide of social trust & bonding', 'Muscle breakdown enzyme', 'Visual photopigment', 'Inner ear balance fluid'],
    correctIndex: 0,
    clue: 'Produced in the paraventricular nucleus of the hypothalamus and secreted by the posterior pituitary.'
  },
  {
    word: 'EPINEPHRINE',
    definition: 'A hormone and neurotransmitter (adrenaline) involved in regulating visceral functions and fight-or-flight mobilization.',
    options: ['Adrenaline fight-or-flight hormone', 'Deep sleep neurotransmitter', 'Stomach digestive acid', 'Liver detoxifying chemical'],
    correctIndex: 0,
    clue: 'Increases heart rate, dilates bronchial passages, and mobilizes blood glucose.'
  },
  {
    word: 'NOREPINEPHRINE',
    definition: 'Neurotransmitter mobilized from the locus coeruleus that increases alertness, vigilance, and reaction readiness.',
    options: ['Arousal & vigilance neurotransmitter', 'Inhibitory calming peptide', 'Bone-building osteoblast', 'Red blood cell pigment'],
    correctIndex: 0,
    clue: 'Synthesized directly from dopamine by dopamine beta-hydroxylase.'
  },
  {
    word: 'GLUTAMATE',
    definition: 'The most abundant excitatory neurotransmitter in the vertebrate nervous system.',
    options: ['Primary excitatory neurotransmitter', 'Primary inhibitory chemical', 'Fat digestion enzyme', 'Skin pigment melanin'],
    correctIndex: 0,
    clue: 'Acts on NMDA, AMPA, and kainate receptors.'
  },
  {
    word: 'ADENOSINE',
    definition: 'Purine nucleoside that acts as a central nervous system depressant, promoting sleep pressure throughout the waking day.',
    options: ['Sleep-pressure neuromodulator', 'High-energy alertness booster', 'Adrenaline receptor agonist', 'Digestive acid stimulant'],
    correctIndex: 0,
    clue: 'Caffeine promotes wakefulness specifically by competitively antagonizing adenosine receptors.'
  },
  {
    word: 'PROSOPAGNOSIA',
    definition: 'A neurological disorder characterized by the inability to recognize familiar human faces.',
    options: ['Face blindness condition', 'Loss of color vision', 'Inability to read sheet music', 'Stuttering speech impediment'],
    correctIndex: 0,
    clue: 'Linked to lesion or developmental atypicality in the fusiform face area (FFA).'
  },
  {
    word: 'PERSEVERATION',
    definition: 'The uncontrollable continuation or repetition of a particular response (word, gesture, strategy) despite cessation of the stimulus.',
    options: ['Inflexible cognitive repetition', 'Extreme creative spontaneity', 'Rapid switching between tasks', 'Sudden amnesia'],
    correctIndex: 0,
    clue: 'Classic sign of prefrontal cortex dysfunction observed on the Wisconsin Card Sorting Test.'
  },
  {
    word: 'SUBLIMINAL',
    definition: 'Existing or functioning below the absolute threshold of conscious perceptual awareness.',
    options: ['Below conscious awareness threshold', 'Extremely bright and intense', 'Painfully loud and deafening', 'Logically indisputable'],
    correctIndex: 0,
    clue: 'Can still trigger measurable cortical activity even if the subject reports seeing nothing.'
  }
];

export function getRandomAnagrams(count = 10): AnagramPuzzle[] {
  const shuffled = [...ANAGRAM_PUZZLES_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getRandomVocabQuestions(count = 10): VocabQuestion[] {
  const shuffled = [...VOCAB_QUESTIONS_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
