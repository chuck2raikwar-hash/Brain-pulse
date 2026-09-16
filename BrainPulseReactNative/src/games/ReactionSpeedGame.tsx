import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { X, Zap, AlertTriangle } from 'lucide-react-native';
import { cognitiveEngine } from '../services/CognitiveEngine';
import { audioHaptics } from '../services/AudioHapticService';
import { GameOverModal } from '../components/GameOverModal';

type GameState = 'waiting' | 'ready' | 'go' | 'early' | 'result';

export const ReactionSpeedGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [state, setState] = useState<GameState>('waiting');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);

  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startRound = () => {
    setState('ready');
    const delay = 1500 + Math.random() * 3000; // 1.5s - 4.5s random delay
    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = Date.now();
      setState('go');
      audioHaptics.playTap();
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleScreenPress = () => {
    if (state === 'waiting') {
      startRound();
    } else if (state === 'ready') {
      // False start!
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState('early');
      audioHaptics.playError();
    } else if (state === 'go') {
      const elapsed = Date.now() - startTimeRef.current;
      setReactionTime(elapsed);
      setState('result');
      audioHaptics.playSuccess();

      const newAttempts = [...attempts, elapsed];
      setAttempts(newAttempts);

      if (newAttempts.length >= 3) {
        // Finished 3 rounds
        setTimeout(() => {
          setIsGameOver(true);
          const avg = Math.round(
            newAttempts.reduce((a, b) => a + b, 0) / newAttempts.length
          );
          const score = Math.max(100, Math.round(1500 - avg * 2));
          cognitiveEngine.recordResult('reaction_speed', score, 100, avg);
        }, 800);
      }
    } else if (state === 'early' || state === 'result') {
      startRound();
    }
  };

  const getBackgroundColor = () => {
    switch (state) {
      case 'ready':
        return '#DC2626'; // Red
      case 'go':
        return '#16A34A'; // Green
      case 'early':
        return '#D97706'; // Amber warning
      default:
        return '#0F172A'; // Slate dark
    }
  };

  const averageLatency =
    attempts.length > 0
      ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
      : 250;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <X size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.roundTracker}>
          Round {Math.min(3, attempts.length + 1)} / 3
        </Text>
      </View>

      <TouchableOpacity
        style={styles.touchArea}
        activeOpacity={1}
        onPress={handleScreenPress}
      >
        {state === 'waiting' && (
          <View style={styles.content}>
            <Zap size={64} color="#38BDF8" />
            <Text style={styles.headline}>Reaction Speed</Text>
            <Text style={styles.instruction}>
              Tap anywhere to begin. When the red screen turns GREEN, tap as fast as you can!
            </Text>
          </View>
        )}

        {state === 'ready' && (
          <View style={styles.content}>
            <Text style={styles.hugeWord}>WAIT FOR GREEN...</Text>
          </View>
        )}

        {state === 'go' && (
          <View style={styles.content}>
            <Text style={styles.hugeWord}>TAP NOW!</Text>
          </View>
        )}

        {state === 'early' && (
          <View style={styles.content}>
            <AlertTriangle size={56} color="#FFFFFF" />
            <Text style={styles.headline}>Too Early!</Text>
            <Text style={styles.instruction}>You tapped before it turned green. Tap to retry.</Text>
          </View>
        )}

        {state === 'result' && (
          <View style={styles.content}>
            <Text style={styles.latencyNumber}>{reactionTime} ms</Text>
            <Text style={styles.instruction}>Tap anywhere to continue</Text>
          </View>
        )}
      </TouchableOpacity>

      <GameOverModal
        visible={isGameOver}
        gameTitle="Reaction Speed"
        score={Math.max(100, Math.round(1500 - averageLatency * 2))}
        accuracy={98}
        brainPowerGained={45}
        onPlayAgain={() => {
          setAttempts([]);
          setIsGameOver(false);
          startRound();
        }}
        onExit={onClose}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundTracker: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  touchArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
  },
  headline: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  instruction: {
    fontSize: 15,
    color: '#E2E8F0',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '600',
  },
  hugeWord: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  latencyNumber: {
    fontSize: 64,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
});
