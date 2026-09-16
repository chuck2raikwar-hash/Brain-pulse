import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Swords, Users, Trophy, ShieldCheck, Zap } from 'lucide-react-native';
import { GameId } from '../types';

interface PvPHubScreenProps {
  onLaunchGame: (gameId: GameId) => void;
}

export const PvPHubScreen: React.FC<PvPHubScreenProps> = ({ onLaunchGame }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);

  const startQuickMatch = () => {
    setIsSearching(true);
    setMatchFound(false);

    setTimeout(() => {
      setIsSearching(false);
      setMatchFound(true);

      setTimeout(() => {
        setMatchFound(false);
        onLaunchGame('color_confusion');
      }, 1200);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>1v1 Neural Arena</Text>
          <Text style={styles.subtitle}>
            Compete head-to-head in real-time cognitive drills
          </Text>
        </View>

        {/* Live Matchmaking Card */}
        <View style={styles.matchmakingCard}>
          <View style={styles.arenaIconCircle}>
            <Swords size={36} color="#F97316" />
          </View>

          <Text style={styles.arenaTitle}>Quick Match Arena</Text>
          <Text style={styles.arenaDescription}>
            Test your reaction speed and Stroop interference control against
            challengers worldwide.
          </Text>

          {isSearching ? (
            <View style={styles.searchingBox}>
              <ActivityIndicator size="small" color="#38BDF8" />
              <Text style={styles.searchingText}>Searching for opponent...</Text>
            </View>
          ) : matchFound ? (
            <View style={styles.foundBox}>
              <Zap size={20} color="#10B981" />
              <Text style={styles.foundText}>Opponent Found! Launching...</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.findMatchBtn}
              activeOpacity={0.8}
              onPress={startQuickMatch}
            >
              <Users size={18} color="#0F172A" />
              <Text style={styles.findMatchText}>Find 1v1 Challenger</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Global Leaderboard Section */}
        <Text style={styles.sectionHeading}>Global Division Rankings</Text>

        {[
          { rank: '1', name: 'Alex V.', score: '2,490', tier: 'Grandmaster' },
          { rank: '2', name: 'Elena R.', score: '2,380', tier: 'Master' },
          { rank: '3', name: 'Marcus K.', score: '2,240', tier: 'Diamond' },
        ].map((player, idx) => (
          <View key={idx} style={styles.playerRow}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankNumber}>{player.rank}</Text>
            </View>
            <View style={styles.playerDetails}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.playerTier}>{player.tier}</Text>
            </View>
            <View style={styles.scorePill}>
              <Trophy size={14} color="#FBBF24" />
              <Text style={styles.scoreText}>{player.score}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070A14',
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
  },
  matchmakingCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 28,
  },
  arenaIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
  },
  arenaTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  arenaDescription: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  findMatchBtn: {
    backgroundColor: '#38BDF8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    width: '100%',
  },
  findMatchText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  searchingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  searchingText: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '700',
  },
  foundBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  foundText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '800',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    color: '#38BDF8',
    fontWeight: '900',
    fontSize: 13,
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  playerTier: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FBBF24',
  },
});
