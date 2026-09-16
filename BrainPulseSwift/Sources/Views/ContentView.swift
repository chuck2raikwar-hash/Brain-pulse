import SwiftUI

public struct ContentView: View {
    @EnvironmentObject private var engine: CognitiveEngine
    @EnvironmentObject private var audio: AudioHapticService
    @State private var selectedTab: Int = 0
    @State private var activeGame: GameType? = nil

    public init() {}

    public var body: some View {
        TabView(selection: $selectedTab) {
            DashboardView(selectedGame: $activeGame)
                .tabItem {
                    Label("Today", systemImage: "sparkles")
                }
                .tag(0)

            GameCatalogView(selectedGame: $activeGame)
                .tabItem {
                    Label("Games", systemImage: "square.grid.2x2.fill")
                }
                .tag(1)

            MultiplayerView()
                .tabItem {
                    Label("1v1 Arena", systemImage: "bolt.horizontal.circle.fill")
                }
                .tag(2)

            AnalyticsView()
                .tabItem {
                    Label("Analytics", systemImage: "chart.xyaxis.line")
                }
                .tag(3)

            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gearshape.fill")
                }
                .tag(4)
        }
        .accentColor(.blue)
        .fullScreenCover(item: $activeGame) { game in
            destinationGameView(for: game)
        }
    }

    @ViewBuilder
    private func destinationGameView(for game: GameType) -> some View {
        switch game {
        case .memoryMatrix:
            MemoryMatrixView()
        case .reactionSpeed:
            ReactionSpeedView()
        case .colorConfusion:
            ColorConfusionView()
        case .breathingPacer:
            BreathingPacerView()
        case .nBack:
            NBackView()
        default:
            MemoryMatrixView()
        }
    }
}
