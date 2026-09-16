import SwiftUI

public struct SettingsView: View {
    @EnvironmentObject private var engine: CognitiveEngine
    @EnvironmentObject private var audio: AudioHapticService

    @State private var showingResetAlert: Bool = false

    public init() {}

    public var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Profile & Identity")) {
                    HStack {
                        Image(systemName: "person.crop.circle.fill")
                            .font(.system(size: 38))
                            .foregroundColor(.blue)

                        VStack(alignment: .leading, spacing: 2) {
                            Text(engine.profile.displayName)
                                .font(.headline)
                            Text("BrainPower: \(engine.profile.brainPower)")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }

                        Spacer()

                        Text("PRO")
                            .font(.caption2.bold())
                            .foregroundColor(.black)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color.yellow)
                            .cornerRadius(8)
                    }
                    .padding(.vertical, 4)
                }

                Section(header: Text("Audio & Feedback")) {
                    Toggle(isOn: $audio.isSoundEnabled) {
                        Label("Sound Effects", systemImage: "speaker.wave.2.fill")
                    }

                    Toggle(isOn: $audio.isHapticsEnabled) {
                        Label("Haptic Feedback", systemImage: "hand.tap.fill")
                    }
                }

                Section(header: Text("Native Swift Architecture")) {
                    HStack {
                        Label("Framework", systemImage: "swift")
                        Spacer()
                        Text("100% Native SwiftUI")
                            .foregroundColor(.secondary)
                    }

                    HStack {
                        Label("Architecture", systemImage: "cpu")
                        Spacer()
                        Text("MVVM + AVFoundation")
                            .foregroundColor(.secondary)
                    }

                    HStack {
                        Label("Version", systemImage: "info.circle")
                        Spacer()
                        Text("2.4.0 Native")
                            .foregroundColor(.secondary)
                    }
                }

                Section(header: Text("Data Management")) {
                    Button(role: .destructive, action: {
                        showingResetAlert = true
                    }) {
                        Label("Reset Training Data", systemImage: "trash.fill")
                    }
                }
            }
            .navigationTitle("Settings")
            .alert(isPresented: $showingResetAlert) {
                Alert(
                    title: Text("Reset All Progress?"),
                    message: Text("This will reset your brain power, daily streak, and high score history to default."),
                    primaryButton: .destructive(Text("Reset")) {
                        engine.resetProgress()
                        audio.playMistake()
                    },
                    secondaryButton: .cancel()
                )
            }
        }
    }
}
