import SwiftUI

public struct DashboardView: View {
    @EnvironmentObject private var engine: CognitiveEngine
    @EnvironmentObject private var audio: AudioHapticService
    @Binding public var selectedGame: GameType?

    public init(selectedGame: Binding<GameType?>) {
        self._selectedGame = selectedGame
    }

    public var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Top Readiness Card
                    VStack(alignment: .leading, spacing: 16) {
                        HStack {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("DAILY READINESS")
                                    .font(.system(size: 11, weight: .black))
                                    .foregroundColor(.cyan)
                                    .tracking(1)

                                Text("Peak Mental State")
                                    .font(.title2.bold())
                                    .foregroundColor(.white)
                            }

                            Spacer()

                            // Readiness Ring
                            ZStack {
                                Circle()
                                    .stroke(Color.white.opacity(0.15), lineWidth: 8)
                                    .frame(width: 68, height: 68)

                                Circle()
                                    .trim(from: 0, to: CGFloat(engine.dailyReadinessScore) / 100.0)
                                    .stroke(
                                        LinearGradient(
                                            colors: [.cyan, .green],
                                            startPoint: .topLeading,
                                            endPoint: .bottomTrailing
                                        ),
                                        style: StrokeStyle(lineWidth: 8, lineCap: .round)
                                    )
                                    .frame(width: 68, height: 68)
                                    .rotationEffect(.degrees(-90))

                                Text("\(engine.dailyReadinessScore)")
                                    .font(.headline.bold())
                                    .foregroundColor(.white)
                            }
                        }

                        // Metrics Ribbon
                        HStack(spacing: 20) {
                            HStack(spacing: 6) {
                                Image(systemName: "flame.fill")
                                    .foregroundColor(.orange)
                                Text("\(engine.profile.dailyStreak) Day Streak")
                                    .font(.subheadline.bold())
                                    .foregroundColor(.white)
                            }

                            HStack(spacing: 6) {
                                Image(systemName: "bolt.shield.fill")
                                    .foregroundColor(.yellow)
                                Text("\(engine.profile.brainPower) BrainPower")
                                    .font(.subheadline.bold())
                                    .foregroundColor(.white)
                            }
                        }
                    }
                    .padding(24)
                    .background(
                        LinearGradient(
                            colors: [Color(red: 0.10, green: 0.14, blue: 0.28), Color(red: 0.06, green: 0.08, blue: 0.16)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .cornerRadius(28)
                    .shadow(color: Color.black.opacity(0.15), radius: 12, x: 0, y: 6)

                    // Daily Recommended Workout Card
                    VStack(alignment: .leading, spacing: 14) {
                        HStack {
                            Text("Recommended Workout")
                                .font(.headline)
                                .foregroundColor(.primary)

                            Spacer()

                            Text("3 Drills • ~4 mins")
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }

                        Button(action: {
                            audio.playTick()
                            selectedGame = .memoryMatrix
                        }) {
                            HStack {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text("Calibrate Memory & Speed")
                                        .font(.subheadline.bold())
                                        .foregroundColor(.white)
                                    Text("Memory Matrix + Reaction Speed + Stroop")
                                        .font(.caption)
                                        .foregroundColor(.white.opacity(0.8))
                                }

                                Spacer()

                                Image(systemName: "play.circle.fill")
                                    .font(.system(size: 34))
                                    .foregroundColor(.white)
                            }
                            .padding(18)
                            .background(
                                LinearGradient(
                                    colors: [.blue, .cyan],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(20)
                        }
                    }
                    .padding(.horizontal)

                    // Cognitive Category Highlights
                    VStack(alignment: .leading, spacing: 14) {
                        Text("Cognitive Domains")
                            .font(.headline)
                            .padding(.horizontal)

                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 12) {
                                ForEach(CognitiveCategory.allCases) { cat in
                                    let score = engine.getCategoryScore(for: cat)
                                    VStack(alignment: .leading, spacing: 8) {
                                        ZStack {
                                            Circle()
                                                .fill(cat.themeColor.opacity(0.15))
                                                .frame(width: 40, height: 40)
                                            Image(systemName: cat.iconName)
                                                .foregroundColor(cat.themeColor)
                                                .font(.system(size: 18))
                                        }

                                        Text(cat.rawValue)
                                            .font(.subheadline.bold())
                                            .foregroundColor(.primary)

                                        Text("\(score) pts")
                                            .font(.caption)
                                            .foregroundColor(.secondary)
                                    }
                                    .frame(width: 125, alignment: .leading)
                                    .padding(14)
                                    .background(Color(.secondarySystemGroupedBackground))
                                    .cornerRadius(18)
                                }
                            }
                            .padding(.horizontal)
                        }
                    }

                    // Flagship Games Quick Launch
                    VStack(alignment: .leading, spacing: 14) {
                        Text("Featured Drills")
                            .font(.headline)
                            .padding(.horizontal)

                        VStack(spacing: 12) {
                            let featured: [GameType] = [.memoryMatrix, .reactionSpeed, .colorConfusion, .nBack, .breathingPacer]
                            ForEach(featured) { game in
                                GameCardView(
                                    game: game,
                                    highScore: engine.getHighScore(for: game),
                                    onSelect: {
                                        audio.playTick()
                                        selectedGame = game
                                    }
                                )
                            }
                        }
                        .padding(.horizontal)
                    }
                }
                .padding(.vertical)
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle("BrainPulse")
        }
    }
}
