import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { X, Heart, Zap } from 'lucide-react-native';
import { cognitiveEngine } from '../services/CognitiveEngine';
import { audioHaptics } from '../services/AudioHapticService';
import { GameOverModal } from '../components/GameOverModal';

const GRID_SIZE = 4; // 4x4 matrix
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

export const MemoryMatrixGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [pattern, setPattern] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  const startLevel = (nextLevel: number) => {
    setSelectedCells([]);
    setRevealed(true);
    // Number of active tiles = 3 + level
    const tileCount = Math.min(8, 3 + nextLevel);
    const newPattern: number[] = [];
    while (newPattern.length < tileCount) {
      const idx = Math.floor(Math.random() * TOTAL_CELLS);
      if (!newPattern.includes(idx)) {
        newPattern.push(idx);
      }
    }
    setPattern(newPattern);

    // Hide after 1.5 seconds
    setTimeout(() => {
      setRevealed(false);
    }, 1500);
  };

  const startNewGame = () => {
    setLevel(1);
    setScore(0);
    setLives(3);
    setIsGameOver(false);
    startLevel(1);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleCellPress = (index: number) => {
    if (revealed || selectedCells.includes(index) || isGameOver) return;

    audioHaptics.playTap();
    const isHit = pattern.includes(index);

    if (isHit) {
      audioHaptics.playSuccess();
      const updated = [...selectedCells, index];
      setSelectedCells(updated);
      setScore((s) => s + 150);

      // Check if all correct cells found
      const remaining = pattern.filter((c) => !updated.includes(c));
      if (remaining.length === 0) {
        // Level cleared!
        setTimeout(() => {
          setLevel((l) => l + 1);
          startLevel(level + 1);
        }, 500);
      }
    } else {
      audioHaptics.playError();
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        setIsGameOver(true);
        cognitiveEngine.recordResult('memory_matrix', score, 90);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <X size={24} color="#94A3B8" />
        </TouchableOpacity>
        <View style={styles.titleBox}>
          <Text style={styles.gameTitle}>Memory Matrix</Text>
          <Text style={styles.subTitle}>Recall the lit tiles</Text>
        </View>
        <View style={styles.livesBox}>
          {[1, 2, 3].map((heart) => (
            <Heart
              key={heart}
              size={18}
              color={heart <= lives ? '#EF4444' : '#334155'}
              fill={heart <= lives ? '#EF4444' : 'transparent'}
            />
          ))}
        </View>
      </View>

      <View style={styles.statBanner}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>LEVEL</Text>
          <Text style={styles.statVal}>{level}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>SCORE</Text>
          <Text style={styles.statVal}>{score}</Text>
        </View>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.grid}>
          {Array.from({ length: TOTAL_CELLS }).map((_, i) => {
            const isPattern = pattern.includes(i);
            const isSelected = selectedCells.includes(i);
            const showActive = (revealed && isPattern) || isSelected;

            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                disabled={revealed}
                style={[
                  styles.cell,
                  showActive && styles.cellActive,
                ]}
                onPress={() => handleCellPress(i)}
              />
            );
          })}
        </View>
      </View>

      <GameOverModal
        visible={isGameOver}
        gameTitle="Memory Matrix"
        score={score}
        accuracy={Math.min(100, Math.round((level / 8) * 100))}
        brainPowerGained={Math.max(15, Math.round(score / 25))}
        onPlayAgain={startNewGame}
        onExit={onClose}
      />
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 64 - 36) / 4;

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
  titleBox: {
    alignItems: 'center',
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  livesBox: {
    flexDirection: 'row',
    gap: 4,
  },
  statBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginVertical: 12,
  },
  statBox: {
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  statVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    width: width - 64,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cellActive: {
    backgroundColor: '#06B6D4',
    borderColor: '#38BDF8',
    shadowColor: '#06B6D4',
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
});
