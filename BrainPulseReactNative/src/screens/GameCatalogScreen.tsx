import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Search } from 'lucide-react-native';
import { GameCard } from '../components/GameCard';
import { cognitiveEngine } from '../services/CognitiveEngine';
import { GameMetadata, CognitiveCategory, GameId } from '../types';

const CATEGORIES: ('All' | CognitiveCategory)[] = [
  'All',
  'Memory',
  'Speed',
  'Attention',
  'Flexibility',
  'Mindfulness',
];

const ALL_GAMES: GameMetadata[] = [
  {
    id: 'color_confusion',
    title: 'Color Confusion (Stroop)',
    subtitle: 'Suppress instinctual reading to match real ink colors',
    category: 'Flexibility',
    themeColor: '#A855F7',
    durationSeconds: 30,
  },
  {
    id: 'memory_matrix',
    title: 'Memory Matrix',
    subtitle: 'Memorize flashing cell formations across expanding grids',
    category: 'Memory',
    themeColor: '#38BDF8',
    durationSeconds: 45,
  },
  {
    id: 'reaction_speed',
    title: 'Reaction Speed Drill',
    subtitle: 'Measure sub-second latency the millisecond light shifts to green',
    category: 'Speed',
    themeColor: '#F59E0B',
    durationSeconds: 20,
  },
  {
    id: 'n_back',
    title: '2-Back Pattern Match',
    subtitle: 'Hold and recall continuous symbol sequences from 2 steps prior',
    category: 'Memory',
    themeColor: '#818CF8',
    durationSeconds: 30,
  },
  {
    id: 'breathing_pacer',
    title: '4-7-8 Breathing Pacer',
    subtitle: 'Diaphragmatic cadence pacing for parasympathetic nervous balance',
    category: 'Mindfulness',
    themeColor: '#34D399',
    durationSeconds: 60,
  },
];

interface GameCatalogScreenProps {
  onLaunchGame: (gameId: GameId) => void;
}

export const GameCatalogScreen: React.FC<GameCatalogScreenProps> = ({
  onLaunchGame,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | CognitiveCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = ALL_GAMES.filter((g) => {
    const matchesCategory =
      selectedCategory === 'All' || g.category === selectedCategory;
    const matchesQuery =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cognitive Catalog</Text>
        <Text style={styles.headerSubtitle}>
          Scientifically targeted neural performance drills
        </Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={18} color="#64748B" />
          <TextInput
            placeholder="Search exercises..."
            placeholderTextColor="#64748B"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Horizontal Category Filter Pills */}
      <View style={styles.pillContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                activeOpacity={0.7}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.pill,
                  isSelected && styles.pillSelected,
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    isSelected && styles.pillTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Game Cards List */}
      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredGames.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            highScore={cognitiveEngine.getHighScore(game.id)}
            onPress={() => onLaunchGame(game.id)}
          />
        ))}

        {filteredGames.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No exercises match your search.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#070A14',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  pillContainer: {
    marginVertical: 14,
  },
  pillScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  pillSelected: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
});
