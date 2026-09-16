import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import {
  Volume2,
  Vibrate,
  User,
  Crown,
  Shield,
  Smartphone,
  Download,
} from 'lucide-react-native';
import { cognitiveEngine } from '../services/CognitiveEngine';
import { audioHaptics } from '../services/AudioHapticService';

export const SettingsScreen: React.FC = () => {
  const profile = cognitiveEngine.getProfile();
  const [name, setName] = useState(profile.displayName);
  const [sound, setSound] = useState(audioHaptics.isSoundOn());
  const [haptics, setHaptics] = useState(audioHaptics.isHapticsOn());

  const handleToggleSound = (val: boolean) => {
    setSound(val);
    audioHaptics.setSoundEnabled(val);
    if (val) audioHaptics.playTap();
  };

  const handleToggleHaptics = (val: boolean) => {
    setHaptics(val);
    audioHaptics.setHapticsEnabled(val);
    if (val) audioHaptics.playTap();
  };

  const handleSaveName = () => {
    if (!name.trim()) return;
    cognitiveEngine.updateDisplayName(name.trim());
    audioHaptics.playSuccess();
    Alert.alert('Success', 'Profile name updated!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings & Config</Text>
          <Text style={styles.subtitle}>
            App preferences, sound, haptics & build artifacts
          </Text>
        </View>

        {/* Membership Status Card */}
        <View style={styles.membershipCard}>
          <View style={styles.crownCircle}>
            <Crown size={28} color="#FBBF24" />
          </View>
          <View style={styles.membershipDetails}>
            <Text style={styles.membershipStatus}>BRAINPULSE PRO</Text>
            <Text style={styles.membershipSub}>
              All 15 cognitive exercises unlocked
            </Text>
          </View>
        </View>

        {/* Profile Card */}
        <Text style={styles.sectionHeading}>Profile</Text>
        <View style={styles.card}>
          <Text style={styles.inputLabel}>DISPLAY NAME</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#64748B"
            />
            <TouchableOpacity
              style={styles.saveBtn}
              activeOpacity={0.8}
              onPress={handleSaveName}
            >
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences */}
        <Text style={styles.sectionHeading}>Sensory & Feedback</Text>
        <View style={styles.card}>
          <View style={styles.prefRow}>
            <View style={styles.prefLabelBox}>
              <Volume2 size={20} color="#38BDF8" />
              <View>
                <Text style={styles.prefTitle}>Sound Effects</Text>
                <Text style={styles.prefSub}>Auditory cues during drills</Text>
              </View>
            </View>
            <Switch
              value={sound}
              onValueChange={handleToggleSound}
              trackColor={{ false: '#334155', true: '#0284C7' }}
              thumbColor={sound ? '#FFFFFF' : '#94A3B8'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.prefRow}>
            <View style={styles.prefLabelBox}>
              <Vibrate size={20} color="#A855F7" />
              <View>
                <Text style={styles.prefTitle}>Haptic Feedback</Text>
                <Text style={styles.prefSub}>Tactile vibration buzzes</Text>
              </View>
            </View>
            <Switch
              value={haptics}
              onValueChange={handleToggleHaptics}
              trackColor={{ false: '#334155', true: '#A855F7' }}
              thumbColor={haptics ? '#FFFFFF' : '#94A3B8'}
            />
          </View>
        </View>

        {/* Build & Runtime Info */}
        <Text style={styles.sectionHeading}>Framework Architecture</Text>
        <View style={styles.card}>
          <View style={styles.techRow}>
            <Smartphone size={20} color="#38BDF8" />
            <View style={{ flex: 1 }}>
              <Text style={styles.techTitle}>React Native (Expo SDK 52)</Text>
              <Text style={styles.techSub}>
                Cross-platform iOS & Android with native TurboModules
              </Text>
            </View>
          </View>
        </View>
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
  membershipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    marginBottom: 24,
  },
  crownCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  membershipDetails: {
    flex: 1,
  },
  membershipStatus: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FBBF24',
    letterSpacing: 1,
  },
  membershipSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#334155',
  },
  saveBtn: {
    backgroundColor: '#38BDF8',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  saveBtnText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 13,
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  prefLabelBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prefTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  prefSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 12,
  },
  techRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  techTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  techSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
});
