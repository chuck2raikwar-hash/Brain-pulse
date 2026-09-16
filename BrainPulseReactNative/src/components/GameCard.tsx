import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, Award } from 'lucide-react-native';
import { GameMetadata } from '../types';

interface GameCardProps {
  game: GameMetadata;
  highScore: number;
  onPress: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  highScore,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: `${game.themeColor}20` },
            ]}
          >
            <Text style={[styles.categoryText, { color: game.themeColor }]}>
              {game.category}
            </Text>
          </View>

          {highScore > 0 && (
            <View style={styles.highScoreBadge}>
              <Award size={12} color="#FBBF24" />
              <Text style={styles.highScoreText}>
                Best: {highScore.toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>{game.title}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {game.subtitle}
        </Text>
      </View>

      <View style={styles.arrowContainer}>
        <ChevronRight size={20} color="#64748B" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  highScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  highScoreText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FBBF24',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
    lineHeight: 16,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
