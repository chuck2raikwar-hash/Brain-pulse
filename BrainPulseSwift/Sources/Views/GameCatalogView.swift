import SwiftUI

public struct GameCatalogView: View {
    @EnvironmentObject private var engine: CognitiveEngine
    @EnvironmentObject private var audio: AudioHapticService
    @Binding public var selectedGame: GameType?

    @State private var selectedCategory: CognitiveCategory? = nil
    @State private var searchText: String = ""

    public init(selectedGame: Binding<GameType?>) {
        self._selectedGame = selectedGame
    }

    private var filteredGames: [GameType] {
        GameType.allCases.filter { game in
            let matchesCategory = selectedCategory == nil || game.category == selectedCategory
            let matchesSearch = searchText.isEmpty ||
                game.title.localizedCaseInsensitiveContains(searchText) ||
                game.subtitle.localizedCaseInsensitiveContains(searchText)
            return matchesCategory && matchesSearch
        }
    }

    public var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 16) {
                    // Category Filter Pills
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            Button(action: {
                                audio.playTick()
                                selectedCategory = nil
                            }) {
                                Text("All Games (\(GameType.allCases.count))")
                                    .font(.subheadline.bold())
                                    .padding(.horizontal, 14)
                                    .padding(.vertical, 8)
                                    .background(selectedCategory == nil ? Color.blue : Color(.secondarySystemGroupedBackground))
                                    .foregroundColor(selectedCategory == nil ? .white : .primary)
                                    .cornerRadius(14)
                            }

                            ForEach(CognitiveCategory.allCases) { cat in
                                Button(action: {
                                    audio.playTick()
                                    selectedCategory = cat
                                }) {
                                    HStack(spacing: 6) {
                                        Image(systemName: cat.iconName)
                                            .font(.system(size: 12))
                                        Text(cat.rawValue)
                                    }
                                    .font(.subheadline.bold())
                                    .padding(.horizontal, 14)
                                    .padding(.vertical, 8)
                                    .background(selectedCategory == cat ? cat.themeColor : Color(.secondarySystemGroupedBackground))
                                    .foregroundColor(selectedCategory == cat ? .white : .primary)
                                    .cornerRadius(14)
                                }
                            }
                        }
                        .padding(.horizontal)
                    }

                    // Games List
                    LazyVStack(spacing: 12) {
                        ForEach(filteredGames) { game in
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
                .padding(.vertical)
            }
            .searchable(text: $searchText, prompt: "Search drills, games, exercises...")
            .background(Color(.systemGroupedBackground))
            .navigationTitle("Game Catalog")
        }
    }
}
