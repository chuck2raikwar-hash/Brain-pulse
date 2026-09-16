import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { X, Check, Eye } from 'lucide-react-native';
import { cognitiveEngine } from '../services/CognitiveEngine';
import { audioHaptics } from '../services/AudioHapticService';
import { GameOverModal } from '../components/GameOverModal';

const SHAPES = ['▲', '■', '●', '★'];

export const NBackGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [hasMatchedThisTurn, setHasMatchedThisTurn] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Generate 15 items with deliberate 2-back matches
    const seq: string[] = [];
    for (let i = 0; i < 15; i++) {
      if (i >= 2 && Math.random() < 0.4) {
        seq.push(seq[i - 2]); // Force 2-back match
      } else {
        seq.push(SHAPES[Math.floor(Math.random() * SHAPES.length)]);
      }
    }
    setSequence(seq);
    setCurrentIndex(0);
    setScore(0);
    setIsGameOver(false);

    let idx = 0;
    timerRef.current = setInterval(() => {
      idx++;
      if (idx >= 15) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsGameOver(true);
        cognitiveEngine.recordResult('n_back', score, 92);
      } else {
        setCurrentIndex(idx);
        setHasMatchedThisTurn(false);
      }
    }, 2000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleMatchPress = () => {
    if (currentIndex < 2 || hasMatchedThisTurn) return;
    setHasMatchedThisTurn(true);

    const isMatch = sequence[currentIndex] === sequence[currentIndex - 2];
    if (isMatch) {
      audioHaptics.playSuccess();
      setScore((s) => s + 200);
    } else {
      audioHaptics.playError();
      setScore((s) => Math.max(0, s - 50));
    }
  };

  const currentShape = sequence[currentIndex] || '●';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <X size={24} color="#94A3B8" />
        </TouchableOpacity>
        <Text style={styles.title}>2-Back Recall</Text>
        <Text style={styles.counter}>{currentIndex + 1} / 15</Text>
      </View>

      <View style={styles.scoreRow}>
        <Text style={styles.scoreText}>SCORE: {score}</Text>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.shapeCard}>
          <Text style={styles.shapeText}>{currentShape}</Text>
        </View>
        <Text style={styles.instruction}>
          Does this match the shape from 2 steps ago?
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.matchButton, currentIndex < 2 && styles.buttonDisabled]}
          disabled={currentIndex < 2 || hasMatchedThisTurn}
          activeOpacity={0.8}
          onPress={handleMatchPress}
        >
          <Check size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>
            {currentIndex < 2 ? 'Memorize sequence...' : '2-Back Match!'}
          </Text>
        </TouchableOpacity>
      </View>

      <GameOverModal
        visible={isGameOver}
        gameTitle="2-Back Recall"
        score={score}
        accuracy={90}
        brainPowerGained={Math.max(15, Math.round(score / 25))}
        onPlayAgain={() => {
          setIsGameOver(false);
          setCurrentIndex(0);
        }}
        onExit={onClose}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  counter: {
    fontSize: 14,
    fontWeight: '800',
    color: '#38BDF8',
  },
  scoreRow: {
    alignItems: 'center',
    marginTop: 8,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#94A3B8',
    letterSpacing: 1,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shapeCard: {
    width: 180,
    height: 180,
    borderRadius: 36,
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#38BDF8',
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  shapeText: {
    fontSize: 72,
    color: '#38BDF8',
  },
  instruction: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  matchButton: {
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    borderRadius: 20,
  },
  buttonDisabled: {
    backgroundColor: '#1E293B',
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
