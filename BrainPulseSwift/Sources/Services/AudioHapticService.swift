import Foundation
import SwiftUI
import AVFoundation
#if canImport(UIKit)
import UIKit
#endif

public final class AudioHapticService: ObservableObject {
    public static let shared = AudioHapticService()

    @Published public var isSoundEnabled: Bool = true
    @Published public var isHapticsEnabled: Bool = true

    private var audioPlayer: AVAudioPlayer?

    private init() {
        configureAudioSession()
    }

    private func configureAudioSession() {
        #if canImport(UIKit)
        do {
            try AVAudioSession.sharedInstance().setCategory(.ambient, mode: .default, options: [.mixWithOthers])
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            print("Audio session setup failed: \(error)")
        }
        #endif
    }

    // Synthesize procedural audio feedback via system sounds or audio chimes
    public func playCorrect() {
        guard isSoundEnabled else { return }
        playSystemSound(id: 1054) // Subtly pleasant confirmation tone
        triggerHaptic(.success)
    }

    public func playMistake() {
        guard isSoundEnabled else { return }
        playSystemSound(id: 1053) // Error double tap
        triggerHaptic(.error)
    }

    public func playTick() {
        guard isSoundEnabled else { return }
        playSystemSound(id: 1104) // Tick
        triggerHaptic(.selection)
    }

    public func playLevelUp() {
        guard isSoundEnabled else { return }
        playSystemSound(id: 1025) // Uplifting fanfare chime
        triggerHaptic(.heavy)
    }

    private func playSystemSound(id: SystemSoundID) {
        #if canImport(AudioToolbox)
        AudioServicesPlaySystemSound(id)
        #endif
    }

    public func triggerHaptic(_ type: HapticFeedbackType) {
        guard isHapticsEnabled else { return }
        #if canImport(UIKit)
        DispatchQueue.main.async {
            switch type {
            case .light:
                let generator = UIImpactFeedbackGenerator(style: .light)
                generator.impactOccurred()
            case .medium:
                let generator = UIImpactFeedbackGenerator(style: .medium)
                generator.impactOccurred()
            case .heavy:
                let generator = UIImpactFeedbackGenerator(style: .heavy)
                generator.impactOccurred()
            case .selection:
                let generator = UISelectionFeedbackGenerator()
                generator.selectionChanged()
            case .success:
                let generator = UINotificationFeedbackGenerator()
                generator.notificationOccurred(.success)
            case .error:
                let generator = UINotificationFeedbackGenerator()
                generator.notificationOccurred(.error)
            }
        }
        #endif
    }
}

public enum HapticFeedbackType {
    case light
    case medium
    case heavy
    case selection
    case success
    case error
}
