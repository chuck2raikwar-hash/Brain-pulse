# BrainPulse Pro - Xcode (iOS) Project Instructions

This archive contains the complete Apple iOS native app project for **BrainPulse Pro** configured with Capacitor and modern Swift Package Manager (SPM).

---

## 📁 What's Included

- **`ios/App/App.xcodeproj`**: The native Xcode project file.
- **`ios/App/App/`**: Native iOS source files:
  - `AppDelegate.swift` & `SceneDelegate.swift`: Native app lifecycle handlers.
  - `Info.plist`: iOS bundle identifiers, permissions, orientation settings.
  - `Assets.xcassets`: App icons and launch screen images.
  - `Base.lproj/LaunchScreen.storyboard`: Native launch screen.
  - `public/`: Pre-bundled production web assets (games, PvP engine, audio).
- **`ios/App/CapApp-SPM/`**: Native Capacitor Swift Package definitions.
- **`capacitor.config.ts`**: Mobile configuration with bundle ID `com.brainpulse.pro`.

---

## 🛠 Prerequisites

1. **macOS** computer (Monterey, Ventura, Sonoma, or Sequoia).
2. **Xcode** (v15 or v16 recommended) installed from the Mac App Store.
3. [Optional for web rebuilds] **Node.js** v18+ and npm.

---

## 🚀 How to Open in Xcode

### Method 1: Double-Click
1. Extract the `.zip` archive.
2. Navigate into `ios/App/`.
3. Double-click **`App.xcodeproj`** to open directly in Xcode.

### Method 2: Command Line
From the extracted project root:
```bash
npx cap open ios
```
Or open the Xcode project directly:
```bash
open ios/App/App.xcodeproj
```

---

## 📱 Running on Simulator or Physical iPhone

1. In Xcode's top toolbar, select a target device:
   - **Simulator:** Choose any iOS simulator (e.g. *iPhone 16 Pro*, *iPhone 15*).
   - **Real Device:** Plug in your iPhone or iPad via USB and select it.
2. Configure Signing (for physical devices):
   - Click the **`App`** project in the left sidebar (project navigator).
   - Select the **`App`** target.
   - Go to the **Signing & Capabilities** tab.
   - Under **Team**, select your Apple ID / Developer account.
3. Press **Run (⌘ + R)** or click the **Play** button in Xcode.
4. The app will build and launch immediately on the device or simulator.

---

## 🔄 Making Web Code Changes

If you modify React / TypeScript files:
```bash
# 1. Rebuild web assets
npm run build

# 2. Sync changes into Xcode project
npx cap sync ios
```
Xcode will automatically detect the updated assets in `ios/App/App/public/`.
