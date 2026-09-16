import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  Brain,
  Flame,
  Zap,
  Award,
  Play,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react-native';
import { cognitiveEngine } from '../services/CognitiveEngine';
import { UserProfile, GameId } from '../types';

interface DashboardScreenProps {
  onLaunchGame: (gameId: GameId) => void;
  onNavigateTab: (tabName: string) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onLaunchGame,
  onNavigateTab,
}) => {
  const [profile, setProfile] = useState<UserProfile>(
    cognitiveEngine.getProfile()
  );

  useEffect(() => {
    const unsub = cognitiveEngine.subscribe(() => {
      setProfile({ ...cognitiveEngine.getProfile() });
    });
    return unsub;
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeLabel}>WELCOME BACK</Text>
            <Text style={styles.userName}>{profile.displayName}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Flame size={18} color="#F97316" />
            <Text style={styles.streakText}>{profile.dailyStreak} Day Streak</Text>
          </View>
        </View>

        {/* Hero Brain Power Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroBadge}>
              <Brain size={16} color="#38BDF8" />
              <Text style={styles.heroBadgeText}>BRAIN POWER INDEX</Text>
            </View>
            <Text style={styles.tierText}>Top 5% Cognitive</Text>
          </View>

          <Text style={styles.brainPowerScore}>
            {profile.brainPower.toLocaleString()}
          </Text>
          <Text style={styles.brainPowerSub}>
            +{Math.min(120, profile.completedDrillsCount * 12)} points earned this week
          </Text>

          <TouchableOpacity
            style={styles.heroCta}
            activeOpacity={0.8}
            onPress={() => onLaunchGame('color_confusion')}
          >
            <Play size={16} color="#0F172A" fill="#0F172A" />
            <Text style={styles.heroCtaText}>Start Daily Workout</Text>
          </TouchableOpacity>
        </View>

        {/* Cognitive Index 2x2 Metric Grid */}
        <Text style={styles.sectionTitle}>Cognitive Metrics</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricCardLabel}>WORKING MEMORY</Text>
            <Text style={[styles.metricCardVal, { color: '#818CF8' }]}>94%</Text>
            <Text style={styles.metricSub}>Top Tier</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricCardLabel}>PROCESSING SPEED</Text>
            <Text style={[styles.metricCardVal, { color: '#FBBF24' }]}>215 ms</Text>
            <Text style={styles.metricSub}>+12% faster</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricCardLabel}>ATTENTION FOCUS</Text>
            <Text style={[styles.metricCardVal, { color: '#38BDF8' }]}>88%</Text>
            <Text style={styles.metricSub}>Strong stability</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricCardLabel}>DRILLS FINISHED</Text>
            <Text style={[styles.metricCardVal, { color: '#34D399' }]}>
              {profile.completedDrillsCount}
            </Text>
            <Text style={styles.metricSub}>Total sessions</Text>
          </View>
        </View>

        {/* Recommended Drills */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recommended Drills</Text>
          <TouchableOpacity onPress={() => onNavigateTab('Games')}>
            <Text style={styles.seeAllText}>Explore All</Text>
          </TouchableOpacity>
        </View>

        {/* Drill 1: Color Confusion */}
        <TouchableOpacity
          style={styles.drillCard}
          activeOpacity={0.8}
          onPress={() => onLaunchGame('color_confusion')}
        >
          <View style={[styles.iconBox, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
            <Sparkles size={24} color="#EF4444" />
          </View>
          <View style={styles.drillInfo}>
            <Text style={styles.drillCategory}>ATTENTION & FLEXIBILITY</Text>
            <Text style={styles.drillTitle}>Color Confusion (Stroop)</Text>
            <Text style={styles.drillSubtitle}>Overcome cognitive interference</Text>
          </View>
          <ArrowUpRight size={20} color="#64748B" />
        </TouchableOpacity>

        {/* Drill 2: Memory Matrix */}
        <TouchableOpacity
          style={styles.drillCard}
          activeOpacity={0.8}
          onPress={() => onLaunchGame('memory_matrix')}
        >
          <View style={[styles.iconBox, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
            <Brain size={24} color="#06B6D4" />
          </View>
          <View style={styles.drillInfo}>
            <Text style={styles.drillCategory}>SPATIAL MEMORY</Text>
            <Text style={styles.drillTitle}>Memory Matrix</Text>
            <Text style={styles.drillSubtitle}>Memorize flashing tile positions</Text>
          </View>
          <ArrowUpRight size={20} color="#64748B" />
        </TouchableOpacity>

        {/* Drill 3: Reaction Speed */}
        <TouchableOpacity
          style={styles.drillCard}
          activeOpacity={0.8}
          onPress={() => onLaunchGame('reaction_speed')}
        >
          <View style={[styles.iconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
            <Zap size={24} color="#F59E0B" />
          </View>
          <View style={styles.drillInfo}>
            <Text style={styles.drillCategory}>REFLEX & SPEED</Text>
            <Text style={styles.drillTitle}>Reaction Speed Drill</Text>
            <Text style={styles.drillSubtitle}>Sub-second auditory/visual reflexes</Text>
          </View>
          <ArrowUpRight size={20} color="#64748B" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070A14',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#06B6D4',
    letterSpacing: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.25)',
  },
  streakText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F97316',
  },
  heroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 24,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
  tierText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399',
  },
  brainPowerScore: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  brainPowerSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 20,
    fontWeight: '500',
  },
  heroCta: {
    backgroundColor: '#38BDF8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },
  heroCtaText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38BDF8',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricCardLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  metricCardVal: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 2,
  },
  metricSub: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  drillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  drillInfo: {
    flex: 1,
  },
  drillCategory: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  drillTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  drillSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
