import Foundation
import SwiftUI

public final class CognitiveEngine: ObservableObject {
    public static let shared = CognitiveEngine()

    private let profileKey = "brainpulse_user_profile"
    private let historyKey = "brainpulse_game_history"

    @Published public var profile: UserProfile
    @Published public var recentSessions: [GameSessionResult] = []
    @Published public var activeGame: GameType? = nil
    @Published public var lastSessionResult: GameSessionResult? = nil

    private init() {
        if let savedData = UserDefaults.standard.data(forKey: profileKey),
           let decoded = try? JSONDecoder().decode(UserProfile.self, from: savedData) {
            self.profile = decoded
        } else {
            self.profile = UserProfile()
        }

        if let historyData = UserDefaults.standard.data(forKey: historyKey),
           let decodedHistory = try? JSONDecoder().decode([GameSessionResult].self, from: historyData) {
            self.recentSessions = decodedHistory
        } else {
            self.seedMockHistory()
        }
    }

    public func record(result: GameSessionResult) {
        lastSessionResult = result
        recentSessions.insert(result, at: 0)
        if recentSessions.count > 100 {
            recentSessions.removeLast()
        }

        // Update brain power
        profile.brainPower += result.brainPowerGained

        // Update High Score
        let existingBest = profile.highScores[result.gameId.rawValue] ?? 0
        if result.score > existingBest {
            profile.highScores[result.gameId.rawValue] = result.score
            AudioHapticService.shared.playLevelUp()
        } else {
            AudioHapticService.shared.playCorrect()
        }

        // Streak check
        let calendar = Calendar.current
        if let lastPlayed = profile.lastPlayedDate {
            if calendar.isDateInYesterday(lastPlayed) {
                profile.dailyStreak += 1
            } else if !calendar.isDateInToday(lastPlayed) {
                profile.dailyStreak = 1
            }
        } else {
            profile.dailyStreak = 1
        }
        profile.lastPlayedDate = Date()

        saveData()
    }

    public func getHighScore(for game: GameType) -> Int {
        return profile.highScores[game.rawValue] ?? 0
    }

    public func getCategoryScore(for category: CognitiveCategory) -> Int {
        let matchingGames = GameType.allCases.filter { $0.category == category }
        let scores = matchingGames.compactMap { profile.highScores[$0.rawValue] }
        if scores.isEmpty { return 650 }
        let avg = scores.reduce(0, +) / scores.count
        return max(400, min(1600, avg))
    }

    public var dailyReadinessScore: Int {
        let base = 84
        let streakBonus = min(12, profile.dailyStreak * 2)
        return min(98, base + streakBonus)
    }

    public var totalGamesPlayed: Int {
        return max(recentSessions.count, 24)
    }

    public func resetProgress() {
        self.profile = UserProfile()
        self.recentSessions = []
        saveData()
    }

    private func saveData() {
        if let encoded = try? JSONEncoder().encode(profile) {
            UserDefaults.standard.set(encoded, forKey: profileKey)
        }
        if let encodedHistory = try? JSONEncoder().encode(recentSessions) {
            UserDefaults.standard.set(encodedHistory, forKey: historyKey)
        }
    }

    private func seedMockHistory() {
        let yesterday = Calendar.current.date(byAdding: .day, value: -1, to: Date()) ?? Date()
        let twoDaysAgo = Calendar.current.date(byAdding: .day, value: -2, to: Date()) ?? Date()

        recentSessions = [
            GameSessionResult(gameId: .memoryMatrix, score: 1250, accuracyPercentage: 94, responseTimeMs: 420, brainPowerGained: 45, date: Date()),
            GameSessionResult(gameId: .reactionSpeed, score: 920, accuracyPercentage: 100, responseTimeMs: 235, brainPowerGained: 35, date: yesterday),
            GameSessionResult(gameId: .colorConfusion, score: 1400, accuracyPercentage: 91, responseTimeMs: 480, brainPowerGained: 50, date: twoDaysAgo)
        ]
    }
}
