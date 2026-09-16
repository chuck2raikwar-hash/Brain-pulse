import SwiftUI

public struct ReactionSpeedView: View {
    @EnvironmentObject private var engine: CognitiveEngine
    @EnvironmentObject private var audio: AudioHapticService
    @Environment(\.dismiss) private var dismiss

    enum State {
        case waitingForStart
        case waitingForGreen
        case readyToTap
        case falseStart
        case result(ms: Int)
        case finished
    }

    @State private var currentState: State = .waitingForStart
    @State private var reactionTimes: [Int] = []
    @State private var currentAttempt: Int = 1
    @State private var timerStartTime: Date?
    @State private var waitTimer: DispatchWorkItem?

    private let totalAttempts = 5

    public init() {}

    public var body: some View {
        ZStack {
            backgroundColor
                .ignoresSafeArea()

            VStack(spacing: 24) {
                // Header
                HStack {
                    Button(action: {
                        waitTimer?.cancel()
                        dismiss()
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 28))
                            .foregroundColor(.white.opacity(0.8))
                    }

                    Spacer()

                    Text("Reaction Speed Drill")
                        .font(.headline)
                        .foregroundColor(.white)

                    Spacer()

                    Text("Attempt \(currentAttempt)/\(totalAttempts)")
                        .font(.caption.bold())
                        .foregroundColor(.white.opacity(0.8))
                }
                .padding(.horizontal)

                Spacer()

                // Main Interactive Tap Area
                VStack(spacing: 16) {
                    centerIcon
                        .font(.system(size: 64))
                        .foregroundColor(.white)

                    Text(instructionText)
                        .font(.title2.bold())
                        .foregroundColor(.white)
                        .multilineTextAlignment(.center)

                    if case .result(let ms) = currentState {
                        Text("\(ms) ms")
                            .font(.system(size: 56, weight: .heavy, design: .rounded))
                            .foregroundColor(.white)

                        Text(reactionGrade(ms: ms))
                            .font(.subheadline.bold())
                            .foregroundColor(.yellow)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 6)
                            .background(Color.black.opacity(0.2))
                            .cornerRadius(12)
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .contentShape(Rectangle())
                .onTapGesture {
                    handleTap()
                }

                Spacer()

                if case .result = currentState {
                    Button(action: {
                        advanceToNextAttempt()
                    }) {
                        Text(currentAttempt < totalAttempts ? "Next Attempt" : "Finish Drill")
                            .font(.headline.bold())
                            .foregroundColor(.black)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color.white)
                            .cornerRadius(16)
                    }
                    .padding(.horizontal, 32)
                    .padding(.bottom, 24)
                }
            }
        }
        .sheet(isPresented: Binding(
            get: { if case .finished = currentState { return true } else { return false } },
            set: { _ in }
        )) {
            let avg = reactionTimes.isEmpty ? 280 : reactionTimes.reduce(0, +) / reactionTimes.count
            let score = max(100, 1600 - (avg * 3))
            GameOverSheet(
                gameTitle: "Reaction Speed",
                score: score,
                accuracy: 100,
                onPlayAgain: {
                    currentAttempt = 1
                    reactionTimes.removeAll()
                    currentState = .waitingForStart
                },
                onExit: { dismiss() }
            )
        }
    }

    private var backgroundColor: Color {
        switch currentState {
        case .waitingForStart:
            return Color(red: 0.12, green: 0.14, blue: 0.22)
        case .waitingForGreen:
            return Color(red: 0.85, green: 0.22, blue: 0.22) // Red: Wait!
        case .readyToTap:
            return Color(red: 0.16, green: 0.72, blue: 0.44) // Green: TAP!
        case .falseStart:
            return Color(red: 0.92, green: 0.45, blue: 0.10) // Orange: Too early
        case .result, .finished:
            return Color(red: 0.15, green: 0.42, blue: 0.85) // Blue
        }
    }

    private var centerIcon: Image {
        switch currentState {
        case .waitingForStart: return Image(systemName: "hand.tap.fill")
        case .waitingForGreen: return Image(systemName: "hand.raised.fill")
        case .readyToTap: return Image(systemName: "bolt.fill")
        case .falseStart: return Image(systemName: "exclamationmark.triangle.fill")
        case .result, .finished: return Image(systemName: "checkmark.circle.fill")
        }
    }

    private var instructionText: String {
        switch currentState {
        case .waitingForStart: return "Tap anywhere to begin"
        case .waitingForGreen: return "Wait for GREEN..."
        case .readyToTap: return "TAP NOW!"
        case .falseStart: return "Too early! Tap to retry"
        case .result: return "Reaction Time"
        case .finished: return "Drill Completed!"
        }
    }

    private func handleTap() {
        switch currentState {
        case .waitingForStart:
            startWaitingForGreen()
        case .waitingForGreen:
            waitTimer?.cancel()
            audio.playMistake()
            currentState = .falseStart
        case .falseStart:
            startWaitingForGreen()
        case .readyToTap:
            if let start = timerStartTime {
                let durationMs = Int(Date().timeIntervalSince(start) * 1000)
                reactionTimes.append(durationMs)
                audio.playCorrect()
                currentState = .result(ms: durationMs)
            }
        case .result:
            advanceToNextAttempt()
        case .finished:
            break
        }
    }

    private func startWaitingForGreen() {
        currentState = .waitingForGreen
        audio.playTick()

        let delay = Double.random(in: 1.6...4.0)
        let workItem = DispatchWorkItem {
            self.timerStartTime = Date()
            self.currentState = .readyToTap
            self.audio.playLevelUp()
        }
        waitTimer = workItem
        DispatchQueue.main.asyncAfter(deadline: .now() + delay, execute: workItem)
    }

    private func advanceToNextAttempt() {
        if currentAttempt < totalAttempts {
            currentAttempt += 1
            startWaitingForGreen()
        } else {
            currentState = .finished
            recordDrillResults()
        }
    }

    private func reactionGrade(ms: Int) -> String {
        if ms < 200 { return "⚡ F1 Driver Reflexes" }
        if ms < 240 { return "🚀 Pro Gamer Speed" }
        if ms < 280 { return "✨ Excellent" }
        if ms < 330 { return "👍 Above Average" }
        return "🧠 Good Foundation"
    }

    private func recordDrillResults() {
        let avg = reactionTimes.isEmpty ? 280 : reactionTimes.reduce(0, +) / reactionTimes.count
        let score = max(100, 1600 - (avg * 3))
        let result = GameSessionResult(
            gameId: .reactionSpeed,
            score: score,
            accuracyPercentage: 100,
            responseTimeMs: avg,
            brainPowerGained: 35
        )
        engine.record(result: result)
    }
}
