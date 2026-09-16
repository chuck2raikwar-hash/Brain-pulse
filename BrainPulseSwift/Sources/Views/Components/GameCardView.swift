import SwiftUI

public struct GameCardView: View {
    public let game: GameType
    public let highScore: Int
    public let onSelect: () -> Void

    public init(game: GameType, highScore: Int, onSelect: @escaping () -> Void) {
        self.game = game
        self.highScore = highScore
        self.onSelect = onSelect
    }

    public var body: some View {
        Button(action: onSelect) {
            HStack(spacing: 16) {
                // Category Icon Capsule
                ZStack {
                    RoundedRectangle(cornerRadius: 16)
                        .fill(game.category.themeColor.opacity(0.15))
                        .frame(width: 54, height: 54)

                    Image(systemName: game.icon)
                        .font(.system(size: 24))
                        .foregroundColor(game.category.themeColor)
                }

                // Info
                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Text(game.title)
                            .font(.headline)
                            .foregroundColor(.primary)

                        Spacer()

                        Text(game.category.rawValue)
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(game.category.themeColor)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(game.category.themeColor.opacity(0.1))
                            .cornerRadius(8)
                    }

                    Text(game.subtitle)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .lineLimit(1)

                    HStack(spacing: 12) {
                        if highScore > 0 {
                            HStack(spacing: 3) {
                                Image(systemName: "trophy.fill")
                                    .font(.system(size: 10))
                                    .foregroundColor(.orange)
                                Text("\(highScore)")
                                    .font(.system(size: 11, weight: .bold))
                                    .foregroundColor(.primary)
                            }
                        }

                        HStack(spacing: 3) {
                            Image(systemName: "clock")
                                .font(.system(size: 10))
                            Text("\(game.durationSeconds)s")
                                .font(.system(size: 11))
                        }
                        .foregroundColor(.secondary)

                        HStack(spacing: 3) {
                            Image(systemName: "flame.fill")
                                .font(.system(size: 10))
                                .foregroundColor(.orange)
                            Text(game.difficulty)
                                .font(.system(size: 11))
                        }
                        .foregroundColor(.secondary)
                    }
                    .padding(.top, 2)
                }
            }
            .padding(16)
            .background(Color(.secondarySystemGroupedBackground))
            .cornerRadius(20)
            .shadow(color: Color.black.opacity(0.04), radius: 6, x: 0, y: 2)
        }
        .buttonStyle(ScaleButtonStyle())
    }
}

public struct ScaleButtonStyle: ButtonStyle {
    public func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.98 : 1.0)
            .animation(.easeInOut(duration: 0.15), value: configuration.isPressed)
    }
}
