import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { X, Clock, Flame } from 'lucide-react-native';
import { cognitiveEngine } from '../services/CognitiveEngine';
import { audioHaptics } from '../services/AudioHapticService';
import { GameOverModal } from '../components/GameOverModal';

interface ColorItem {
  name: string;
  colorHex: string;
}

const PALETTE: ColorItem[] = [
  { name: 'RED', colorHex: '#EF4444' },
  { name: 'BLUE', colorHex: '#3B82F6' },
  { name: 'GREEN', colorHex: '#10B981' },
  { name: 'YELLOW', colorHex: '#FBBF24' },
  { name: 'PURPLE', colorHex: '#A855F7' },
  { name: 'ORANGE', colorHex: '#F97316' },
];

interface ColorConfusionGameProps {
  onClose: () => void;
}

export const ColorConfusionGame: React.FC<ColorConfusionGameProps> = ({ onClose }) => {
  const [targetWord, setTargetWord] = useState('BLUE');
  const [targetInkColor, setTargetInkColor] = useState('#EF4444');
  const [correctColorName, setCorrectColorName] = useState('RED');
  const [options, setOptions] = useState<ColorItem[]>([]);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const [totalDecisions, setTotalDecisions] = useState(0);
  const [correctDecisions, setCorrectDecisions] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generatePrompt = () => {
    const textItem = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    let inkItem = PALETTE[Math.floor(Math.random() * PALETTE.length)];

    // 75% chance of mismatch to trigger Stroop interference
    while (inkItem.name === textItem.name && Math.random() > 0.25) {
      inkItem = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    }

    setTargetWord(textItem.name);
    setTargetInkColor(inkItem.colorHex);
    setCorrectColorName(inkItem.name);

    // Pick 4 options including correct ink
    const others = PALETTE.filter((p) => p.name !== inkItem.name).sort(
      () => 0.5 - Math.random()
    );
    const roundOptions = [inkItem, ...others.slice(0, 3)].sort(
      () => 0.5 - Math.random()
    );
    setOptions(roundOptions);
  };

  const startSession = () => {
    setScore(0);
    setStreak(0);
    setTotalDecisions(0);
    setCorrectDecisions(0);
    setTimeRemaining(30);
    setIsGameOver(false);
    generatePrompt();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startSession();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timeRemaining === 0 && !isGameOver) {
      setIsGameOver(true);
      const accuracy =
        totalDecisions > 0
          ? Math.round((correctDecisions / totalDecisions) * 100)
          : 0;
      cognitiveEngine.recordResult('color_confusion', score, accuracy);
    }
  }, [timeRemaining]);

  const handleChoice = (chosen: ColorItem) => {
    if (timeRemaining === 0) return;
    setTotalDecisions((prev) => prev + 1);

    if (chosen.name === correctColorName) {
      audioHaptics.playSuccess();
      setCorrectDecisions((prev) => prev + 1);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setScore((prev) => prev + 100 + nextStreak * 20);
    } else {
      audioHaptics.playError();
      setStreak(0);
      setScore((prev) => Math.max(0, prev - 50));
    }

    generatePrompt();
  };

  const accuracyPercent =
    totalDecisions > 0
      ? Math.round((correctDecisions / totalDecisions) * 100)
      : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (timerRef.current) clearInterval(timerRef.current);
            onClose();
          }}
          style={styles.closeButton}
        >
          <X size={24} color="#94A3B8" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.gameTitle}>Color Confusion</Text>
          <Text style={styles.gameSubtitle}>Match the INK COLOR</Text>
        </View>

        <View style={styles.timerPill}>
          <Clock size={14} color="#FBBF24" />
          <Text style={styles.timerText}>{timeRemaining}s</Text>
        </View>
      </View>

      {/* Score & Combo Banner */}
      <View style={styles.metricBanner}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>SCORE</Text>
          <Text style={styles.metricValue}>{score}</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricBox}>
          <View style={styles.comboHeader}>
            <Flame size={12} color="#F97316" />
            <Text style={[styles.metricLabel, { color: '#F97316' }]}>COMBO</Text>
          </View>
          <Text style={[styles.metricValue, { color: '#F97316' }]}>
            {streak}x
          </Text>
        </View>
      </View>

      {/* Target Word Card (Stroop Stimulus) */}
      <View style={styles.stimulusContainer}>
        <View style={styles.stimulusCard}>
          <Text
            style={[
              styles.targetWordText,
              {
                color: targetInkColor,
                textShadowColor: `${targetInkColor}80`,
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 20,
              },
            ]}
          >
            {targetWord}
          </Text>
        </View>
      </View>

      {/* 2x2 Option Buttons */}
      <View style={styles.grid}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.name}
            style={styles.optionButton}
            activeOpacity={0.7}
            onPress={() => handleChoice(opt)}
          >
            <Text style={styles.optionText}>{opt.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Game Over Sheet */}
      <GameOverModal
        visible={isGameOver}
        gameTitle="Color Confusion"
        score={score}
        accuracy={accuracyPercent}
        brainPowerGained={Math.max(15, Math.round(score / 25))}
        onPlayAgain={startSession}
        onExit={onClose}
      />
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070A14',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  gameSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#06B6D4',
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  timerText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FBBF24',
    fontVariant: ['tabular-nums'],
  },
  metricBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    marginHorizontal: 24,
    marginTop: 8,
    borderRadius: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  metricBox: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 1,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#334155',
  },
  comboHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stimulusContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  stimulusCard: {
    backgroundColor: '#0F172A',
    borderRadius: 28,
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  targetWordText: {
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  optionButton: {
    width: (width - 48 - 12) / 2,
    height: 72,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});
