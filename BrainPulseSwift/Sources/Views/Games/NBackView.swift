import SwiftUI

public struct NBackView: View {
    @EnvironmentObject private var engine: CognitiveEngine
    @EnvironmentObject private var audio: AudioHapticService
    @Environment(\.dismiss) private var dismiss

    struct CardItem: Equatable {
        let shape: String
        let color: Color
        let colorName: String
    }

    private let symbols = ["circle.fill", "square.fill", "triangle.fill", "diamond.fill", "star.fill"]
    private let colors: [(Color, String)] = [
        (.cyan, "Cyan"), (.orange, "Orange"), (.pink, "Pink"), (.green, "Green"), (.purple, "Purple")
    ]

    @State private var currentCard: CardItem?
    @State private var history: [CardItem] = []
    @State private var roundIndex: Int = 0
    @State private var totalRounds: Int = 20
    @State private var score: Int = 0
    @State private var hits: Int = 0
    @State private var misses: Int = 0
    @State private var falseAlarms: Int = 0
    @State private var isGameOver: Bool = false
    @State private var stimulusTimer: Timer?
    @State private var hasDecidedForCurrent: Bool = false

    public init() {}

    public var body: some View {
        ZStack {
            Color(red: 0.08, green: 0.10, blue: 0.16)
                .ignoresSafeArea()

            VStack(spacing: 20) {
                // Top Header
                HStack {
                    Button(action: {
                        stimulusTimer?.invalidate()
                        dismiss()
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 28))
                            .foregroundColor(.white.opacity(0.7))
                    }

                    Spacer()

                    VStack {
                        Text("Pattern Match (2-Back)")
                            .font(.headline)
                            .foregroundColor(.white)
                        Text("Step \(roundIndex)/\(totalRounds)")
                            .font(.caption)
                            .foregroundColor(.cyan)
                    }

                    Spacer()

                    Text("Score: \(score)")
                        .font(.subheadline.bold())
                        .foregroundColor(.yellow)
                }
                .padding(.horizontal)

                Spacer()

                // Active Symbol Card
                if let card = currentCard {
                    ZStack {
                        RoundedRectangle(cornerRadius: 28)
                            .fill(Color.white.opacity(0.08))
                            .frame(width: 220, height: 220)
                            .overlay(
                                RoundedRectangle(cornerRadius: 28)
                                    .stroke(card.color.opacity(0.5), lineWidth: 2)
                            )
                            .shadow(color: card.color.opacity(0.3), radius: 20)

                        Image(systemName: card.shape)
                            .font(.system(size: 80))
                            .foregroundColor(card.color)
                    }
                    .transition(.scale.combined(with: .opacity))
                } else {
                    RoundedRectangle(cornerRadius: 28)
                        .fill(Color.white.opacity(0.04))
                        .frame(width: 220, height: 220)
                }

                Spacer()

                // Instructions
                Text("Does this match the symbol from **2 steps ago**?")
                    .font(.footnote)
                    .foregroundColor(.white.opacity(0.8))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)

                // Decision Action Buttons
                HStack(spacing: 16) {
                    Button(action: {
                        handleDecision(playerSaysMatch: false)
                    }) {
                        HStack {
                            Image(systemName: "xmark")
                            Text("NO MATCH")
                        }
                        .font(.headline.bold())
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 18)
                        .background(Color.white.opacity(0.12))
                        .cornerRadius(18)
                    }

                    Button(action: {
                        handleDecision(playerSaysMatch: true)
                    }) {
                        HStack {
                            Image(systemName: "checkmark")
                            Text("2-BACK MATCH")
                        }
                        .font(.headline.bold())
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 18)
                        .background(Color.cyan)
                        .cornerRadius(18)
                    }
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 24)
            }
        }
        .onAppear {
            startNBack()
        }
        .sheet(isPresented: $isGameOver) {
            let totalDecisions = max(1, hits + misses + falseAlarms)
            let accuracy = Int((Double(hits) / Double(totalDecisions)) * 100)
            GameOverSheet(
                gameTitle: "Pattern Match (2-Back)",
                score: score,
                accuracy: accuracy,
                onPlayAgain: {
                    startNBack()
                },
                onExit: { dismiss() }
            )
        }
    }

    private func startNBack() {
        history.removeAll()
        roundIndex = 0
        score = 0
        hits = 0
        misses = 0
        falseAlarms = 0
        isGameOver = false

        advanceStimulus()

        stimulusTimer?.invalidate()
        stimulusTimer = Timer.scheduledTimer(withTimeInterval: 2.6, repeats: true) { _ in
            advanceStimulus()
        }
    }

    private func advanceStimulus() {
        if roundIndex >= totalRounds {
            stimulusTimer?.invalidate()
            isGameOver = true
            recordGameEnd()
            return
        }

        hasDecidedForCurrent = false
        roundIndex += 1

        let isMatchStep = history.count >= 2 && Double.random(in: 0...1) < 0.4
        let nextCard: CardItem

        if isMatchStep {
            nextCard = history[history.count - 2]
        } else {
            let randomShape = symbols.randomElement()!
            let randomColor = colors.randomElement()!
            nextCard = CardItem(shape: randomShape, color: randomColor.0, colorName: randomColor.1)
        }

        withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
            currentCard = nextCard
        }
        history.append(nextCard)
        audio.playTick()
    }

    private func handleDecision(playerSaysMatch: Bool) {
        guard !hasDecidedForCurrent else { return }
        hasDecidedForCurrent = true

        let isActualMatch = history.count >= 3 && history[history.count - 1] == history[history.count - 3]

        if playerSaysMatch == isActualMatch {
            audio.playCorrect()
            if isActualMatch {
                hits += 1
                score += 200
            } else {
                score += 50
            }
        } else {
            audio.playMistake()
            if isActualMatch {
                misses += 1
            } else {
                falseAlarms += 1
            }
            score = max(0, score - 60)
        }
    }

    private func recordGameEnd() {
        let totalDecisions = max(1, hits + misses + falseAlarms)
        let accuracy = Int((Double(hits) / Double(totalDecisions)) * 100)
        let result = GameSessionResult(
            gameId: .nBack,
            score: score,
            accuracyPercentage: accuracy,
            responseTimeMs: 640,
            brainPowerGained: max(20, score / 25)
        )
        engine.record(result: result)
    }
}
