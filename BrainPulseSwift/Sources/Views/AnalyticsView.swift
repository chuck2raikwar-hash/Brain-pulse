import SwiftUI

public struct AnalyticsView: View {
    @EnvironmentObject private var engine: CognitiveEngine

    public init() {}

    public var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Overall Brain Score Hero
                    VStack(spacing: 12) {
                        Text("TOTAL BRAINPOWER")
                            .font(.system(size: 11, weight: .black))
                            .foregroundColor(.cyan)
                            .tracking(1.5)

                        Text("\(engine.profile.brainPower)")
                            .font(.system(size: 54, weight: .heavy, design: .rounded))
                            .foregroundColor(.white)

                        Text("Level \(max(1, engine.profile.brainPower / 100)) • Synapse Adept")
                            .font(.subheadline.bold())
                            .foregroundColor(.white.opacity(0.8))

                        // Progress to next level
                        let currentLevelProgress = Double(engine.profile.brainPower % 100) / 100.0
                        ProgressView(value: currentLevelProgress)
                            .tint(.cyan)
                            .padding(.horizontal, 32)
                            .padding(.top, 4)
                    }
                    .padding(.vertical, 28)
                    .frame(maxWidth: .infinity)
                    .background(
                        LinearGradient(
                            colors: [Color(red: 0.10, green: 0.16, blue: 0.32), Color(red: 0.06, green: 0.08, blue: 0.16)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .cornerRadius(28)
                    .padding(.horizontal)

                    // Cognitive Domain Breakdown
                    VStack(alignment: .leading, spacing: 16) {
                        Text("Cognitive Radar Breakdown")
                            .font(.headline)
                            .padding(.horizontal)

                        VStack(spacing: 14) {
                            ForEach(CognitiveCategory.allCases) { category in
                                let score = engine.getCategoryScore(for: category)
                                let progress = Double(score) / 1600.0

                                VStack(alignment: .leading, spacing: 6) {
                                    HStack {
                                        Image(systemName: category.iconName)
                                            .foregroundColor(category.themeColor)
                                            .frame(width: 24)
                                        Text(category.rawValue)
                                            .font(.subheadline.bold())
                                        Spacer()
                                        Text("\(score) pts")
                                            .font(.subheadline)
                                            .foregroundColor(.secondary)
                                    }

                                    GeometryReader { geo in
                                        ZStack(alignment: .leading) {
                                            RoundedRectangle(cornerRadius: 6)
                                                .fill(Color(.systemGray5))
                                                .frame(height: 8)

                                            RoundedRectangle(cornerRadius: 6)
                                                .fill(category.themeColor)
                                                .frame(width: max(12, geo.size.width * CGFloat(progress)), height: 8)
                                        }
                                    }
                                    .frame(height: 8)
                                }
                                .padding(14)
                                .background(Color(.secondarySystemGroupedBackground))
                                .cornerRadius(16)
                            }
                        }
                        .padding(.horizontal)
                    }

                    // Recent Drill Performance History
                    VStack(alignment: .leading, spacing: 14) {
                        Text("Recent Training Sessions")
                            .font(.headline)
                            .padding(.horizontal)

                        if engine.recentSessions.isEmpty {
                            Text("No drills recorded yet. Play a game to see trends!")
                                .font(.caption)
                                .foregroundColor(.secondary)
                                .padding(.horizontal)
                        } else {
                            VStack(spacing: 10) {
                                ForEach(engine.recentSessions.prefix(6)) { session in
                                    HStack {
                                        ZStack {
                                            Circle()
                                                .fill(session.gameId.category.themeColor.opacity(0.15))
                                                .frame(width: 40, height: 40)
                                            Image(systemName: session.gameId.icon)
                                                .foregroundColor(session.gameId.category.themeColor)
                                                .font(.system(size: 16))
                                        }

                                        VStack(alignment: .leading, spacing: 2) {
                                            Text(session.gameId.title)
                                                .font(.subheadline.bold())
                                            Text("Accuracy: \(session.accuracyPercentage)%")
                                                .font(.caption2)
                                                .foregroundColor(.secondary)
                                        }

                                        Spacer()

                                        VStack(alignment: .trailing, spacing: 2) {
                                            Text("\(session.score)")
                                                .font(.subheadline.bold())
                                                .foregroundColor(.primary)
                                            Text("+\(session.brainPowerGained) BP")
                                                .font(.caption2.bold())
                                                .foregroundColor(.green)
                                        }
                                    }
                                    .padding(12)
                                    .background(Color(.secondarySystemGroupedBackground))
                                    .cornerRadius(14)
                                }
                            }
                            .padding(.horizontal)
                        }
                    }
                }
                .padding(.vertical)
            }
            .background(Color(.systemGroupedBackground))
            .navigationTitle("Analytics")
        }
    }
}
