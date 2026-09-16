# BrainPulse Pro - Mobile Application (iOS & Android)

This repository contains the complete cross-platform mobile application powered by **Capacitor**, **React**, and **TypeScript**.

---

## 📱 Project Structure

- `android/` - Full native Android Studio project ready for Gradle build & Google Play Store release.
- `ios/` - Full native Xcode project ready for iOS simulators, physical iPhone/iPad debugging, and App Store archive.
- `src/` - Complete React + TypeScript codebase (15 cognitive games, real-time PvP engine, audio effects, profile tracking).
- `dist/` - Pre-compiled production web assets embedded into native app wrappers.
- `capacitor.config.ts` - Capacitor configuration (`com.brainpulse.pro`).

---

## 🚀 Quick Start Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or v20+)
- For Android: [Android Studio](https://developer.android.com/studio) with Android SDK and emulator
- For iOS: macOS with [Xcode](https://developer.apple.com/xcode/) and CocoaPods

### 1. Install Dependencies
```bash
npm install
```

### 2. Build Web Assets
```bash
npm run build
```

### 3. Sync Native Projects
```bash
npx cap sync
```

---

## 🤖 Running & Building Android App

### Open in Android Studio
```bash
npx cap open android
```
*Alternatively, launch Android Studio manually and open the `./android` folder.*

### Build an APK or AAB
1. Inside Android Studio, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)** for immediate testing on devices.
2. For Play Store release, go to **Build > Generate Signed Bundle / APK** and follow the signing wizard.

### Direct Command Line Run
```bash
npx cap run android
```

---

## 🍏 Running & Building iOS App (macOS)

### Open in Xcode
```bash
npx cap open ios
```
*Alternatively, open `./ios/App/App.xcworkspace` in Xcode.*

### Run on Simulator or iPhone
1. In Xcode, select your target simulator (e.g. iPhone 16 Pro) or your connected physical iPhone.
2. Under the **Signing & Capabilities** tab, select your Apple Development Team.
3. Click the **Play / Run (⌘R)** button to launch.

---

## 🔄 Making Changes & Syncing

Whenever you edit React files in `src/`:
```bash
# 1. Rebuild web assets
npm run build

# 2. Sync to Android and iOS
npx cap sync
```

---

## 🎮 Included Features & Highlights
- **15 Cognitive Games & Drills:** Memory Matrix, Quick-Reaction Drill, Color Confusion (Stroop), N-Back, Number Recall, Matching Cards, Recall Sequence, Distraction Task, Logic Puzzles, Word Games, Pattern Recognition, Guided Meditation, Breathing Pacer, Journaling Prompts, and Stretching Dual-Task.
- **PvP Matchmaking & Custom Lobbies:** 1v1, 2v2, and Free-For-All modes with real-time Firebase sync, bots fallback, voting phase, and ranking system.
- **Audio Engine:** Web Audio API sound generator for tactile feedback, correct bells, mistakes, and ambient sounds.
- **Offline Capable:** Local calibration profile, high-score records, and streak tracking.
