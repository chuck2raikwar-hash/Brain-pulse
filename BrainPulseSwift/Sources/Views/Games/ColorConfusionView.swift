import SwiftUI

public struct ColorConfusionView: View {
    @EnvironmentObject private var engine: CognitiveEngine
    @EnvironmentObject private var audio: AudioHapticService
    @Environment(\.dismiss) private var dismiss

    struct ColorItem {
        let name: String
        let color: Color
    }

    private let colorPalette: [ColorItem] = [
        ColorItem(name: "RED", color: .red),
        ColorItem(name: "BLUE", color: .blue),
        ColorItem(name: "GREEN", color: .green),
        ColorItem(name: "YELLOW", color: .yellow),
        ColorItem(name: "PURPLE", color: .purple),
        ColorItem(name: "ORANGE", color: .orange)
    ]

    @State private var targetWord: String = "BLUE"
    @State private var targetInkColor: Color = .red
    @State private var correctColorName: String = "RED"
    @State private var options: [ColorItem] = []

    @State private var score: Int = 0
    @State private var streak: Int = 0
    @State private var timeRemaining: Int = 30
    @State private var isGameOver: Bool = false
    @State private var totalDecisions: Int = 0
    @State private var correctDecisions: Int = 0
    @State private var timer: Timer?

    public init() {}

    public var body: some View {
        ZStack {
            Color(red: 0.07, green: 0.09, blue: 0.14)
                .ignoresSafeArea()

            VStack(spacing: 24) {
                // Header Bar
                HStack {
                    Button(action: {
                        timer?.invalidate()
                        dismiss()
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 28))
                            .foregroundColor(.white.opacity(0.7))
                    }

                    Spacer()

                    VStack {
                        Text("Color Confusion")
                            .font(.headline)
                            .foregroundColor(.white)
                        Text("Match the INK COLOR, not the word!")
                            .font(.caption2.bold())
                            .foregroundColor(.cyan)
                    }

                    Spacer()

                    // Timer Pill
                    HStack(spacing: 4) {
                        Image(systemName: "clock.fill")
                        Text("\(timeRemaining)s")
                            .font(.system(size: 14, weight: .heavy, design: .monospaced))
                    }
                    .foregroundColor(.yellow)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(Color.white.opacity(0.1))
                    .cornerRadius(12)
                }
                .padding(.horizontal)

                // Score + Streak Banner
                HStack(spacing: 24) {
                    VStack {
                        Text("SCORE")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.gray)
                        Text("\(score)")
                            .font(.title2.bold())
                            .foregroundColor(.white)
                    }

                    VStack {
                        Text("COMBO")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.gray)
                        Text("\(streak)x")
                            .font(.title2.bold())
                            .foregroundColor(.orange)
                    }
                }
                .padding(.vertical, 8)
                .padding(.horizontal, 24)
                .background(Color.white.opacity(0.06))
                .cornerRadius(16)

                Spacer()

                // Stroop Target Card
                VStack(spacing: 12) {
                    Text(targetWord)
                        .font(.system(size: 54, weight: .black, design: .rounded))
                        .foregroundColor(targetInkColor)
                        .shadow(color: targetInkColor.opacity(0.6), radius: 16)
                        .padding(.vertical, 40)
                        .frame(maxWidth: .infinity)
                        .background(Color.white.opacity(0.05))
                        .cornerRadius(24)
                        .overlay(
                            RoundedRectangle(cornerRadius: 24)
                                .stroke(Color.white.opacity(0.1), lineWidth: 1)
                        )
                }
                .padding(.horizontal, 24)

                Spacer()

                // Choice Options (2x2 Grid)
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 14) {
                    ForEach(options, id: \.name) { item in
                        Button(action: {
                            handleChoice(item)
                        }) {
                            Text(item.name)
                                .font(.headline.bold())
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .frame(height: 64)
                                .background(
                                    RoundedRectangle(cornerRadius: 18)
                                        .fill(Color.white.opacity(0.12))
                                )
                                .overlay(
                                    RoundedRectangle(cornerRadius: 18)
                                        .stroke(Color.white.opacity(0.2), lineWidth: 1)
                                )
                        }
                    }
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 24)
            }
        }
        .onAppear {
            startGame()
        }
        .onDisappear {
            timer?.invalidate()
        }
        .sheet(isPresented: $isGameOver) {
            let accuracy = totalDecisions > 0 ? Int((Double(correctDecisions) / Double(totalDecisions)) * 100) : 0
            GameOverSheet(
                gameTitle: "Color Confusion",
                score: score,
                accuracy: accuracy,
                onPlayAgain: {
                    startGame()
                },
                onExit: { dismiss() }
            )
        }
    }

    private func startGame() {
        score = 0
        streak = 0
        totalDecisions = 0
        correctDecisions = 0
        timeRemaining = 30
        isGameOver = false

        generateNewPrompt()

        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { _ in
            if timeRemaining > 1 {
                timeRemaining -= 1
            } else {
                timer?.invalidate()
                isGameOver = true
                recordGameEnd()
            }
        }
    }

    private func generateNewPrompt() {
        let textItem = colorPalette.randomElement()!
        var inkItem = colorPalette.randomElement()!
        // 75% chance of mismatch for Stroop effect
        while inkItem.name == textItem.name && Bool.random() {
            inkItem = colorPalette.randomElement()!
        }

        targetWord = textItem.name
        targetInkColor = inkItem.color
        correctColorName = inkItem.name

        // Generate 4 distinct options including correct ink
        var choices = [inkItem]
        var remainingPalette = colorPalette.filter { $0.name != inkItem.name }
        remainingPalette.shuffle()
        choices.append(contentsOf: remainingPalette.prefix(3))
        choices.shuffle()
        options = choices
    }

    private func handleChoice(_ chosen: ColorItem) {
        totalDecisions += 1
        if chosen.name == correctColorName {
            audio.playCorrect()
            correctDecisions += 1
            streak += 1
            score += 100 + (streak * 20)
        } else {
            audio.playMistake()
            streak = 0
            score = max(0, score - 50)
        }
        generateNewPrompt()
    }

    private func recordGameEnd() {
        let accuracy = totalDecisions > 0 ? Int((Double(correctDecisions) / Double(totalDecisions)) * 100) : 0
        let result = GameSessionResult(
            gameId: .colorConfusion,
            score: score,
            accuracyPercentage: accuracy,
            responseTimeMs: 510,
            brainPowerGained: max(15, score / 30)
        )
        engine.record(result: result)
    }
}
