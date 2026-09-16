# BrainPulse Mobile (React Native + Expo SDK 52)

A cross-platform React Native cognitive performance training app for iOS and Android.

## Features Included
- **Stroop Effect (Color Confusion)**: Dual-stream cognitive flexibility drill with reactive combo multipliers and color conflict engine.
- **Memory Matrix**: Spatial working memory grid with adaptive expansion and life trackers.
- **Reaction Speed**: Millisecond-accurate reflex timer with false-start detection.
- **2-Back Pattern Match**: Working memory continuous stream recognition.
- **4-7-8 Breathing Pacer**: Diaphragmatic mindfulness breathing loop with animated circle guidance.
- **1v1 Neural Arena**: Matchmaking simulation and global tier rankings.
- **Analytics & Cognitive Index**: Longitudinal telemetry, accuracy averages, and category breakdowns.
- **Haptic & Audio Engine**: Real-time tactile feedback via `expo-haptics` and ambient audio cues.

## Quick Start Guide

### 1. Install Dependencies
```bash
cd BrainPulseReactNative
npm install
```

### 2. Start the Development Server
```bash
npx expo start
```

- **Physical Device**: Scan the generated QR code using the **Expo Go** app on your iPhone or Android phone.
- **iOS Simulator (macOS & Xcode)**: Press `i` in the terminal to launch the iOS Simulator.
- **Android Emulator**: Press `a` in the terminal to launch the Android Emulator.
- **Web Preview**: Press `w` to run directly in the browser with Expo Web.

### 3. Native Builds (Xcode / Android Studio)
To generate standalone native Xcode (`.xcworkspace`) and Android Studio projects:
```bash
npx expo prebuild
```
This generates the native `/ios` and `/android` directories ready for Xcode 15/16 and Android Studio.
