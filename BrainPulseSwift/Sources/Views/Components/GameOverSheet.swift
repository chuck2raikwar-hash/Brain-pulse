import SwiftUI

public struct GameOverSheet: View {
    public let gameTitle: String
    public let score: Int
    public let accuracy: Int
    public let onPlayAgain: () -> Void
    public let onExit: () -> Void

    public init(gameTitle: String, score: Int, accuracy: Int, onPlayAgain: @escaping () -> Void, onExit: @escaping () -> Void) {
        self.gameTitle = gameTitle
        self.score = score
        self.accuracy = accuracy
        self.onPlayAgain = onPlayAgain
        self.onExit = onExit
    }

    public var body: some View {
        ZStack {
            Color(red: 0.07, green: 0.09, blue: 0.15)
                .ignoresSafeArea()

            VStack(spacing: 24) {
                // Celebration Icon
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [.cyan, .blue, .purple],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 88, height: 88)
                        .shadow(color: .cyan.opacity(0.4), radius: 18)

                    Image(systemName: "trophy.fill")
                        .font(.system(size: 40))
                        .foregroundColor(.white)
                }
                .padding(.top, 32)

                VStack(spacing: 4) {
                    Text("Session Completed")
                        .font(.caption.bold())
                        .foregroundColor(.cyan)
                        .textCase(.uppercase)

                    Text(gameTitle)
                        .font(.title.bold())
                        .foregroundColor(.white)
                }

                // Stats Cards
                HStack(spacing: 16) {
                    VStack(spacing: 6) {
                        Text("FINAL SCORE")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.gray)
                        Text("\(score)")
                            .font(.title.bold())
                            .foregroundColor(.white)
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.white.opacity(0.06))
                    .cornerRadius(16)

                    VStack(spacing: 6) {
                        Text("ACCURACY")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.gray)
                        Text("\(accuracy)%")
                            .font(.title.bold())
                            .foregroundColor(.green)
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.white.opacity(0.06))
                    .cornerRadius(16)
                }
                .padding(.horizontal, 24)

                Spacer()

                // Buttons
                VStack(spacing: 12) {
                    Button(action: onPlayAgain) {
                        HStack {
                            Image(systemName: "arrow.counterclockwise")
                            Text("Play Again")
                        }
                        .font(.headline.bold())
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(
                            LinearGradient(
                                colors: [.cyan, .green],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(18)
                    }

                    Button(action: onExit) {
                        Text("Return to Hub")
                            .font(.headline)
                            .foregroundColor(.white.opacity(0.8))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(Color.white.opacity(0.08))
                            .cornerRadius(18)
                    }
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 24)
            }
        }
        .presentationDetents([.fraction(0.65)])
    }
}
