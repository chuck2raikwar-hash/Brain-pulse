import SwiftUI

public struct MemoryMatrixView: View {
    @EnvironmentObject private var engine: CognitiveEngine
    @EnvironmentObject private var audio: AudioHapticService
    @Environment(\.dismiss) private var dismiss

    @State private var gridSize: Int = 3
    @State private var targetTiles: Set<Int> = []
    @State private var selectedTiles: Set<Int> = []
    @State private var isShowingPattern: Bool = true
    @State private var score: Int = 0
    @State private var roundNumber: Int = 1
    @State private var lives: Int = 3
    @State private var isGameOver: Bool = false
    @State private var consecutiveSuccesses: Int = 0

    public init() {}

    public var body: some View {
        ZStack {
            Color(red: 0.08, green: 0.10, blue: 0.16)
                .ignoresSafeArea()

            VStack(spacing: 20) {
                // Header Bar
                HStack {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 28))
                            .foregroundColor(.white.opacity(0.7))
                    }

                    Spacer()

                    VStack {
                        Text("Memory Matrix")
                            .font(.headline)
                            .foregroundColor(.white)
                        Text("Round \(roundNumber) • \(gridSize)x\(gridSize)")
                            .font(.caption)
                            .foregroundColor(.cyan)
                    }

                    Spacer()

                    // Lives
                    HStack(spacing: 4) {
                        ForEach(0..<3) { i in
                            Image(systemName: i < lives ? "heart.fill" : "heart")
                                .foregroundColor(.pink)
                                .font(.system(size: 16))
                        }
                    }
                }
                .padding(.horizontal)

                // Stats Pill
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
                        Text("STATUS")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.gray)
                        Text(isShowingPattern ? "MEMORIZE" : "RECALL")
                            .font(.subheadline.bold())
                            .foregroundColor(isShowingPattern ? .yellow : .green)
                    }
                }
                .padding(.vertical, 8)
                .padding(.horizontal, 24)
                .background(Color.white.opacity(0.08))
                .cornerRadius(20)

                Spacer()

                // Matrix Grid
                let columns = Array(repeating: GridItem(.flexible(), spacing: 10), count: gridSize)
                LazyVGrid(columns: columns, spacing: 10) {
                    ForEach(0..<(gridSize * gridSize), id: \.self) { index in
                        let isTarget = targetTiles.contains(index)
                        let isSelected = selectedTiles.contains(index)

                        Button(action: {
                            handleTileTap(index)
                        }) {
                            RoundedRectangle(cornerRadius: 12)
                                .fill(tileColor(index: index, isTarget: isTarget, isSelected: isSelected))
                                .aspectRatio(1, contentMode: .fit)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(Color.white.opacity(0.15), lineWidth: 1)
                                )
                                .shadow(color: (isShowingPattern && isTarget) ? .cyan.opacity(0.6) : .clear, radius: 10)
                        }
                        .disabled(isShowingPattern || isGameOver)
                    }
                }
                .padding(.horizontal, 32)

                Spacer()

                Text(isShowingPattern ? "Remember the highlighted cyan tiles..." : "Tap all the tiles you memorized!")
                    .font(.footnote)
                    .foregroundColor(.white.opacity(0.8))
                    .padding(.bottom, 24)
            }
        }
        .onAppear {
            startNewRound()
        }
        .sheet(isPresented: $isGameOver) {
            GameOverSheet(
                gameTitle: "Memory Matrix",
                score: score,
                accuracy: max(60, min(100, 100 - (3 - lives) * 12)),
                onPlayAgain: {
                    lives = 3
                    score = 0
                    roundNumber = 1
                    gridSize = 3
                    consecutiveSuccesses = 0
                    isGameOver = false
                    startNewRound()
                },
                onExit: { dismiss() }
            )
        }
    }

    private func tileColor(index: Int, isTarget: Bool, isSelected: Bool) -> Color {
        if isShowingPattern {
            return isTarget ? Color.cyan : Color.white.opacity(0.06)
        } else {
            if isSelected {
                return isTarget ? Color.cyan : Color.red
            }
            return Color.white.opacity(0.08)
        }
    }

    private func handleTileTap(_ index: Int) {
        guard !selectedTiles.contains(index) else { return }
        selectedTiles.insert(index)

        if targetTiles.contains(index) {
            audio.playCorrect()
            score += 150 * roundNumber

            // Check if all targets found
            if selectedTiles.intersection(targetTiles).count == targetTiles.count {
                audio.playLevelUp()
                consecutiveSuccesses += 1
                if consecutiveSuccesses >= 2 && gridSize < 5 {
                    gridSize += 1
                    consecutiveSuccesses = 0
                }
                roundNumber += 1
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
                    startNewRound()
                }
            }
        } else {
            audio.playMistake()
            lives -= 1
            if lives <= 0 {
                isGameOver = true
                recordGameEnd()
            }
        }
    }

    private func startNewRound() {
        selectedTiles.removeAll()
        let totalTiles = gridSize * gridSize
        let targetCount = min(totalTiles - 2, max(3, gridSize + (roundNumber / 2)))

        var targets = Set<Int>()
        while targets.count < targetCount {
            targets.insert(Int.random(in: 0..<totalTiles))
        }
        targetTiles = targets
        isShowingPattern = true

        DispatchQueue.main.asyncAfter(deadline: .now() + 1.8) {
            withAnimation(.easeInOut(duration: 0.3)) {
                isShowingPattern = false
            }
        }
    }

    private func recordGameEnd() {
        let result = GameSessionResult(
            gameId: .memoryMatrix,
            score: score,
            accuracyPercentage: max(50, 100 - (3 - lives) * 15),
            responseTimeMs: 420,
            brainPowerGained: max(15, score / 35)
        )
        engine.record(result: result)
    }
}
