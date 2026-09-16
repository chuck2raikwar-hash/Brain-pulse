import SwiftUI

public struct BreathingPacerView: View {
    @EnvironmentObject private var engine: CognitiveEngine
    @EnvironmentObject private var audio: AudioHapticService
    @Environment(\.dismiss) private var dismiss

    enum BreathPhase: String {
        case inhale = "Inhale..."
        case hold = "Hold..."
        case exhale = "Exhale..."
        case rest = "Rest..."

        var duration: Double {
            switch self {
            case .inhale: return 4.0
            case .hold: return 7.0
            case .exhale: return 8.0
            case .rest: return 1.0
            }
        }

        var color: Color {
            switch self {
            case .inhale: return .cyan
            case .hold: return .indigo
            case .exhale: return .teal
            case .rest: return .blue
            }
        }
    }

    @State private var phase: BreathPhase = .inhale
    @State private var circleScale: CGFloat = 0.6
    @State private var totalCyclesCompleted: Int = 0
    @State private var sessionTimer: Timer?
    @State private var secondsRemaining: Int = 60
    @State private var isCompleted: Bool = false

    public init() {}

    public var body: some View {
        ZStack {
            Color(red: 0.05, green: 0.07, blue: 0.12)
                .ignoresSafeArea()

            VStack(spacing: 24) {
                // Header Bar
                HStack {
                    Button(action: {
                        sessionTimer?.invalidate()
                        dismiss()
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 28))
                            .foregroundColor(.white.opacity(0.6))
                    }

                    Spacer()

                    Text("4-7-8 Breathing Pacer")
                        .font(.headline)
                        .foregroundColor(.white)

                    Spacer()

                    Text("\(secondsRemaining)s")
                        .font(.subheadline.bold())
                        .foregroundColor(.cyan)
                }
                .padding(.horizontal)

                Spacer()

                // Animated Pulsing Breathing Circle
                ZStack {
                    // Outer Glow Rings
                    Circle()
                        .fill(phase.color.opacity(0.12))
                        .frame(width: 280, height: 280)
                        .scaleEffect(circleScale * 1.3)

                    Circle()
                        .fill(phase.color.opacity(0.25))
                        .frame(width: 220, height: 220)
                        .scaleEffect(circleScale * 1.15)

                    // Core Circle
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [phase.color, phase.color.opacity(0.7)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 170, height: 170)
                        .scaleEffect(circleScale)
                        .shadow(color: phase.color.opacity(0.5), radius: 24)

                    // Text inside Circle
                    VStack(spacing: 6) {
                        Text(phase.rawValue)
                            .font(.title2.bold())
                            .foregroundColor(.white)

                        Text("Cycles: \(totalCyclesCompleted)")
                            .font(.caption2.bold())
                            .foregroundColor(.white.opacity(0.8))
                    }
                }

                Spacer()

                // Guidance Card
                VStack(spacing: 8) {
                    Text("Diaphragmatic Calm Protocol")
                        .font(.caption.bold())
                        .foregroundColor(.cyan)
                    Text("4s Inhale through nose • 7s Hold • 8s Smooth exhale")
                        .font(.footnote)
                        .foregroundColor(.white.opacity(0.7))
                }
                .padding()
                .frame(maxWidth: .infinity)
                .background(Color.white.opacity(0.05))
                .cornerRadius(16)
                .padding(.horizontal, 24)
                .padding(.bottom, 20)
            }
        }
        .onAppear {
            startBreathingEngine()
        }
        .sheet(isPresented: $isCompleted) {
            GameOverSheet(
                gameTitle: "4-7-8 Breathing Pacer",
                score: 500 + (totalCyclesCompleted * 100),
                accuracy: 100,
                onPlayAgain: {
                    secondsRemaining = 60
                    totalCyclesCompleted = 0
                    isCompleted = false
                    startBreathingEngine()
                },
                onExit: { dismiss() }
            )
        }
    }

    private func startBreathingEngine() {
        runCycleStep(current: .inhale)

        sessionTimer?.invalidate()
        sessionTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { _ in
            if secondsRemaining > 1 {
                secondsRemaining -= 1
            } else {
                sessionTimer?.invalidate()
                isCompleted = true
                recordSession()
            }
        }
    }

    private func runCycleStep(current: BreathPhase) {
        guard !isCompleted else { return }
        phase = current

        let duration = current.duration

        withAnimation(.easeInOut(duration: duration)) {
            switch current {
            case .inhale:
                circleScale = 1.0
                audio.triggerHaptic(.light)
            case .hold:
                circleScale = 1.05
                audio.triggerHaptic(.selection)
            case .exhale:
                circleScale = 0.55
                audio.triggerHaptic(.medium)
            case .rest:
                circleScale = 0.5
            }
        }

        DispatchQueue.main.asyncAfter(deadline: .now() + duration) {
            guard !self.isCompleted else { return }
            switch current {
            case .inhale:
                self.runCycleStep(current: .hold)
            case .hold:
                self.runCycleStep(current: .exhale)
            case .exhale:
                self.totalCyclesCompleted += 1
                self.runCycleStep(current: .rest)
            case .rest:
                self.runCycleStep(current: .inhale)
            }
        }
    }

    private func recordSession() {
        let result = GameSessionResult(
            gameId: .breathingPacer,
            score: 500 + (totalCyclesCompleted * 100),
            accuracyPercentage: 100,
            responseTimeMs: 0,
            brainPowerGained: 40
        )
        engine.record(result: result)
    }
}
