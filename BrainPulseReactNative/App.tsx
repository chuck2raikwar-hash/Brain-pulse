import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  Home,
  Grid,
  Swords,
  BarChart3,
  Settings as SettingsIcon,
} from 'lucide-react-native';

import { GameId } from './src/types';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { GameCatalogScreen } from './src/screens/GameCatalogScreen';
import { PvPHubScreen } from './src/screens/PvPHubScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

import { ColorConfusionGame } from './src/games/ColorConfusionGame';
import { MemoryMatrixGame } from './src/games/MemoryMatrixGame';
import { ReactionSpeedGame } from './src/games/ReactionSpeedGame';
import { BreathingPacerGame } from './src/games/BreathingPacerGame';
import { NBackGame } from './src/games/NBackGame';

type TabName = 'Dashboard' | 'Games' | 'PvP' | 'Analytics' | 'Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('Dashboard');
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  const renderActiveGame = () => {
    switch (activeGame) {
      case 'color_confusion':
        return <ColorConfusionGame onClose={() => setActiveGame(null)} />;
      case 'memory_matrix':
        return <MemoryMatrixGame onClose={() => setActiveGame(null)} />;
      case 'reaction_speed':
        return <ReactionSpeedGame onClose={() => setActiveGame(null)} />;
      case 'breathing_pacer':
        return <BreathingPacerGame onClose={() => setActiveGame(null)} />;
      case 'n_back':
        return <NBackGame onClose={() => setActiveGame(null)} />;
      default:
        return null;
    }
  };

  if (activeGame) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        {renderActiveGame()}
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={styles.screenContainer}>
        {activeTab === 'Dashboard' && (
          <DashboardScreen
            onLaunchGame={(id) => setActiveGame(id)}
            onNavigateTab={(tab) => setActiveTab(tab as TabName)}
          />
        )}
        {activeTab === 'Games' && (
          <GameCatalogScreen onLaunchGame={(id) => setActiveGame(id)} />
        )}
        {activeTab === 'PvP' && (
          <PvPHubScreen onLaunchGame={(id) => setActiveGame(id)} />
        )}
        {activeTab === 'Analytics' && <AnalyticsScreen />}
        {activeTab === 'Settings' && <SettingsScreen />}
      </View>

      {/* Bottom Tab Bar */}
      <SafeAreaView style={styles.tabBarWrapper}>
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('Dashboard')}
          >
            <Home
              size={20}
              color={activeTab === 'Dashboard' ? '#38BDF8' : '#64748B'}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'Dashboard' && styles.tabLabelActive,
              ]}
            >
              Today
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('Games')}
          >
            <Grid
              size={20}
              color={activeTab === 'Games' ? '#38BDF8' : '#64748B'}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'Games' && styles.tabLabelActive,
              ]}
            >
              Games
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('PvP')}
          >
            <Swords
              size={20}
              color={activeTab === 'PvP' ? '#38BDF8' : '#64748B'}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'PvP' && styles.tabLabelActive,
              ]}
            >
              1v1 Arena
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('Analytics')}
          >
            <BarChart3
              size={20}
              color={activeTab === 'Analytics' ? '#38BDF8' : '#64748B'}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'Analytics' && styles.tabLabelActive,
              ]}
            >
              Analytics
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('Settings')}
          >
            <SettingsIcon
              size={20}
              color={activeTab === 'Settings' ? '#38BDF8' : '#64748B'}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'Settings' && styles.tabLabelActive,
              ]}
            >
              Settings
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#070A14',
  },
  screenContainer: {
    flex: 1,
  },
  tabBarWrapper: {
    backgroundColor: '#0F172A',
  },
  tabBar: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  tabLabelActive: {
    color: '#38BDF8',
  },
});
