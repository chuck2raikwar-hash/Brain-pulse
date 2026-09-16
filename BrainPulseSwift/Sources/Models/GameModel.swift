import Foundation
import SwiftUI

public enum CognitiveCategory: String, CaseIterable, Codable, Identifiable {
    case memory = "Memory"
    case speed = "Speed"
    case attention = "Attention"
    case flexibility = "Flexibility"
    case problemSolving = "Problem Solving"
    case mindfulness = "Mindfulness"

    public var id: String { rawValue }

    public var iconName: String {
        switch self {
        case .memory: return "brain.head.profile"
        case .speed: return "bolt.fill"
        case .attention: return "scope"
        case .flexibility: return "arrow.triangle.2.circlepath"
        case .problemSolving: return "puzzlepiece.fill"
        case .mindfulness: return "heart.fill"
        }
    }

    public var themeColor: Color {
        switch self {
        case .memory: return Color(red: 0.38, green: 0.45, blue: 0.96) // Indigo
        case .speed: return Color(red: 0.98, green: 0.65, blue: 0.12)  // Amber
        case .attention: return Color(red: 0.02, green: 0.71, blue: 0.83) // Cyan
        case .flexibility: return Color(red: 0.66, green: 0.33, blue: 0.98) // Purple
        case .problemSolving: return Color(red: 0.16, green: 0.76, blue: 0.54) // Emerald
        case .mindfulness: return Color(red: 0.96, green: 0.35, blue: 0.47) // Rose
        }
    }
}

public enum GameType: String, CaseIterable, Codable, Identifiable {
    case memoryMatrix = "memory_matrix"
    case reactionSpeed = "reaction_speed"
    case colorConfusion = "color_confusion"
    case nBack = "n_back"
    case numberRecall = "number_recall"
    case cardMatch = "card_match"
    case sequenceRecall = "sequence_recall"
    case distractionFilter = "distraction_filter"
    case logicPuzzle = "logic_puzzle"
    case wordScramble = "word_scramble"
    case patternMatrix = "pattern_matrix"
    case guidedMeditation = "guided_meditation"
    case breathingPacer = "breathing_pacer"
    case dailyJournal = "daily_journal"
    case stretchDualTask = "stretch_dual_task"

    public var id: String { rawValue }

    public var title: String {
        switch self {
        case .memoryMatrix: return "Memory Matrix"
        case .reactionSpeed: return "Reaction Speed Drill"
        case .colorConfusion: return "Color Confusion (Stroop)"
        case .nBack: return "Pattern Match (2-Back)"
        case .numberRecall: return "Number Recall"
        case .cardMatch: return "Matching Cards"
        case .sequenceRecall: return "Recall Sequence"
        case .distractionFilter: return "Distraction Filter"
        case .logicPuzzle: return "Logic Grid"
        case .wordScramble: return "Word Scramble"
        case .patternMatrix: return "Pattern Matrix"
        case .guidedMeditation: return "Guided Meditation"
        case .breathingPacer: return "4-7-8 Breathing Pacer"
        case .dailyJournal: return "Cognitive Journal"
        case .stretchDualTask: return "Dual-Task Stretch"
        }
    }

    public var subtitle: String {
        switch self {
        case .memoryMatrix: return "Memorize flashing pattern grid positions"
        case .reactionSpeed: return "React instantly when the light turns green"
        case .colorConfusion: return "Overcome cognitive Stroop interference"
        case .nBack: return "Track and recall shapes from 2 steps prior"
        case .numberRecall: return "Hold expanding digit sequences in memory"
        case .cardMatch: return "Pair matching symbols in minimal moves"
        case .sequenceRecall: return "Repeat auditory and visual light sequences"
        case .distractionFilter: return "Identify targets among visual noise"
        case .logicPuzzle: return "Deductive reasoning and relational grid"
        case .wordScramble: return "Rapid anagram decoding under pressure"
        case .patternMatrix: return "Raven-style progressive matrix solver"
        case .guidedMeditation: return "Mental reset and diaphragmatic calm"
        case .breathingPacer: return "Heart-rate variability calming cadence"
        case .dailyJournal: return "Reflective cognitive clarity check-in"
        case .stretchDualTask: return "Coordination and cognitive dual challenge"
        }
    }

    public var category: CognitiveCategory {
        switch self {
        case .memoryMatrix, .numberRecall, .cardMatch, .sequenceRecall:
            return .memory
        case .reactionSpeed:
            return .speed
        case .colorConfusion, .distractionFilter:
            return .attention
        case .nBack, .stretchDualTask:
            return .flexibility
        case .logicPuzzle, .wordScramble, .patternMatrix:
            return .problemSolving
        case .guidedMeditation, .breathingPacer, .dailyJournal:
            return .mindfulness
        }
    }

    public var icon: String {
        switch self {
        case .memoryMatrix: return "square.grid.3x3.fill"
        case .reactionSpeed: return "bolt.fill"
        case .colorConfusion: return "paintpalette.fill"
        case .nBack: return "arrow.counterclockwise.circle.fill"
        case .numberRecall: return "number.square.fill"
        case .cardMatch: return "rectangle.fill.on.rectangle.fill"
        case .sequenceRecall: return "waveform.path.ecg"
        case .distractionFilter: return "eye.slash.fill"
        case .logicPuzzle: return "puzzlepiece.extension.fill"
        case .wordScramble: return "character.book.closed.fill"
        case .patternMatrix: return "circle.hexagongrid.fill"
        case .guidedMeditation: return "sparkles"
        case .breathingPacer: return "lungs.fill"
        case .dailyJournal: return "note.text"
        case .stretchDualTask: return "figure.walk"
        }
    }

    public var durationSeconds: Int {
        switch self {
        case .reactionSpeed: return 30
        case .colorConfusion, .memoryMatrix, .nBack: return 45
        case .breathingPacer: return 90
        default: return 60
        }
    }

    public var difficulty: String {
        switch self {
        case .memoryMatrix, .reactionSpeed: return "Moderate"
        case .colorConfusion, .nBack: return "High"
        case .breathingPacer: return "Relaxing"
        default: return "Normal"
        }
    }
}

public struct GameSessionResult: Identifiable, Codable {
    public var id: UUID = UUID()
    public var gameId: GameType
    public var score: Int
    public var accuracyPercentage: Int
    public var responseTimeMs: Int
    public var brainPowerGained: Int
    public var date: Date = Date()
}

public struct UserProfile: Codable {
    public var displayName: String = "Brain Athlete"
    public var brainPower: Int = 340
    public var dailyStreak: Int = 5
    public var lastPlayedDate: Date? = Date()
    public var highScores: [String: Int] = [
        GameType.memoryMatrix.rawValue: 1250,
        GameType.reactionSpeed.rawValue: 920,
        GameType.colorConfusion.rawValue: 1400,
        GameType.nBack.rawValue: 880,
        GameType.breathingPacer.rawValue: 500
    ]
    public var isPremium: Bool = true
}
