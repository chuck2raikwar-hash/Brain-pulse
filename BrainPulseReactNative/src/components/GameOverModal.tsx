import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Trophy, RotateCcw, X } from 'lucide-react-native';

interface GameOverModalProps {
  visible: boolean;
  gameTitle: string;
  score: number;
  accuracy: number;
  brainPowerGained: number;
  onPlayAgain: () => void;
  onExit: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  visible,
  gameTitle,
  score,
  accuracy,
  brainPowerGained,
  onPlayAgain,
  onExit,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <View style={styles.card}>
            {/* Trophy Icon */}
            <View style={styles.iconCircle}>
              <Trophy size={40} color="#FBBF24" />
            </View>

            <Text style={styles.completeLabel}>Session Completed</Text>
            <Text style={styles.title}>{gameTitle}</Text>

            {/* Score Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statLabel}>FINAL SCORE</Text>
                <Text style={styles.statValue}>{score.toLocaleString()}</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statLabel}>ACCURACY</Text>
                <Text style={[styles.statValue, { color: '#06B6D4' }]}>
                  {accuracy}%
                </Text>
              </View>
            </View>

            {/* Brain Power Reward Pill */}
            <View style={styles.powerBadge}>
              <Text style={styles.powerText}>
                +{brainPowerGained} Brain Power Points
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.8}
                onPress={onPlayAgain}
              >
                <RotateCcw size={18} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Play Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.8}
                onPress={onExit}
              >
                <X size={18} color="#94A3B8" />
                <Text style={styles.secondaryButtonText}>Back to Hub</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 10, 20, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  completeLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#06B6D4',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  powerBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    marginBottom: 24,
  },
  powerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#60A5FA',
  },
  actions: {
    width: '100%',
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    width: '100%',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    width: '100%',
  },
  secondaryButtonText: {
    color: '#94A3B8',
    fontSize: 15,
    fontWeight: '700',
  },
});
