import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { X, Wind } from 'lucide-react-native';
import { cognitiveEngine } from '../services/CognitiveEngine';
import { audioHaptics } from '../services/AudioHapticService';
import { GameOverModal } from '../components/GameOverModal';

type BreathPhase = 'Inhale' | 'Hold' | 'Exhale';

export const BreathingPacerGame: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [phase, setPhase] = useState<BreathPhase>('Inhale');
  const [countdown, setCountdown] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const runCycle = () => {
      // 4s Inhale
      setPhase('Inhale');
      audioHaptics.playTap();
      Animated.timing(scaleAnim, {
        toValue: 1.8,
        duration: 4000,
        useNativeDriver: true,
      }).start();

      timer = setTimeout(() => {
        // 7s Hold
        setPhase('Hold');
        audioHaptics.playTap();
        timer = setTimeout(() => {
          // 8s Exhale
          setPhase('Exhale');
          audioHaptics.playTap();
          Animated.timing(scaleAnim, {
            toValue: 1.0,
            duration: 8000,
            useNativeDriver: true,
          }).start();

          timer = setTimeout(() => {
            setCyclesCompleted((prev) => {
              const next = prev + 1;
              if (next >= 3) {
                setIsGameOver(true);
                cognitiveEngine.recordResult('breathing_pacer', 100, 100);
              } else {
                runCycle();
              }
              return next;
            });
          }, 8000);
        }, 7000);
      }, 4000);
    };

    runCycle();

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <X size={24} color="#94A3B8" />
        </TouchableOpacity>
        <Text style={styles.title}>4-7-8 Breathing Pacer</Text>
        <Text style={styles.cycleBadge}>{cyclesCompleted} / 3</Text>
      </View>

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.breathCircle,
            {
              transform: [{ scale: scaleAnim }],
              borderColor:
                phase === 'Inhale'
                  ? '#38BDF8'
                  : phase === 'Hold'
                  ? '#A855F7'
                  : '#10B981',
            },
          ]}
        >
          <Wind size={36} color="#FFFFFF" />
          <Text style={styles.phaseText}>{phase}</Text>
        </Animated.View>
        <Text style={styles.instruction}>
          {phase === 'Inhale' && 'Breathe in slowly through the nose...'}
          {phase === 'Hold' && 'Hold your breath gently...'}
          {phase === 'Exhale' && 'Exhale completely through your mouth...'}
        </Text>
      </View>

      <GameOverModal
        visible={isGameOver}
        gameTitle="Breathing Pacer"
        score={100}
        accuracy={100}
        brainPowerGained={50}
        onPlayAgain={() => {
          setCyclesCompleted(0);
          setIsGameOver(false);
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
  cycleBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38BDF8',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
  },
  phaseText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 6,
  },
  instruction: {
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
