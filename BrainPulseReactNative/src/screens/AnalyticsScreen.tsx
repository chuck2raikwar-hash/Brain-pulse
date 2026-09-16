import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LineChart, BarChart2, TrendingUp, Calendar, Zap } from 'lucide-react-native';
import { cognitiveEngine } from '../services/CognitiveEngine';
import { GameSessionResult, UserProfile } from '../types';

export const AnalyticsScreen: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(cognitiveEngine.getProfile());
  const [sessions, setSessions] = useState<GameSessionResult[]>(
    cognitiveEngine.getSessions()
  );

  useEffect(() => {
    const unsub = cognitiveEngine.subscribe(() => {
      setProfile({ ...cognitiveEngine.getProfile() });
      setSessions([...cognitiveEngine.getSessions()]);
    });
    return unsub;
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Cognitive Analytics</Text>
          <Text style={styles.subtitle}>
            Longitudinal telemetry & neural index progression
          </Text>
        </View>

        {/* Primary Stats Grid */}
        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>OVERALL INDEX</Text>
            <Text style={[styles.cardVal, { color: '#38BDF8' }]}>
              {profile.brainPower}
            </Text>
            <Text style={styles.cardSub}>Top 5% percentile</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>TOTAL DRILLS</Text>
            <Text style={[styles.cardVal, { color: '#10B981' }]}>
              {profile.completedDrillsCount}
            </Text>
            <Text style={styles.cardSub}>Sessions logged</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>ACCURACY AVG</Text>
            <Text style={[styles.cardVal, { color: '#FBBF24' }]}>92.4%</Text>
            <Text style={styles.cardSub}>Across all games</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>DAILY STREAK</Text>
            <Text style={[styles.cardVal, { color: '#F97316' }]}>
              {profile.dailyStreak} Days
            </Text>
            <Text style={styles.cardSub}>Active momentum</Text>
          </View>
        </View>

        {/* Category Breakdown */}
        <Text style={styles.sectionHeading}>Domain Performance</Text>
        <View style={styles.domainCard}>
          {[
            { label: 'Working Memory', percent: 94, color: '#38BDF8' },
            { label: 'Processing Speed', percent: 88, color: '#FBBF24' },
            { label: 'Attention Focus', percent: 91, color: '#818CF8' },
            { label: 'Cognitive Flexibility', percent: 85, color: '#A855F7' },
          ].map((item, idx) => (
            <View key={idx} style={styles.barRow}>
              <View style={styles.barLabelRow}>
                <Text style={styles.barLabel}>{item.label}</Text>
                <Text style={[styles.barVal, { color: item.color }]}>
                  {item.percent}%
                </Text>
              </View>
              <View style={styles.barBackground}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${item.percent}%`, backgroundColor: item.color },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Recent Session History */}
        <Text style={styles.sectionHeading}>Recent Workout Sessions</Text>
        {sessions.slice(0, 5).map((session, idx) => (
          <View key={idx} style={styles.sessionItem}>
            <View style={styles.sessionLeft}>
              <Text style={styles.sessionGame}>{session.gameId.replace('_', ' ').toUpperCase()}</Text>
              <Text style={styles.sessionDate}>
                {new Date(session.timestamp).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.sessionRight}>
              <Text style={styles.sessionScore}>Score: {session.score}</Text>
              <Text style={styles.sessionAcc}>{session.accuracyPercentage}% acc</Text>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  cardVal: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    marginTop: 8,
  },
  domainCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 24,
    gap: 14,
  },
  barRow: {},
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  barVal: {
    fontSize: 12,
    fontWeight: '800',
  },
  barBackground: {
    height: 8,
    backgroundColor: '#1E293B',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sessionLeft: {},
  sessionGame: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sessionDate: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  sessionRight: {
    alignItems: 'flex-end',
  },
  sessionScore: {
    fontSize: 13,
    fontWeight: '800',
    color: '#38BDF8',
  },
  sessionAcc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
});
