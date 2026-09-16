import SwiftUI

public struct MultiplayerView: View {
    @EnvironmentObject private var engine: CognitiveEngine
    @EnvironmentObject private var multiplayer: MultiplayerEngine
    @EnvironmentObject private var audio: AudioHapticService

    @State private var duelGame: GameType = .reactionSpeed

    public init() {}

    public var body: some View {
        NavigationView {
            ZStack {
                Color(.systemGroupedBackground)
                    .ignoresSafeArea()

                ScrollView {
                    VStack(spacing: 24) {
                        // Rating & Arena Status Header
                        VStack(spacing: 12) {
                            HStack {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text("PVP DUEL ARENA")
                                        .font(.system(size: 11, weight: .black))
                                        .foregroundColor(.orange)
                                        .tracking(1)

                                    Text("Global Matchmaking")
                                        .font(.title2.bold())
                                        .foregroundColor(.white)
                                }

                                Spacer()

                                VStack(alignment: .trailing, spacing: 2) {
                                    Text("TIER RATING")
                                        .font(.system(size: 10, weight: .bold))
                                        .foregroundColor(.gray)
                                    Text("\(multiplayer.userRating) ELO")
                                        .font(.headline.bold())
                                        .foregroundColor(.yellow)
                                }
                            }

                            Divider().background(Color.white.opacity(0.15))

                            HStack {
                                Label("Live Synced Rounds", systemImage: "bolt.horizontal.fill")
                                Spacer()
                                Label("Bot Fallback Ready", systemImage: "cpu")
                            }
                            .font(.caption2.bold())
                            .foregroundColor(.white.opacity(0.8))
                        }
                        .padding(24)
                        .background(
                            LinearGradient(
                                colors: [Color(red: 0.16, green: 0.10, blue: 0.28), Color(red: 0.08, green: 0.06, blue: 0.18)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .cornerRadius(28)
                        .padding(.horizontal)

                        // Main Arena State Card
                        switch multiplayer.state {
                        case .idle:
                            idleView
                        case .searching:
                            searchingView
                        case .matchFound:
                            matchFoundView
                        case .countdown(let seconds):
                            countdownView(seconds: seconds)
                        case .playing(let round, let total):
                            playingView(round: round, total: total)
                        case .finished(let won):
                            finishedView(won: won)
                        }

                        // Duel Game Selection
                        if case .idle = multiplayer.state {
                            VStack(alignment: .leading, spacing: 12) {
                                Text("Choose Duel Discipline")
                                    .font(.headline)
                                    .padding(.horizontal)

                                let pvpOptions: [GameType] = [.reactionSpeed, .colorConfusion, .memoryMatrix, .nBack]
                                VStack(spacing: 8) {
                                    ForEach(pvpOptions) { game in
                                        Button(action: {
                                            audio.playTick()
                                            duelGame = game
                                        }) {
                                            HStack {
                                                Image(systemName: game.icon)
                                                    .font(.system(size: 20))
                                                    .foregroundColor(game.category.themeColor)
                                                    .frame(width: 32)

                                                VStack(alignment: .leading, spacing: 2) {
                                                    Text(game.title)
                                                        .font(.subheadline.bold())
                                                        .foregroundColor(.primary)
                                                    Text(game.subtitle)
                                                        .font(.caption2)
                                                        .foregroundColor(.secondary)
                                                }

                                                Spacer()

                                                if duelGame == game {
                                                    Image(systemName: "checkmark.circle.fill")
                                                        .foregroundColor(.orange)
                                                }
                                            }
                                            .padding(14)
                                            .background(Color(.secondarySystemGroupedBackground))
                                            .cornerRadius(16)
                                        }
                                    }
                                }
                                .padding(.horizontal)
                            }
                        }
                    }
                    .padding(.vertical)
                }
            }
            .navigationTitle("1v1 Arena")
        }
    }

    private var idleView: some View {
        VStack(spacing: 16) {
            Image(systemName: "person.2.wave.2.fill")
                .font(.system(size: 48))
                .foregroundColor(.orange)

            VStack(spacing: 4) {
                Text("Ready for a Brain Battle?")
                    .font(.headline.bold())
                Text("Challenge players in high-speed cognitive tests.")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            Button(action: {
                multiplayer.findMatch(game: duelGame)
            }) {
                HStack {
                    Image(systemName: "magnifyingglass")
                    Text("Find 1v1 Opponent")
                }
                .font(.headline.bold())
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(
                    LinearGradient(
                        colors: [.orange, .red],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )
                .cornerRadius(18)
            }
            .padding(.horizontal)
        }
        .padding(24)
        .background(Color(.secondarySystemGroupedBackground))
        .cornerRadius(24)
        .padding(.horizontal)
    }

    private var searchingView: some View {
        VStack(spacing: 16) {
            ProgressView()
                .scaleEffect(1.4)
                .tint(.orange)

            Text("Searching for matched opponent...")
                .font(.headline)

            Button(action: {
                multiplayer.cancelMatchmaking()
            }) {
                Text("Cancel")
                    .font(.subheadline.bold())
                    .foregroundColor(.red)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(32)
        .background(Color(.secondarySystemGroupedBackground))
        .cornerRadius(24)
        .padding(.horizontal)
    }

    private var matchFoundView: some View {
        VStack(spacing: 16) {
            Image(systemName: "checkmark.seal.fill")
                .font(.system(size: 48))
                .foregroundColor(.green)

            Text("Opponent Found!")
                .font(.title3.bold())

            if let opp = multiplayer.opponent {
                HStack(spacing: 20) {
                    VStack {
                        Text(engine.profile.displayName)
                            .font(.subheadline.bold())
                        Text("\(multiplayer.userRating) ELO")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }

                    Text("VS")
                        .font(.headline.bold())
                        .foregroundColor(.orange)

                    VStack {
                        Text(opp.name)
                            .font(.subheadline.bold())
                        Text("\(opp.rating) ELO")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                .padding()
                .background(Color(.systemGroupedBackground))
                .cornerRadius(16)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(24)
        .background(Color(.secondarySystemGroupedBackground))
        .cornerRadius(24)
        .padding(.horizontal)
    }

    private func countdownView(seconds: Int) -> some View {
        VStack(spacing: 12) {
            Text("MATCH STARTS IN")
                .font(.caption.bold())
                .foregroundColor(.orange)

            Text("\(seconds)")
                .font(.system(size: 72, weight: .black, design: .rounded))
                .foregroundColor(.primary)
        }
        .frame(maxWidth: .infinity)
        .padding(32)
        .background(Color(.secondarySystemGroupedBackground))
        .cornerRadius(24)
        .padding(.horizontal)
    }

    private func playingView(round: Int, total: Int) -> some View {
        VStack(spacing: 20) {
            HStack {
                Text("Round \(round) of \(total)")
                    .font(.caption.bold())
                    .foregroundColor(.orange)
                Spacer()
                Text(multiplayer.selectedDuelGame.title)
                    .font(.caption.bold())
                    .foregroundColor(.secondary)
            }

            // Live Score Comparison Bar
            HStack(spacing: 16) {
                VStack {
                    Text("YOU")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.secondary)
                    Text("\(multiplayer.userScore)")
                        .font(.title.bold())
                        .foregroundColor(.cyan)
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color(.systemGroupedBackground))
                .cornerRadius(16)

                Text("VS")
                    .font(.headline.bold())
                    .foregroundColor(.gray)

                VStack {
                    Text(multiplayer.opponent?.name.uppercased() ?? "BOT")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.secondary)
                    Text("\(multiplayer.opponentScore)")
                        .font(.title.bold())
                        .foregroundColor(.purple)
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color(.systemGroupedBackground))
                .cornerRadius(16)
            }

            // Interactive Round Tap Button
            Button(action: {
                let pts = Int.random(in: 180...320)
                multiplayer.submitRoundScore(points: pts)
            }) {
                HStack {
                    Image(systemName: "bolt.fill")
                    Text("Tap Rapid Answer (+Score)")
                }
                .font(.headline.bold())
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 18)
                .background(Color.blue)
                .cornerRadius(18)
            }
        }
        .padding(24)
        .background(Color(.secondarySystemGroupedBackground))
        .cornerRadius(24)
        .padding(.horizontal)
    }

    private func finishedView(won: Bool) -> some View {
        VStack(spacing: 16) {
            Image(systemName: won ? "trophy.fill" : "hand.thumbsdown.fill")
                .font(.system(size: 54))
                .foregroundColor(won ? .yellow : .gray)

            Text(won ? "VICTORY!" : "DEFEAT")
                .font(.title.bold())
                .foregroundColor(won ? .green : .red)

            Text(won ? "+25 ELO Points Earned" : "-18 ELO Points")
                .font(.subheadline.bold())
                .foregroundColor(.secondary)

            HStack(spacing: 20) {
                Text("Your Score: \(multiplayer.userScore)")
                Text("Opponent: \(multiplayer.opponentScore)")
            }
            .font(.footnote)
            .foregroundColor(.secondary)

            Button(action: {
                multiplayer.state = .idle
            }) {
                Text("Return to Arena")
                    .font(.headline.bold())
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.primary)
                    .cornerRadius(16)
            }
            .padding(.top, 8)
        }
        .padding(24)
        .background(Color(.secondarySystemGroupedBackground))
        .cornerRadius(24)
        .padding(.horizontal)
    }
}
