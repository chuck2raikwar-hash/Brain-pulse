# BrainPulse Pro - 100% Native Swift & SwiftUI iOS Application

This folder contains the complete, native Apple iOS application for **BrainPulse Pro**, written 100% in **Swift 5.9+** and **SwiftUI** for iOS 16.0 / 17.0+.

---

## 🏗 Architecture & Technologies

- **UI Framework**: SwiftUI with declarative state management (`@StateObject`, `@EnvironmentObject`, `@Binding`).
- **Design System**: Dynamic iOS system grouped materials, San Francisco typography, responsive grids, and spring physics transitions.
- **Audio Synthesis**: `AVFoundation` / `AudioToolbox` for low-latency feedback tones (no external audio assets required).
- **Haptic Feedback**: `UIImpactFeedbackGenerator`, `UISelectionFeedbackGenerator`, and `UINotificationFeedbackGenerator`.
- **State & Persistence**: `CognitiveEngine` backed by `UserDefaults` with JSON encoders/decoders for offline-first performance.
- **PvP Matchmaking**: `MultiplayerEngine` with live simulated rounds, rating ELO progression, and bot fallbacks.

---

## 📁 Source Tree Structure

```
BrainPulseSwift/
├── BrainPulse.xcodeproj/      # Native Xcode Project (double-click to open)
│   ├── project.pbxproj
│   └── project.xcworkspace/
├── Package.swift              # Swift Package Manager definition
├── README.md                  # This documentation
└── Sources/
    ├── BrainPulseApp.swift    # @main App entry point
    ├── Models/
    │   └── GameModel.swift    # CognitiveCategory, GameType (15 games), UserProfile
    ├── Services/
    │   ├── CognitiveEngine.swift   # Profile, streaks, scoring & readiness calculation
    │   ├── AudioHapticService.swift # AVFoundation audio & UIKit tactile haptics
    │   └── MultiplayerEngine.swift  # 1v1 PvP matching, round sync & ratings
    └── Views/
        ├── ContentView.swift        # Main TabView + modal sheet presenter
        ├── DashboardView.swift      # Daily readiness gauge, streaks, daily workout
        ├── GameCatalogView.swift    # Filterable 15-game catalog with search
        ├── MultiplayerView.swift    # 1v1 Duel arena with live score comparison
        ├── AnalyticsView.swift      # Category radar bars & training trends
        ├── SettingsView.swift       # Audio/haptics toggles, profile & reset
        ├── Components/
        │   ├── GameCardView.swift   # Interactive drill card
        │   └── GameOverSheet.swift  # Summary sheet with accuracy & replay
        └── Games/
            ├── MemoryMatrixView.swift   # Spatial working memory grid
            ├── ReactionSpeedView.swift  # Millisecond reaction timer
            ├── ColorConfusionView.swift # Stroop interference color test
            ├── BreathingPacerView.swift # 4-7-8 Breathing circle animation
            └── NBackView.swift          # 2-Back visual pattern matching
```

---

## 🚀 How to Run in Xcode (macOS)

### Option A: Open Native Xcode Project
1. Unzip `brainpulse-swift-native.zip`.
2. Double-click **`BrainPulse.xcodeproj`** (or run `open BrainPulse.xcodeproj` in Terminal).
3. In Xcode's top toolbar, select any iOS Simulator (e.g. **iPhone 16 Pro** or **iPhone 15**).
4. Press **⌘ + R** (Command + R) or click the **Play** button to build and run.

### Option B: Open as Swift Package
In Xcode:
1. Choose **File $\rightarrow$ Open...**
2. Select the `BrainPulseSwift` folder (containing `Package.swift`).
3. Xcode will automatically resolve targets and render SwiftUI Previews in Canvas!

---

## 📱 Running on a Physical iPhone / iPad

1. Plug your iPhone/iPad into your Mac with a USB cable.
2. In Xcode, select your physical device from the target device dropdown.
3. Click the top-level **`BrainPulse`** project in the left navigator.
4. Go to **Signing & Capabilities**.
5. Check **Automatically manage signing** and select your Apple Developer Account / Personal Team.
6. Press **⌘ + R** to install and run.
