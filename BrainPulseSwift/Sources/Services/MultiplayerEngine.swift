import Foundation
import SwiftUI

public struct MatchPlayer: Identifiable, Codable {
    public var id: String
    public var name: String
    public var rating: Int
    public var avatarColorHex: String
    public var currentScore: Int = 0
    public var isReady: Bool = false
}

public enum MatchState {
    case idle
    case searching
    case matchFound
    case countdown(secondsRemaining: Int)
    case playing(round: Int, totalRounds: Int)
    case finished(won: Bool)
}

public final class MultiplayerEngine: ObservableObject {
    public static let shared = MultiplayerEngine()

    @Published public var state: MatchState = .idle
    @Published public var opponent: MatchPlayer? = nil
    @Published public var userScore: Int = 0
    @Published public var opponentScore: Int = 0
    @Published public var userRating: Int = 1420
    @Published public var selectedDuelGame: GameType = .reactionSpeed

    private var countdownTimer: Timer?
    private var simulationTimer: Timer?

    private let botNames = ["NovaMind_99", "SynapseQueen", "DrNeuro", "CortexRacer", "AlphaWave", "PulseMaster"]

    private init() {}

    public func findMatch(game: GameType) {
        selectedDuelGame = game
        state = .searching
        userScore = 0
        opponentScore = 0

        AudioHapticService.shared.triggerHaptic(.medium)

        // Simulate 2.5s matchmaking
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.2) { [weak self] in
            guard let self = self else { return }
            let botName = self.botNames.randomElement() ?? "CortexRider"
            let botRating = self.userRating + Int.random(in: -40...50)
            self.opponent = MatchPlayer(
                id: UUID().uuidString,
                name: botName,
                rating: botRating,
                avatarColorHex: "#06B6D4"
            )
            self.state = .matchFound
            AudioHapticService.shared.playCorrect()

            self.startCountdown()
        }
    }

    private func startCountdown() {
        var remaining = 3
        state = .countdown(secondsRemaining: remaining)
        AudioHapticService.shared.playTick()

        countdownTimer?.invalidate()
        countdownTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] timer in
            guard let self = self else { timer.invalidate(); return }
            remaining -= 1
            if remaining > 0 {
                self.state = .countdown(secondsRemaining: remaining)
                AudioHapticService.shared.playTick()
            } else {
                timer.invalidate()
                self.startMatchRounds()
            }
        }
    }

    private func startMatchRounds() {
        state = .playing(round: 1, totalRounds: 5)
        AudioHapticService.shared.playLevelUp()

        // Simulate opponent scoring periodically
        simulationTimer?.invalidate()
        simulationTimer = Timer.scheduledTimer(withTimeInterval: 2.0, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            if case .playing(let round, _) = self.state {
                let opponentGain = Int.random(in: 120...280)
                self.opponentScore += opponentGain
                if round >= 5 {
                    self.finishMatch()
                }
            }
        }
    }

    public func submitRoundScore(points: Int) {
        userScore += points
        AudioHapticService.shared.playCorrect()

        if case .playing(let currentRound, let total) = state {
            if currentRound < total {
                state = .playing(round: currentRound + 1, totalRounds: total)
            } else {
                finishMatch()
            }
        }
    }

    public func finishMatch() {
        countdownTimer?.invalidate()
        simulationTimer?.invalidate()

        let userWon = userScore >= opponentScore
        state = .finished(won: userWon)

        if userWon {
            userRating += 25
            AudioHapticService.shared.playLevelUp()
        } else {
            userRating = max(1000, userRating - 18)
            AudioHapticService.shared.playMistake()
        }
    }

    public func cancelMatchmaking() {
        countdownTimer?.invalidate()
        simulationTimer?.invalidate()
        state = .idle
        opponent = nil
    }
}
