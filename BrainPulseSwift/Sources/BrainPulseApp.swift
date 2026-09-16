import SwiftUI

@main
public struct BrainPulseApp: App {
    @StateObject private var engine = CognitiveEngine.shared
    @StateObject private var audio = AudioHapticService.shared
    @StateObject private var multiplayer = MultiplayerEngine.shared

    public init() {}

    public var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(engine)
                .environmentObject(audio)
                .environmentObject(multiplayer)
        }
    }
}
